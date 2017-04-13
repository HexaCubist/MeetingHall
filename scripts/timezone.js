// This is the file for calculating the score for timezone displacement
// It will interact directly with the current score variable
// 
// 
// Tz=Tz(origin)-Tz(destination)
// Absolute of Tz=Tz(abs)
// If Tz(abs)>12 then Tz(>12)=24- Tz(abs)
// If Tz(abs)<12 then Tz(>12)=Tz(abs)
// If Tz<0 and Tz>-12 or Tz>12 then dir=East
// If Tz>0 and Tz<-12 or Tz<12 then dir=West
// If dir=East then Tz(adjusted)= Tz(>12)*1.1       //this number needs to be decided. 1.1 is a random number I picked//
// If dir=West then Tz(adjusted)= Tz(>12)
// Print:Tz(adjusted) (edited)
function timezone(placescores) {
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


	// First let's loop through each airport
	for (var i = placescores.length - 1; i >= 0; i--) {
		// next let's loop through each person:
		place = placescores[i];
		for (var i = place["Scores"]["flightlength"]["individuals"].length - 1; i >= 0; i--) {
			individual = place["Scores"]["flightlength"]["individuals"][i];
			// individual schema: {
			// 	"status": status,
			// 	"cost": costnum,
			// 	"path": [path],
			// 	"time": timeinsec
			// }
			
			// Starting City Timezone
			startzone = parseInt(individual["path"][0]["Timezone"]);
			
			// Ending City Timezone
			endzone = parseInt(individual["path"][individual["path"].length - 1]["Timezone"]);
		}

	}
	timezone = (timezone - mincost)/(maxcost-mincost);
}