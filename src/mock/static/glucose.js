
if (!Proj4js.defs.PLANE) {
  Proj4js.defs['PLANE'] = "+proj=eqc +lat_ts=1 +lon_0=0 +x_0=0 +y_0=0 +a=0 +b=0 +units=ft +k_0=1";
}
/**
 * Hi-jack all resolution calculations to calculate x and y axis
 * independently.
 *
 * getLonLatFromViewPortPx
 * getViewPortPxFromLonLat
 * getZoomForExtent
 * @request Second.js
 * Allows subclasses to independently override the resolution for x or y axis.
 * map calls:
 * moveTo
 *
 * explicitly provided for overriding
 * getExtent
 * getResolution
 * getUnits
 * getScale
 * getZoomForExtent
 * getResolutionForZoom
 * getZoomForResolution
 *
 * Translation
 * getLonLatFromViewPortPx
 * getViewPortPxFromLonLat
 *
 * zoomToScale does some scaling
 *
 * FixedZoomLevels
 * missing:
 * addOptions
 *
 */
//var GlucoseDay = OpenLayers.Class(OpenLayers.Layer.MapServer, {
var GlucoseDay = OpenLayers.Class( OpenLayers.Layer.MapServer,
                                   OpenLayers.Layer.FixedZoomLevels, {
  RESOLUTIONS: [
    24/256,
    400/256
  ],
  res_x : null,
  res_y : null,
  initialize: function(name, url, params, options) {
    var args = [ ];
    args.push(name, url, params, options);
    OpenLayers.Layer.MapServer.prototype.initialize.apply(this, args);
    this.isBaseLayer = true;
    // TODO:
    //   * 
  },
  //addOptions: OpenLayers.Layer.MapServer.prototype.addOptions,
  //setZindex: OpenLayers.Layer.prototype.setZIndex,
  //moveTo: OpenLayers.Map.prototype.moveTo,
  getResolution: function () {
    return this.getXResolution.apply(this, arguments);
  },
  getXResolution: function () {
    return 24/256;
    var res  = null,
    viewSize = this.map.getSize(),
    extent   = this.getExtent();

    if ((viewSize != null) && (extent != null)) {
      res = extent.getWidth() / viewSize.w;
    }
    return res;
  },
  getYResolution: function () {
    return 400/256;
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
        (1/res_x * (lonlat.lon - extent.left)),
        (1/res_y * (extent.top - (lonlat.lat)) ));
    }
    return px;
  },
  // map Extent... entire map's bounds at this resolution.
  getExtent: function() {
    var extent = null;
    var size = this.map.getSize();
    var tlPx = new OpenLayers.Pixel(0,0),
        tlLL = this.getLonLatFromViewPortPx(tlPx);
    var brPx = new OpenLayers.Pixel(size.w, size.h),
        brLL = this.getLonLatFromViewPortPx(brPx);

    if ((tlLL != null) && (brLL != null)) {
      // left, bottom, right, top
      extent = new OpenLayers.Bounds( tlLL.lon, brLL.lat,
                                      brLL.lon, tlLL.lat );
    }

    //extent = this.calculateBounds();
    return extent;
  },
  //
  calculateBounds: function(center, res_x, res_y) {
    var extent = null;
    var res = this.getResolution(),
    size, w_deg, h_deg,
    left, bottom, top, right;

    if (center == null) {
      center = this.map.getCenter();
    }
    res_x = this.getXResolution();
    res_y = this.getYResolution();
    if ((center != null) && (res_x != null && res_y != null)) {
      size   = this.map.getSize();
      w_deg  = size.w * res_x;
      h_deg  = size.h * res_y;
      left   = center.lon - w_deg / 2;
      bottom = center.lat - h_deg / 2;
      right  = center.lon + w_deg / 2;
      top    = center.lat + h_deg / 2;
      extent = new OpenLayers.Bounds(left, bottom, right, top);
    }
    return extent;
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

        lon = center.lon + delta_x * (res_x);
        lat = (center.lat - delta_y * (res_y));
        lonlat  = new OpenLayers.LonLat(lon, lat);

        if (this.wrapDateLine) {
          lonlat = lonlat.wrapDateLine(this.maxExtent);
        }
      }
    }
    return lonlat;
  },
  setMap: function (map) {
    OpenLayers.Layer.prototype.setMap.apply(this, arguments);
    this.map.calculateBounds = function(center, resolution) {
      return this.baseLayer.calculateBounds(center, resolution);
    };
  },
  /*
   */
  // v2: calculateGridLayout: function(bounds, extent, res) {
  // v3:
  calculateGridLayout: function(bounds, origin, res) {
    var res_x = this.getXResolution(),
        res_y = this.getYResolution();

    // v2
    //var origin  = extent.getCenterLonLat();
    var tilelon = res_x * this.tileSize.w,
        tilelat = res_y * this.tileSize.h;

    var offsetlon     = bounds.left - origin.lon,
        tilecol       = Math.floor(offsetlon/tilelon) - this.buffer,
        tilecolremain = offsetlon/tilelon - tilecol,
        tileoffsetx   = -tilecolremain * this.tileSize.w,
        tileoffsetlon = origin.lon + tilecol * tilelon;

    var offsetlat     = bounds.top - (origin.lat + tilelat),
        tilerow       = Math.ceil(offsetlat/tilelat) + this.buffer,
        tilerowremain = tilerow - offsetlat/tilelat,
        tileoffsety   = -tilerowremain * this.tileSize.h,
        tileoffsetlat = origin.lat + tilerow * tilelat;
    var result =  {
      tilelon: tilelon, tilelat: tilelat,
      tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
      tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
    };
    return result;
  },
  getZoomForExtent: function (extent, closest) {
    return OpenLayers.Layer.prototype.getZoomForExtent.apply(this, arguments);
  },
  /*
  getURL: function (newParams, altUrl) {
    var url = OpenLayers.Layer.MapServer.prototype.getURL.apply(this, arguments);
    return url;
  },
  getFullRequestString: function (newParams, altUrl) {
    var url = OpenLayers.Layer.MapServer.prototype.getFullRequestString.apply(this, arguments);
    return url;
  }
  */
});



