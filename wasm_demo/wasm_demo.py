import re
from xml.etree import ElementTree as ET
from uuid import uuid4

from markdown import Extension
from markdown.blockprocessors import BlockProcessor


def create_demo_dialog(parent : ET.Element, function):
    dialog_id = f"dialog-{str(uuid4())[:8]}"
    demo_container = ET.SubElement(
        parent,
        "div",
        {"class": "wasm-demo-button"}
    )

    button = ET.SubElement(
        demo_container,
        "button",
        {"type": "button", "class": "btn btn-primary", "data-toggle":"modal", "data-target":f"#{dialog_id}"}
    )
    button.text = "Demo"

    modal = ET.SubElement(parent, "div", {"class": "modal", "id": dialog_id, "tabindex": "-1", "aria-labelledby": f"{dialog_id}-label", "aria-hidden": "true"})
    modal_dialog = ET.SubElement(modal, "div", {"class": "modal-dialog"})
    modal_content = ET.SubElement(modal_dialog, "div", {"class": "modal-content"})
    modal_header = ET.SubElement(modal_content, "div", {"class": "modal-header"})
    modal_title = ET.SubElement(modal_header, "h5", {"class": "modal-title", "id": f"{dialog_id}-label"})
    modal_title.text = "WASM demo "
    modal_title_description = ET.SubElement(modal_title, "small")
    modal_title_description.text = "powered by "
    modal_title_link = ET.SubElement(modal_title_description, "a", {"href": "https://emscripten.org/"})
    modal_title_link.text = "emscripten"
    close_button = ET.SubElement(modal_header, "button", {"class": "close", "data-dismiss": "modal", "aria-label": "Close"})
    close_button_icon = ET.SubElement(close_button, "span", {"aria-hidden": "true"})
    close_button_icon.text = "&times;"
    content_id = f"{dialog_id}-content"

    modal_function_title = ET.SubElement(modal_content, "h6")
    modal_function_title.text = "Function:"
    modal_function = ET.SubElement(modal_content, "div", {"class": "wasm-function"})

    modal_output_title = ET.SubElement(modal_content, "h6")
    modal_output_title.text = "Output:"
    modal_output = ET.SubElement(modal_content, "pre", {"id": content_id, "class": "wasm-output"})

    modal_footer = ET.SubElement(modal_content, "div", {"class": "modal-footer"})
    wasm_function = function
    print(wasm_function)
    run = ET.SubElement(modal_footer, "button", {"class": "btn btn-run", "onclick": f"$('#{content_id}').text(Module.{wasm_function});"})
    run.text = "Run"

    return modal_function


class DemoBlockProcessor(BlockProcessor):
    RE_FENCE_START = re.compile(r"^!!demo:(?P<function>.+)!!")
    RE_FENCE_END = re.compile(r"!!demo!!$")

    function = None

    def test(self, parent, block):
        match = self.RE_FENCE_START.match(block)
        if not match:
            return None
        self.function = match.groupdict()["function"]
        return match

    def run(self, parent, blocks):
        original_block = blocks[0]
        blocks[0] = self.RE_FENCE_START.sub('', blocks[0])

        for block_num, block in enumerate(blocks):
            if self.RE_FENCE_END.search(block):
                blocks[block_num] = self.RE_FENCE_END.sub('', block)
                dialog_content = create_demo_dialog(parent, self.function)
                self.parser.parseBlocks(dialog_content, blocks[0:block_num + 1])
                for i in range(0, block_num + 1):
                    blocks.pop(0)
                return True

        blocks[0] = original_block
        return False


class WasmDemoExtension(Extension):
    def extendMarkdown(self, md):
        md.parser.blockprocessors.register(DemoBlockProcessor(md.parser), "wasm_demo", 175)