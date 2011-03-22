
if (!Proj4js.defs.PLANE) {
  Proj4js.defs['PLANE'] = "+proj=eqc +lat_ts=1 +lon_0=0 +x_0=0 +y_0=0 +a=0 +b=0 +units=ft +k_0=1";
}
/**
 *
 * getLonLatFromViewPortPx
 * getViewPortPxFromLonLat
 * getZoomForExtent
 * @request Second.js
 */
var CartesianLayer = OpenLayers.Class(OpenLayers.Layer.MapServer, {
  getViewPortPxFromLonLat: function (lonlat) {
    var px = null,
        resolution, extent,
        res_x, res_y;
    if (lonlat != null) {
      // TODO: separate resolutions
      resolution = this.map.getResolution();
      extent     = this.map.getExtent();
      px         = new OpenLayers.Pixel(
        (1/resolution * (lonlat.lon - extent.left)),
        (1/resolution * (extent.top - lonlat.lat))
      );
    }
    return px;
  },
  getLonLatFromViewPortPx: function (viewPortPx) {
    var lonlat = null,
        size, center, res,
        delta_x, delta_y,
        scale_x, scale_y, // choose scale vs res?
        res_x, res_y,
        lon, lat;
    if (viewPortPx != null) {
      size   = this.map.getSize();
      center = this.map.getCenter();
      if (center) {
        res = this.map.getResolution();
        
        delta_x = viewPortPx.x - (size.w / 2);
        delta_y = viewPortPx.y - (size.h / 2);

        lon = center.lon + delta_x * (res * 1);
        lat = center.lat - delta_y * (res * 1);
        lonlat  = new OpenLayers.LonLat(lon, lat);

        if (this.wrapDateLine) {
          lonlat = lonlat.wrapDateLine(this.maxExtent);
        }
      }
    }
    return lonlat;
  },
  getZoomForExtent: function (extent, closest) {
    return OpenLayers.Layer.prototype.getZoomForExtent.apply(this, arguments);
  }
});
