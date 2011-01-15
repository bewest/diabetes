/*
// http://stackoverflow.com/questions/1538681/how-to-call-fromlatlngtodivpixel-in-google-maps-api-v3
*/
function MyOverlay(options) {
    this.setValues(options);

    var div = this.div_= document.createElement('div');

    div.className = "overlay";
};

// MyOverlay is derived from google.maps.OverlayView
MyOverlay.prototype = new google.maps.OverlayView;

MyOverlay.prototype.onAdd = function() {

    var pane = this.getPanes().overlayLayer;
    pane.appendChild(this.div_);

}

MyOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
}

MyOverlay.prototype.draw = function() {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.getMap().getCenter());

    var div = this.div_;
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    div.style.display = 'block';
};


