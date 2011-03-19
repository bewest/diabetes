from matplotlib.backends.backend_cairo import FigureCanvasCairo as FigureCanvas
from matplotlib import ticker

from matplotlib.figure import Figure
from matplotlib import pyplot as plt
from mpl_toolkits.axes_grid1 import ImageGrid
import cStringIO

PREFER = ( 120, 135 )
SAFE = ( 70, 140 )
  
def safe_span( ax ):
  preferspan = ax.axhspan( SAFE[0], SAFE[1],
                           facecolor='g', alpha=0.2,
                           edgecolor = '#003333',
                           linewidth=1
                         )
  return preferspan

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
  return get_image_buffer( canvas )

def x_axis_panel( ):
  fig = Figure( ( 2.56, 2.56 ), 300 )
  ax = fig.add_axes((0,0,1,1))
  ax.grid(True)
  config_yaxis( ax )
  safe_span(ax)
  canvas = FigureCanvas(fig)
  return get_image_buffer( canvas )

def debug(msg):
  fig = Figure( (2.56, 2.56), 300, linewidth=.5 )
  canvas = FigureCanvas(fig)
  ax = fig.add_axes((0,0,1,1))
  ax.grid(True)
  ax.text( 0, 1, msg,
           verticalalignment='top',
           transform=ax.transAxes )
  return get_image_buffer( canvas )

def get_image_buffer( canvas ):
  stream = cStringIO.StringIO( )
  canvas.figure.savefig(stream, transparent=True)
  stream.seek(0)
  return stream

######
# EOF
