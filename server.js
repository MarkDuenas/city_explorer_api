'use strict';

require('dotenv/types').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;
const app = express();
app.use(cors());


app.listen(PORT, () => console.log(`Now rocking on port ${PORT}`));