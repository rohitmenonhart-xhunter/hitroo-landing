-- Role for the admin app (hitroo_admin_page): reads and manages rows in schema `web`.
-- No DDL, no access to `internal`. Run once as `postgres` against the `hitroo` database:
--   psql "<postgres url to db hitroo>" -v adminpw=... -f db/roles/admin_app.sql
-- The password is passed in as a psql variable and never stored in this file.

CREATE ROLE admin_app LOGIN PASSWORD :'adminpw' CONNECTION LIMIT 20;
GRANT CONNECT ON DATABASE hitroo TO admin_app;
GRANT USAGE ON SCHEMA web TO admin_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA web TO admin_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA web TO admin_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA web GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO admin_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA web GRANT USAGE, SELECT ON SEQUENCES TO admin_app;
