var nummarkers = 0; // Number of markers on the map
var markers = []; // Array of latitudes and longitudes of the markers
var mapMarkers = []; // Array of markers on the map

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 1,
		center: {lat: 0, lng: 0},
		mapTypeId: google.maps.MapTypeId.ROADMAP
	});

	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng, event);
	});


	function setMarkers() {
		for (var i = 0; i < mapMarkers.length; i++) {
			mapMarkers[i].setMap(map); //Add the marker to the map
		}
	}
	function clearMarkers() {
		for (var i = 0; i < mapMarkers.length; i++) {
			mapMarkers[i].setMap(null); //Remove the marker from the map
		}
		mapMarkers = []; // Delete all markers
	}


	function placeMarker(location, event) {
		nummarkers = nummarkers + 1;
		
		if(nummarkers > 2) {
			clearMarkers();
			markers = []
			nummarkers = 0;
		} else {
			mapMarkers.push(
				new google.maps.Marker({
					position: location
				})
			);
			setMarkers();
			markers.push([location.lat(), location.lng()])

			console.log(markers);
			console.log(nummarkers);
		}
	}


}