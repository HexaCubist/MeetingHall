var nummarkers = 0; // Number of markers on the map
var markers = []; // Array of latitudes and longitudes of the markers
var mapMarkers = []; // Array of markers on the map

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 1,
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
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}
	    places.forEach(function(place) {
			placeMarker(place.geometry.location, event);
	    });
	});


	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng, event);
	});


	window.setMarkers = function() {
		for (var i = 0; i < mapMarkers.length; i++) {
			mapMarkers[i].setMap(map); //Add the marker to the map
		}
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
		setMarkers();
		markers.push([location.lat(), location.lng()])

		// console.log(markers);
		// console.log(nummarkers);
	}


}