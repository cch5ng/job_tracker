CREATE TABLE job_tracker_user(
  id                SERIAL PRIMARY KEY,
  email             VARCHAR(64) UNIQUE,
  password_hash     VARCHAR(64),
  name              VARCHAR(64),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  guid              VARCHAR(64) UNIQUE,
  session_id        VARCHAR(36),
  time_zone         VARCHAR(255)
);
