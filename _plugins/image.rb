require 'flickraw'

FlickRaw.api_key="8d77c8e15549563b6f81192232ae0337"
FlickRaw.shared_secret="1e27464717d13cff"


module Jekyll
	class ImageTag < Liquid::Tag

		def initialize( tag_name, text, tokens )
			super
			params = text.split
			@float = params[1]
			@id = params[0]
			@info = flickr.photos.getInfo(:photo_id => params[0])
		end

		def render(context)
			thumbnail_url=FlickRaw.url_q(@info)
			image_url=FlickRaw.url_b(@info)

			"<div class=\"thumbnail-#{@float}\"><a href=\"#{image_url}\" data-lightbox=\"#{@id}\"><img src=\"#{thumbnail_url}\"/></a></div>"
		end
	end
end



Liquid::Template.register_tag('img', Jekyll::ImageTag)
