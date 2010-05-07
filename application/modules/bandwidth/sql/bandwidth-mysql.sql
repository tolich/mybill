#
# Bandwidth module
#

#
# Table structure for table 'rate'
#
CREATE TABLE rate(
  id int(11) NOT NULL auto_increment,
  datecreate timestamp,
  inoctets int(11), 
  outoctets int(11), 
  iface int(11),
  PRIMARY KEY id (id),
  KEY datecreate (datecreate),
  KEY iface (iface)
)ENGINE=INNODB;
