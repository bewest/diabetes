#!/usr/bin/python


import cherrypy
from mako.template import Template
from mako.lookup import TemplateLookup
lookup = TemplateLookup(directories=['templates'])

class Root:
    @cherrypy.expose
    def index(self):
        tmpl = lookup.get_template("index.html")
        return tmpl.render(salutation="Hello", target="World")



if __name__ == '__main__':
  R = Root( )
  cherrypy.quickstart( R, config='simple.conf' )


