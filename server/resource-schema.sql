-- Separate operational type: resource requests never enter contact_enquiries or a list.
CREATE TABLE IF NOT EXISTS resource_requests (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  organisation TEXT NOT NULL,
  source_path TEXT NOT NULL,
  resource_key TEXT NOT NULL,
  pdf_sha256 TEXT NOT NULL,
  notice_version TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  request_key TEXT NOT NULL,
  is_test INTEGER NOT NULL DEFAULT 0,
  is_internal INTEGER NOT NULL DEFAULT 0,
  is_spam INTEGER NOT NULL DEFAULT 0,
  followup_status TEXT NOT NULL DEFAULT 'owner-review' CHECK(followup_status IN ('owner-review','sent','declined')),
  UNIQUE(email, resource_key)
);
CREATE TABLE IF NOT EXISTS resource_deliveries (
  request_id TEXT NOT NULL REFERENCES resource_requests(id),
  kind TEXT NOT NULL CHECK(kind IN ('checklist','owner')),
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK(delivery_status IN ('pending','sending','sent','failed')),
  delivery_attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL,
  lease_until TEXT,
  email_id TEXT,
  last_error_code TEXT,
  PRIMARY KEY(request_id, kind)
);
CREATE INDEX IF NOT EXISTS resource_created ON resource_requests(created_at);
CREATE INDEX IF NOT EXISTS resource_rate ON resource_requests(request_key, created_at);
CREATE INDEX IF NOT EXISTS resource_outbox ON resource_deliveries(delivery_status, next_attempt_at);
