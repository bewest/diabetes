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
    def debug(self, **kwds):
      """
<?php

    // Output a tile containing debug information about the args we were
    // called with.

    define('SIZE',    200);
    define('FONT',      2);
    define('VINSET',    4);
    define('HINSET',    4);
    define('LSPACE',    2);

    $width  = isset($_GET['WIDTH'])  ? $_GET['WIDTH']  : SIZE;
    $height = isset($_GET['HEIGHT']) ? $_GET['HEIGHT'] : SIZE;
    
    $img = imagecreatetruecolor($width, $height);
    
    $bg     = imagecolorallocate($img, 190, 212, 253);
    $fg     = imagecolorallocate($img,   0,   0,   0);
    $border = imagecolorallocate($img, 128, 128, 128);

    // Draw background, border
    imagefilledrectangle($img, 0, 0, $width-1, $height-1, $bg);
    imagerectangle($img, 0, 0, $width-1, $height-1, $border);
  
    // Draw text
    $tw = imagefontwidth(FONT);
    $th = imagefontheight(FONT);
    
    $tx = HINSET;
    $ty = VINSET;
    $cw = 0;
    
    while (list($n, $v) = each($_GET)) {
        imagestring($img, FONT, $tx, $ty, "$n = $v", $fg);
        $ty += $th + LSPACE;
    }
    
    header('Content-type: image/png');
    imagepng($img);

?>

      """
      debug_str = pformat(kwds)
      return plot.debug( debug_str )

    @cherrypy.expose
    def yaxis(self):
      return plot.y_axis_panel( )

    @cherrypy.expose
    def xaxis(self, *args, **kwds):
      r = [args, kwds]
      ctxt = kwds.get( 'date', None )
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

    @cherrypy.expose
    def openlayers(self):
      tmpl = lookup.get_template("openlayers.html")
      return tmpl.render(salutation="Hello", target="World")

    graph = Graph()

if __name__ == '__main__':
  R = Root( )
  cherrypy.quickstart( R, config='simple.conf' )


