var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.978912, -89.751062),
		    southWest = L.latLng(38.256959, -90.791426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.673945, -90.273416], 10).setMaxBounds(bounds);


		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

			// update filename, collection name

			 d3.json("malls.topojson", function(error, geodata) {
				 var regions = topojson.feature(geodata, geodata.objects.collection);
				 var geojson;


				 //set up styling logic

				 function getColor(d) {

			 //example logic to get color based on number
			 return (d == 'open' ? colors.green :
					d == 'closed' ? colors.red :
					colors.yellow)

					 }

				 function style(feature) {
						 return {
							 // update property
					         fillColor: getColor(feature.properties.status),
					         weight: 1,
					         opacity: 1,
					         color: colors.yellow,
					         dashArray: '3',
					         fillOpacity: 0.7
					     };
					 }

				 //set up highlighting function

				 function highlightFeature(e) {
				     var layer = e.target;

					 info.update(layer.feature.properties);

				 }

				 function resetHighlight(e) {
					 info.update();
				 }

                 function clickHighlight(e) {
                     highlightFeature(e)
                 }

				 function onEachFeature(feature, layer) {
				     layer.on({
                         mouseover: highlightFeature,
                         mouseout: resetHighlight,
                         click: clickHighlight
				     });
				 }

                 var setDivIcon = function(feature) {
                     return {
                         className: "div-icon " + feature.properties.status,
                         iconSize: 20
                     }
                 }

				 geojson = L.geoJson(regions, {
                     pointToLayer: function(feature, latlng) {
                         return L.marker(latlng, { icon: L.divIcon(setDivIcon(feature))})
                     },
				// 	//  style: style,
					 onEachFeature: onEachFeature
				 }).addTo(map);

				 // add infobox

				 var info = L.control();

				 info.onAdd = function (map) {
				     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
				     this.update();
				     return this._div;
				 };

				 // method that we will use to update the control based on feature properties passed
				 info.update = function (props) {
				     this._div.innerHTML = '<h4>Local Malls</h4>' + ( props ? '<span class="mall">' + props.name + '</span><br/>' + props.address + '<br/>Status: <span class=status-' + props.status + '>' + props.status + '</span>' : 'Hover over a mall')

					 // example ternary logic for infobox
					 // +  (
// 						 props ?
// 						 props.STATUS == 'new' ?
// 						 "<strong>" + props.MUNICIPALI + '</strong> was added to the suit.'
// 						 : props.STATUS == 'old' ?
// 						 "<strong>" + props.MUNICIPALI + '</strong> is another municipality named in the suit.'
// 						 : "<strong>" + props.MUNICIPALI + '</strong> has been dropped from the suit.'
// 						 : 'Hover over a county');
				 };

				 info.addTo(map);

				 // add legend

				 var legend = L.control({position: 'bottomright'});

				 legend.onAdd = function (map) {

				     var div = L.DomUtil.create('div', 'info legend')

					 // Legend with strings
					 div.innerHTML = '<i style="background:' + colors.red + '"></i> Closed<br /><i style="background:' + colors.green + '"></i> Open<br /><i style="background:' + colors.yellow + '"></i> Outlet malls<br />';

				     return div;
				 };

				 legend.addTo(map);

		     })

    if (pymChild) {
        pymChild.sendHeight();
    }
}

/*
 * NB: Use window.load instead of document.ready
 * to ensure all images have loaded
 */
$(window).load(function() {
    pymChild = new pym.Child({
        renderCallback: render
    });
})
