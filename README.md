# City Explorer

**Author**: Mark duenas
**Version**: 1.0.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->
Back-end application for City-Explorer application. Making API calls to several API's to retrieve data that will be displayed on the City-Explorer front-end.

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
After cloning/forking project, make sure to:
- `npm i` to install all dependenciies
- make sure to create a .env file that includes all the following API keys:
  1. Geocoding API
  2. Weatherbit API
## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
Built on Node.js using Express.js framework.
Technologies used:
  - superagent library for api calls
  - cors
  - heroku for deployme
## Change Log
<!-- Use this area to document the iterative changes made to your application as each feature is successfully implemented. Use time stamps. Here's an examples:

01-02-2021 1:20pm - Application has functional express server, with a GET route for the location and weather resource, including errors if request is empy.
01-06-2021 8:30pm - Application has been refactored to make API calls to retreive data from Geocoding API and Weatherbit API using superagent.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->
