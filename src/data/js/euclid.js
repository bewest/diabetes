function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}

  // var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);

function EuclidProjection(tiles, lng_ticks, lat_ticks ){
  this._num_tiles = tiles;
  this._lng_ticks = lng_ticks;
  this._lat_ticks = lat_ticks;
  // pixels per tile * num tiles
  // XXX: howto get tilesize?
  var tilesize    = 256;
  this._grid_size  = new google.maps.Size( tilesize * tiles, tilesize * tiles);
  this._origin     = new google.maps.Point( this._grid_size.width/2 - tilesize/2,
                                           this._grid_size.height/2);

  this._px_per_lng = tilesize / this._lng_ticks;
  this._px_per_lat = tilesize / this._lat_ticks;
  return this;
}

EuclidProjection.prototype.fromLatLngToPoint = function(ll){
  // 
  var origin = this._origin;

  var x = origin.x + ( this._px_per_lng * ll.lng());
  // Note that latitude is measured from the world coordinate origin
  // at the top left of the map.
  var y = origin.y - ( this._px_per_lat * ll.lat() * -1);
  // y = y % this._grid_size.height;
  //y -= y

  //var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);
  //var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);
  // var SCALE_FACTOR = 90.0 / GRID_WIDTH_IN_REGIONS;
  var result = new google.maps.Point(x, y);
  console.log( 'll2point', this, arguments, result );
  return result;
  
}

EuclidProjection.prototype.fromPointToLatLng = function(point, noWrap) {
  var y = point.y;
  var x = point.x;
  var origin = this._origin;
  var lng = (x - origin.x) / this._px_per_lng;
  var lat = (y - origin.y) / this._px_per_lat;
  var result = new google.maps.LatLng(lat, lng);
  console.log( 'p2ll', this, arguments, result );
  return result;

}

// EOF
