import json
import codecs
import csv
from datetime import datetime
import hashlib
from collections import defaultdict

input("Welcome! Press enter to start the conversion. This will take files from airports.dat and routes.dat and build a JSON 'database' out of them")

database = {}

# Open list of airports and extract data
with codecs.open('airports.dat','r', "utf-8") as f:
    reader = csv.reader(f)
    # Schema for airports.dat:
    # 0: Airport ID
    # 1: Name
    # 2: City
    # 3: Country
    # 4: IATA
    # 5: ICAO
    # 6: Latitude
    # 7: Longitude
    # 8: Altitude
    # 9: Timezone
    # 10: DST
    # 11: Tz (Olson) format
    # 12: Type
    # 13: Source
    for row in reader:
        airport = row
        database[airport[0]] = {
            "Name": airport[1],
            "City": airport[2],
            "Country": airport[3],
            "IATA": airport[4],
            "ICAO": airport[5],
            "Latitude": airport[6],
            "Longitude": airport[7],
            "Altitude": airport[8],
            "Timezone": airport[9],
            "DST": airport[10],
            "Tz (Olson) format": airport[11],
            "Type": airport[12],
            "Source": airport[13]
        }

with codecs.open('routes.dat','r', "utf-8") as f:
    reader = csv.reader(f)
    # Route Structure
    # 0: Airline
    # 1: Airline ID
    # 2: Source airport
    # 3: Source airport ID
    # 4: Destination airport
    # 5: Destination airport ID
    # 6: Codeshare
    # 7: Stops
    # 8: Equipment
    for row in reader:
        route = row
        if route[3] in database: # If there is an airport with our source id
            if "Routes" not in database[route[3]]: # If we haven't already created the routes key
                database[route[3]]["Routes"] = []
            database[route[3]]["Routes"].append({ # Place the route in the source airport
                "Airline": route[0],
                "Airline ID": route[1],
                # "Source airport": route[2], # Not needed as it's in the airport db (one level up)
                # "Source airport ID": route[3], # Same as above
                "Destination airport": route[4],
                "Destination airport ID": route[5],
                "Codeshare": route[6],
                "Stops": route[7],
                "Equipment": route[8]
            })

# Export data as a json file
with open('airports.js', 'w') as outfile:
    outfile.write("airports = ")
    json.dump(database, outfile)

database = defaultdict(list)
# Lookup table for city id
lookupID = []
# Open list of Weather data by City and extract into usable format
with codecs.open('GlobalLandTemperaturesByCity.csv','r', "utf-8") as f:
    reader = csv.reader(f)
    # Schema for GlobalLandTemperaturesByCity.csv:
    # "Date": temperatures[0],
    # "AverageTemperature": temperatures[1],
    # "Uncertainty": temperatures[2],
    # "City": temperatures[3],
    # "Country": temperatures[4],
    # "Latitude": temperatures[5],
    # "Longitude": temperatures[6],
    next(f) # Skip headers
    for row in reader:
        temperatures = row
        # Check if we've proccessed the city before
        hasproccessed = False
        id = len(lookupID)
        for i, City in enumerate(lookupID):
            if City == temperatures[3]:
                hasproccessed = False
                id = i
                break
        # Check to see if we've already made our data structure
        if(not database[id]):
            # If not, then let's build an object to store data in
            database[id] = {
                "City" : temperatures[3],
                "Country": temperatures[4],
                "Latitude": float(temperatures[5][:-1]),
                "Longitude": float(temperatures[6][:-1]),
                "TemperatureMonths": { # Each month of the year, recording total temperature per month
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0
                },
                "DataPointMonths": { # Each month of the year, recording number of data points per month
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    6: 0,
                    7: 0,
                    8: 0,
                    9: 0,
                    10: 0,
                    11: 0,
                    12: 0
                }
            }
        # Now, let's add our temperature
        # Example date to show what we're dealing with:
        # 1907-12-01
        # Datetime format
        # %Y-%m-%d
        # The datetime object is timezone-naive, but that's okay as we're on the scale of months
        datetime_object = datetime.strptime(temperatures[0], '%Y-%m-%d')
        # Add the temperature to our object => array
        database[id]["TemperatureMonths"][datetime_object.month] += float(temperatures[1])
        # Increment the number of data points for that month by 1 for book keeping
        database[id]["DataPointMonths"][datetime_object.month] += 1

    # Once we have our database, let's make those numbers averages
    for CityName in database:
        for month in database[CityName]["TemperatureMonths"]:
            database[CityName]["TemperatureMonths"][month] = database[CityName]["TemperatureMonths"][month]/ database[CityName]["DataPointMonths"][month]
    # And just like that, we're done.


# Export data as a json file
with open('temperatures.js', 'w') as outfile:
    outfile.write("temperatures = ")
    json.dump(database, outfile)

