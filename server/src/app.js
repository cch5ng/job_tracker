require('dotenv').config();
var logger = require('morgan');
var express = require('express');
const cors = require("cors");
var cookieParser = require('cookie-parser');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
var indexRouter = require('./api/index');
var app = express();
const jobRouter = require('./api/job');
const authRouter = require('./api/auth');
const eventRouter = require('./api/event');

app.use(logger('dev'));
app.use(cors({ origin: process.env.CLIENT_ORIGIN_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and 
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'http://localhost:3000',
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

//app.use(checkJwt);

app.use('/api/jobs', jobRouter);
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);

app.use('/v1', indexRouter);

// This route doesn't need authentication
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// This route needs authentication
app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

const checkScopes = jwtAuthz([ 'read:companies' ]);

app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:companies to see this.'
  });
});

module.exports = app;