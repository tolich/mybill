#
# 10.06.2008
# freeradius2
# Create database 
#

DROP DATABASE brbill;
CREATE DATABASE brbill;

# Connect to 'brbill'
CONNECT brbill;

# Table structure for table 'radacct'
#

CREATE TABLE radacct (
  radacctid bigint(21) NOT NULL auto_increment,
  acctsessionid varchar(32) NOT NULL default '',
  acctuniqueid varchar(32) NOT NULL default '',
  username varchar(64) NOT NULL default '',
  groupname varchar(64) NOT NULL default '',
  realm varchar(64) default '',
  nasipaddress varchar(15) NOT NULL default '',
  nasportid varchar(15) default NULL,
  nasporttype varchar(32) default NULL,
  acctstarttime datetime NULL default NULL,
  acctstoptime datetime NULL default NULL,
  acctsessiontime int(12) default NULL,
  acctauthentic varchar(32) default NULL,
  connectinfo_start varchar(50) default NULL,
  connectinfo_stop varchar(50) default NULL,
  acctinputoctets bigint(20) default NULL,
  acctoutputoctets bigint(20) default NULL,
  calledstationid varchar(50) NOT NULL default '',
  callingstationid varchar(50) NOT NULL default '',
  acctterminatecause varchar(32) NOT NULL default '',
  servicetype varchar(32) default NULL,
  framedprotocol varchar(32) default NULL,
  framedipaddress varchar(15) NOT NULL default '',
  acctstartdelay int(12) default NULL,
  acctstopdelay int(12) default NULL,
  xascendsessionsvrkey varchar(10) default NULL,
  PRIMARY KEY  (radacctid),
  KEY username (username),
  KEY framedipaddress (framedipaddress),
  KEY acctsessionid (acctsessionid),
  KEY acctsessiontime (acctsessiontime),
  KEY acctuniqueid (acctuniqueid),
  KEY acctstarttime (acctstarttime),
  KEY acctstoptime (acctstoptime),
  KEY nasipaddress (nasipaddress)
) ENGINE=INNODB;

#
# Table structure for table 'radcheck'
#

CREATE TABLE radcheck (
  id int(11) unsigned NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  attribute varchar(32)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '==',
  value varchar(253) NOT NULL default '',
  PRIMARY KEY  (id),
  KEY username (username(32))
) ENGINE=INNODB;

#
# Table structure for table 'radgroupcheck'
#

CREATE TABLE radgroupcheck (
  id int(11) unsigned NOT NULL auto_increment,
  groupname varchar(64) NOT NULL default '',
  attribute varchar(32)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '==',
  value varchar(253)  NOT NULL default '',
  PRIMARY KEY  (id),
  KEY groupname (groupname(32))
) ENGINE=INNODB;

#
# Table structure for table 'radgroupreply'
#

CREATE TABLE radgroupreply (
  id int(11) unsigned NOT NULL auto_increment,
  groupname varchar(64) NOT NULL default '',
  attribute varchar(32)  NOT NULL default '',
  op char(2) NOT NULL DEFAULT '=',
  value varchar(253)  NOT NULL default '',
  PRIMARY KEY  (id),
  KEY groupname (groupname(32))
) ENGINE=INNODB;

#
# Table structure for table 'radreply'
#

CREATE TABLE radreply (
  id int(11) unsigned NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  attribute varchar(32) NOT NULL default '',
  op char(2) NOT NULL DEFAULT '=',
  value varchar(253) NOT NULL default '',
  PRIMARY KEY  (id),
  KEY username (username(32))
) ENGINE=INNODB;


#
# Table structure for table 'usergroup'
#

CREATE TABLE radusergroup (
  id int(11) unsigned NOT NULL auto_increment,
  code varchar(10) NOT NULL default '',
  username varchar(64) NOT NULL default '',
  groupname varchar(64) NOT NULL default 'user',
  priority int(11) NOT NULL default '1',
  id_tariff int(11) NOT NULL default '0',
  deposit decimal(15,2) NOT NULL default '0.00',
  freebyte decimal(15,3) NOT NULL default '0.000',
  mindeposit decimal(15,2) NOT NULL default '0.00',
  dateofcheck int(2) NOT NULL default '0',	
  wwwpassword  varchar(64) NOT NULL default '', 
  email varchar(64) NOT NULL default '',
  name varchar(64) NOT NULL default '',
  surname varchar(255) NOT NULL default '',
  detail varchar(255) NOT NULL default '',
  ip varchar(15) NOT NULL default '',
  mac varchar(64) NOT NULL default '',
  access int(1) NOT NULL default '1',
  acctype int(1) NOT NULL default '1', #0-radius,1-ng_ipacct
  error decimal(15,2) NOT NULL default '1.00',
  freemblimit decimal(15,3) NOT NULL default '0.000',
  bonus decimal(15,3) NOT NULL default '0.000',
  laststatsupdate timestamp NOT NULL,
  address varchar(255) NOT NULL default '',
  password varchar(64) NOT NULL default '',
  in_pipe int(11) NOT NULL default '0',
  out_pipe int(11) NOT NULL default '0',
  out_ip varchar(15) NOT NULL default '0.0.0.0',
  in_ip varchar(15) NOT NULL default '0.0.0.0',
  id_sluice int(11) NOT NULL default '0',
  session_timeout int NOT NULL default '86400',
  idle_timeout varchar(64) NOT NULL default '0',
  check_calling int NOT NULL default '0',
  pipe_method int NOT NULL default '0',
  PRIMARY KEY  (id),
  KEY username (username(32))
) ENGINE=INNODB;

#
# Table structure for table 'snapshot_user
#
CREATE TABLE snapshot_user (
  id int(11) unsigned NOT NULL auto_increment,
  date timestamp NOT NULL,
  id_user int(11) NOT NULL default '0',
  username varchar(64) NOT NULL default '',
  groupname varchar(64) NOT NULL default '',
  id_tariff int(11) NOT NULL default '0',
  deposit decimal(15,2) NOT NULL default '0.00',
  freeByte bigint NOT NULL default '0',
  mindeposit decimal(15,2) NOT NULL default '0.00',
  dateofcheck int(2) NOT NULL default '10',	
  wwwpassword  varchar(64) NOT NULL default '', 
  email varchar(64) NOT NULL default '',
  name varchar(64) NOT NULL default '',
  surname varchar(255) NOT NULL default '',
  detail varchar(255) NOT NULL default '',
  ip varchar(15) NOT NULL default '',
  mac varchar(64) NOT NULL default '',
  access int(1) NOT NULL default '1',
  acctype int(1) NOT NULL default '1', #0-radius,1-ng_ipacct
  error decimal(15,2) NOT NULL default '1.00',
  freemblimit int(11) NOT NULL default '0',
  laststatsupdate timestamp NOT NULL,
  PRIMARY KEY  (id)
) ENGINE=INNODB;


#
# Table structure for table 'usersettings'
#

#CREATE TABLE usersettings (
#  id int(11) unsigned NOT NULL auto_increment,
#  id_user int(11) unsigned NOT NULL default '0',
#  username varchar(64) NOT NULL default '',
#  filter_ip_address varchar(15) NOT NULL default '',
#  filter_mac_address varchar(256) NOT NULL default '',
#  filtered int(11) NOT NULL default '0',
#  framed_ip_address varchar(15) NOT NULL default '',
#  in_pipe int(11) NOT NULL default '0',
#  out_pipe int(11) NOT NULL default '0',
#  session_timeout int(11) NOT NULL default '86400',
#  idle_timeout int(11) NOT NULL default '0',
#  user_password varchar(64) NOT NULL default '',
#  PRIMARY KEY  (id),
#  UNIQUE KEY id_user (id_user),
#  FOREIGN KEY id_user (id_user) references usergroup (id) on delete restrict
#)ENGINE=INNODB;

#
# Table structure for table 'radpostauth'
#

CREATE TABLE radpostauth (
  id int(11) NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  pass varchar(64) NOT NULL default '',
  reply varchar(32) NOT NULL default '',
  authdate timestamp(14) NOT NULL,
  PRIMARY KEY  (id)
) ENGINE=INNODB;


#
# My tables
#
# Table structure for table 'tariffs'
#
CREATE TABLE tariffs (
  id int(11) NOT NULL auto_increment,
  tariffname varchar(128) NOT NULL default 'New tariff', 
  monthlyfee decimal(15,2) NOT NULL default '0.00',
  freebyte bigint NOT NULL default '0',
  bonus int(11) NOT NULL default '0',
  del int(11) NOT NULL default 0,
  PRIMARY KEY (id),
  KEY (tariffname)
)ENGINE=INNODB;


# Table structure for table 'zones'
#
CREATE TABLE zones (
  id int(11) NOT NULL auto_increment,
  zonename varchar(128) NOT NULL default 'New zone',
  src varchar(255) NOT NULL default '',
#  ip varchar(15) NOT NULL default '0.0.0.0',
#  mask int(2) NOT NULL default '1',
#  port varchar(255) NOT NULL default '0',
#  proto varchar(4) NOT NULL default 'all', #all, tcp, udp, icmp 
  del varchar(3) NOT NULL default 'No',
  PRIMARY KEY (id),
  KEY (zonename)
)ENGINE=INNODB;
  
# Table structure for table 'intariffs'
#
CREATE TABLE intariffs (
  id int(11) NOT NULL auto_increment,
  idtariff int(11) NOT NULL,
  idzone int(11) NOT NULL,
  days varchar(7) NOT NULL default '0123456', #0-Sunday...6-Saturday
  timestart time NOT NULL default '000000',
  timestop time NOT NULL default '000000',
  pricein decimal(15,2) NOT NULL default '0.00',
  priceout decimal(15,2) NOT NULL default '0.00',
  flag varchar(5) NOT NULL default '0', #in or other freeByte
  PRIMARY KEY (id)
)ENGINE=INNODB;

# Table structure for table 'payments' 
#
CREATE TABLE payments (
  id int(11) NOT NULL auto_increment,
  iduser int(11) NOT NULL,
  datepayment timestamp NOT NULL,
  amount decimal(15,2) NOT NULL default '0.00',
  amountdeposit decimal(15,2) NOT NULL default '0.00',
  amountfreebyte decimal (15,3) NOT NULL default '0.000',
  rate decimal(10,2) NOT NULL default '0.00',
  lastdeposit decimal(15,2) NOT NULL default '0.00',
  lastfreebyte decimal(15,3) NOT NULL default '0.000',
  description varchar(200) NOT NULL default '',
  status int(11) NOT NULL default '0',
  amountbonus decimal(15,3) NOT NULL default '0.000',
  lastbonus decimal(15,3) NOT NULL default '0.000',
  PRIMARY KEY (id)
)ENGINE=INNODB;


# Table structure for table 'currency'
#
CREATE TABLE currency (
  id int(11) NOT NULL auto_increment,
  name varchar(25) NOT NULL default '',    
  rate decimal(15,2) NOT NULL default '0.00',
  PRIMARY KEY (id)
)ENGINE=INNODB;

# Table structure for table 'tasks'
#
CREATE TABLE tasks (
    id int(11) NOT NULL AUTO_INCREMENT,
    username varchar(64) NOT NULL default '',
    attribute varchar(64) NOT NULL default '',
    value int NOT NULL default '0',
    opdate datetime default '0000-00-00 00:00:00',
    execdate datetime default '0000-00-00 00:00:00',
    execresult varchar(32) NOT NULL default '',
    PRIMARY KEY (id)
)ENGINE=INNODB;



# Table structure for table 'sluice'
#
CREATE TABLE sluice (
    id int(11) NOT NULL AUTO_INCREMENT,
    sluicename varchar(64) NOT NULL default '',
    is_default int(1) NOT NULL default '0',
    sluiceval varchar(15) NOT NULL default '',
    PRIMARY KEY (id)
)ENGINE=INNODB;

# Add default admin
#
INSERT INTO radusergroup (username, groupname, wwwpassword)
    VALUES ('admin','admin','admin');
