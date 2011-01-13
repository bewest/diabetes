#!/usr/bin/python

#from matplotlib.backends.backend_svg import FigureCanvasSVG as FigureCanvas
from matplotlib.dates import AutoDateLocator
from matplotlib import dates
from matplotlib.backends.backend_cairo import FigureCanvasCairo as FigureCanvas

from matplotlib.figure import Figure
from matplotlib import pyplot as plt
from mpl_toolkits.axes_grid1 import ImageGrid

import sys
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

def get_opt_parser( ):
  from optparse import OptionParser
  usage = """usage = "usage: %prog [options] input output"""
  parser = OptionParser(usage=usage)
  parser.add_option("-q", "--quiet",
                    action="store_false", dest="verbose", default=True,
                    help="don't print status messages to stdout")

  return parser

def get_series( name ):
  return glucose.load_file( name )

PREFER = ( 120, 135 )
SAFE = ( 70, 140 )

def month_timeseries( ts ):
  pass

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
  def draw_glucose( ax, limit ):
    xmin, xmax = limit
    # visualize glucose using stems
    ax.set_xlim( [ xmin, xmax ] )
    markers, stems, baselines = ax.stem( ts.time, ts.value,
             linefmt='b:' )
    plt.setp( markers, color='red', linewidth=.5,
              marker='o'
            )
    plt.setp( baselines, marker='None' ) 

  def draw_title( ax, limit ):
    ax.set_title('glucose history')

  def get_axis( ax, limit ):
    xmin, xmax = limit
    ax.set_xlim( [ xmin, xmax ] )

    ax.grid(True)
    #ax.set_ylim( [ ts.value.min( ) *.85 , 600 ] )
    #ax.set_xlabel('time')

    majorLocator   = dates.DayLocator( )
    majorFormatter = dates.AutoDateFormatter( majorLocator )

    minorLocator   = dates.HourLocator( interval=6 )
    minorFormatter = dates.AutoDateFormatter( minorLocator )

    #ax.xaxis.set_major_locator(majorLocator)
    #ax.xaxis.set_major_formatter(majorFormatter)

    ax.xaxis.set_minor_locator(minorLocator)
    ax.xaxis.set_minor_formatter(minorFormatter)

    labels = ax.get_xminorticklabels()
    plt.setp(labels, rotation=30, fontsize='small')
    plt.setp(ax.get_xmajorticklabels(), rotation=30, fontsize='medium')

    xmin, xmax = ax.get_xlim( )
    
    log.info( pformat( {
      'xlim': [ dates.num2date( xmin ), dates.num2date( xmax ) ],
      'xticks': dates.num2date( ax.get_xticks( ) ),
    } ) )

  for i, day in enumerate(timestamps):
    ax = grid[i]
    get_axis( ax, [ day, day + delta ] )
    name = '%s-%d.png' % ( day.isoformat( ), i )
    #fig.savefig( name )
    canvas.print_figure(name)
    # fig.clf()
    #make_plot( ax, 

  #ax.set_ylabel('glucose mm/dL')
  return canvas

def daily_axis( ts ):
  # http://matplotlib.sourceforge.net/mpl_toolkits/axes_grid/users/overview.html
  fig = Figure( ( 2.56, 2.56 ), 300 )
  canvas = FigureCanvas(fig)

  ax = fig.add_subplot(111)

  preferspan = ax.axhspan( SAFE[0], SAFE[1],
                           facecolor='g', alpha=0.2,
                           edgecolor = '#003333',
                           linewidth=1
                         )
  timestamps = glucose.get_days( ts.time )
  xmin, xmax = timestamps[ 0 ], timestamps[ -1 ]
  ax.set_xlim( [ xmin, xmax ] )
  ax.set_ylim( [ ts.value.min( ) *.85 , 600 ] )
  log.info( pformat( timestamps ) )
  #fig.autofmt_xdate( )

  ax.grid(True)

  return canvas
  
def giant_timeseries( ts ):

  fig = Figure( ( 20.3, 3.5 ), 300 )
  canvas = FigureCanvas(fig)

  ax = fig.add_subplot(111, padding=0)


  preferspan = ax.axhspan( SAFE[0], SAFE[1],
                           facecolor='g', alpha=0.35,
                           edgecolor = '#003333',
                           linewidth=1
                         )

  # visualize glucose using stems
  # XXX: gets a list of days.
  timestamps = glucose.get_days( ts.time )
  delta = dates.relativedelta( days=1, hours=12 )
  oneday = dates.relativedelta( days=1 )
  xmin, xmax = ( timestamps[ 0 ], timestamps[ -1 ] )
  
  
  ax.set_xlim( [ xmin, xmax ] )
  markers, stems, baselines = ax.stem( ts.time, ts.value,
           linefmt='b:' )
  plt.setp( markers, color='red', linewidth=.5,
            marker='o'
          )
  plt.setp( baselines, marker='None' ) 
  fig.autofmt_xdate( )

  ax.set_title('glucose history')
  ax.grid(True)
  ax.set_xlabel('time')

  majorLocator   = dates.DayLocator( )
  majorFormatter = dates.AutoDateFormatter( majorLocator )

  minorLocator   = dates.HourLocator( interval=6 )
  minorFormatter = dates.AutoDateFormatter( minorLocator )

  ax.xaxis.set_major_locator(majorLocator)
  ax.xaxis.set_major_formatter(majorFormatter)

  ax.xaxis.set_minor_locator(minorLocator)
  ax.xaxis.set_minor_formatter(minorFormatter)

  labels = ax.get_xminorticklabels()
  plt.setp(labels, rotation=30, fontsize='small')
  plt.setp(ax.get_xmajorticklabels(), rotation=30, fontsize='medium')


  xmin, xmax = ax.get_xlim( )
  log.info( pformat( {
    'xlim': [ dates.num2date( xmin ), dates.num2date( xmax ) ],
  } ) )

  ax.set_ylabel('glucose mm/dL')
  return canvas

if __name__ == '__main__':
  print "Generate a chart of a timeseries."

  parser = get_opt_parser( )
  options, args = parser.parse_args( sys.argv )
  infile, outfile = args[ 1 ], args[ 2 ]
  if infile == '-':
    infile = sys.stdin

  log.info( 'infile: %s' % infile )
  data = get_series( infile )

  canvas = daily_timseries( data )
  #canvas = daily_axis( data )
  #canvas = last_day( data )
  #canvas = giant_timeseries( data )
  #canvas = tiled_axis( data )
  canvas.print_figure(outfile, pad_inches=None)




#####
# EOF
