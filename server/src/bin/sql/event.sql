CREATE TABLE event(
  id SERIAL PRIMARY KEY,
  name VARCHAR(64),
  format VARCHAR(64),
  contact VARCHAR(255),
  notes VARCHAR(1000),
  description VARCHAR(5000),
  follow_up VARCHAR(500),
  date_time TIMESTAMPTZ(64),
  job_id INT,
  FOREIGN KEY (job_id) REFERENCES job(id)
);
