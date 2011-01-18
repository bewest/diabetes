#!/usr/bin/python

from matplotlib.dates import AutoDateLocator
from matplotlib import dates
from matplotlib.backends.backend_cairo import FigureCanvasCairo as FigureCanvas

from matplotlib.figure import Figure
from matplotlib import pyplot as plt
import datetime

def day_range( start, end ):
  pass
  
def draw_date_grid( prefix="tiles/", grid=(6,6) ):
  xmax, ymax = grid
  for x in range( xmax ):
    for y in range( ymax ):
      name = prefix + 't-{x}-{y}.png'.format( x=x, y=y )
      draw_tile( name )

def draw_tile( name ):
  fig = Figure( ( 2.56, 2.56 ), 300 )
  canvas = FigureCanvas(fig)
  ax = fig.add_axes((0,0,1,1))
  SAFE = ( 70, 140 )

  ax.set_ylim( [ 0 , 500 ] )

  preferspan = ax.axhspan( SAFE[0], SAFE[1],
                           facecolor='g', alpha=0.2,
                           edgecolor = '#003333',
                           linewidth=1
                         )
  # XXX: gets a list of days.
  timestamps = datetime.date.today( )
  halfday = dates.relativedelta( hours=12 )
  soleday = dates.relativedelta( days=1 )
  xmin, xmax = ( timestamps, timestamps + soleday )
  ax.set_xlim( [ xmin, xmax ] )
  #fig.autofmt_xdate( )
  #plot_glucose_stems( ax, ts )
  plt.setp(ax.get_xminorticklabels(), visible=False )
  plt.setp(ax.get_xmajorticklabels(), visible=False )
  plt.setp(ax.get_ymajorticklabels(), visible=False )
  plt.setp(ax.get_yminorticklabels(), visible=False )
  ax.text( .50, .50, name,
           horizontalalignment='center',
           verticalalignment='center',
           transform = ax.transAxes )
  ax.grid(True)

  fig.savefig( name, transparent=True )



if __name__ == '__main__':
  draw_tile( 'tile.png' )
  draw_date_grid( )

#####
# EOF
