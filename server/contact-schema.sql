CREATE TABLE IF NOT EXISTS contact_enquiries (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  request_key TEXT NOT NULL,
  is_test INTEGER NOT NULL DEFAULT 0,
  is_internal INTEGER NOT NULL DEFAULT 0,
  is_spam INTEGER NOT NULL DEFAULT 0,
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK(delivery_status IN ('pending','sending','sent','failed')),
  delivery_attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TEXT NOT NULL,
  lease_until TEXT,
  email_id TEXT,
  last_error_code TEXT
);
CREATE INDEX IF NOT EXISTS contact_created ON contact_enquiries(created_at);
CREATE INDEX IF NOT EXISTS contact_rate ON contact_enquiries(request_key, created_at);
CREATE INDEX IF NOT EXISTS contact_outbox ON contact_enquiries(delivery_status, next_attempt_at);
