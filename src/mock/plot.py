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

def config_yaxis( ax, formatter=True ):
  ax.set_ylim( [ 0, 400 ] )
  tick_locs = [0, 40,70,140,200,300,400]
  ax.yaxis.set_major_locator( ticker.FixedLocator( tick_locs ) )
  if formatter:
    ax.yaxis.set_major_formatter(ticker.FixedFormatter( tick_locs ))

def config_xaxis( ax, numTicks ):
  ax.xaxis.set_major_locator( ticker.LinearLocator( numTicks ) )

def y_axis_panel(size=(.64, 3.84)):
  """Just get the yaxis"""
  """TODO: more sensitive ticks?"""
  fig = Figure( size, 300 )
  canvas = FigureCanvas(fig)
  ax = fig.add_axes((.9, 1/6., 1., 2/3.0))
  ax.grid(True)
  config_yaxis( ax )
  safe_span(ax)
  ax.xaxis.set_visible(False)
  return get_image_buffer( canvas )

def x_axis_panel( xlim=(0,1000), numticks=5 ):
  fig = Figure( ( 2.56, 2.56 ), 300 )
  ax = fig.add_axes((0,0,1,1))
  ax.grid(True)
  config_yaxis( ax )
  config_xaxis( ax, numticks )
  safe_span(ax)
  canvas = FigureCanvas(fig)
  return get_image_buffer( canvas )

def dot( color='r' ):
  fig = Figure( ( .12, .12 ), 300 )
  canvas = FigureCanvas(fig)
  ax = fig.add_axes((0,0,1,1), frameon=False)
  ax.set_ylim([0,1])
  ax.set_xlim([0,1])
  ax.plot(.5, .5, 'ro')
  ax.grid(False)
  ax.tick_params('both', width=0, length=0)
  return get_image_buffer( canvas )



def debug(msg):
  fig = Figure( (2.56, 2.56), 300, linewidth=.5 )
  canvas = FigureCanvas(fig)
  ax = fig.add_axes((0,0,1,1))
  config_yaxis( ax, formatter=False )
  config_xaxis( ax, 5 )
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
