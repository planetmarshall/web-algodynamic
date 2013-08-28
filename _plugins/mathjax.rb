
module Jekyll
	class MathJaxTag < Liquid::Block

		def initialize(tag_name, text, tokens)
			super
		end

		def render(context)
			math = @nodelist.join
			slashed = math.gsub("\\\\", "\\\\\\\\\\")
			"\\\\\\[ #{slashed} \\\\\\]"
		end

	end
end

Liquid::Template.register_tag('math', Jekyll::MathJaxTag)
