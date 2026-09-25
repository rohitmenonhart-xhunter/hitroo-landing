-- Engagement analytics (visits, clicks, reading) and admin workflow fields.
-- Additive only: the site running on 001 keeps working while this is applied.

-- A random id per page load groups the pages of one visit, and a random id per page view
-- ties engagement events to their view. Both live only in the page's memory: nothing is
-- stored on the visitor's device, and a reload starts a new visit.
ALTER TABLE web.page_views
  ADD COLUMN visit_id uuid,
  ADD COLUMN view_id  uuid;
CREATE INDEX page_views_visit_idx ON web.page_views (visit_id, ts) WHERE visit_id IS NOT NULL;

CREATE TABLE web.events (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ts          timestamptz NOT NULL DEFAULT now(),
  type        text NOT NULL CHECK (type IN ('click', 'engage')),
  path        text NOT NULL,
  visit_id    uuid,
  view_id     uuid,
  visitor_id  uuid,                                             -- only with consent
  label       text,                                             -- click: the link or button text
  href        text,                                             -- click: where it points
  seconds     integer  CHECK (seconds BETWEEN 0 AND 86400),     -- engage: visible time since the last report
  depth       smallint CHECK (depth BETWEEN 0 AND 100),         -- engage: furthest scroll (% of the article on post pages)
  country     text
);
CREATE INDEX events_ts_idx ON web.events (ts DESC);
CREATE INDEX events_view_idx ON web.events (view_id) WHERE view_id IS NOT NULL;

-- Admin workflow: notes beside the existing status column.
ALTER TABLE web.leads
  ADD COLUMN notes      text,
  ADD COLUMN updated_at timestamptz;
ALTER TABLE web.job_applications
  ADD COLUMN notes      text,
  ADD COLUMN updated_at timestamptz;
