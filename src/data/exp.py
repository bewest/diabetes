#!/usr/bin/python

#from matplotlib.backends.backend_svg import FigureCanvasSVG as FigureCanvas
import user
from matplotlib.dates import AutoDateLocator
from matplotlib import dates
from matplotlib.backends.backend_cairo import FigureCanvasCairo as FigureCanvas
from matplotlib import ticker

from matplotlib.figure import Figure
from matplotlib import pyplot as plt
from mpl_toolkits.axes_grid1 import ImageGrid

import sys
import os
from pprint import pformat
import numpy as np

from insulaudit.data import glucose

import insulaudit
import logging
logging.basicConfig( stream=sys.stdout )
log = logging.getLogger( 'data.timseries.hacking' )
log.setLevel( logging.DEBUG )

log.debug( 'hello world' )

data = {}

halfday = dates.relativedelta( hours=12 )

def get_opt_parser( ):
  from optparse import OptionParser
  usage = """usage = "usage: %prog [options] input output"""
  parser = OptionParser(usage=usage)
  parser.add_option("-p", "--prefix", dest="prefix", default="./tiles",
                    help="prefix to place images")
  parser.add_option("-q", "--quiet",
                    action="store_false", dest="verbose", default=True,
                    help="don't print status messages to stdout")

  return parser

def get_series( name ):
  return glucose.load_file( name )

PREFER = ( 120, 135 )
SAFE = ( 70, 140 )

def set_daily_locators( ax, rotation=30,
                            majorfontsize='small',
                            minorfontsize='xx-small' ):
  majorLocator   = dates.DayLocator( )
  majorFormatter = dates.AutoDateFormatter( majorLocator )

  minorLocator   = dates.HourLocator( interval=6 )
  minorFormatter = dates.AutoDateFormatter( minorLocator )

  ax.xaxis.set_major_locator(majorLocator)
  ax.xaxis.set_major_formatter(majorFormatter)

  ax.xaxis.set_minor_locator(minorLocator)
  ax.xaxis.set_minor_formatter(minorFormatter)

  plt.setp(ax.get_xmajorticklabels(), rotation=rotation, fontsize=majorfontsize)
  plt.setp(ax.get_xminorticklabels(), rotation=rotation, fontsize=minorfontsize)

def plot_glucose_stems( ax, ts ):
  # visualize glucose using stems
  markers, stems, baselines = ax.stem( ts.time, ts.value,
           linefmt='b:' )
  plt.setp( markers, color='red', linewidth=.5,
            marker='o' )
  plt.setp( baselines, marker='None' ) 

def daily_timseries( ts ):
  fig = Figure( ( 2.56, 2.56 ), 300 )
  canvas = FigureCanvas(fig)
  ax = fig.add_axes((0,0,1,1))

  ax.set_ylim( [ 0 , 500 ] )

  preferspan = ax.axhspan( SAFE[0], SAFE[1],
                           facecolor='g', alpha=0.2,
                           edgecolor = '#003333',
                           linewidth=1
                         )
  # XXX: gets a list of days.
  timestamps = glucose.get_days( ts.time )
  halfday = dates.relativedelta( hours=12 )
  soleday = dates.relativedelta( days=1 )
  xmin, xmax = ( timestamps[ 0 ], timestamps[ 1 ] + soleday )
  ax.set_xlim( [ xmin, xmax ] )
  #fig.autofmt_xdate( )
  #plot_glucose_stems( ax, ts )
  plt.setp(ax.get_xminorticklabels(), visible=False )
  plt.setp(ax.get_xmajorticklabels(), visible=False )
  plt.setp(ax.get_ymajorticklabels(), visible=False )
  plt.setp(ax.get_yminorticklabels(), visible=False )

  ax.grid(True)

  xmin, xmax = ax.get_xlim( )
  log.info( pformat( {
    'xlim': [ dates.num2date( xmin ), dates.num2date( xmax ) ],
  } ) )

  return canvas

def tiled_axis( ts, filename=None ):
  fig = Figure( ( 2.56 * 4, 2.56 * 4), 300 )
  canvas = FigureCanvas(fig)
  #ax = fig.add_subplot(111)

  grid = ImageGrid(fig, 111, # similar to subplot(111)
                  nrows_ncols = (3, 1),
                  axes_pad = 0.5,
                  add_all=True,
                  label_mode = "L",
                  )
  # pad half a day so that major ticks show up in the middle, not on the edges
  delta = dates.relativedelta( days=2, hours=12 )
  # XXX: gets a list of days.
  timestamps = glucose.get_days( ts.time )
  xmin, xmax = ( timestamps[  0 ] - delta,
                 timestamps[ -1 ] + delta )

  fig.autofmt_xdate( )

  def make_plot( ax, limit ):

    preferspan = ax.axhspan( SAFE[0], SAFE[1],
                             facecolor='g', alpha=0.2,
                             edgecolor = '#003333',
                             linewidth=1
                           )
  def draw_title( ax, limit ):
    ax.set_title('glucose history')

  #ax.set_ylabel('glucose mm/dL')
  return canvas

  
def safe_span( ax ):
  preferspan = ax.axhspan( SAFE[0], SAFE[1],
                           facecolor='g', alpha=0.2,
                           edgecolor = '#003333',
                           linewidth=1
                         )
  return preferspan

def daily_axis( ts ):
  # http://matplotlib.sourceforge.net/mpl_toolkits/axes_grid/users/overview.html
  fig = Figure( ( 2.56, 2.56 ), 300 )
  canvas = FigureCanvas(fig)

  ax = fig.add_subplot(111)
  safe_span(ax)
  timestamps = glucose.get_days( ts.time )
  xmin, xmax = timestamps[ 0 ], timestamps[ -1 ]
  ax.set_xlim( [ xmin, xmax ] )
  ax.set_ylim( [ ts.value.min( ) *.85 , 600 ] )
  log.info( pformat( timestamps ) )
  #fig.autofmt_xdate( )

  ax.grid(True)

  return canvas

def config_yaxis( ax ):
  ax.set_ylim( [ 40, 400 ] )
  tick_locs = [40,70,140,200,300,400]
  ax.yaxis.set_major_locator( ticker.FixedLocator( tick_locs ) )
  ax.yaxis.set_major_formatter(ticker.FixedFormatter( tick_locs ))

def y_axis_panel( ):
  """Just get the yaxis"""
  """TODO: more sensitive ticks?"""
  fig = Figure( ( .64, 5.12 ), 300 )
  canvas = FigureCanvas(fig)
  ax = fig.add_axes((.9,1./3.,1.,.5))
  ax.grid(True)
  config_yaxis( ax )
  safe_span(ax)
  ax.xaxis.set_visible(False)
  return canvas

def x_axis_panel( ):
  fig = Figure( ( 2.56, 2.56 ), 300 )
  canvas = FigureCanvas(fig)

def grid( data ):
  fig = Figure( ( 2.56, 2.56 ), 300 )
  canvas = FigureCanvas(fig)
  d = data.time[ 0 ]
  day = glucose.glucose_for_day( data, d )
  days = glucose.get_days( data.time )
  name = str( d )

  ax = fig.add_axes((.5,0,1,1))
  xmin, xmax = days[ 0 ], days[ -1 ]
  ax.set_xlim( [ xmin, xmax ] )
  ax.grid(True)
  safe_span(ax)
  one = ax.text( .50, .50, name,
           horizontalalignment='center',
           verticalalignment='center',
           transform = ax.transAxes )
  one.remove( )
  log.info( pformat( one ) )
  ax.text( .60, .60, name + "two",
           horizontalalignment='center',
           verticalalignment='center',
           transform = ax.transAxes )
  set_daily_locators( ax )
  config_yaxis( ax )

  return canvas


  
def exp( data ):
  fig = Figure( ( 2.56, 2.56 ), 300 )
  canvas = FigureCanvas(fig)
  d = data.time[ 0 ]
  day = glucose.glucose_for_day( data, d )
  name = str( d )
  ax = fig.add_axes((0,0,1,1))
  ax.text( .50, .50, name,
           horizontalalignment='center',
           verticalalignment='center',
           transform = ax.transAxes )
  ax.grid(True)
  return canvas

def day_ticks( ):
  pass


if __name__ == '__main__':
  print "Generate a chart of a timeseries."

  parser = get_opt_parser( )
  options, args = parser.parse_args( sys.argv )
  infile, outfile = args[ 1 ], args[ 2 ]
  if infile == '-':
    infile = sys.stdin

  outfile = os.path.join(options.prefix, outfile)
  log.info( 'input: %s'  % infile )
  log.info( 'saving: %s' % outfile )
  data = get_series( infile )

  days= glucose.get_days( data.time )
  for day in days:
    records = glucose.glucose_for_day( data, day )
    n = day.strftime( '%Y-%m-%d' )
    
  canvas = y_axis_panel( )
  #canvas.print_png(outfile, transparent=True)
  #canvas.print_figure( outfile, transparent=True )
  canvas.figure.savefig( outfile, transparent=True)




#####
# EOF
