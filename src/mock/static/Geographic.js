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

function load() {
  if (GBrowserIsCompatible()) {
    	
	var geographicTileLayer = new GTileLayer(
		new GCopyrightCollection(), 1, 5);
	geographicTileLayer.getTileUrl = function(tile, zoom) {
		return "Tiles/GeographicTile_" + tile.x + "_" + tile.y + "_" + zoom + ".png";
	};
	var geographicMap = new GMapType([geographicTileLayer],
    	new GeographicProjection(), "Geographic",
    	{tileSize:256});

	var map = new GMap2(document.getElementById("map"), {mapTypes:[geographicMap]});
    
    // Add the controls
    map.addControl(new GSmallZoomControl());
    map.setCenter(new GLatLng(0,0), 1);

        
  } else {
    document.getElementById('map').style.backgroundColor = '#DDDDDD';
	document.getElementById('map').innerHTML = 'Sorry, your browser does not appear to be compatible with Google maps.';
  }
}
