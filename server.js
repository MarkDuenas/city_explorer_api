'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;
const app = express();
app.use(cors());

// ROUTES
app.get('/location', handleLocation);



// HELPER FUNCTIONS
function handleLocation(req, res) {
    const geoData = require('./data/location.json');
    const city = req.query.city;
    const locationData = new Location(city, geoData);
    res.send(locationData);
}

// CONSTRUCTORS
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
}

app.listen(PORT, () => console.log(`Now rocking on port ${PORT}`));
