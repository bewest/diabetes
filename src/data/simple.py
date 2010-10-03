


from matplotlib.backends.backend_svg import FigureCanvasSVG as FigureCanvas
#from matplotlib.backends.backend_cairo import FigureCanvasCairo as FigureCanvas
from matplotlib.figure import Figure




xlim = [ 0,  10.0 ]
YMAX = 240.00
ylim = [ 0,  YMAX ]
fig = Figure( )
canvas = FigureCanvas(fig)
#xticks = [ 1,2,3,4,5,6,7,8  ]
ax = fig.add_subplot(111, xlim=xlim, ylim=ylim,
                      xticks=range( 10 ) )
data = [[False, False], [1,200],[4, 100],[6, 120]]
#ax.plot(data)
D = dict( data )

ax.stem( D.keys( ), D.values( ), '-.' )

ax.set_title('hi mom')
ax.grid(True)
ax.set_xlabel('time')
ax.set_ylabel('glucose')
canvas.print_figure('test')


#####
# EOF
