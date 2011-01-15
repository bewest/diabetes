
var map21 = null;
var raphael_overlay = null;
(function($) {

$(document).ready( function( ) {

  map21 = new google.maps.Map(document.getElementById("map21"), {
    zoom : 0,
    center : new google.maps.LatLng(0,0),
    mapTypeId : google.maps.MapTypeId.SATELLITE
  });
  
  
  raphael_overlay = new RaphaelOverlay({
    map : map21,
    shapes : [{
      type : "barchart",
      position : new google.maps.LatLng(85, -175),
      size : new google.maps.Size(255, 255),
      info : {
        data : [
          [55, 20, 13, 32, 5, 1, 2, 10], 
          [10, 2, 1, 5, 32, 13, 20, 55], 
          [12, 20, 30]
        ],
        param : {
          stacked: true
        }
      }
    }]
  });
} );
  
})( jQuery );


//////
// EOF
