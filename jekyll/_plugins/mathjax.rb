
module Jekyll
	class MathJaxBlock < Liquid::Block

		def initialize(tag_name, text, tokens)
			super
		end

		def render(context)
			math = @nodelist.join
			slashed = math.gsub("\\\\", "\\\\\\\\\\").gsub("_","\\_")
			"\\\\\\[ #{slashed} \\\\\\]"
		end

	end

	class MathJaxTag < Liquid::Tag

		def initialize( tag_name, text, tokens )
			super
			@text = text
		end

		def render(context)
			"\\\\\\( #{@text} \\\\\\)".gsub("_","\\_")
		end
	end
end



Liquid::Template.register_tag('math', Jekyll::MathJaxBlock)
Liquid::Template.register_tag('m', Jekyll::MathJaxTag)
