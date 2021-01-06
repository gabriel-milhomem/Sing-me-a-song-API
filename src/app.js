const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

module.exports = app;