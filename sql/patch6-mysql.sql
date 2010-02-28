#pass/deny zone
ALTER TABLE intariffs ADD COLUMN action int NOT NULL default '1';
