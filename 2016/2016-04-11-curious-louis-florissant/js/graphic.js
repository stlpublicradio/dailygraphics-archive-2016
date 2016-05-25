var pymChild = null;

var colors = {
    'brown': '#6b6256','tan': '#a5a585','ltgreen': '#70a99a','green': '#449970','dkgreen': '#31716e','ltblue': '#55b7d9','blue': '#358fb3','dkblue': '#006c8e','yellow': '#f1bb4f','orange': '#f6883e','tangerine': '#e8604d','red': '#cc203b','pink': '#c72068','maroon': '#8c1b52','purple': '#571751'
};

/*
 * Render the graphic
 */
function render(width) {

		var northEast = L.latLng(38.898912, -90.051062),
		    southWest = L.latLng(38.456959, -90.801426),
		    bounds = L.latLngBounds(southWest, northEast);

		var map = L.map('map', {scrollWheelZoom: false, attribution: ''}).setView([38.754543, -90.256462], 12).setMaxBounds(bounds);

		var tiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/stlpr.hi06d4b5/{z}/{x}/{y}.png', { attribution: "<a href='https://www.mapbox.com/about/maps/' target='_blank'>&copy; Mapbox &copy; OpenStreetMap</a> <a class='mapbox-improve-map' href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a>"})
		    .addTo(map);

	    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
	        g = svg.append("g").attr("class", "leaflet-zoom-hide");

            //add overlay

            imageBounds = L.latLngBounds([
                [38.571546, -90.699452],
                [38.881061, -90.103130]
            ])

            imageUrl = './assets/florissant-roads.jpg'

            var overlay = L.imageOverlay(imageUrl, imageBounds)
           .addTo(map);

           var opacitySlider = new L.Control.opacitySlider();
            map.addControl(opacitySlider);

            opacitySlider.setOpacityLayer(overlay);

            overlay.setOpacity(.8);

            d3.json("florissant_roads.topojson", function(error, geodata) {
				 var regions = topojson.feature(geodata, geodata.objects.florissant_roads);
				 var geojson;




				 //set up styling logic

				 function getColor(d) {


			 		 // example logic to get color based on string
					 return (d == 'New Florissant' ? colors.red :
					  d == 'Old Florissant' ? colors.yellow :
					  colors.blue)

					 }

				 function style(feature) {
                         return {
					         color: getColor(feature.properties.road_name),
					         weight: 4,
                             opacity: .6
					     };
					 }

				 geojson = L.geoJson(regions, {
					 style: style,
				 }).addTo(map);

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
