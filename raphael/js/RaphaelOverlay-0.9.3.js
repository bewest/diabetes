(function(){

	/**
	 * autor: CTAPbIu_MABP
	 * email: ctapbiumabp@gmail.com
	 * site: http://mabp.kiev.ua/2010/09/10/raphael-overlay/
	 * license: GPL
	 * last update: 29.10.2010
	 * version: 0.9.2
	 */

var relations = [];


function RaphaelOverlay(options) {

	for(var i in relations){
		if (relations[i].map == options.map){
			relations[i].overlay.shapes = relations[i].overlay.shapes.concat(options.shapes);
			return relations[i].overlay;
		}
	}
	
	relations.push({map:options.map, overlay:this});
	
	this.shapes = options.shapes || [];
	this.setMap(options.map);
	this.optimize = !!options.optimize

	this.drawable = new Drawable();
	this.dimensions = new Dimensions();
}

RaphaelOverlay.prototype = new google.maps.OverlayView();

RaphaelOverlay.prototype.onAdd = function() {
	
	var center = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(0,0)),
		projection = this.getProjection(),
		worldWidth = projection.getWorldWidth(),
		convertor = new Convertor();
	
	this.div = document.createElement('div');
	this.div.style.border = 'none';
	this.div.style.position = 'absolute';
	this.div.style.overflow = 'visible';
	
	this.div.style.left = center.x - worldWidth / 2 + 'px';
	this.div.style.top = center.y - worldWidth / 2 + 'px';
	this.div.style.width = worldWidth+'px';
	this.div.style.height = worldWidth+'px';
	
	this.getPanes().overlayImage.appendChild(this.div);
	this.drawable.setCanvas(Raphael(this.div));

	convertor.setFromLatLngToDivPixel(function(latLng){
		//fromContainerPixelToLatLng(pixel:Point)
		//fromDivPixelToLatLng(pixel:Point)
		//fromLatLngToContainerPixel(latLng:LatLng)
		//fromLatLngToDivPixel(latLng:LatLng)
		return projection.fromLatLngToDivPixel(latLng);
	});
	convertor.setParsePathString(function(path){
		return Raphael.parsePathString(path);
	});
	convertor.setPathToRelative(function(path){
		return Raphael.pathToRelative(path);
	});
	
	this.dimensions.setConvertor(convertor);
};

RaphaelOverlay.prototype.draw = function() {
	Logger.group("draw");

	var center = this.getProjection().fromLatLngToDivPixel(new google.maps.LatLng(0,0)),
		bounds = this.map.getBounds(),
		worldWidth = this.getProjection().getWorldWidth(),
		left = center.x - worldWidth / 2,
		top = center.y - worldWidth / 2,
		zoom = this.getMap().getZoom(),
		shapes = [],
		figures = [],
		types = ["shapes", "charts"],
		dim = {
			left : [0],
			top : [0],
			right : [0],
			bottom : [0]
		};
	/*
	console.log("bounds",
	"getNorthEast" , bounds.getNorthEast(),
	"getSouthWest", bounds.getSouthWest()
	)*/
	
	this.drawable.getCanvas().clear();
	
	for (var i in this.shapes){
		try {
			
			data = this.dimensions[this.shapes[i].type](this.shapes[i], {
				map:this.map,
				bounds : bounds,
				worldWidth : worldWidth,
				zoom : zoom,
				left : left, 
				top : top
			});

			if ("dimension" in data){
				dim.left.push(data.dimension.left);
				dim.top.push(data.dimension.top);
				dim.right.push(data.dimension.right);
				dim.bottom.push(data.dimension.bottom);
			}

			figures.push({
				data : data.figure,
				type : data.type || this.shapes[i].type,
				attr : this.shapes[i].attr,
				info : this.shapes[i].info
			});
		} catch (e){
			Logger.log(e)
		}
	}

		
	var offsetLeft = Math.max.apply(null,dim.left),
		offsetTop = Math.max.apply(null,dim.top),
		offsetRight = Math.max.apply(null,dim.right),
		offsetBottom = Math.max.apply(null,dim.bottom),
		fullWorkdWidth = offsetLeft + worldWidth + offsetRight,
		fullWorkdHeight = offsetTop + worldWidth + offsetBottom;
		
	this.div.style.left = left - offsetLeft + 'px';
	this.div.style.top = top - offsetTop + 'px';
	this.div.style.width = fullWorkdWidth + 'px';
	this.div.style.height = fullWorkdHeight + 'px';
	this.drawable.getCanvas().setSize(fullWorkdWidth, fullWorkdHeight);
	
	for (var i in figures){
		shapes[i] = this.drawable[figures[i].type](figures[i].data,{
			left : offsetLeft, 
			top : offsetTop
		}, this.clone(figures[i].info));  // magic
		if (figures[i].attr){
			shapes[i].attr(figures[i].attr)
		}
	}

	this.drawable.setShapes(shapes);
	Logger.groupEnd("draw");
};

RaphaelOverlay.prototype.onRemove = function() {
	this.drawable.getCanvas().clear();
	this.div.parentNode.removeChild(this.div);
};

RaphaelOverlay.prototype.clone = function(obj) {
    if(obj == null || typeof(obj) != 'object'){
        return obj;
	}
	
    var temp = obj.constructor(); // changed

    for(var key in obj){
        temp[key] = this.clone(obj[key]);
	}
	
    return temp;
};




Convertor = function(){};

Convertor.prototype.setFromLatLngToDivPixel = function(fromLatLngToDivPixel) {
	this.fromLatLngToDivPixel = fromLatLngToDivPixel;
};

Convertor.prototype.setParsePathString = function(parsePathString) {
	this.parsePathString = parsePathString;
};

Convertor.prototype.setPathToRelative = function(pathToRelative) {
	this.pathToRelative = pathToRelative;
};





Console = function(){
	if (!("console" in window) || !("firebug" in window.console)){
		window.console = {}; // prevent errors
		for (var i in this.logLevels){
			window.console[this.logLevels[i]] = function(){};
		}
	}
	var self = this;
	for (var methodName in window.console){
		(function(methodName){
			var method = window.console[methodName];
				self[methodName] = function(){
					if(self.isLoggable(arguments.callee.caller) && this.checkLogLevel(methodName)){
						method.apply(window.console, arguments);
					}
				};
		})(methodName);
	}
};

Console.prototype.loggable = []; 
Console.prototype.logLevel = 1; // log
Console.prototype.logLevels = ["info","log","debug","warn","error","group","groupEnd"];

Console.prototype.addLoggable = function (){
	for (var i=0,j=arguments.length;i<j;i++){
		this.loggable.push(arguments[i]);
	}
}

Console.prototype.isLoggable = function (method){
	for (var i in this.loggable){
		for (var property in this.loggable[i]) {
			if (this.loggable[i][property] == method){
				return true;
			}
		}
	}
	return false;
}

Console.prototype.setLogLevel = function (level){
	level = level.toLowerCase();
	for (var i in this.logLevels){
		if (this.logLevels[i] == level){
			this.logLevel = i;
			break;
		}
	}
}

Console.prototype.checkLogLevel = function (level){
	var logLevel = 10;
	for (var i in this.logLevels){
		if (this.logLevels[i] == level){
			logLevel = i;
			break;
		}
	}
	return logLevel >= this.logLevel;
}

Dimensions = function(){};

Dimensions.prototype.setConvertor = function(convertor) {
	this.convertor = convertor;
};

Dimensions.prototype.getConvertor = function() {
	return this.convertor;
};

Dimensions.prototype.getScaleRate = function(data, zoom) {
	//console.log("zoom", data.zoom.min, "<", param.zoom, "<", data.zoom.max);
	if ("zoom" in data){
		if ("min" in data.zoom && data.zoom.min > zoom){
			throw "Zoom out of range";
		} else if ("max" in data.zoom && zoom > data.zoom.max){
			throw "Zoom out of range";
		}
		if ("adjusted" in data.zoom){
			zoom -= data.zoom.adjusted;
		} else if ("min" in data.zoom) {
			zoom -= data.zoom.min;
		}
	}
	return 1 << zoom;
};
					
Dimensions.prototype.ellipse = function(data, param) {
	var scale = this.getScaleRate(data, param.zoom),
		x, y, r, rx, ry, point, center;
		
	if (data.center instanceof google.maps.LatLng || data.position instanceof google.maps.LatLng){
		point = this.convertor.fromLatLngToDivPixel(data.center || data.position);
	} else if (data.center instanceof google.maps.Point || data.position instanceof google.maps.Point){
		point = data.center || data.position;
	} else {
		throw "Unrecognized data type";
	}
	
	rx = scale * data.rx;
	ry = scale * data.ry;
	r = scale * data.radius;
	x = point.x - param.left;
	y = point.y - param.top;
	
	var ne = this.convertor.fromLatLngToDivPixel(param.bounds.getNorthEast());
	var sw = this.convertor.fromLatLngToDivPixel(param.bounds.getSouthWest());
	
	// contains
	if (
		this.optimize &&
		Math.pow(sw.x - param.left - x, 2) / Math.pow(rx||r, 2) + Math.pow(sw.y - param.top - y, 2) / Math.pow(ry||r, 2) < 1 &&
		Math.pow(sw.x - param.left - x, 2) / Math.pow(rx||r, 2) + Math.pow(ne.y - param.top - y, 2) / Math.pow(ry||r, 2) < 1 &&
		Math.pow(ne.x - param.left - x, 2) / Math.pow(rx||r, 2) + Math.pow(sw.y - param.top - y, 2) / Math.pow(ry||r, 2) < 1 &&
		Math.pow(ne.x - param.left - x, 2) / Math.pow(rx||r, 2) + Math.pow(ne.y - param.top - y, 2) / Math.pow(ry||r, 2) < 1
	) {
		return this.fillAllMap(param);
	}

	return { 
		figure : {x:x, y:y, rx:rx, ry:ry, r:r, data:data.data},
		dimension : {left:(rx||r)-x, top:(ry||r)-y, right:(rx||r)+x-param.worldWidth, bottom:(ry||r)+y-param.worldWidth}
	};	
};

Dimensions.prototype.circle = function(data, param) {
	return this.ellipse(data, param);
};

Dimensions.prototype.text = function(data, param) {
	var point = this.convertor.fromLatLngToDivPixel(data.position),	
		x = point.x - param.left,
		y = point.y - param.top;
	
	return {
		figure : {x:x, y:y, text:data.text}
	};
};

Dimensions.prototype.polygon = function(data, param) {
	var scale = this.getScaleRate(data, param.zoom), 
		line = [], 
		point = null;

	for (var i in data.position){
		point = this.convertor.fromLatLngToDivPixel(data.position[i]);
		line.push([
			i == 0 ? "M" : "L", 
			point.x - param.left, 
			point.y - param.top
		]);
	}
	line.push(["Z"]);
	
	return { 
		figure : {path:this.convertor.pathToRelative(line)}
	};
};

Dimensions.prototype.path = function(data, param) {
	var scale = this.getScaleRate(data, param.zoom),
		point = this.convertor.fromLatLngToDivPixel(data.position),
		path = this.convertor.pathToRelative(this.convertor.parsePathString(data.path)),
		line = [];
		
	for (var i in path) {
		for (var j in path[i]) {
			if (j == 0) {
				line[i] = [path[i][j]];
			} else if (i==0 && j==1) {
				line[i].push(point.x - param.left + path[i][j] * scale);
			} else if (i==0 && j==2) {
				line[i].push(point.y - param.top + path[i][j] * scale);
			} else {
				line[i].push(path[i][j] * scale);
			}
		}
	}
	
	return { 
		figure : {path:line}
	};
};

Dimensions.prototype.rect = function(data, param) {
	var scale = this.getScaleRate(data, param.zoom),
		ne, sw,	x, y, height, width, r, point, scale, center, fixed;

	if (data.position instanceof google.maps.LatLngBounds) {
		// contains
		if (
			this.optimize &&
			data.position.contains(param.bounds.getNorthEast()) &&
			data.position.contains(param.bounds.getSouthWest())
		){
			return this.fillAllMap(param);
		}
		ne = this.convertor.fromLatLngToDivPixel(data.position.getNorthEast());
		sw = this.convertor.fromLatLngToDivPixel(data.position.getSouthWest());
		width = ne.x - sw.x;
		height = sw.y - ne.y;
		x = sw.x - param.left;
		y = ne.y - param.top;
		r = scale * data.radius;
		fixed = 1;
	} else {

		if (data.position instanceof google.maps.LatLng){
			point = this.convertor.fromLatLngToDivPixel(data.position);
			center = 0;
			fixed = 1;
		} else if (data.position instanceof google.maps.Point){
			point = data.position;
			center = 0;
			fixed = -1;
		} else if (data.center instanceof google.maps.LatLng){
			point = this.convertor.fromLatLngToDivPixel(data.center);
			center = 1 / 2;
			fixed = 1;
		} else if (data.center instanceof google.maps.Point){
			point = data.center;
			center = 1 / 2;
			fixed = -1;
		} else {
			throw "Unrecognized data type";
		}
		
		
		ne = this.convertor.fromLatLngToDivPixel(param.bounds.getNorthEast());
		sw = this.convertor.fromLatLngToDivPixel(param.bounds.getSouthWest());
		width = data.size.width * scale;
		height = data.size.height * scale;
		r = data.radius * scale;
		x = point.x - width * center - param.left;
		y = point.y - height * center - param.top;
		
		// contains
		if (
			this.optimize &&
			x <= sw.x - param.left &&
			y <= ne.y - param.top &&
			x + width >= ne.x - param.left &&
			y + height >= sw.y - param.top
		){
			return this.fillAllMap(param);
		}
	}

	return { 
		figure : {x:x, y:y, width:width, height:height, r:r, src:data.src},
		dimension : {left:-x, top:-y, right:width+x-param.worldWidth*fixed, bottom:height+y-param.worldWidth*fixed},
		type : data.type
	};	
};

Dimensions.prototype.image = function(data, param) {
	return this.rect(data, param);
};

Dimensions.prototype.fillAllMap = function(param){
	var ne, sw, x, y, height, width;
	
	ne = this.convertor.fromLatLngToDivPixel(param.bounds.getNorthEast());
	sw = this.convertor.fromLatLngToDivPixel(param.bounds.getSouthWest());
	width = ne.x - sw.x;
	height = sw.y - ne.y;
	x = sw.x - param.left;
	y = ne.y - param.top;

	return { 
		figure : {x:x, y:y, width:width, height:height, r:0},
		dimension : {left:-x, top:-y, right:width+x-param.worldWidth, bottom:height+y-param.worldWidth},
		type : "rect"
	};
	/*
	return this.rect({
		position : param.bounds
		type : "rect"
	}, param);*/
}

Dimensions.prototype.piechart = function(data, param) {
	return this.ellipse(data, param);
};

Dimensions.prototype.barchart = function(data, param) {
	return this.rect(data, param);
};

Dimensions.prototype.hbarchart = function(data, param) {
	return this.rect(data, param);
};

Dimensions.prototype.linechart = function(data, param) {
	return this.rect(data, param);
};

Dimensions.prototype.dotchart = function(data, param) {
	return this.rect(data, param);
};



Drawable = function(){};

Drawable.prototype.setCanvas = function(canvas) {
	this.canvas = canvas;
};

Drawable.prototype.getCanvas = function() {
	return this.canvas;
};

Drawable.prototype.setShapes = function(array) {
	this.shapes = this.canvas.set(array);
};

Drawable.prototype.getShapes = function(canvas) {
	return this.shapes;
};

Drawable.prototype.path = function(data, param) {
	data.path[0][1] += param.left;
	data.path[0][2] += param.top;
	return this.canvas.path(data.path);
};

Drawable.prototype.polygon = function(data, param) {
	data.path[0][1] += param.left;
	data.path[0][2] += param.top;
	return this.canvas.path(data.path);
};

Drawable.prototype.text = function(data, param) {
	return this.canvas.text(data.x, data.y, data.text);
};

Drawable.prototype.image = function(data, param) {
	return this.canvas.image(
		data.src,
		data.x + param.left,
		data.y + param.top,
		data.width,
		data.height
	);
};

Drawable.prototype.rect = function(data, param) {
	return this.canvas.rect(
		data.x + param.left,
		data.y + param.top,
		data.width,
		data.height,
		data.r
	);
};

Drawable.prototype.circle = function(data, param) {
	return this.canvas.circle(
		data.x + param.left,
		data.y + param.top,
		data.r
	);
};

Drawable.prototype.ellipse = function(data, param) {
	return this.canvas.ellipse(
		data.x + param.left,
		data.y + param.top,
		data.rx,
		data.ry
	);
};

Drawable.prototype.piechart = function(data, param, info) {
	return this.canvas.g.piechart(
		data.x + param.left, 
		data.y + param.top,
		data.r,
		info.data
	);
};

Drawable.prototype.barchart = function(data, param, info) {
	return this.canvas.g.barchart(
		data.x + param.left, 
		data.y + param.top,
		data.width,
		data.height,
		info.data,
		info.param
	);
};

Drawable.prototype.hbarchart = function(data, param, info) {
	return this.canvas.g.hbarchart(
		data.x + param.left, 
		data.y + param.top,
		data.width,
		data.height,
		info.data,
		info.param
	);
};

Drawable.prototype.linechart = function(data, param, info) {
	return this.canvas.g.linechart(
		data.x + param.left, 
		data.y + param.top,
		data.width,
		data.height,
		info.x,
		info.y,
		info.param
	);
};

Drawable.prototype.dotchart = function(data, param, info) {
	return this.canvas.g.dotchart(
		data.x + param.left, 
		data.y + param.top,
		data.width,
		data.height,
		info.xs,
		info.ys,
		info.data,
		info.param
	);
};

	window.RaphaelOverlay = RaphaelOverlay;
	
	Logger = new Console;
	Logger.addLoggable(/*RaphaelOverlay.prototype, Drawable.prototype, Dimensions.prototype*/);
	//Logger.setLogLevel("log");



	
})();