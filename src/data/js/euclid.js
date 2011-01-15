
var FOO = true;

function EuclidProjection(tiles, lng_ticks, lat_ticks ){
  this._num_tiles = tiles;
  this._lng_ticks = lng_ticks;
  this._lat_ticks = lat_ticks;
  // pixels per tile * num tiles
  // XXX: howto get tilesize?
  var tilesize    = 256 * this._num_tiles;
  this._grid_size  = new google.maps.Size( tilesize, tilesize );
  this._origin     = new google.maps.Point( this._grid_size.width/2,
                                           this._grid_size.height/2 );

  this._px_per_lng = this._grid_size.width / this._lng_ticks;
  this._px_per_lat = this._grid_size.height / this._lat_ticks;
  return this;
}

EuclidProjection.prototype.fromLatLngToPoint = function(ll){
  // 
  var origin = this._origin;

  var x = origin.x + ( this._px_per_lng * ll.lng());
  // Note that latitude is measured from the world coordinate origin
  // at the top left of the map.
  var y = origin.y + ( this._px_per_lat * ll.lat());
  //y = y * -1

  //var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);
  //var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);
 
  return new google.maps.Point(x, y);
  
}

EuclidProjection.prototype.fromPointToLatLng = function(point, noWrap) {
  var y = point.y;
  var x = point.x;
  var origin = this._origin;
  var lng = (x - origin.x) / this._px_per_lng;
  var lat = (y - origin.y) / this._px_per_lat;
  return new google.maps.LatLng(lat, lng);

}

// EOF
