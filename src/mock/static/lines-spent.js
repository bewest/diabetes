var data = [];
var baseline = 0;
var min = 0, max = 0;
for (var i = 0; i < kData.changes.length; ++i) {
  var commit = kData.changes[i];

  if (commit.add > 1000)
    continue;
  if (commit.del > 1000)
    continue;

  if (commit.add + commit.del < 5)
    continue;

  commit.baseline = baseline;
  commit.time = new Date(commit.time * 1000);

  data.push(commit);
  if (baseline - commit.del < min)
    min = baseline - commit.del;
  if (baseline + commit.add > max)
    max = baseline + commit.add;

  baseline += commit.add - commit.del;
}

var barwidth = 8;
var barspacing = 2;

var kMarginTop = 25;
var labelmargin = 2;
var w = data.length * (barwidth + barspacing);
var h = 300;


var x = d3.scale.linear()
  .domain([0, data.length])
  .range([0, w]);
var y = d3.scale.linear()
  .domain([min-100, max+100])
  .range([h, kMarginTop]);
var timescale = d3.time.scale()
  .domain([data[0].time, data[data.length - 1].time])
  .range([0, w]);

var vis = d3.select('#vis-body')
  .append('svg:svg')
    .attr('width', w)
    .attr('height', h)
;
vis.call(d3.behavior.zoom().on("zoom", move));
// vis.call(d3.behavior.zoom());

function move() {
  var ev = d3.event;
  var x = d3.event.translate[0],
      y = d3.event.translate[1];
  console.log(this, arguments, ev, x, y);
  console.log( 'selection:',
               vis.selectAll('.commit'));
  // find data in view
}

var kTickWidth = 42;
var kTickMargin = 2;

d3.select('#vis-body')
  .style('margin-left', (kTickWidth + kTickMargin) + 'px');

var ticks = y.ticks(5);
d3.select('#vis-left')
  .append('svg:svg')
    .attr('width', kTickWidth)
    .attr('height', h)
  .selectAll('text.tick')
    .data(ticks)
  .enter().append('svg:text')
    .attr('class', 'tick')
    .attr('x', kTickWidth)
    .attr('y', y)
    .attr('dy', '0.5ex')
    .attr('text-anchor', 'end')
    .text(d3.format('+'))
;

ticks = vis.selectAll('line.tick')
    .data(y.ticks(5));
ticks.enter().append('svg:line')
  .attr('x1', x(0))
  .attr('x2', x(data.length))
  .attr('y1', y)
  .attr('y2', y)
  .style('stroke', function(d) { return d == 0 ? 'black' : 'lightgray'; })
;

// Add a date marker every 30 bars or so.
var time_tick_count = data.length / 30;
var timeticks = timescale.ticks(time_tick_count);
vis.selectAll('text.date')
    .data(timeticks)
  .enter().append('svg:text')
    .attr('x', timescale)
    .attr('dx', '0.5ex')
    .attr('y', '0.8em')
    .text(d3.time.format('%b %Y'))
    .style('fill', 'gray')
;
vis.selectAll('line.date')
    .data(timeticks)
  .enter().append('svg:line')
    .attr('x1', timescale)
    .attr('x2', timescale)
    .attr('y1', '0')
    .attr('y2', '1.5em')
    .style('stroke', 'gray')
;


var commits = vis.selectAll('.commit')
    .data(data)
  .enter().append('svg:g')
    .attr('transform', function(d, i) { return 'translate(' + x(i) + ',0)'; })
;

commits.append('svg:rect')
  .attr('class', 'positive')
  .attr('width', barwidth)
  .attr('x', 0)
  .attr('y', function(d) { return y(d.baseline + d.add); })
  .attr('height', function(d) { return Math.abs(y(d.baseline + d.add) - y(d.baseline)); })
;

commits.append('svg:rect')
  .attr('class', 'negative')
  .attr('width', barwidth)
  .attr('x', 0)
  .attr('y', function(d) { return y(d.baseline); })
  .attr('height', function(d) { return Math.abs(y(d.baseline - d.del) - y(d.baseline)); })
;

commits.append('svg:title')
  .text(function(d) { return d.msg; })
;

d3.select('#git').text(kData.git_args.join(' '));
