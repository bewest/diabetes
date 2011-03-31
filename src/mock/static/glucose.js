
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
//var GlucoseDay = OpenLayers.Class(OpenLayers.Layer.MapServer, { }
/*
var GlucoseDay = OpenLayers.Class( OpenLayers.Layer.MapServer,
                                   OpenLayers.Layer.FixedZoomLevels, { });
*/
var CartesianLayer = OpenLayers.Class( OpenLayers.Layer.FixedZoomLevels, {
  // TODO: figure out zoom levels?
  // pure conjecture: these could be separate layers or separate zoom levels.
  // zoom 0: minutes 1 tile = 90 minutes
  // zoom 1: hours 1 tile = 6 hours
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
    var x = this.getXResolution.apply(this, arguments),
        y = this.getYResolution.apply(this, arguments);
    var res = [ x, y ];
    // most function only compute against one axis.
    return x;
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
    var self = this;
    this.map.getXResolution = function () {
      return self.getXResolution.apply(self, arguments);
    }
    this.map.getYResolution = function () {
      return self.getYResolution.apply(self, arguments);
    }
  },
  /*
   */
  // v2: calculateGridLayout: function(bounds, extent, res) { }
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

// Monkey patch Renderer

OpenLayers.Util.extend(OpenLayers.Renderer.prototype, {
  drawFeature: function(feature, style) {
    var bounds = feature.geometry ? feature.geometry.getBounds() : null,
        rendered = null,
        location,
        xOffset, yOffset,
        res,
        res_x, res_y;
    console.log( 'draw Feature' );
    if (style == null) {
      style = feature.style;
    }
    if (bounds) {
      if (!bounds.intersectsBounds(this.extent)) {
        style = {display: 'none'};
      }
      rendered = this.drawGeometry(feature.geometry, style, feature.id);
      if (style.display != 'none' && style.label && rendered !== false) {
        location = feature.geometry.getCentroid();
        if (style.labelXOffset || style.labelYOffset) {
          xOffset = isNaN(style.labelXOffset) ? 0 : style.labelXOffset;
          yOffset = isNaN(style.labelYOffset) ? 0 : style.labelYOffset;
          res = this.getResolution();
          res_x = this.map.getXResolution();
          res_y = this.map.getYResolution();
          location.move(xOffset * res_x, yOffset * res_y);
        }
        this.drawText(feature.id, style, location);
        console.log( 'drew text');
      } else {
        this.removeText(feature.id);
      }
      return rendered;
    }
  }

});

// SVG

OpenLayers.Util.extend(OpenLayers.Renderer.SVG.prototype, {
  setExtent: function(extent, resolutionChanged) {
    OpenLayers.Renderer.Elements.prototype.setExtent.apply(this, arguments);

    var resolution = this.getResolution(),
        res_x = this.map.getXResolution(),
        res_y = this.map.getYResolution(),
        left  = -extent.left / res_x,
        top   = extent.top / res_y,
        extentString, inRange;

    if (resolutionChanged) {
      this.left = left;
      this.top = top;
      extentString = "0 0 " + this.size.w + " " + this.size.h;
      this.rendererRoot.setAttributeNS(null, 'viewBox', extentString);
      this.translate(0, 0);
      return true;
    } else {
      inRange = this.translate(left - this.left, top - this.top);
      if (!inRange) {
        this.setExtent(extent, true);
      }
      return inRange;
    }
  },
  drawCircle: function(node, geometry, radius) {
    var resolution = this.getResolution(),
        res_x = this.map.getXResolution(),
        res_y = this.map.getYResolution(),
        x     = (geometry.x / res_x + this.left),
        y     = (this.top - geometry.y / res_y);

    if (this.inValidRange(x, y)) {
      node.setAttributeNS(null, "cx", x);
      node.setAttributeNS(null, "cy", y);
      node.setAttributeNS(null, "r", radius);
      return node;
    } else {
      return false;
    }
  },
  drawRectangle: function(node, geometry) {
    var resolution = this.getResolution(),
        res_x  = this.map.getXResolution(),
        res_y  = this.map.getYResolution(),
        width  = geometry.width  / res_x,
        height = geometry.height / res_y,
        x      = (geometry.x / res_x + this.left),
        y      = (this.top - geometry.y / res_y);

    if (this.inValidRange(x, y)) {
      node.setAttributeNS(null, "x", x);
      node.setAttributeNS(null, "y", y);
      node.setAttributeNS(null, "width", width);
      node.setAttributeNS(null, "height", height);
      return node;
    } else {
      return false;
    }
  },
  drawText: function(featureId, style, location) {
    var resolution = this.getResolution(),
        res_x = this.map.getXResolution(),
        res_y = this.map.getYResolution(),
        x     = (location.x / res_x + this.left),
        y     = (location.y / res_y - this.top),
        label = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX, "text"),
        tspan = this.nodeFactory(featureId + this.LABEL_ID_SUFFIX, "_tspan", "text"),
        align;
        ;

    label.setAttributeNS(null, "x",  x);
    label.setAttributeNS(null, "y", -y);

    if (style.fontColor) {
      label.setAttributeNS(null, "fill", style.fontColor);
    }
    if (style.fontOpacity) {
      label.setAttributeNS(null, "opacity", style.fontOpacity);
    }
    if (style.fontFamily) {
      label.setAttributeNS(null, "font-family", style.fontFamily);
    }
    if (style.fontSize) {
      label.setAttributeNS(null, "font-size", style.fontSize);
    }
    if (style.fontWeight) {
      label.setAttributeNS(null, "font-weight", style.fontWeight);
    }
    if (style.labelSelect === true) {
      label.setAttributeNS(null, "pointer-events", "visible");
      label._featureId = featureId;
      tspan._featureId = featureId;
      tspan._geometry  = location;
      tspan._geometryClass = location.CLASS_NAME;
    } else {
      label.setAttributeNS(null, "pointer-events", "none");
    }

    align = style.labelAlign || "cm";
    label.setAttributeNS(null, "text-anchor",
        OpenLayers.Renderer.SVG.LABEL_ALIGN[align[0]] || "middle");
    if (OpenLayers.IS_GECKO === true) {
      label.setAttributeNS(null, "dominant-baseline",
          OpenLayers.Renderer.SVG.LABEL_ALIGN[align[1]] || "central");

    } else {
      tspan.setAttributeNS(null, "baseline-shift",
          OpenLayers.Renderer.SVG.LABEL_ALIGN[align[1]] || "-35%");
    }

    tspan.textContent = style.label;
    
    if (!label.parentNode) {
      label.appendChild(tspan);
      this.textRoot.appendChild(label);
      console.log('added', label, this.textRoot);
    }
  
  },

  clipLine: function(badComponent, goodComponent) {
    if (goodComponent.equals(badComponent)) {
      return "";
    }
    var resolution = this.getResolution(),
        res_x = this.map.getXResolution(),
        res_y = this.map.getYResolution(),
        maxX  = this.MAX_PIXEL - this.translationParameters.x,
        maxY  = this.MAX_PIXEL - this.translationParameters.y,
        x1    = goodComponent.x / res_x + this.left,
        y1    = this.top - goodComponent.y / res_y,
        x2    = badComponent.x / res_x + this.left,
        y2    = this.top - badComponent.y / res_y,
        k;
    if (x2 < -maxX || x2 > maxX) {
      k = (y2 - y1) / (x2 - x1);
      x2 = x2 < 0 ? -maxX : maxX;
      y2 = y1 + (x2 - x1) * k;
    }
    if (y2 < -maxY || y2 > maxY) {
      k = (x2 - x1) / (y2 - y1);
      y2 = y2 < 0 ? -maxY : maxY;
      x2 = x1 + (y2 - y1) * k;
    }
    return x2 + "," + y2;
  },
  getShortString: function(point) {
    var resolution = this.getResolution(),
        res_x  = this.map.getXResolution(),
        res_y  = this.map.getYResolution(),
        x      = (location.x / res_x + this.left),
        y      = (location.y / res_y - this.top);
    if (this.inValidRange(x, y)) {
      return x + "," + y;
    } else {
      return false;
    }
    
  }

});

var GlucoseDay = OpenLayers.Class(OpenLayers.Layer.MapServer, CartesianLayer, {
});

//////
// EOF
