function initialize() {
	
    /**
     * autor : CTAPbIu_MABP
     * email : ctapbiumabp@gmail.com
     * url : http://mabp.kiev.ua/2010/10/29/graphael-overlay/
     */
	
	// example 1
	var map1 = new google.maps.Map(document.getElementById("map1"), {
		zoom : 0,
		center : new google.maps.LatLng(0,0),
		mapTypeId : google.maps.MapTypeId.SATELLITE
	});

	new RaphaelOverlay({
		map : map1,
		shapes : [{
			type : "piechart",
			position : new google.maps.LatLng(0, 0),
			radius : 150,
			info : {
				data : [55, 20, 13, 32, 5, 1, 2]
			}
		}]
	});
	
	
	// example 2.1
	var map21 = new google.maps.Map(document.getElementById("map21"), {
		zoom : 0,
		center : new google.maps.LatLng(0,0),
		mapTypeId : google.maps.MapTypeId.SATELLITE
	});
	
	
	new RaphaelOverlay({
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
	
	// example 2.2
	var map22 = new google.maps.Map(document.getElementById("map22"), {
		zoom : 0,
		center : new google.maps.LatLng(0,0),
		mapTypeId : google.maps.MapTypeId.SATELLITE
	});
	
	
	new RaphaelOverlay({
		map : map22,
		shapes : [{
			type : "hbarchart",
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
	
	// example 3
	var map3 = new google.maps.Map(document.getElementById("map3"), {
		zoom : 0,
		center : new google.maps.LatLng(0,0),
		mapTypeId : google.maps.MapTypeId.SATELLITE
	});	
	
	var x = [], y1 = [], y2 = [], y3 = [];
	for (var i = 0; i < 1e3; i++) {
		x[i] = i * 10;
		y1[i] = (y1[i - 1] || 0)   + (Math.random() * 7) - 3;
		y2[i] = (y2[i - 1] || 150) + (Math.random() * 7) - 3.5;
		y3[i] = (y3[i - 1] || 300) + (Math.random() * 7) - 4;
	}
	
	new RaphaelOverlay({
		map : map3,
		shapes : [{
			type : "linechart",
			position : new google.maps.LatLng(85, -175),
			size : new google.maps.Size(255, 255),
			info : {
				x : x,
				y : [y1, y2, y3],
				param : {
					nostroke: true,
					shade: true
				}
			}
		}]
	});
	
	// example 4
	var map4 = new google.maps.Map(document.getElementById("map4"), {
		zoom : 0,
		center : new google.maps.LatLng(0,0),
		mapTypeId : google.maps.MapTypeId.SATELLITE
	});	
	
	var xs = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9,  
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9 
		],
		ys = [
			7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 
			6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 
			5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 
			4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 
			3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 
			2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 
			1, 1, 1, 1, 1, 1, 1, 1, 1, 1 
		],
		data = [
			294, 300, 204, 255, 348, 383, 334, 217, 114,  33, 
			 44,  26,  41,  39, 52,   17,  13,   2,   0,   2, 
			  5,   6,  64, 153, 294, 313, 195, 280, 365, 392,
			340, 184,  87,  35,  43,  55,  53,  79,  49,  19,
			  6,   1,   0,   1,   1,  10,  50, 181, 246, 246,
			220, 249, 355, 373, 332, 233,  85,  54,  28,  33,
			 45,  72,  54,  28,   5,   5,   0,   1,   2,   3
		],
		axisy = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		axisx = ["0", "1", "2", "3", "4",  "5", "6",  "7",  "8",  "9"];
	
	new RaphaelOverlay({
		map : map4,
		shapes : [{
			type : "dotchart",
			position : new google.maps.LatLng(85, -175),
			size : new google.maps.Size(255, 255),
			info : {
				xs : xs,
				ys : ys,
				data : data,
				param : { 
					symbol: "o", 
					max: 10, 
					heat: true, 
					axis: "0 0 1 1", 
					axisxstep: 23, 
					axisystep: 6, 
					axisxlabels: axisx, 
					axisxtype: " ", 
					axisytype: " ", 
					axisylabels: axisy
				}
			}
		}]
	});


}

google.maps.event.addDomListener(window, 'load', initialize);

