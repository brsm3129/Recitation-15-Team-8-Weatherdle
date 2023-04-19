# API Planning
https://www.visualcrossing.com/weather/weather-data-services
## Requests
Unfortunately yearly average data is locked behind paid APIs so we will have to make due with using data from the past year.

### Yearly Data
3. Request the monthly climate data for the last 30 years

If you need to know what the weather is normally like at a particular location, the historical summaries provide climate level data of what you can except for any year, month, week or even day throughout the year.

https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/historysummary?&minYear=1989&maxYear=2019&chronoUnit=months&breakBy=self&dailySummaries=false&contentType=csv&unitGroup=us&key=YOUR_API_KEY&locations=New York City,NY  

We will need to turn this into a JSON request.

The results are CSV again and provide a monthly climate for New York City. If you want to change between yearly, monthly or weekly summaries, change the ‘chronoUnit’ parameter. If you want to break by years, change breakBy=self to breakBy=years


Period,Address,Date time,Minimum Temperature,Maximum Temperature,Temperature,Dew Point,Relative Humidity,Heat Index,Wind Speed,Wind Gust,Wind Direction,Wind Chill,Precipitation,Precipitation Cover,Snow Depth,Visibility,Cloud Cover,Sea Level Pressure
 "Jan","New York City, NY","",-2.6,70.3,33.8,21.4,62.01,,39.5,56.5,225.36,-24,114.29,9.98,4.7,1,42.4,1017.9
 "Feb","New York City, NY","",0.2,72.4,35.5,21.3,58.62,,33.6,57.5,220.22,-19.5,80.64,8.97,4.5,1,39.4,1017.4

### Spring Equinox Data
Template: 
Data needed before request

Location: String of location name ex(Denver Colorado)

unitGroup: this decides metric vs imperial (C vs F) values can either be us or eu

API_KEY: This is the API KEY stored in the .env file

https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[Location]/2023-03-17/2023-03-24?unitGroup=[unitGroup]&elements=datetime%2Ctempmax%2Ctempmin%2Chumidity%2Cprecip%2Csnow%2Csnowdepth%2Cwindgust%2Csunrise%2Csunset&include=stats%2Cdays&key=[API_KEY]&contentType=json

Example:

https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Denver%20Colorado/2023-03-17/2023-03-24?unitGroup=us&elements=datetime%2Ctempmax%2Ctempmin%2Chumidity%2Cprecip%2Csnow%2Csnowdepth%2Cwindgust%2Csunrise%2Csunset&include=stats%2Cdays&key=YOUR_API_KEY&contentType=json


### Fall Equinox Data

## Data
```
{
 "queryCost": 8,
 "latitude": 39.74,
 "longitude": -104.992,
 "resolvedAddress": "Denver, CO, United States",
 "address": "Denver Colorado",
 "timezone": "America/Denver",
 "tzoffset": -6,
 "days": [
  {
   "datetime": "2023-03-17",
   "datetimeEpoch": 1679032800,
   "tempmax": 56.7,
   "tempmin": 34.4,
   "humidity": 42.1,
   "precip": 0.008,
   "snow": null,
   "snowdepth": null,
   "windgust": 30,
   "sunrise": "07:08:22",
   "sunset": "19:08:55",
   "normal": {
    "tempmax": [
     35.3,
     56.7,
     73.5
    ],
    "tempmin": [
     24.3,
     34.4,
     46.5
    ],
    "precip": [
     0,
     0,
     0.1
    ],
    "humidity": [
     15.7,
     42.1,
     86.9
    ],
    "snowdepth": [
     null,
     null,
     null
    ],
    "windgust": [
     18.3,
     30,
     38
    ]
   },
   "precipsum": 0.008,
   "precipsumnormal": 0,
   "snowsum": 0,
   "datetimeInstance": "2023-03-17T06:00:00.000Z"
  }
 ]
}
```

## Storage
We want to cache this data so we dont need to continuously requesting it from the API

WeatherData Table - The contents of this table may change throughout development

LocationID - (Primary Key for the Table)

LocationName - (Common String name used to access)

MarchHi - (Weekly Average around the March Equinox)

MarchLo - (Weekly Lo around the March Equinox)

SeptemberHi- (Weekly Hi around the September Equinox)

SeptemberLo - (Weekly Lo around the September Equinox)

DecemberDaylength - Length of the day on December 21st(Solstice)

JulyDayLength - Length of day on July 21st(Solstice)

YearlyPrecip
