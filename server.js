'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

// ROUTES
app.get('/location', handleLocation);
app.get('/weather', handleWeather);

app.use('*', notFoundError);


// HELPER FUNCTIONS
function handleLocation(req, res) {
    if(!req.query.city){
        res.status(500).send("Sorry, something went wrong");
    }
    const geoData = require('./data/location.json');
    const city = req.query.city;
    const locationData = new Location(city, geoData);
    res.send(locationData);
}

function handleWeather(req, res) {
    const wData = require('./data/weather.json');
    const weatherData = wData.data.map( entry => {
        return new Weather(entry);
    });
    res.send(weatherData);
}

function notFoundError(req, res) {
    res.status(404).send('Wrong route my dude!');
}

// CONSTRUCTORS
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

function Weather(wData) {
    this.forecast = wData.weather.description;
    this.time = wData.valid_date;
}

app.listen(PORT, () => console.log(`Now rocking on port ${PORT}`));
