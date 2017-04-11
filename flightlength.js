// Our data is stored in the variable airports (from data.js)
// First, let's convert that into a (simplified) format which we can use for graphs.js
// Example simple map: var map = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}},
var connections = {}
for (var airportid in airports) {
	if (!airports.hasOwnProperty(airportid)) {
		//The current property is not a direct property of airports
		continue;
	}
	connections[airportid] = {};
	for (route in airports[airportid]["Routes"]) {
		if (!airports[airportid]["Routes"].hasOwnProperty(route)) {
			//The current property is not a direct property of airports
			continue;
		}
		// Equation for calculating time from distance = (30 min plus 1 hr/500 mi)
		// Taken from Openflights Github page (hidden on line 2327 of openflights.js)
		// However, first we must calculate distance:
		airport1 = airports[airportid];
		airport2 = airports[airports[airportid]["Routes"][route]["Destination airport ID"]];
		if(!airport2) {continue;}
		// console.log(airport2);
		// console.log(airports[airportid]["Routes"][route]["Destination airport ID"]);
		// console.log(airports[airportid]["Routes"][route]);
		pos1 = [parseFloat(airport1["Latitude"]), parseFloat(airport1["Longitude"])];
		pos2 = [parseFloat(airport2["Latitude"]), parseFloat(airport2["Longitude"])];
		distance = calcdist(pos1, pos2);
		// Now that we have the distance, calculate the time:
		time = (30 + 60*(distance/1000/800) + parseFloat(airports[airportid]["Routes"][route]["Stops"]));
		// console.log("time: " + time);
		// console.log("distance: " + distance/1000);
		connections[airportid][airports[airportid]["Routes"][route]["Destination airport ID"]] = time;
	}
}

// Now we have a list of connections between each airport, and the time it takes to travel to each one. Now, we can use the pathfinding algorithm to get the best route to any airport in the world assuming there is a possible path.
graph = new Graph(connections);
// Function to find the nearest airport
function nearestport(lat1, long1) {
	var nearestport;
	var nearestportid;
	var nearestdist = Number.MAX_SAFE_INTEGER; // init with "infinity"
	for (var airportid in airports) {
		airport = airports[airportid];
		if (!(airport["Routes"])) {continue;}
		if (!(airport["Routes"].length > 0)) {continue;}
		lat2 = parseFloat(airport["Latitude"]);
		long2 = parseFloat(airport["Longitude"]);
		distance = calcdist([lat1, long1] , [lat2, long2]);
		if (distance < nearestdist) {
			nearestdist = distance;
			nearestport = airport;
			nearestportid = airportid;
		}
	}
	returnvar = {
		"airport": nearestport,
		"ID": nearestportid,
		"distance": nearestdist
	};
	console.log(returnvar);
	return returnvar;
}
// Function to find the best path between two points
function findpath([startlat, startlong], [endlat, endlong]) {
	startport = nearestport(startlat, startlong);
	endport = nearestport(endlat, endlong);

	shortestpath = graph.findShortestPath(startport["ID"], endport["ID"]);
	airportpaths = [];
	for (var i = 0; i < shortestpath.length; i++) {
		airportpaths.push(airports[shortestpath[i]]);
	}
	return airportpaths;
}

function findbest() {
	distance = calcdist(markers[0], markers[1]);
	bearing = calcbearing(markers[0], markers[1]);
	$('#info').html(
		"<b>Distance:</b> " + distance + 
		"<b>Bearing:</b> " + bearing);
	bestplaces = {}
	for (var i = 0; i < markers.length; i++) {
		marker = markers[id];
		for (airportid in airports) {
			airport = airports[airportid];
			location = [airport["Latitude"], airport["Longitude"]];
			findpath(marker, location);
		}
	}
	airportpaths = findpath(markers[0], markers[1]);
	// routecoords = []
	// console.log(airportpaths)
	// for (var i = 0; i < airportpaths.length; i++) {
	// 	routecoords.push({
	// 		lat: parseFloat(airportpaths[i]["Latitude"]),
	// 		lng: parseFloat(airportpaths[i]["Longitude"])
	// 		})
	// }
	// var flightPath = new google.maps.Polyline({
	// 	path: routecoords,
	// 	geodesic: true,
	// 	strokeColor: '#FF0000',
	// 	strokeOpacity: 1.0,
	// 	strokeWeight: 2
	// });
	// flightPath.setMap(map);
}