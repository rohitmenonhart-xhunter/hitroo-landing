-- Role for the console (hitroo_dashboard, console.hitroo.com on hitroo-1): projects and products,
-- their progress and next steps, clients, leads and the team. It owns schema `console` and manages its
-- own tables there. It reads website enquiries from web.leads to bring them into its leads pipeline;
-- it never writes to `web` and cannot read anything else there.
-- Run once as `postgres` against the `hitroo` database:
--   psql "<postgres url to db hitroo>" -v consolepw=... -f db/roles/console_app.sql
-- The password is passed in as a psql variable and never stored in this file.

CREATE ROLE console_app LOGIN PASSWORD :'consolepw' CONNECTION LIMIT 20;
GRANT CONNECT ON DATABASE hitroo TO console_app;
CREATE SCHEMA console AUTHORIZATION console_app;

-- Website enquiries, read-only. (Read access to the anonymous analytics was added in migrations/006.)
GRANT USAGE ON SCHEMA web TO console_app;
GRANT SELECT ON web.leads TO console_app;
