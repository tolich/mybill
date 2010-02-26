#
# Table structure for table 'acctperiod'
#
CREATE TABLE acctperiod(
  id int(11) NOT NULL auto_increment,
  name varchar(255) NOT NULL default '',
  datestart datetime default '0000-00-00 00:00:00',
  datefinish datetime default '0000-00-00 00:00:00',
  status int NOT NULL default 0, #0-open, 1-close
  id_repl int(11),
  PRIMARY KEY id (id),
  KEY datestart (datestart),
  KEY datefinish (datefinish),
  KEY status (status)
)ENGINE=INNODB;

INSERT INTO acctperiod (datestart) value (curdate());