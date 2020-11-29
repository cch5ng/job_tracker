CREATE TABLE job(
  id SERIAL PRIMARY KEY,
  name VARCHAR(64),
  source VARCHAR(255),
  url VARCHAR(350),
  description VARCHAR(5000),
  questions VARCHAR(1000),
  status VARCHAR(64),
  company_id INT,
  company_name VARCHAR(255),
  FOREIGN KEY (company_id) REFERENCES company(id)
);
