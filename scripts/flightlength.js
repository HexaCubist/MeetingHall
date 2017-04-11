// Our data is stored in the variable airports (from data.js)

// Helper functions:
// Find the nearest airport
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
	// console.log(returnvar);
	return returnvar;
}


// First, let's calculate flight lengths for each route
for (var airportid in airports) {
	for (route in airports[airportid]["Routes"]) {
		// Equation for calculating time from distance = (30 min plus 1 hr/500 mi)
		// Taken from Openflights Github page (hidden on line 2327 of openflights.js)
		// However, first we must calculate distance:
		airport1 = airports[airportid];
		airport2 = airports[airports[airportid]["Routes"][route]["Destination airport ID"]];
		if(!airport2) {continue;} // Give up if we don't have the destination airport in our database
		pos1 = [parseFloat(airport1["Latitude"]), parseFloat(airport1["Longitude"])];
		pos2 = [parseFloat(airport2["Latitude"]), parseFloat(airport2["Longitude"])];
		distance = calcdist(pos1, pos2);
		// Now that we have the distance, calculate the time:
		time = (30 + 60*(distance/1000/800) + parseFloat(airports[airportid]["Routes"][route]["Stops"]));
		// Store time calculated in route variable
		airports[airportid]["Routes"][route]["Length"] = time;
		airports[airportid]["Routes"][route]["Distance"] = distance;
	}
}

// Let's also build a list of airports where they have 10 or more routes leaving. We can use this later as a list of options for destinations
airhubs = {}
for (var airportid in airports) {
	airport = airports[airportid];
	if(!airport["Routes"]) {continue;}
	// console.log(airport["Routes"].length);
	if(airport["Routes"].length >= 10) {
		airhubs[airportid] = airport;
	}
}

// Now we have a list of connections between each airport, and the time it takes to travel to each one. Now, we can build functions for the pathfinding algorithim to use to find the best location
// Required functions:
// neighbor - function(node) that returns an array of neighbors for a node
// distance - function(a, b) that returns the distance cost between two nodes
// hash (optional) - function(node) that returns a unique string for a node. this is so that we can put nodes in heap and set data structures which are based on plain old JavaScript objects. Defaults to using node.toString.
// timeout (optional) - limit to amount of milliseconds to search before returning null.

// The following are also required but need to be defined at the time of execution
// isEnd - function(node) that returns whether a node is an acceptable end
// heuristic - function(node) that returns a heuristic guess of the cost from node to an end.

// For the hash & node names we'll use Openflight's unique database identifier, as we can be fairly sure there won't be any duplicates (as they're using it for their own database unique id)

// neighbor - function(node) that returns an array of neighbors for a node
function path_neighbor(node) {
	if(!airport["Routes"]) {return [];} //return empty array if we don't have any listed routes
	return Object.keys(airports[node]["Routes"]);
}

// distance - function(a, b) that returns the distance cost between two nodes
function path_distance(a, b) {
	// Get location of start point
	lat1 = parseInt(airports[a]["Latitude"]);
	long1 = parseInt(airports[a]["Longitude"]);
	// Get location of end point
	lat2 = parseInt(airports[b]["Latitude"]);
	long2 = parseInt(airports[b]["Longitude"]);
	// Return the calculated distance
	return calcdist([lat1, long1], [lat2, long2]);
}

// Now we have defined the helper functions, let's build a function to find the best path between two points
// This is not the final step, but it's getting there.
// We can either pass coordinates or airport ids to this
function findpath([startlat, startlong], [endlat, endlong], startport, endport) {
	if(!(startport && endport)) {
		startport = nearestport(startlat, startlong);
		endport = nearestport(endlat, endlong);
	}

	// Now that we have the start and end nodes, we can build out paramter object and pass it to the algorithm
	var params = {
		"start" : startport["ID"],
		"isEnd" : function(node) {
			return node == endport["ID"];
		},
		"neighbor": path_neighbor(),
		"distance": path_distance(),
		"heuristic": function(node) {
			// Get distance from node to end node
			// Get location of node point
			lat1 = parseInt(airports[node]["Latitude"]);
			long1 = parseInt(airports[node]["Longitude"]);
			// Get location of end point
			lat2 = parseInt(endport["Latitude"]);
			long2 = parseInt(endport["Longitude"]);
			// Return the calculated distance
			return calcdist([lat1, long1], [lat2, long2]);
		}
	}
	var path = aStar(params);
	shortestpath = path["path"];
	airportpaths = [];
	for (var i = 0; i < shortestpath.length; i++) {
		airportpaths.push(airports[shortestpath[i]]);
	}
	return {
		"status": path["status"],
		"path": airportpaths,
		"cost": path["cost"]
	};
}


function findbest() {
	// Make a list of marker airports (nearest)
	var markerports = [];
	for (var i = 0; i < markers.length; i++) {
		marker = markers[i];
		markerports.push(nearestport(marker[0], marker[1]));
	}
	// Make a list of all the markers in HTML
	var markerhtml = "<div class='locations row'>";
	for (var i = 0; i < markerports.length; i++) {
		markerhtml += "<div class='locationinfo card col-sm-3' id='marker" + i + "'><div class='card-block'> <div class='card-title'>Marker </b>" + (i+1) + "</b> </div> <div class='card-text'><b>City: </b>" + markerports[i]["airport"]["City"] + "<br /></div></div></div>";
	}
	markerhtml += "</div>";
	$('#info').html(markerhtml);
	// Now, let's calculate the average of all locations
	average = averageloc(markers);
	mapMarkers.push(
		new google.maps.Marker({
			position: {
				lat: average[0],
				lng: average[1]
			},
			label: {
				text: "M",
				color: "white"
			}

		})
	);
	setMarkers();
}