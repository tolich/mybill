#
# Aclmanager module
#

ALTER TABLE role ADD COLUMN type int NOT NULL default 1;
UPDATE role SET type=0;