import json
import codecs
import csv

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


# Open list of Weather data by City and extract into usable format
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

