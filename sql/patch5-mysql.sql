#
# Table structure for table 'radvendorcheck'
#
CREATE TABLE radvendorcheck (
  id int(11) unsigned NOT NULL auto_increment,
  vendorname varchar(64) NOT NULL default '',
  attribute varchar(32)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '==',
  value varchar(253)  NOT NULL default '',
  PRIMARY KEY  (id),
  KEY vendorname (vendorname(32))
) ENGINE=INNODB;

#
# Table structure for table 'radvendorreply'
#
CREATE TABLE radvendorreply (
  id int(11) unsigned NOT NULL auto_increment,
  vendorname varchar(64) NOT NULL default '',
  attribute varchar(32)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '=',
  value varchar(253)  NOT NULL default '',
  PRIMARY KEY  (id),
  KEY vendorname (vendorname(32))
) ENGINE=INNODB;
