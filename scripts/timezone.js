// This is the file for calculating the score for timezone displacement
// It will interact directly with the current score variable
// 
// 
function timezone(placescores, weighting) {
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


	// First let's loop through each airport & keep some stats
	max = 0;
	min = Number.MAX_SAFE_INTEGER;
	for (var i = placescores.length - 1; i >= 0; i--) {
		// next let's loop through each person and keep a total:
		totaldisplacement = 0;
		for (var x = placescores[i]["Scores"]["flightlength"]["individuals"].length - 1; x >= 0; x--) {
			individual = placescores[i]["Scores"]["flightlength"]["individuals"][x];
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

			// Tz=Tz(origin)-Tz(destination)
			// Absolute of Tz=Tz(abs)
			// If Tz(abs)>12 then Tz(>12)=24- Tz(abs)
			// If Tz(abs)<12 then Tz(>12)=Tz(abs)
			// If Tz<0 and Tz>-12 or Tz>12 then dir=East
			// If Tz>0 and Tz<-12 or Tz<12 then dir=West
			// If dir=East then Tz(adjusted)= Tz(>12)*1.1       //this number needs to be decided. 1.1 is a random number I picked//
			// If dir=West then Tz(adjusted)= Tz(>12)
			// Print:Tz(adjusted) (edited)
			
			// Change in timezone
			changezone = startzone - endzone;
			if(changezone > 12) {
				tz12 = 24-Math.abs(changezone);
			} else {
				tz12 = changezone;
			}
			if((changezone < 0 && changezone > -12) | (changezone > 12)) {
				dir = "e";
			} else {
				dir = "w";
			}
			if(dir =="w") {
				tza = tz12 * 0.9;
			} else {
				tza = tz12;
			}
			// Make the displacement absolute
			tza = Math.abs(tza);
			tza = Math.pow(tza, 2);

			// Update min and max
			if(tza > min) {min = tza;}
			if(tza < max) {max = tza;}


			// Change in timezone = tza
			placescores[i]["Scores"]["timezone"]["individuals"][x] = tza;
			totaldisplacement += tza;
		}
		placescores[i]["Scores"]["timezone"]["score"] = totaldisplacement;
	}

	// Now let's standardize the data on the scale 0-1
	for (var i = placescores.length - 1; i >= 0; i--) {
		total = 0;
		for (var x = placescores[i]["Scores"]["timezone"]["individuals"]	.length - 1; x >= 0; x--) {
			total += placescores[i]["Scores"]["timezone"]["individuals"][x];
		}
		placescores[i]["Scores"]["timezone"]["score"] = (total - min)/(max-min);
		placescores[i]["Total"] += placescores[i]["Scores"]["timezone"]["score"] * weighting;
	}
	return placescores;
}