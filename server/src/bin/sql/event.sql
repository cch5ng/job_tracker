CREATE TABLE event(
  id SERIAL PRIMARY KEY,
  name VARCHAR(64),
  contact VARCHAR(255),
  notes VARCHAR(1000),
  description VARCHAR(5000),
  date_time TIMESTAMPTZ(64),
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id)
);
