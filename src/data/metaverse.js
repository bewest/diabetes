// clone of Linden Lab stuff?
// http://code.google.com/p/openmetaverse/source/browse/trunk/Simian/GridFrontend/map.php?r=425
// The relative or absolute URL of your SimianGrid map tile folder
var TILE_HOST = "/Grid/map/";

// The maximum width/height of the grid in regions (must be a power of two)
var GRID_WIDTH_IN_REGIONS = 7;
// Map from a GRID_WIDTH_IN_REGIONS x GRID_WIDTH_IN_REGIONS square to Lat/Long (0, 0),(-90, 90) 
var SCALE_FACTOR = 90.0 / GRID_WIDTH_IN_REGIONS;

euclidTileUrl = function(coord, zoom) {
  // var gridZoom = 8 - zoom;
  var gridZoom = zoom;
  //var regions_per_tile_edge = Math.pow(2, gridZoom - 1);
  var regions_per_tile_edge = Math.pow(2, gridZoom );
      
  // Convert from tile coordinates to world coordinates
  var x = coord.x * regions_per_tile_edge;
  var y = coord.y * regions_per_tile_edge;
  
  // Flip the y axis
  y = -y;
      
  // Orient the y axis from the bottom-left corner instead of the top-left
  y -= regions_per_tile_edge;
  
  // Adjust x/y to the lower-left tile for this zoom level
  x -= x % regions_per_tile_edge;
  y -= y % regions_per_tile_edge;  
  
  return "t-" + x + "-" + y + ".png#" + gridZoom;
};

// Override the default Mercator projection with Euclidean projection
// (insert oblig. Flatland reference here)
function EuclideanProjection() {
};

EuclideanProjection.prototype.fromLatLngToPoint = function(latLng, opt_point) {
        var point = opt_point || new google.maps.Point(0, 0);
        
    point.x = latLng.lng() / SCALE_FACTOR;
    point.y = latLng.lat() / SCALE_FACTOR;
    
        return point;
};

EuclideanProjection.prototype.fromPointToLatLng = function(point) {
    var lng = point.x * SCALE_FACTOR;
    var lat = point.y * SCALE_FACTOR;
    
        return new google.maps.LatLng(lat, lng, true);
};


