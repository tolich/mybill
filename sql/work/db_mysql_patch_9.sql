#
# Table structure for table "usersettings"
#
CREATE TABLE usersettings (
  id_user int(11) NOT NULL default 0,
  var varchar(64) NOT NULL default '',
  value text NOT NULL default '',
  description varchar(253) NOT NULL default ''
) ENGINE=INNODB;
