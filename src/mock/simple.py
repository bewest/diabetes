#!/usr/bin/python


import cherrypy
from mako.template import Template
from mako.lookup import TemplateLookup


import json

lookup = TemplateLookup(directories=['templates'])

class Root:
    @cherrypy.expose
    def index(self):
      tmpl = lookup.get_template("index.html")
      return tmpl.render(salutation="Hello", target="World")


    @cherrypy.expose
    def config(self):
      cherrypy.response.headers['content-type'] = 'text/plain'
      return json.dumps(cherrypy.config, indent=2)
      


if __name__ == '__main__':
  R = Root( )
  cherrypy.quickstart( R, config='simple.conf' )


