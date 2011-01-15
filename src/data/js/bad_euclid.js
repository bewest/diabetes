
// http://maps.forum.nu/gm_function_plotter.html
// ====== Create the Euclidean Projection for the flat map ======
// == Constructor ==
function EuclideanProjection(maxzoom){
  this.pixelsPerLonDegree = [];
  this.pixelsPerLonRadian = [];
  this.pixelOrigo = [];
  this.tileBounds = [];
  var b = 256;
  //var b = 256;
  var c = 1;
  for(var d = 0; d < maxzoom ; d++){
    var e = b/2;
    //this.pixelsPerLonDegree.push(b / 360);
    //this.pixelsPerLonRadian.push(b / (2*Math.PI));
    this.pixelsPerLonDegree.push(b / 360);
    this.pixelsPerLonRadian.push(b / (2*Math.PI));
    this.pixelOrigo.push(new google.maps.Point(e,e));
    this.tileBounds.push(c);
    b *= 2;
    c *= 2
  }
  return this;
}

EuclideanProjection.prototype.getZoomFactor = function(zoom){
  var zfactor = Math.pow(2, zoom);
  console.log( 'zoom factor same?', zfactor, this.tileBounds[ zoom ] );
  return zfactor;


}

// == A method for converting latitudes and longitudes to pixel coordinates == 
// 6/6 grid 256
// latlng( 0, 0 ) = 
// x
EuclideanProjection.prototype.fromLatLngToPoint = function(ll,zoom){
  console.log( 'euclid ll2point', this, arguments );
  if (arguments.length < 2) zoom = test.gmap.getZoom();
  //var x = Math.round(this.pixelOrigo[zoom].x + ll.lng()* this.pixelsPerLonDegree[zoom]);
  //var y = Math.round(this.pixelOrigo[zoom].y + (-1 * ll.lat()) * this.pixelsPerLonDegree[zoom]);
  var x = Math.round(this.pixelOrigo[zoom].x + ll.lng()* this.pixelsPerLonDegree[zoom]);
  var y = Math.round(this.pixelOrigo[zoom].y + (-1 * ll.lat()) * this.pixelsPerLonDegree[zoom]);
  console.log( this.getZoomFactor( zoom), 'origo', this.pixelOrigo[zoom],
               this.pixelsPerLonDegree[zoom] );
  return new google.maps.Point(x,y);
};

// == a method for converting pixel coordinates to latitudes and longitudes ==
EuclideanProjection.prototype.fromPointToLatLng = function(point, noWrap) {
  console.log( 'euclid point2ll', this, arguments );
  var zoom = test.gmap.getZoom();
  var lng  = (point.x - this.pixelOrigo[zoom].x) / this.pixelsPerLonDegree[zoom];
  var lat  = -1 * (point.y - this.pixelOrigo[zoom].y) / this.pixelsPerLonDegree[zoom];

  return new google.maps.LatLng(lat, lng, true);
};

// == a method that checks if the y value is in range, and wraps the x value ==
// function(tileIndex, zoom, bs) {
EuclideanProjection.prototype.tileCheckRange = function(a,b,c){
  var d=this.tileBounds[b];
  if (a.y < 0 || a.y >= d) {
    return false;
  }
  if(a.x < 0 || a.x >= d){
    a.x = a.x % d;
    if ( a.x < 0 ){
      a.x += d;
    }
  }
  return true
}

// == a method that returns the width of the tilespace ==     
EuclideanProjection.prototype.getWrapWidth = function(zoom) {
  return this.tileBounds[zoom] * 256;
}

