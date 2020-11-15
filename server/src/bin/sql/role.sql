CREATE TABLE role(
  id SERIAL PRIMARY KEY,
  name VARCHAR(64),
  source VARCHAR(255),
  description VARCHAR(5000),
  questions_self VARCHAR(1000),
  status VARCHAR(64),
  company_id INT,
  FOREIGN KEY (company_id) REFERENCES company(id)
);
