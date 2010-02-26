#
# Table structure for table 'admin'
#

CREATE TABLE admin (
  id int(11) unsigned NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  password varchar(64) NOT NULL default '',
  lastlogin timestamp,
  role varchar(64) NOT NULL default 'guest',
  PRIMARY KEY  (id),
  KEY username (username(32)),
  KEY password (password(32))
) ENGINE=INNODB;
  
INSERT INTO admin (username, password)
    VALUES ('admin','admin');  



#
# Table structure for table 'roles'
#
#CREATE TABLE roles (
#  id int(11) NOT NULL auto_increment,
#  name varchar(64) NOT NULL default '',
#  script enum('user','admin') default 'user',
#  describe varchar(255),
#  PRIMARY KEY  (id),
#  KEY name (name(32))
#) ENGINE=INNODB;

#
# Table structure for table 'rights'
#
#CREATE TABLE rights (
#  id int(11) NOT NULL auto_increment,
#  name varchar(64) NOT NULL default '',
#  describe varchar(255),
#  PRIMARY KEY  (id),
#  KEY name (name(32))
#) ENGINE=INNODB;

#
# Table structure for table 'inroles'
#
#CREATE TABLE inroles (
#  id int(11) NOT NULL auto_increment,
#  idroles int(11) NOT NULL,
#  PRIMARY KEY  (id),
#  KEY idroles (idroles),
#  KEY idrights (idrights)
#) ENGINE=INNODB;
