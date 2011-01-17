function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}


function invertX(y, tilesize, num_tiles){
  var tileoffset = ( Math.floor( y / tilesize ) );
  return num_tiles *  tilesize - ( ( tileoffset * tilesize )
                                 +  ( y % tilesize ) );
  
}

function GPoint( x, y ) { return new google.maps.Point( x, y ); }
function GLatLng( lat, lng ) { return new google.maps.LatLng( lat, lng ); }


function EuclidProjection(tiles, tilesize, lng_ticks, lat_ticks ){
  this._num_tiles = tiles;
  this._lng_ticks = lng_ticks;
  this._lat_ticks = lat_ticks;
  // pixels per tile * num tiles
  // XXX: howto get tilesize?
  var tilesize    = tilesize;
  this._grid_size  = new google.maps.Size( tilesize * tiles, tilesize * tiles);
  this._origin     = new google.maps.Point( 0,
                                            0);

  this._tilesize  = tilesize;
  this._px_per_lng = tilesize / this._lng_ticks;
  this._px_per_lat = tilesize / this._lat_ticks;
  return this;
}

EuclidProjection.prototype.fromLatLngToAxis = function(ll) {
  // Note that latitude is measured from the world coordinate origin
  // at the top left of the map.
  var x = ( this._px_per_lng * ll.lng());
  var delta = ( this._px_per_lat * ll.lat() * -1);
  var y = delta * -1;
  var result = new google.maps.Point(x, y);
  return result;

}
EuclidProjection.prototype.fromPointToAxis = function(world) {
  var origin = this._origin;
  var x    = (world.x - origin.x);
  var y    = (world.y - origin.y) * -1;
  var result = new google.maps.Point(x, y);
  return result;

}

EuclidProjection.prototype.fromAxisToWorld = function(axis) {
  var result = axis;
  return result;
}


EuclidProjection.prototype.fromLatLngToPoint = function(ll){
  // 
  var origin = this._origin;
  var axis   = this.fromLatLngToAxis( ll );
  var result = this.fromAxisToWorld( axis );
  // console.log( 'll2point', this, arguments, result );
  return result;
  
}

EuclidProjection.prototype.fromPointToLatLng = function(point, noWrap) {
  // XXX: what is noWrap? it's passed occasionally
  var y      = point.y;
  var x      = point.x;
  var axis   = this.fromPointToAxis( point );
  var lng    = (axis.x) / this._px_per_lng;
  var lat    = (axis.y) / this._px_per_lat * -1;
  // lat = invertX( lat, this._tilesize, this._num_tiles ) * 1;
  var result = new google.maps.LatLng(lat, lng);
  // console.log( 'p2ll', this, arguments, result );
  return result;

}

// EOF
