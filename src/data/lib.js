

/*
// clone of Linden Lab stuff?
// http://code.google.com/p/openmetaverse/source/browse/trunk/Simian/GridFrontend/map.php?r=425
// The relative or absolute URL of your SimianGrid map tile folder
var TILE_HOST = "/Grid/map/";

// The maximum width/height of the grid in regions (must be a power of two)
var GRID_WIDTH_IN_REGIONS = 1;
// Map from a GRID_WIDTH_IN_REGIONS x GRID_WIDTH_IN_REGIONS square to Lat/Long (0, 0),(-90, 90) 
var SCALE_FACTOR = 90.0 / GRID_WIDTH_IN_REGIONS;

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
*/

// Configure options for the map
/*
var imageMapOptions = {
        getTileUrl: function(coord, zoom) {
                var gridZoom = 8 - zoom;
            var regions_per_tile_edge = Math.pow(2, gridZoom - 1);
                
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
            
            return TILE_HOST + "map-" + gridZoom + "-" + x + "-" + y + "-objects.png";
        },
        tileSize: new google.maps.Size(256, 256),
        minZoom: 0,
        maxZoom: 7,
        isPng: true
};
*/


// http://facstaff.unca.edu/mcmcclur/GoogleMaps/Projections/Geographic.html
// this is v2??
/*
function GeographicProjection() {};
GeographicProjection.prototype = new GProjection();
GeographicProjection.prototype.fromPixelToLatLng = function(pixel, zoom) {
  return new GLatLng(
    90 - 45*pixel.y/Math.pow(2,zoom + 5),
    (45*pixel.x/Math.pow(2,zoom + 5)) - 180);
};
GeographicProjection.prototype.fromLatLngToPixel = function(latLng, zoom) {
  return new GPoint(
    Math.floor((latLng.lng() + 180)*Math.pow(2, zoom+5)/45),
    Math.floor((90 - latLng.lat())*Math.pow(2, zoom+5)/45));
};
GeographicProjection.prototype.tileCheckRange = function(tileIndex, zoom, bs) {
  if(0 <= tileIndex.x && tileIndex.x < Math.pow(2,zoom) &&
     0 <= tileIndex.y && tileIndex.y < Math.pow(2,zoom-1)) {
       return true;}
  else { return false; };
};
GeographicProjection.prototype.getWrapWidth = function(zoom) {
  return Math.pow(2,zoom+8);
};

*/

// http://stackoverflow.com/questions/2915944/replacing-gtilelayer-in-google-maps-v3-with-imagemaptype-tile-bounding-box
/*
var StackOverFlowSimpleMapType = new google.maps.ImageMapType({
  getTileUrl: function(coord,zoom) { 
    var proj = map.getProjection();
    var zfactor=Math.pow(2,zoom);
    var top=proj.fromPointToLatLng(new google.maps.Point(coord.x*256/zfactor,coord.y*256/zfactor));
    var bot=proj.fromPointToLatLng(new google.maps.Point((coord.x+1)*256/zfactor,(coord.y+1)*256/zfactor));
    url = "/layer/layer_"+zoom+"_"+top.lng().toFixed(6)+"_"+bot.lat().toFixed(6)+"_"+bot.lng().toFixed(6)+"_"+top.lat().toFixed(6)+".png";
return url; 
},
tileSize: new google.maps.Size(256, 256),
isPng: true,
});

*/
