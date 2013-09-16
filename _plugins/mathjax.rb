
module Jekyll
	class MathJaxBlock < Liquid::Block

		def initialize(tag_name, text, tokens)
			super
		end

		def render(context)
			math = @nodelist.join
			slashed = math.gsub("\\\\", "\\\\\\\\\\")
			"\\\\\\[ #{slashed} \\\\\\]"
		end

	end

	class MathJaxTag < Liquid::Tag

		def initialize( tag_name, text, tokens )
			super
			@text = text
		end

		def render(context)
			"\\\\\\( #{@text} \\\\\\)"
		end
	end
end



Liquid::Template.register_tag('math', Jekyll::MathJaxBlock)
Liquid::Template.register_tag('m', Jekyll::MathJaxTag)
