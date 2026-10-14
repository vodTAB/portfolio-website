CREATE TABLE IF NOT EXISTS illustrations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL CHECK (length(title) <= 255),
    description TEXT CHECK (length(description) <= 1000),
    date TEXT CHECK (length(date) <= 50),
    tools TEXT CHECK (length(tools) <= 100),
    sort_order INTEGER DEFAULT 0,
    thumbnail_file_id TEXT CHECK (length(thumbnail_file_id) <= 255),
    full_file_id TEXT CHECK (length(full_file_id) <= 255),
    social_link TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);