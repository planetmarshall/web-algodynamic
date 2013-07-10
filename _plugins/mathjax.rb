
module Jekyll
	class MathJaxTag < Liquid::Raw

		def initialize(tag_name, markup, tokens)
			super

		end

		def render(context)
			text = super
			#"\\\\\\[#{text.inspect}\\\\\\]"
			@nodelist.join('\n')
		end

	end
end

Liquid::Template.register_tag('math', Jekyll::MathJaxTag)
