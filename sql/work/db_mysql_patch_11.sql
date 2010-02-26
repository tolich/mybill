# Table structure for table 'radacctzone'
#

CREATE TABLE radacctzone (
  radacctzoneid bigint(21) NOT NULL auto_increment,
  acctsessionid varchar(32) NOT NULL default '',
  acctuniqueid varchar(32) NOT NULL default '',
  username varchar(64) NOT NULL default '',
  zonename varchar(64) NOT NULL default '',
  nasipaddress varchar(15) NOT NULL default '',
  acctinputoctets bigint(20) default NULL,
  acctoutputoctets bigint(20) default NULL,
  PRIMARY KEY  (radacctzoneid)
) ENGINE=INNODB;

# Table structure for table 'sessions'
#

CREATE TABLE sessions (
  acctsessionid varchar(32) NOT NULL default '',
  acctuniqueid varchar(32) NOT NULL default '',
  username varchar(64) NOT NULL default '',
  callingstationid varchar(50) NOT NULL default '',
  nasipaddress varchar(15) NOT NULL default '',
  iface varchar(15) default NULL,
  framedipaddress varchar(15) NOT NULL default '',
  acctstarttime datetime NULL default NULL
) ENGINE=INNODB;

# Table structure for table 'pool'
#
CREATE TABLE pools (
    id int(11) NOT NULL AUTO_INCREMENT,
    poolname varchar(64) NOT NULL default '',
    poolval varchar(64) NOT NULL default '',
    PRIMARY KEY (id)
)ENGINE=INNODB;

ALTER TABLE usergroup add
	id_pool varchar(64) NOT NULL default '';
	
ALTER TABLE tariffs add
	id_pool varchar(64) NOT NULL default '';	