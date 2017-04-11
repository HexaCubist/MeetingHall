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

			if(nummarkers == 2) {
				distance = calcdist(markers[0], markers[1]);
				bearing = calcbearing(markers[0], markers[1]);
				$('#info').html(
					"<b>Distance:</b> " + distance + 
					"<b>Bearing:</b> " + bearing);
				airportpaths = findpath(markers[0], markers[1]);
				routecoords = []
				console.log(airportpaths)
				for (var i = 0; i < airportpaths.length; i++) {
					routecoords.push({
						lat: parseFloat(airportpaths[i]["Latitude"]),
						lng: parseFloat(airportpaths[i]["Longitude"])
						})
				}
				var flightPath = new google.maps.Polyline({
					path: routecoords,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
				});
				flightPath.setMap(map);
			}
		}
	}


}