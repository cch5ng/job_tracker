CREATE TABLE company(
  id SERIAL PRIMARY KEY,
  name VARCHAR(64),
  financial VARCHAR(1000),
  description VARCHAR(5000),
  purpose VARCHAR(300),
  user_guid VARCHAR(64),
  FOREIGN KEY (user_guid) REFERENCES job_tracker_user(guid)
);
