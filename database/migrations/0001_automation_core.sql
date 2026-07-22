-- TopShelfWebsites Automation Core D1 Schema

CREATE TABLE IF NOT EXISTS commands (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  payload TEXT,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  created_at TEXT NOT NULL,
  completed_at TEXT,
  error TEXT
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  hostname TEXT,
  status TEXT NOT NULL DEFAULT 'STOPPED',
  heartbeat_at TEXT,
  version TEXT
);

CREATE TABLE IF NOT EXISTS deployments (
  id TEXT PRIMARY KEY,
  client_slug TEXT NOT NULL,
  commit_sha TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  event TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'INFO',
  created_at TEXT NOT NULL
);
