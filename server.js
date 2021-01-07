'use strict';

require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

const PORT = process.env.PORT;
const app = express();
app.use(cors());


// ROUTES
app.get('/location', handleLocation);
app.get('/weather', handleWeather);

app.use('*', notFoundError);


// HELPER FUNCTIONS
function handleLocation(req, res) {
    let key = process.env.GEOCODE_API_KEY;
    let city = req.query.city;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;

    if(!req.query.city){
        res.status(500).send("Sorry, something went wrong");
    }

    superagent.get(url)
        .then(data => {
            const geoData = data.body[0];
            const location = new Location(city, geoData);
            res.status(200).send(location);
        })
        .catch( err => {
            console.log(err);
        });
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
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
}

function Weather(wData) {
    this.forecast = wData.weather.description;
    this.time = wData.valid_date;
}

app.listen(PORT, () => console.log(`Now rocking on port ${PORT}`));
