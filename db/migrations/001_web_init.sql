-- Website data (schema `web`). Owned by postgres; the site connects as web_app (row access only).

-- Project enquiries from the contact and home-page forms.
CREATE TABLE web.leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  name        text,
  email       text,
  phone       text,
  interest    text,
  message     text,
  lead_type   text NOT NULL DEFAULT 'contact',
  page        text,                 -- path the form was sent from
  country     text,                 -- from the edge (x-vercel-ip-country)
  region      text,
  city        text,
  user_agent  text,
  emailed     boolean NOT NULL DEFAULT false,
  status      text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'won', 'lost', 'spam'))
);
CREATE INDEX leads_created_idx ON web.leads (created_at DESC);

-- Job applications from /careers (resume PDF stored inline, max 5 MB).
CREATE TABLE web.job_applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  position      text NOT NULL,
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text,
  linkedin      text,
  portfolio     text,
  experience    text,
  availability  text,
  why_hitroo    text,
  why_position  text,
  resume_name   text,
  resume_type   text,
  resume        bytea,
  country       text,
  emailed       boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'interview', 'hired', 'rejected'))
);
CREATE INDEX job_applications_created_idx ON web.job_applications (created_at DESC);

-- First-party page views. No IP addresses are stored. visitor_id/session_id are only
-- recorded after the visitor accepts analytics cookies.
CREATE TABLE web.page_views (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts            timestamptz NOT NULL DEFAULT now(),
  path          text NOT NULL,
  referrer_host text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  country       text,
  region        text,
  city          text,
  device        text,                -- desktop | mobile | tablet
  browser       text,
  os            text,
  language      text,
  visitor_id    uuid,
  session_id    uuid
);
CREATE INDEX page_views_ts_idx ON web.page_views (ts DESC);
CREATE INDEX page_views_path_ts_idx ON web.page_views (path, ts DESC);
CREATE INDEX page_views_visitor_idx ON web.page_views (visitor_id) WHERE visitor_id IS NOT NULL;

-- Cookie-consent decisions (proof of consent).
CREATE TABLE web.consents (
  id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts              timestamptz NOT NULL DEFAULT now(),
  visitor_id      uuid,
  choice          text NOT NULL CHECK (choice IN ('granted', 'denied')),
  policy_version  text NOT NULL,
  country         text
);

-- Articles and blog posts (replaces the old data/content.json file CMS).
CREATE TABLE web.posts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind             text NOT NULL CHECK (kind IN ('article', 'blog')),
  slug             text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  legacy_id        text UNIQUE,      -- id from the old JSON CMS, for redirects
  title            text NOT NULL,
  excerpt          text NOT NULL DEFAULT '',
  body             text NOT NULL DEFAULT '',
  category         text,
  cover_image      text,
  author           text NOT NULL DEFAULT 'HITROO',
  status           text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  published_at     timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  seo_title        text,
  seo_description  text
);
CREATE INDEX posts_listing_idx ON web.posts (kind, status, published_at DESC);
