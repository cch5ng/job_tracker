## Job Tracker README

These are instructions for running the app locally. Due to restrictions with db hosting and budget, this app will not be hosted for public long-term use but for short-term demo purposes only.

.

## Prerequisites

### Authentiation

Firebase (v9 web sdk and current admin sdk) was used to handle the authentication. Please see the following docs:

#### Client integration


#### Server integration


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
```

## Running the app

### To install the app (server)

From /server, install required libraries.

```
cd server
npm install
```

### To install the app (client)

From /client, install required libraries.

```
cd ../client
npm install
```

### To run the app (development server)

```
cd ../server
npm run dev
```

### To run the app (development client)

```
cd ../client
npm run start_https
```

A browser should open with the url: https://localhost:3001
