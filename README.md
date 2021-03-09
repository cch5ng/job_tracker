## Job Tracker README

These are instructions for running the app locally. Due to restrictions with db hosting and budget, this app will not be hosted for public long-term use but for short-term demo purposes only.

## Prerequisites

### Authentiation

For UX reasons, this app was designed to mainly use Google account authentication with an email/password authentication option as fallback.

Auth0 was used to handle the authentication. Please see the following docs:

#### Client integration

* https://auth0.com/docs/quickstart/spa/react

* https://auth0.com/docs/quickstart/spa/react/02-calling-an-api

* https://auth0.com/docs/connections/social/google

#### Server integration

* https://auth0.com/docs/quickstart/backend/nodejs

### Environment variables

## Server environment variables

From /server make a copy of .env.example and name the new file => .env

```
cd server
cp .env.example .env
```

**Notes on environment variables**

```
API_ROOT - you may need to update the url if hosting the server other than local machine; base url for the API server
PGUSER - PostgreSQL database user name
PGHOST - PostgreSQL database host url
PGPASSWORD - PostgreSQL database password
PGDATABASE - PostgreSQL database name
PGPORT - PostgreSQL database port
PGMAXCONNECTIONS - This value is set to the max connections supported at free tier for elephantsql.com but it might be increased for local database instance or other hosts
GOOGLE_CLIENT_ID - This value comes from Google project configuration (see Auth doc link for google social)
AUTH0_DOMAIN - This value comes from Auth0 configuration
AUTH0_AUDIENCE - This value comes from Auth0 configuration and references the server url
CLIENT_ORIGIN_URL - This value comes from Auth0 configuration and refernces the client url
```

## Client environment variables

From /client make a copy of .env.example and name the new file => .env

```
cd client
cp .env.example .env
```

**Notes on environment variables**

```
REACT_APP_GOOGLE_CLIENT_ID - This value will be the same as the server env var, GOOGLE_CLIENT_ID
AuthorizeURL - This value will come from Google project configuration, see Authentication > Client Integration docs
TokenURL - This value will come from Google project configuration, see Authentication > Client Integration docs
PORT - Update this if you change from the default client port, 3001
REACT_APP_AUTH0_DOMAIN - This value comes from Auth0 client configuration, see Authentication > Client Integration docs
REACT_APP_AUTH0_CLIENT_ID - This value comes from Auth0 client configuration, see Authentication > Client Integration docs
REACT_APP_AUTH0_AUDIENCE - This value comes from Auth0 configuration and references the server url
REACT_APP_SERVER_URL - This value comes from Auth0 configuration and references the server url
```

## Running the app

### To install the app (server)

### To install the app (client)

### To run the app (development server)

### To run the app (development client)

```
cd client
npm run start_https
```
