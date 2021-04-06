CREATE TABLE job(
  id SERIAL PRIMARY KEY,
  guid VARCHAR(64) UNIQUE NOT NULL,
  name VARCHAR(64),
  source VARCHAR(255),
  url VARCHAR(350),
  description VARCHAR(5000),
  questions VARCHAR(1000),
  status VARCHAR(64),
  company_id INT,
  user_guid VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (company_id) REFERENCES company(id),
  FOREIGN KEY (user_guid) REFERENCES job_tracker_user(guid)
);
