
  function FloatingOverlay(map, projection, origin, point, opts) {
    this._map     = map;
    this._url     = 'tile.png';
    this._point   = point;
    this._opts    = opts;
    this._div     = null;
    this._projection = projection;
    this._origin  = origin;
    this._llorigin  = projection.fromLatLngToPoint( origin );
    this._location  = null;
    // this.skeleton = skeleton;
    this.setMap( this._map );

  }


  FloatingOverlay.prototype = new google.maps.OverlayView();
  /*
  FloatingOverlay.prototype.getProjection = function getProjection( ) {
    return this._projection;
  };
  */

  FloatingOverlay.prototype.onAdd = function onAdd( ) {
    // Note: an overlay's receipt of onAdd() indicates that
    // the map's panes are now available for attaching
    // the overlay to the map via the DOM.


    // Create the DIV and set some basic attributes.
    var div = document.createElement('DIV');
    div.style.borderStyle = "none";
    div.style.borderWidth = "0px";
    div.style.position = "absolute";

    // Create an IMG element and attach it to the DIV.
    var img = document.createElement("img");
    img.src = this._url;
    img.style.width = "100%";
    img.style.height = "100%";
    div.appendChild(img);

    // Set the overlay's _div property to this DIV
    this._div = div;

    // We add an overlay to a map via one of the map's panes.
    // We'll add this overlay to the overlayImage pane.
    // where does the zoom control go?
    var panes = this.getPanes();
    console.log( 'onAdd', this, arguments, 'panes', panes );
    panes.floatPane.appendChild(div);
  };

  FloatingOverlay.prototype.draw = function() {

    // Size and position the overlay. We use a southwest and northeast
    // position of the overlay to peg it to the correct position and size.
    // We need to retrieve the projection from this overlay to do this.
    var overlayProjection = this.getProjection();

    // Retrieve the southwest and northeast coordinates of this overlay
    // in latlngs and convert them to pixels coordinates.
    // We'll use these coordinates to resize the DIV.
    var xxyy = this._point;
    console.log( 'draw', this, arguments );
    // return;
    var center = this.getMap( ).getCenter( );
    var bounds = this.getMap( ).getBounds( );
    
    var axis = this._projection.fromLatLngToAxis( center );
    // XXX: use this projection to find the boundaries for the new middle.
    // overlayProjection.fromLatLngToDivPixel( 
    
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    var l = bounds.getSouthWest().lng();
    var b = bounds.getSouthWest().lat();
    var t = bounds.getNorthEast().lat();
    var r = bounds.getNorthEast().lng();
    var middle = new google.maps.LatLng( b + ( t - b ) / 2.25,
                                         l + ( r - l ) / 2.25 );
    /*
    var ne = overlayProjection.fromLatLngToDivPixel(
              this._projection.fromAxisToLatLng( new google.maps.Point( -128 , 128 ) )
           );
    */

    var middleXY = overlayProjection.fromLatLngToDivPixel( middle );
    console.log( 'center', center, axis, middleXY );
    /*
    var sw = overlayProjection.fromLatLngToDivPixel(
              this._projection.fromAxisToLatLng( new google.maps.Point( +128 , -128 ) )
           );
    */

    // Resize the image's DIV to fit the indicated dimensions.
    var div = this._div;
    var result = middleXY;
    div.style.left   = result.x.toString( ) + 'px';
    div.style.top    = result.y.toString( ) + 'px';
    div.style.width  = '256px';
    div.style.height = '256px';
    console.log( middle, div );
  }

  FloatingOverlay.prototype.onRemove = function() {
    this._div.parentNode.removeChild(this._div);
    this._div = null;
  }

