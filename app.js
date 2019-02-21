'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(morgan('dev'));
app.use(cors());

const playstore = require('./playstore'); 

app.get('/apps', (req, res) => {
  const { sort, genre } = req.query;

  if (sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must be one of rating or app');
    }
  }

  if (genre) {
    if (!['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
      return res.status(400).send('Must be an acceptable genre.');
    }
  }

  let results = [...playstore];
  if (sort) {
    results.sort((a, b) => {
      return a[sort] < b[sort] ? 1 : a[sort] > b[sort] ? -1 : 0;
    });
    return res.json(results);
  }

  if (genre) {
    results = results.filter(app => app.Genres.includes(genre));
    // let string = app['Genres'];
    // if (string.includes(genres)) {
    //   return app;
    // }
    return res.json(results);
  }

  res.json(playstore);
});

module.exports = app;
