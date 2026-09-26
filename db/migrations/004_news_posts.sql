-- 004: company news joins articles and blog posts. The admin publishes it; the site shows it at /news.
ALTER TABLE web.posts DROP CONSTRAINT posts_kind_check;
ALTER TABLE web.posts ADD CONSTRAINT posts_kind_check CHECK (kind IN ('article', 'blog', 'news'));
