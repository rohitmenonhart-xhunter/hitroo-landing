-- 006: the console (role console_app, see db/roles/console_app.sql) shows the website's performance,
-- so it reads the anonymous analytics: page views, clicks and engagement, and cookie decisions.
-- Read-only; no IP addresses are stored in these tables. It still cannot read job applications or write to `web`.
GRANT SELECT ON web.page_views, web.events, web.consents TO console_app;
