#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

from wasm_demo import WasmDemoExtension

AUTHOR = 'Andrew Marshall'
SITENAME = 'algodynamic'
SITESUBTITLE =  'C++, Python, Computer Vision and Machine Learning'
SITEURL = 'https://www.algodynamic.co.uk'
THEME = 'theme'

PATH = 'content'
PLUGINS = [
    'pelican_webassets'
]
WEBASSETS_SOURCE_PATHS = [
    "src"
]
TIMEZONE = 'GMT'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

MARKDOWN = {
    'extensions': [WasmDemoExtension()],
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
    },
    'output_format': 'html5',
}

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
STATIC_PATHS = ["js"]
