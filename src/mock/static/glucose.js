
if (!Proj4js.defs.PLANE) {
  Proj4js.defs['PLANE'] = "+proj=eqc +lat_ts=1 +lon_0=0 +x_0=0 +y_0=0 +a=0 +b=0 +units=ft +k_0=1";
}
/**
 *
 * getLonLatFromViewPortPx
 * getViewPortPxFromLonLat
 * getZoomForExtent
 * @request Second.js
 * Allows subclasses to independently override the resolution for x or y axis.
 */
var GlucoseDay = OpenLayers.Class(OpenLayers.Layer.MapServer, {
  res_x : null,
  res_y : null,
  getXResolution: function () {
    var res  = null,
    viewSize = this.map.getSize(),
    extent   = this.getExtent();

    if ((viewSize != null) && (extent != null)) {
      res = extent.getWidth() / viewSize.w;
    }
    return res;
  },
  getYResolution: function () {
    var res  = null,
    viewSize = this.map.getSize(),
    extent   = this.getExtent();

    if ((viewSize != null) && (extent != null)) {
      res = extent.getHeight() / viewSize.h;
    }
    return res;
  },
  getGlucoseFromLat: function (lat) {

  },
  getLatFromGlucose: function (glucose) {

  },
  getViewPortPxFromLonLat: function (lonlat) {
    var px    = null, res, extent,
        res_x = this.getXResolution(),
        res_y = this.getYResolution();
    if (lonlat != null) {
      res    = this.map.getResolution();
      res_x  = res_x == null ? res : res_x;
      res_y  = res_y == null ? res : res_y;

      extent = this.map.getExtent();
      px     = new OpenLayers.Pixel(
        (1/res * (lonlat.lon - extent.left)),
        (1/res_y * (extent.top - (lonlat.lat)) ));
    }
    return px;
  },
  getExtent: function() {
    var extent = null;
    var size = this.map.getSize();
    var tlPx = new OpenLayers.Pixel(0,0);
    //var tlLL = this
    return this.getMaxExtent();

  },
  calculateBounds: function(center, resolution, res_y) {
  },
  getLonLatFromViewPortPx: function (viewPortPx) {
    var lonlat = null,
        size, center, res,
        delta_x, delta_y,
        res_x = null,
        res_y = null,
        lon, lat;
    if (viewPortPx != null) {
      size   = this.map.getSize();
      center = this.map.getCenter();
      if (center) {
        res    = this.map.getResolution();
        res_x  = this.getXResolution();
        res_y  = this.getYResolution();
        
        delta_x = viewPortPx.x - (size.w / 2);
        delta_y = viewPortPx.y - (size.h / 2);

        lon = center.lon + delta_x * (res);
        lat = (center.lat - delta_y * (res_y));
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
