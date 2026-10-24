-- 005: page content and media move into the database, edited from the admin app.
-- Additive only: the site keeps its built-in copy as a fallback, so it runs before and after this is applied.

-- One row per content block (a page or a shared block). `data` mirrors the TypeScript shape the site renders,
-- e.g. key 'division:software' holds the DivisionPageContent object for /software.
CREATE TABLE web.content (
  key         text PRIMARY KEY CHECK (key ~ '^[a-z0-9]+(:[a-z0-9-]+)?$'),
  data        jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  text
);

-- Every saved version, so an edit can be undone.
CREATE TABLE web.content_history (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key       text NOT NULL,
  data      jsonb NOT NULL,
  saved_at  timestamptz NOT NULL DEFAULT now(),
  saved_by  text
);
CREATE INDEX content_history_key_idx ON web.content_history (key, saved_at DESC);

-- Uploaded images and videos. Files live in object storage (Tigris on Fly); rows hold their public URLs.
-- Images are pre-sized at upload into WebP variants, so the site serves them as plain cached files.
CREATE TABLE web.media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  kind        text NOT NULL CHECK (kind IN ('image', 'video')),
  name        text NOT NULL,                      -- original file name, for the library
  alt         text NOT NULL DEFAULT '',
  url         text NOT NULL,                      -- the default file (largest image variant, or the video)
  width       integer,
  height      integer,
  bytes       bigint,
  tone        text,                               -- average colour (#rrggbb), shown while it loads
  variants    jsonb NOT NULL DEFAULT '[]'::jsonb, -- images: [{ "w": 640, "url": "…", "bytes": 12345 }], ascending
  poster_url  text,                               -- videos: a still frame
  tags        text[] NOT NULL DEFAULT '{}'
);
CREATE INDEX media_created_idx ON web.media (created_at DESC);

-- The site reads content and media (it never writes them). admin_app gets full access through the
-- default privileges set in db/roles/admin_app.sql; granted explicitly here as well so the order of setup never matters.
GRANT SELECT ON web.content, web.media TO web_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON web.content, web.content_history, web.media TO admin_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA web TO admin_app;
