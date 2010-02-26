#pass/deny zone
ALTER TABLE zones ADD COLUMN action int NOT NULL default '1';
