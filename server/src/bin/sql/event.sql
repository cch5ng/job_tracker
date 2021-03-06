CREATE TABLE event(
  id SERIAL PRIMARY KEY,
  guid VARCHAR(64) UNIQUE NOT NULL,
  format VARCHAR(64),
  contact VARCHAR(255),
  notes VARCHAR(1000),
  description VARCHAR(5000),
  follow_up VARCHAR(500),
  date_time TIMESTAMPTZ(64),
  job_guid VARCHAR(64),
  FOREIGN KEY (job_guid) REFERENCES job(guid)
);
