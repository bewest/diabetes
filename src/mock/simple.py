#!/usr/bin/python


import cherrypy
from mako.template import Template
from mako.lookup import TemplateLookup
from pprint import pformat
import json
import os

import plot
import date


lookup = TemplateLookup(directories=['templates'])

import helper

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
    def debug(self, **kwds):
      """

      """
      debug_str = pformat(kwds)
      return plot.debug( debug_str )

    @cherrypy.expose
    def dot(self):
      return plot.dot( )

    @cherrypy.expose
    def yaxis(self):
      return plot.y_axis_panel( )

    @cherrypy.expose
    def xaxis(self, *args, **kwds):
      r = [args, kwds]
      ctxt = kwds.get( 'date', None )
      return plot.x_axis_panel( )

class Templates(GeneralHandler):
  def __call__(self, *args, **kwds):
    
    cherrypy.log.info("HELLO WORLD")
    super(self, type(self))(*args, **kwds)

class Root(GeneralHandler):
    @cherrypy.expose
    def index(self):
      pages = os.listdir('./templates')
      tmpl  = lookup.get_template("index.html")
      return tmpl.render(salutation="Hello", target="World", pages=pages)

      
    @cherrypy.expose
    def list(self):
      tmpl = lookup.get_template("list.html")
      return tmpl.render(salutation="Hello", target="World")

    @cherrypy.expose
    def openlayers(self):
      tmpl = lookup.get_template("openlayers.html")
      return tmpl.render(salutation="Hello", target="World")

    #@cherrypy.tools.mako(directories="./templates")
    @cherrypy.expose
    def template(self, page):
      tmpl = lookup.get_template("%s" % page)
      return tmpl.render(salutation="Hello", target="World")

    graph = Graph()

if __name__ == '__main__':
  R = Root( )
  cherrypy.quickstart( R, config='simple.conf' )


