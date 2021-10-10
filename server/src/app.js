require('dotenv').config();
var logger = require('morgan');
var express = require('express');
const cors = require("cors");
const path = require("path");
var cookieParser = require('cookie-parser');
var admin = require('firebase-admin');
var indexRouter = require('./api/index');
var app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/build")));
}

if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, "../../client/public")));
}

const jobRouter = require('./api/job');
const authRouter = require('./api/auth');
const eventRouter = require('./api/event');
const companyRouter = require('./api/company');

app.use(logger('dev'));
app.use(cors({ origin: process.env.CLIENT_ORIGIN_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/jobs', jobRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/company', companyRouter);

app.use('/v1', indexRouter);

module.exports = app;