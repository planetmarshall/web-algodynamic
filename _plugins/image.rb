require 'flickraw'
require 'htmlentities'

FlickRaw.api_key="8d77c8e15549563b6f81192232ae0337"
FlickRaw.shared_secret="1e27464717d13cff"
#FlickRaw.proxy = "http://edibloxx.local.tmvse.com:8080"
#https_proxy = "http://edibloxx.local.tmvse.com:8080"

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
			description=HTMLEntities.new.encode(@info.description)

			"<div class=\"thumbnail-#{@float}\"><a href=\"#{image_url}\" data-lightbox=\"#{@id}\" title=\"#{description}\"><img src=\"#{thumbnail_url}\"/></a></div>"
		end
	end
			
	Thumbnail= Struct.new(:url,:width,:height)

	class GImageTag < Liquid::Tag
		def initialize( tag_name, text, tokens )
			super

			params = text.split
			@float = params[1]
			@photo_id = params[0].to_s
		end

		def render(context)
			description = "dummy"
			thumbnail = Thumbnail.new("empty.png",64,64)
			image_url="empty.png"

			"<div class=\"thumbnail-#{@float}\"><a href=\"#{image_url}\" data-lightbox=\"#{@photo_id}\" title=\"#{description}\"><img src=\"#{thumbnail.url}\" width=\"#{thumbnail.width}\" height=\"#{thumbnail.height}\" alt=\"#{description}\"/></a></div>"
		end
	end
end



Liquid::Template.register_tag('img', Jekyll::ImageTag)
Liquid::Template.register_tag('gimg', Jekyll::GImageTag)
