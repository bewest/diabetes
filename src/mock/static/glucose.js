
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
  initialize: OpenLayers.Layer.MapServer.prototype.initialize,
  //addOptions: OpenLayers.Layer.MapServer.prototype.addOptions,
  //setZindex: OpenLayers.Layer.prototype.setZIndex,
  //moveTo: OpenLayers.Map.prototype.moveTo,
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
  getExtent: function() {
    var extent = null;
    var size = this.map.getSize();
    var tlPx = new OpenLayers.Pixel(0,0);
    var bounds = this.calculateBounds();
    //var tlLL = this
    return bounds;
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
      bottom = center.lon - w_deg / 2;
      left   = center.lat - h_deg / 2;
      top    = center.lon + w_deg / 2;
      right  = center.lat + h_deg / 2;
      extent = new OpenLayers.Bounds(bottom, top, left, right);
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
    // :-( After replacing calculateBounds, restrictedExtent does not work as
    // expected.  The top limit seems to work, but the bottom goes to the edge
    // of the grid, farther than the restricted bottom..
    /*
    var inspector = new InspectMoveTo(this.map.moveTo, this.map);
    this.map.moveTo = inspector.make(this.map);
    var originalMove = this.map.moveTo;
    this.map.moveTo = function (lonlat, zoom, options) {
      var result = originalMove.apply(this, arguments);
      console.log( 'moveTo', arguments, result );
      return result;
    };
    */
  },
  /*
   * Very odd.  Grid's accepts (bounds, origin, res) but we're receiving
   * (bounds, extent, res) instead. ! was looking at v3 source but running v2
   */
  // calculateGridLayout: function(bounds, extent, res) {
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


var InspectMoveTo = OpenLayers.Class({
  context : null,
  original: null,
  initialize: function (original, context) {
    this.original = original;
    this.context  = context;

    var self = this;
    this.run = function () {
      console.log( 'run' );
      //var result = self.original.apply(this, arguments);
      var result = self.originalCopy.apply(this, arguments);
      console.log( arguments, result );
      return result;
    };
    console.log( 'inspector setup done' );
  },
  make: function(context) {
    var ctx = context;
    var run = this.original;
    return (function () {
      console.log( 'run' );
      //var result = self.original.apply(this, arguments);
      var result = run.apply(ctx, arguments);
      console.log( arguments, result );
      return result;
    });
  },
  mapMoveTo: function (lonlat, zoom, options) {
    this.options = options || { };
    if (zoom != null) {
        zoom = parseFloat(zoom);
        if (!this.fractionalZoom) {
            zoom = Math.round(zoom);
        }
    }



  },

  /** ORIGINAL COPY v3xxx?
   * Method: moveTo
   *
   * Parameters:
   * lonlat - {<OpenLayers.LonLat>}
   * zoom - {Integer}
   * options - {Object}
   */
  originalCopy: function(lonlat, zoom, options) {
    if (!options) {
        options = {};
    }
    if (zoom != null) {
        zoom = parseFloat(zoom);
        if (!this.fractionalZoom) {
            zoom = Math.round(zoom);
        }
    }
    // dragging is false by default
    var dragging = options.dragging;
    // forceZoomChange is false by default
    var forceZoomChange = options.forceZoomChange;
    // noEvent is false by default
    var noEvent = options.noEvent;

    if (this.panTween && options.caller == "setCenter") {
        this.panTween.stop();
    }

    if (!this.center && !this.isValidLonLat(lonlat)) {
        lonlat = this.maxExtent.getCenterLonLat();
    }

    // translate applyPolicy
    if(this.restrictedExtent != null) {
        // In 3.0, decide if we want to change interpretation of maxExtent.
        if(lonlat == null) {
            lonlat = this.getCenter();
        }
        if(zoom == null) {
            zoom = this.getZoom();
        }
        var resolution = this.getResolutionForZoom(zoom);
        var extent = this.calculateBounds(lonlat, resolution);
        if(!this.restrictedExtent.containsBounds(extent)) {
            var maxCenter = this.restrictedExtent.getCenterLonLat();
            if(extent.getWidth() > this.restrictedExtent.getWidth()) {
                lonlat = new OpenLayers.LonLat(maxCenter.lon, lonlat.lat);
            } else if(extent.left < this.restrictedExtent.left) {
                lonlat = lonlat.add(this.restrictedExtent.left -
                                    extent.left, 0);
            } else if(extent.right > this.restrictedExtent.right) {
                lonlat = lonlat.add(this.restrictedExtent.right -
                                    extent.right, 0);
            }
            if(extent.getHeight() > this.restrictedExtent.getHeight()) {
                lonlat = new OpenLayers.LonLat(lonlat.lon, maxCenter.lat);
            } else if(extent.bottom < this.restrictedExtent.bottom) {
                lonlat = lonlat.add(0, this.restrictedExtent.bottom -
                                    extent.bottom);
            }
            else if(extent.top > this.restrictedExtent.top) {
                lonlat = lonlat.add(0, this.restrictedExtent.top -
                                    extent.top);
            }
        }
    } // end

    var zoomChanged = forceZoomChange || (
                        (this.isValidZoomLevel(zoom)) &&
                        (zoom != this.getZoom()) );

    var centerChanged = (this.isValidLonLat(lonlat)) &&
                        (!lonlat.equals(this.center));


    // if neither center nor zoom will change, no need to do anything
    if (zoomChanged || centerChanged || !dragging) {

        if (!this.dragging && !noEvent) {
            this.events.triggerEvent("movestart");
        }

        if (centerChanged) {
            if ((!zoomChanged) && (this.center)) {
                // if zoom hasnt changed, just slide layerContainer
                //  (must be done before setting this.center to new value)
                this.centerLayerContainer(lonlat);
            }
            this.center = lonlat.clone();
        }

        // (re)set the layerContainerDiv's location
        if ((zoomChanged) || (this.layerContainerOrigin == null)) {
            this.layerContainerOrigin = this.center.clone();
            this.layerContainerDiv.style.left = "0px";
            this.layerContainerDiv.style.top  = "0px";
        }

        if (zoomChanged) {
            this.zoom = zoom;
            this.resolution = this.getResolutionForZoom(zoom);
            // zoom level has changed, increment viewRequestID.
            this.viewRequestID++;
        }

        var bounds = this.getExtent();

        //send the move call to the baselayer and all the overlays

        if(this.baseLayer.visibility) {
            this.baseLayer.moveTo(bounds, zoomChanged, dragging);
            if(dragging) {
                this.baseLayer.events.triggerEvent("move");
            } else {
                this.baseLayer.events.triggerEvent("moveend",
                    {"zoomChanged": zoomChanged}
                );
            }
        }

        bounds = this.baseLayer.getExtent();

        for (var i=0, len=this.layers.length; i<len; i++) {
            var layer = this.layers[i];
            if (layer !== this.baseLayer && !layer.isBaseLayer) {
                var inRange = layer.calculateInRange();
                if (layer.inRange != inRange) {
                    // the inRange property has changed. If the layer is
                    // no longer in range, we turn it off right away. If
                    // the layer is no longer out of range, the moveTo
                    // call below will turn on the layer.
                    layer.inRange = inRange;
                    if (!inRange) {
                        layer.display(false);
                    }
                    this.events.triggerEvent("changelayer", {
                        layer: layer, property: "visibility"
                    });
                }
                if (inRange && layer.visibility) {
                    layer.moveTo(bounds, zoomChanged, dragging);
                    if(dragging) {
                        layer.events.triggerEvent("move");
                    } else {
                        layer.events.triggerEvent("moveend",
                            {"zoomChanged": zoomChanged}
                        );
                    }
                }
            }
        }

        if (zoomChanged) {
            //redraw popups
            for (var i=0, len=this.popups.length; i<len; i++) {
                this.popups[i].updatePosition();
            }
        }

        this.events.triggerEvent("move");

        if (zoomChanged) { this.events.triggerEvent("zoomend"); }
    }

    // even if nothing was done, we want to notify of this
    if (!dragging && !noEvent) {
        this.events.triggerEvent("moveend");
    }

    // Store the map dragging state for later use
    this.dragging = !!dragging;

  },
  /**
   * Method: moveTo
   *
   * Parameters:
   * lonlat - {<OpenLayers.LonLat>}
   * zoom - {Integer}
   * options - {Object}
   */
  originalCopyV2: function (lonlat, zoom, options) {
    if (!options) {
        options = {};
    }
    if (zoom != null) {
        zoom = parseFloat(zoom);
        if (!this.fractionalZoom) {
            zoom = Math.round(zoom);
        }
    }
    // dragging is false by default
    var dragging = options.dragging || this.dragging;
    // forceZoomChange is false by default
    var forceZoomChange = options.forceZoomChange;

    if (!this.getCachedCenter() && !this.isValidLonLat(lonlat)) {
        lonlat = this.maxExtent.getCenterLonLat();
        this.center = lonlat.clone();
    }

    if(this.restrictedExtent != null) {
        // In 3.0, decide if we want to change interpretation of maxExtent.
        if(lonlat == null) {
            lonlat = this.center;
        }
        if(zoom == null) {
            zoom = this.getZoom();
        }
        var resolution = this.getResolutionForZoom(zoom);
        var extent = this.calculateBounds(lonlat, resolution);
        if(!this.restrictedExtent.containsBounds(extent)) {
            var maxCenter = this.restrictedExtent.getCenterLonLat();
            if(extent.getWidth() > this.restrictedExtent.getWidth()) {
                lonlat = new OpenLayers.LonLat(maxCenter.lon, lonlat.lat);
            } else if(extent.left < this.restrictedExtent.left) {
                lonlat = lonlat.add(this.restrictedExtent.left -
                                    extent.left, 0);
            } else if(extent.right > this.restrictedExtent.right) {
                lonlat = lonlat.add(this.restrictedExtent.right -
                                    extent.right, 0);
            }
            if(extent.getHeight() > this.restrictedExtent.getHeight()) {
                lonlat = new OpenLayers.LonLat(lonlat.lon, maxCenter.lat);
            } else if(extent.bottom < this.restrictedExtent.bottom) {
                lonlat = lonlat.add(0, this.restrictedExtent.bottom -
                                    extent.bottom);
            }
            else if(extent.top > this.restrictedExtent.top) {
                lonlat = lonlat.add(0, this.restrictedExtent.top -
                                    extent.top);
            }
        }
    }

    var zoomChanged = forceZoomChange || (
                        (this.isValidZoomLevel(zoom)) &&
                        (zoom != this.getZoom()) );

    var centerChanged = (this.isValidLonLat(lonlat)) &&
                        (!lonlat.equals(this.center));

    // if neither center nor zoom will change, no need to do anything
    if (zoomChanged || centerChanged || dragging) {
        dragging || this.events.triggerEvent("movestart");

        if (centerChanged) {
            if (!zoomChanged && this.center) {
                // if zoom hasnt changed, just slide layerContainer
                //  (must be done before setting this.center to new value)
                this.centerLayerContainer(lonlat);
            }
            this.center = lonlat.clone();
        }

        var res = zoomChanged ?
            this.getResolutionForZoom(zoom) : this.getResolution();
        // (re)set the layerContainerDiv's location
        if (zoomChanged || this.layerContainerOrigin == null) {
            this.layerContainerOrigin = this.getCachedCenter();
            this.layerContainerDiv.style.left = "0px";
            this.layerContainerDiv.style.top  = "0px";
            var maxExtent = this.getMaxExtent({restricted: true});
            var maxExtentCenter = maxExtent.getCenterLonLat();
            var lonDelta = this.center.lon - maxExtentCenter.lon;
            var latDelta = maxExtentCenter.lat - this.center.lat;
            var extentWidth = Math.round(maxExtent.getWidth() / res);
            var extentHeight = Math.round(maxExtent.getHeight() / res);
            var left = (this.size.w - extentWidth) / 2 - lonDelta / res;
            var top = (this.size.h - extentHeight) / 2 - latDelta / res;
            this.minPx = new OpenLayers.Pixel(left, top);
            this.maxPx = new OpenLayers.Pixel(left + extentWidth, top + extentHeight);
        }

        if (zoomChanged) {
            this.zoom = zoom;
            this.resolution = res;
            // zoom level has changed, increment viewRequestID.
            this.viewRequestID++;
        }

        var bounds = this.getExtent();

        //send the move call to the baselayer and all the overlays

        if(this.baseLayer.visibility) {
            this.baseLayer.moveTo(bounds, zoomChanged, options.dragging);
            options.dragging || this.baseLayer.events.triggerEvent(
                "moveend", {zoomChanged: zoomChanged}
            );
        }

        bounds = this.baseLayer.getExtent();

        for (var i=0, len=this.layers.length; i<len; i++) {
            var layer = this.layers[i];
            if (layer !== this.baseLayer && !layer.isBaseLayer) {
                var inRange = layer.calculateInRange();
                if (layer.inRange != inRange) {
                    // the inRange property has changed. If the layer is
                    // no longer in range, we turn it off right away. If
                    // the layer is no longer out of range, the moveTo
                    // call below will turn on the layer.
                    layer.inRange = inRange;
                    if (!inRange) {
                        layer.display(false);
                    }
                    this.events.triggerEvent("changelayer", {
                        layer: layer, property: "visibility"
                    });
                }
                if (inRange && layer.visibility) {
                    layer.moveTo(bounds, zoomChanged, options.dragging);
                    options.dragging || layer.events.triggerEvent(
                        "moveend", {zoomChanged: zoomChanged}
                    );
                }
            }
        }

        this.events.triggerEvent("move");
        dragging || this.events.triggerEvent("moveend");

        if (zoomChanged) {
            //redraw popups
            for (var i=0, len=this.popups.length; i<len; i++) {
                this.popups[i].updatePosition();
            }
            this.events.triggerEvent("zoomend");
        }
    }
  }

});

