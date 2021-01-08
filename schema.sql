DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS weather;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude  VARCHAR(255),
    longitude VARCHAR(255)
);

CREATE TABLE weather (
    id SERIAL PRIMARY KEY,
    forecast VARCHAR(255),
    time VARCHAR(255)
);
