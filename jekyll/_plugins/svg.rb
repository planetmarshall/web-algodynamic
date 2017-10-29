module Jekyll
	class SvgTag < Liquid::Tag

		def initialize( tag_name, text, tokens )
			super
			params = text.split
			@class = params[0]
			@width = params[1]
			@height = params[2]
		end

		def render(context)
		    markup = "<div class=\"col-md-6\">" +
		        "<div id=\"#{@class}\" class=\"svg_container\"><svg class=\"#{@class}\"></svg><script src=\"/assets/js/#{@class}.js\"></script></div>" +
		        "</div>"
		    markup.strip
		end
	end
			
end

Liquid::Template.register_tag('svg', Jekyll::SvgTag)
