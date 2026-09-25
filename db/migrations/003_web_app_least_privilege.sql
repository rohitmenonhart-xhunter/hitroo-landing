-- The admin moved to its own app (hitroo_admin_page, role admin_app), so the public
-- website no longer needs to read leads, applications or analytics. If the site is ever
-- compromised, its role can add rows but cannot read anyone's details back.
-- Apply after db/roles/admin_app.sql, once the admin app is live.

REVOKE ALL ON ALL TABLES IN SCHEMA web FROM web_app;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA web REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM web_app;

-- Articles and blog posts are public.
GRANT SELECT ON web.posts TO web_app;

-- Forms, analytics and consent: write-only.
GRANT INSERT ON web.leads, web.job_applications, web.page_views, web.consents, web.events TO web_app;

-- INSERT … RETURNING id, then UPDATE … SET emailed = true WHERE id = $1.
GRANT SELECT (id), UPDATE (emailed) ON web.leads, web.job_applications TO web_app;
