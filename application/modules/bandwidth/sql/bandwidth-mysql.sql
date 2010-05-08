#
# Bandwidth module
#

#
# Table structure for table 'rate'
#
CREATE TABLE bandwidth_rate(
  id int(11) NOT NULL auto_increment,
  datecreate bigint(20),
  inoctets bigint(20), 
  outoctets bigint(20), 
  iface int(11),
  PRIMARY KEY id (id),
  KEY datecreate (datecreate),
  KEY iface (iface)
)ENGINE=INNODB;

CREATE TABLE bandwidth_settings(
  id int(11) NOT NULL auto_increment,
  name varchar(64),
  ifacename varchar(10),
  iface int(11),
  ip varchar(15),
  secret varchar(128),
  invert int(11),
  inmib varchar(255),
  outmib varchar(255),
  disabled int(11) NOT NULL default 0,
  PRIMARY KEY id (id),
  KEY ifacename (ifacename),
  KEY iface (iface),
  KEY disabled (disabled)
)ENGINE=INNODB;


