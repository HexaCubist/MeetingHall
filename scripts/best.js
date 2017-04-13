// Best.js
// Here is the heart of the program. This combines all of the algorithms, weights them and makes a points total for each location
// Because of API limits, we'll only consider the top 30 places based on the first algorithm (flightlength)

// Some constants:
// Each priority is a weight to be assigned to factors of that priority. A weight of 2 is worth 2x as much as one with a weight of 1.
var priority1 = 8
var priority2 = 3
var priority3 = 1


function findbest() {
	// First, let's make an (unsorted) variable to store all of our rank scores
	// Schema = [
	// 	{
	// 		"ID": AirportID
	// 		"Total": int_score,
	// 		"Scores": {
	// 			"flightlength": {
	// 				score: totalscore,
	// 				individuals: [array]
	// 			},
	// 			"timezone": {
	// 				score: totalscore,
	// 				individuals: [array]
	// 			},
	// 			"weather": {
	// 				score: totalscore,
	// 			},
	// 			"cost": {
	// 				score: totalscore,
	// 				individuals: [array]
	// 			}
	// 		}
	// 	}
	// ]
	placescores = [];
	// First, let's gather initial aiport data from the flightlength.js scripts, and calculate the score for flight lengths
	flightlengths = flightlength();
	for (var airportID in flightlengths) {
		// Make airport in the placescore variable
		placescores.push({
			"ID": airportID,
			"Total": flightlengths[airportID]["score"] * priority1,
			"Scores": {
				"flightlength": flightlengths[airportID],
				"timezone": {
					score: 0,
					individuals: []
				},
				"weather": {
					score: 0,
				},
				"cost": {
					score: 0,
					individuals: []
				}
			}
		});
	}

	// Next, let's pass that to timezone.js and calculate timezone displacements
	placescores = timezone(placescores, priority1);

	// Now that we have the flightlength and timezone score, let's sort it as an array and take the top 30 for consideration
	// (more not used as we don't want to abuse the API's we will be using later on)
	function compare(a,b) {
		if (a["Total"] < b["Total"])
			return -1;
		if (a["Total"] > b["Total"])
			return 1;
		return 0;
	}
	placescores.sort(compare);
	console.log(placescores)




	// Trim to top 30
	var top30 = placescores.slice(0, 30);
	// Trim to top 10
	var top10 = placescores.slice(0, 30);
	// Get airport lat long from ID for top 50
	for (var i = 0; i < top10.length; i++) {
		var latlong = [];
		latlong[0] = parseFloat(airports[top10[i]["ID"]]["Latitude"]);
		latlong[1] = parseFloat(airports[top10[i]["ID"]]["Longitude"]);
		markpoint(latlong, String(i));
	}
	
	// Heatmapdata - we'll build an array of heatmapdata for a nice heatmap layer
	var heatMapData = [];
	for (var i = 0; i < placescores.length; i++) {
		var latlong = [];
		latlong[0] = parseFloat(airports[placescores[i]["ID"]]["Latitude"]);
		latlong[1] = parseFloat(airports[placescores[i]["ID"]]["Longitude"]);
		// Calculate max value
		// maxvalue = priority1 + priority2 + priority3
		maxvalue = priority1
		heatMapData.push({location: new google.maps.LatLng(latlong[0], latlong[1]), weight: ((placescores[i]["Total"] * -1) + maxvalue)});
	}
	makeHeatMap(heatMapData);


	// Display city ui
	buildui();
}









// COMPONENTS OF FINDBEST ALGORITHM
// Stuff here isn't critical to the main function, and so for readability has been placed here
function buildui() {
	// First, let's make a little ui magic happen, and show the city we detected each marker to be in
	// Make a list of all the markers in HTML
	var markerhtml = "<div class='locations row'>";
	for (var i = 0; i < markerports.length; i++) {
		markerhtml += "<div class='locationinfo card col-sm-3' id='marker" + i + "'><div class='card-block'> <div class='card-title'>Marker </b>" + (i+1) + "</b> </div> <div class='card-text'><b>City: </b>" + markerports[i]["airport"]["City"] + "<br /><br /><b>Airport ID: </b>" + markerports[i]["ID"] + "<br /></div></div></div>";
	}
	markerhtml += "</div>";
	$('#info').html(markerhtml);
	// Now, let's calculate the average of all locations and display it on the map for reference
	average = averageloc(markers);
	markpoint(average, "M");
}