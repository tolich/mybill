#
#vendor
#
ALTER TABLE nas ADD vendor varchar(32) NOT NULL DEFAULT 'mpd5';
ALTER TABLE nas ADD ipaddress varchar(15) NOT NULL;

#
UPDATE nas SET ipaddress = nasname;