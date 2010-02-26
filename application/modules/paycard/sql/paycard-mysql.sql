#
# Paycard module
#

#
# Table structure for table 'paycard'
#
CREATE TABLE paycard(
  id int(11) NOT NULL auto_increment,
  code varchar(16) NOT NULL, 
  md5 varchar(32) NOT NULL,
  datecreate datetime default '0000-00-00 00:00:00',
  dateactivate datetime default '0000-00-00 00:00:00',
  datefinish datetime default '0000-00-00 00:00:00',
  nominal decimal (15,3) NOT NULL default '0.000',
  status int NOT NULL default 0, #0-new, 1-sold, 2-activated, 3-hold
  id_payment int(11),
  PRIMARY KEY id (id),
  KEY datecreate (datecreate),
  KEY dateactivate (dateactivate),
  KEY datefinish (datefinish),
  KEY id_payment (id_payment),
  KEY nominal (nominal),
  UNIQUE code (code),
  UNIQUE md5 (md5),
  KEY status (status)
)ENGINE=INNODB;
