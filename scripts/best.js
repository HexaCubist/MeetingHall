// Best.js
// Here is the heart of the program. This combines all of the algorithms, weights them and makes a points total for each location
// Because of API limits, we'll only consider the top 30 places based on the first algorithm (flightlength)

// Some constants:
// Each priority is a weight to be assigned to factors of that priority. A weight of 2 is worth 2x as much as one with a weight of 1.
var priority1 = 8
var priority2 = 3
// var priority3 = 1


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
	var top10 = placescores.slice(0, 10);
	// Get airport lat long from ID for top 50
	for (var i = 0; i < top10.length; i++) {
		var latlong = [];
		latlong[0] = parseFloat(airports[top10[i]["ID"]]["Latitude"]);
		latlong[1] = parseFloat(airports[top10[i]["ID"]]["Longitude"]);
		markpoint(latlong, String(i+1));
	}
	
	// Heatmapdata - we'll build an array of heatmapdata for a nice heatmap layer
	var heatMapData = [];
	for (var i = 0; i < placescores.length; i++) {
		var latlong = [];
		latlong[0] = parseFloat(airports[placescores[i]["ID"]]["Latitude"]);
		latlong[1] = parseFloat(airports[placescores[i]["ID"]]["Longitude"]);
		// Calculate max value
		// maxvalue = priority1 * 2 + priority2 + priority3
		maxvalue = priority1 * 2;
		weight = ((placescores[i]["Total"] * -1) + maxvalue)/maxvalue;
		heatMapData.push({location: new google.maps.LatLng(latlong[0], latlong[1]), weight: weight});
	}
	makeHeatMap(heatMapData);


	// Display ui of best places
	buildui(top10);
}









// COMPONENTS OF FINDBEST ALGORITHM
// Stuff here isn't critical to the main function, and so for readability has been placed here
function buildui(top10) {
	// Make a list of all the best places below in HTML
	var markerhtml = "<div class='locations row'>";
	for (var i = 0; i < top10.length; i++) {
		airport = airports[top10[i]["ID"]];
		console.log(top10[i]["ID"]);
		markerhtml += "<div class='locationinfo card col-sm-3' id='marker" + i + "'><div class='card-block'> <div class='card-title'>Rank </b>" + (i+1) + "</b> </div> <div class='card-text'><b>City: </b>" + airport["City"] + "<br /><br /><b>Country: </b>" + airport["Country"] + "<br />" + 
			// "<div class='progress'> <div class='progress-bar' style='width: " + (top10[i]["Scores"]["flightlength"]["score"]*-1+1)*100 + "%' role='progressbar' aria-valuenow='" + (top10[i]["Scores"]["flightlength"]["score"]*-1+1)*100 + "' aria-valuemin='0' aria-valuemax='100'></div> </div>" +
			// "<div class='progress'> <div class='progress-bar' style='width: " + (top10[i]["Scores"]["timezone"]["score"]*-1+1)*100 + "%' role='progressbar' aria-valuenow='" + (top10[i]["Scores"]["timezone"]["score"]*-1+1)*100 + "' aria-valuemin='0' aria-valuemax='100'></div> </div>" +
 			"<br /></div></div></div>";
	}
	markerhtml += "</div>";
	$('#info').html(markerhtml);
	// Now, let's calculate the average of all locations and display it on the map for reference
	average = averageloc(markers);
	markpoint(average, "M");
}