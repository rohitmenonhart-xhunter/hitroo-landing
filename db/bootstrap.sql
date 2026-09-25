-- One-time setup of the shared HITROO Postgres cluster (Fly app `hitroo-db`).
-- Run as the `postgres` superuser against the `postgres` database:
--   psql "<admin url to db postgres>" -v webpw=... -v intpw=... -f db/bootstrap.sql
-- Passwords are passed in as psql variables and never stored in this file.

CREATE ROLE web_app LOGIN PASSWORD :'webpw' CONNECTION LIMIT 60;
CREATE ROLE internal_app LOGIN PASSWORD :'intpw' CONNECTION LIMIT 60;

CREATE DATABASE hitroo;
REVOKE CONNECT ON DATABASE hitroo FROM PUBLIC;
GRANT CONNECT ON DATABASE hitroo TO web_app, internal_app;

\connect hitroo

REVOKE ALL ON SCHEMA public FROM PUBLIC;

-- Segment 1: the public website (forms, analytics, consent, articles and blog).
-- Owned by postgres (migrations); the site's role can only read and write rows.
CREATE SCHEMA web;
GRANT USAGE ON SCHEMA web TO web_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA web GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO web_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA web GRANT USAGE, SELECT ON SEQUENCES TO web_app;

-- Segment 2: internal HITROO apps. Owned by their role, which manages its own tables.
CREATE SCHEMA internal AUTHORIZATION internal_app;

-- Migration bookkeeping (db/migrations/*.sql, applied by scripts/db-migrate.mjs).
CREATE TABLE public.schema_migrations (
  filename   text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
