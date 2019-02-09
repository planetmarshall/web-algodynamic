#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Andrew Marshall'
SITENAME = "Andrew Marshall's blog"
SITEURL = ''

PLUGIN_PATHS =['../web/pelican-plugins']
PLUGINS = ['assets']
PATH = 'content'
STATIC_PATHS = ['images', 'data', 'scripts']
ASSET_CONFIG = [('BABEL_PRESETS', 'env')]

TIMEZONE = 'Europe/London'
THEME = 'themes/planetmarshall'
DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

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
