from matplotlib.backends.backend_cairo import FigureCanvasCairo as FigureCanvas
from matplotlib.figure import Figure
xlim = [ 0,  4.0 ]
YMAX = 240.00
ylim = [ 0,  YMAX ]
fig = Figure( )
canvas = FigureCanvas(fig)
#xticks = [ 1,2,3,4,5,6,7,8  ]
ax = fig.add_subplot(111, xlim=xlim, ylim=ylim )
data = [[1,200],[4, 100],[6, 120]]
ax.plot(data)
for x,y in data:
  print "%s, %s" % ( x, y )
  ax.axvline( x=x, ymin=0, ymax=y/YMAX,
              ls='--',
              color='r',
              marker='*'
            )
  ax.stem( [x], [y/YMAX], '-.' )

ax.set_title('hi mom')
ax.grid(True)
ax.set_xlabel('time')
ax.set_ylabel('glucose')
canvas.print_figure('test')


#####
# EOF
