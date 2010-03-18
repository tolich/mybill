DROP DATABASE IF EXISTS mybill_log;
CREATE DATABASE mybill_log DEFAULT CHARACTER SET cp1251 COLLATE cp1251_general_ci;

# Connect to 'mybill_log'
CONNECT mybill_log;

#    
# Table structure for table 'userlog'
#
CREATE TABLE log(
  id int(11) NOT NULL auto_increment,
  date_log timestamp,
  level int(11) NOT NULL default 0,
  username varchar(64) NOT NULL default '',
  role varchar(64) NOT NULL default '',
  msg text,
  remote_addr varchar(15),
  http_user_agent text,
  PRIMARY KEY (id),
  KEY date_log (date_log),
  KEY username (username),
  KEY level (level),
  KEY remote_addr (remote_addr)
)ENGINE=INNODB;

