#
# Arpwatch module
#

#
# Table structure for table 'arpwatch'
#
CREATE TABLE arpwatch(
  id int(11) NOT NULL auto_increment,
  datecreate timestamp,
  datelog varchar(15),
  source varchar(32),
  event varchar(255),
  ip varchar(15),
  newmac varchar(17),
  oldmac varchar(17),
  PRIMARY KEY id (id),
  KEY datecreate (datecreate),
  KEY datelog (datelog),
  KEY source (source),
  KEY event (event),
  KEY newmac (newmac),
  KEY ip (ip),
  KEY oldmac (oldmac)
)ENGINE=INNODB;
