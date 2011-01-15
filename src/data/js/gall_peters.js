// Note: this value is exact as the map projects a full 360 degrees of longitude
var GALL_PETERS_RANGE_X = 255;
var NUM_X_TILES = 6;
var NUM_Y_TILES = 6;

// Note: this value is inexact as the map is cut off at ~ +/- 83 degrees.
// However, the polar regions produce very little increase in Y range, so
// we will use the tile size.
var GALL_PETERS_RANGE_Y = 255;

function degreesToRadians(deg) {
  return deg * (Math.PI / 180);
}

function radiansToDegrees(rad) {
  return rad / (Math.PI / 180);
}

function EProj() {
}
 
function GallPetersProjection() {

  // This projection has equidistant meridians, so each longitude degree is a linear
  // mapping.  
  this.worldCoordinatePerLonDegree_ = GALL_PETERS_RANGE_X * NUM_X_TILES / GALL_PETERS_RANGE_X;

  // This constant merely reflects that latitudes vary from +90 to -90 degrees.
  //this.worldCoordinateLatRange = GALL_PETERS_RANGE_Y / 2;
  this.worldCoordinateLatRange = GALL_PETERS_RANGE_Y * NUM_Y_TILES

  // Using the base map tile, denote the lat/lon of the equatorial origin.
  this.worldOrigin_ = new google.maps.Point(this.worldCoordinatePerLonDegree_ / 2),
      this.worldCoordinateLatRange / 2);

};

GallPetersProjection.prototype.fromLatLngToPoint = function(latLng) {

  var origin = this.worldOrigin_;
  var x = origin.x + this.worldCoordinatePerLonDegree_ * latLng.lng();

  // Note that latitude is measured from the world coordinate origin
  // at the top left of the map.
  var latRadians = degreesToRadians(latLng.lat());
  //var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);
  var y = origin.y - this.worldCoordinateLatRange * Math.sin(latRadians);

 
  return new google.maps.Point(x, y);
};

GallPetersProjection.prototype.fromPointToLatLng = function(point) {

  var y = point.y;
  var x = point.x;
  
  if (y < 0) {
    y = 0;
  }
  if (y >= GALL_PETERS_RANGE_Y) {
    y = GALL_PETERS_RANGE_Y;
  }
 
  var origin = this.worldOrigin_;
  var lng = (x - origin.x) / this.worldCoordinatePerLonDegree_;
  var latRadians = Math.asin((origin.y - y) / this.worldCoordinateLatRange);
  var lat = radiansToDegrees(latRadians);
  return new google.maps.LatLng(lat, lng);
};
  
function initialize() {

  var gallPetersMap;

  var gallPetersMapType = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
      var numTiles = 1 << zoom;

      // Don't wrap tiles vertically.
      if (coord.y < 0 || coord.y >= numTiles) {
        return null;
      }

      // Wrap tiles horizontally.
      var x = ((coord.x % numTiles) + numTiles) % numTiles;  

      // For simplicity, we use a tileset consisting of 1 tile at zoom level 0
      // and 4 tiles at zoom level 1.
      var baseURL = 'images/';
      baseURL += 'gall-peters_' + zoom + '_' + x + '_' + coord.y + '.png';
      return baseURL;
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true,
    minZoom: 0,
    maxZoom: 1,
    name: 'Gall-Peters'
  });
  
  gallPetersMapType.projection = new GallPetersProjection();  
  
  var mapOptions = {
    zoom: 0,
    center: new google.maps.LatLng(0,0)
  };
  gallPetersMap = new google.maps.Map(document.getElementById("gallPetersMap"),
      mapOptions);

  gallPetersMap.mapTypes.set('gallPetersMap', gallPetersMapType);
  gallPetersMap.setMapTypeId('gallPetersMap');
  gallPetersMap.overlayMapTypes.insertAt(0, gallPetersMapType);

}b

