#!/usr/bin/python


import cherrypy
from mako.template import Template
from mako.lookup import TemplateLookup
from pprint import pformat
import json

import plot
import date


lookup = TemplateLookup(directories=['templates'])

class GeneralHandler:

    @cherrypy.expose
    def config(self):
      cherrypy.response.headers['content-type'] = 'text/plain'
      config = cherrypy.config
      config.update( cherrypy.request.config );
      return json.dumps(config, indent=2)

class Graph(GeneralHandler):
    _cp_config = { 'tools.response_headers.on': True,
                   'tools.response_headers.headers':
                      [('content-type', 'image/png')] }

    @cherrypy.expose
    def yaxis(self):
      return plot.y_axis_panel( )

    @cherrypy.expose
    def xaxis(self, *args, **kwds):
      cherrypy.response.headers['content-type'] = 'text/plain'
      r = [args, kwds]
      ctxt = kwds.get( 'date', None )
      return pformat(r)
      return plot.x_axis_panel( )


class Root(GeneralHandler):
    @cherrypy.expose
    def index(self):
      tmpl = lookup.get_template("index.html")
      return tmpl.render(salutation="Hello", target="World")

      
    @cherrypy.expose
    def list(self):
      tmpl = lookup.get_template("list.html")
      return tmpl.render(salutation="Hello", target="World")

    graph = Graph()

if __name__ == '__main__':
  R = Root( )
  cherrypy.quickstart( R, config='simple.conf' )


