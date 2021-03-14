import re
from xml.etree import ElementTree as ET

from markdown import Extension
from markdown.blockprocessors import BlockProcessor


def create_plot_element(parent : ET.Element, element_id):
    element_container = ET.SubElement(
        parent,
        "div",
        {"class": "algodynamic_plot", "id": element_id}
    )

    return element_container


class PlotBlockProcessor(BlockProcessor):
    RE_FENCE_START = re.compile(r"^!!plot:(?P<element_id>.+)!!")
    RE_FENCE_END = re.compile(r"!!plot!!$")

    function = None

    def test(self, parent, block):
        match = self.RE_FENCE_START.match(block)
        if not match:
            return None
        self.element_id = match.groupdict()["element_id"]
        return match

    def run(self, parent, blocks):
        original_block = blocks[0]
        blocks[0] = self.RE_FENCE_START.sub('', blocks[0])

        for block_num, block in enumerate(blocks):
            if self.RE_FENCE_END.search(block):
                blocks[block_num] = self.RE_FENCE_END.sub('', block)
                plot_element = create_plot_element(parent, self.element_id)
                self.parser.parseBlocks(plot_element, blocks[0:block_num + 1])
                for i in range(0, block_num + 1):
                    blocks.pop(0)
                return True

        blocks[0] = original_block
        return False


class PlotExtension(Extension):
    def extendMarkdown(self, md):
        md.parser.blockprocessors.register(PlotBlockProcessor(md.parser), "plot", 176)
