var nummarkers = 0; // Number of markers on the map
var markers = []; // Array of latitudes and longitudes of the markers
var mapMarkers = []; // Array of markers on the map
var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 2,
		center: {lat: 0, lng: 0},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	// Let's make our search box to make things easier
	// Create the search box and link it to the UI element.
	var input = document.getElementById('search-input');
	var searchBox = new google.maps.places.SearchBox(input);
	// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Listen for the event fired when the user selects a prediction and retrieve
	// more details for that place.
	searchBox.addListener('places_changed', function(event) {
		var place = searchBox.getPlaces()[0];

		if (!place.geometry) return;

		placeMarker(place.geometry.location, event);

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
		}

		// Clear input box
		$('#search-input').val('');
	});


	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng, event);
	});


	window.setMarkers = function() {
		for (var i = 0; i < mapMarkers.length; i++) {
			mapMarkers[i].setMap(map); //Add the marker to the map
		}
		// Let's add the markers from here to our side menu
		html = "";
		for (var i = 0; i < markers.length; i++) {
			// console.log(markers[i]);
			lat = markers[i][0];
			long = markers[i][1];
			airport = nearestport(lat,long);
			city = airport["airport"]["City"];
			// String
			html += "<div class='marker'> <h3>Marker " + (i+1) + "</h3> <p><strong>City:</strong> " + city + "</p><button class='btn btn-danger' onclick='deleteMarker(" + i + ")'>Delete</button> </div>"
		}
		$('#markerlist').html(html);
	}

	window.deleteMarker = function(markerid) {
		mapMarkers[markerid].setMap(null);
		mapMarkers.splice(markerid, 1);
		markers.splice(markerid, 1);
		setMarkers();
	}

	window.clearMarkers = function() {
		for (var i = 0; i < mapMarkers.length; i++) {
			mapMarkers[i].setMap(null); //Remove the marker from the map
		}
		mapMarkers = []; // Delete all markers
		markers = []; // Delete all marker coords
	}


	window.placeMarker = function(location, event) {
		nummarkers = nummarkers + 1;
		mapMarkers.push(
			new google.maps.Marker({
				position: location
			})
		);
		markers.push([location.lat(), location.lng()])
		setMarkers();

		// console.log(markers);
		// console.log(nummarkers);
	}

	window.makeHeatMap = function(data) {
		var heatmap = new google.maps.visualization.HeatmapLayer({
			data: data,
			dissipating: false,
			maxIntensity: 4,
			radius: 5,
			opacity: 0.35,
		});
		heatmap.setMap(map);
	}


}