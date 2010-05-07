#
# Bandwidth module
#

#
# Table structure for table 'rate'
#
CREATE TABLE rate(
  id int(11) NOT NULL auto_increment,
  datecreate bigint(20),
  inoctets bigint(20), 
  outoctets bigint(20), 
  iface int(11),
  PRIMARY KEY id (id),
  KEY datecreate (datecreate),
  KEY iface (iface)
)ENGINE=INNODB;
