CREATE TABLE job_tracker_user(
  id                SERIAL PRIMARY KEY,
  email             VARCHAR(64) UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  guid              VARCHAR(64) UNIQUE,
  time_zone         VARCHAR(255)
);
