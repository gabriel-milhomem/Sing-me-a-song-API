require('dotenv').config();
require('./utils/loadingRelationship');

const express = require('express');
const cors = require('cors');
const app = express();

const genresRouter = require('./routers/genresRouter');
const recommendationsRouter = require('./routers/recommendationsRouter');

app.use(cors());
app.use(express.json());

app.use('/genres', genresRouter);
app.use('/recommendations', recommendationsRouter);

module.exports = app;