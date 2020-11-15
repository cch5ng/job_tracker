#!/bin/bash

DB_USER=$(grep PGUSER .env | xargs)
DB=$(grep PGDATABASE .env | xargs)
IFS='=' read -ra DB_USER <<< "$DB_USER"
DB_USER=${DB_USER[1]}
IFS='=' read -ra DB <<< "$DB"
DB=${DB[1]}

echo 'Configuring db'

dropdb -U ${DB_USER} ${DB}
createdb -U ${DB_USER} ${DB}

psql -U ${DB_USER} ${DB} < ./bin/sql/job_tracker_user.sql
psql -U ${DB_USER} ${DB} < ./bin/sql/company.sql
psql -U ${DB_USER} ${DB} < ./bin/sql/role.sql
psql -U ${DB_USER} ${DB} < ./bin/sql/event.sql

echo 'db configured'