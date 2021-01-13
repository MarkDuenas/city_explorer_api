/* eslint-disable no-trailing-spaces */
'use strict';

require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

const PORT = process.env.PORT;
const app = express();
app.use(cors());


// ROUTES
app.get('/', (req, res) => {
    res.status(200).send('ok');
});

app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get("/movies", handleMovies);
app.get('/yelp', handleYelp);

app.get('*', notFoundError);

// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => {throw err;});


// HELPER FUNCTIONS
function handleYelp(req, res) {
    let key = process.env.YELP_API_KEY;

    const url = `https://api.yelp.com/v3/businesses/search`;

    const numPerPage = 5;
    const page = req.query.page || 1;
    const start = ((page - 1) * numPerPage + 1);

    const queryParams = {
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        offset: start,
        limit: numPerPage
      };
    
      superagent.get(url)
        .set('Authorization', `Bearer ${key}`)
        .query(queryParams)
        .then( data => {
            console.log('RESTAURANT DATA', data.body);
            const restaurantData = [];
            data.body.businesses.forEach( entry => {
                restaurantData.push( new Yelp(entry));
            });
            res.send(restaurantData);
        })
        .catch( err => {
            console.log('ERROR', err);
            res.status(500).send('Something is wrong');
        });
    
}
function handleMovies(req, res) {
    let key = process.env.MOVIE_API_KEY;
    let city = req.query.search_query;
    let imageUrl = 'https://image.tmdb.org/t/p/w500';

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${city}`;

    superagent.get(url)
        .then( movie => {
            const movieData = movie.body.results.map( data => {
                // console.log('THIS IS THE MOVIE DATA', data);
                return new Movie(data, imageUrl);
            });
            res.status(200).send(movieData);
        })
        .catch( err => {
            console.log(err);
        });
}


function insertLocationDB (location) {
    let search_query = location.search_query;
    let formatted_query = location.formatted_query;
    let latitude = location.latitude;
    let longitude = location.longitude;

    const SQL = 'INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES($1, $2, $3, $4) RETURNING *';
    let safeValues = [search_query, formatted_query, latitude, longitude];
    
    client.query(SQL, safeValues)
        .then( results => {
            // console.log('SAVING TO THE DATABASE', results);
            return results;
        })
        .catch( err => {
            console.log('ERROR', err);
        });
}
function handleLocation(req, res) {
    let key = process.env.GEOCODE_API_KEY;
    let city = req.query.city;
    const url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;

    if(!req.query.city){
        res.status(500).send("Sorry, something went wrong");
    }

    let SQL = 'SELECT search_query, formatted_query, latitude, longitude FROM locations WHERE search_query = $1';
    let safeValues = [city];

    client.query(SQL, safeValues)
        .then( results => {
            if(results.rowCount > 0) {
                // console.log(results.rows[0], "HERE IS DATA FROM DATABASE");
                res.status(200).send(results.rows[0]);
            }
            else{
                superagent.get(url)
                    .then(data => {
                        // console.log("MAKING API CALL");
                        // console.log(data.body[0]);
                        const geoData = data.body[0];
                        const location = new Location(city, geoData);
            
                        // SAVE API DATA TO DATABASE
                        insertLocationDB(location);

                        res.status(200).send(location);
                        
                    })
                    .catch( err => {
                        console.log(err);
                    });
            }
        })
        .catch( err => {
            console.log(err);
        });
}
                    



function handleWeather(req, res) {
    let key = process.env.WEATHER_API_KEY;
    let lon = req.query.longitude;
    let lat = req.query.latitude;
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;


    superagent.get(url)
        .then(weather => {
            const weatherData = weather.body.data.map( entry =>{
                return new Weather(entry);
            });
            res.status(200).send(weatherData);
        })
        .catch( err => {
            console.log(err);
        });
}

function notFoundError(req, res) {
    res.status(404).send('Wrong route my dude!');
}

// CONSTRUCTORS
function Yelp(restObj) {
    this.name = restObj.name;
    this.image_url = restObj.image_url;
    this.price = restObj.price;
    this.rating = restObj.rating;
    this.url = restObj.url;
}
function Movie(movieObj, imgUrl) {
    this.title = movieObj.original_title;
    this.overview = movieObj.overview;
    this.average_votes = movieObj.vote_average;
    this.total_votes = movieObj.vote_count;
    this.image_url = `${imgUrl}${movieObj.poster_path}`;
    this.popularity = movieObj.popularity;
    this.released_on = movieObj.release_date;
}
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
}

function Weather(wData) {
    this.forecast = wData.weather.description;
    this.time = wData.datetime;
}

// CONNECT TO DB and START THE WEB SERVER
client.connect()
    .then( () => {
        app.listen(PORT, () => { 
            console.log(`Now rocking on port ${PORT}`);
            console.log(`Connected to database ${client.connectionParameters.database}`);
        });
    })
    .catch(err => {
        console.log( 'ERROR', err);
    });

