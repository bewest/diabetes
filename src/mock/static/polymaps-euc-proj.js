function GeographicProjection() {};
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

//////
// EOF
