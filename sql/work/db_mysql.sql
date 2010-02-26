#
# 10.06.2008
# freeradius
# Create database 
#

DROP DATABASE IF EXISTS mybill;
CREATE DATABASE mybill;

# Connect to 'mybill'
CONNECT mybill;

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
  PRIMARY KEY  (radacctzoneid),
  KEY username (username),
  KEY acctsessionid (acctsessionid),
  KEY acctuniqueid (acctuniqueid),
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

CREATE TABLE usergroup (
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
  mac varchar(255) NOT NULL default '',
  maxlogin int NOT NULL default '1',
  access int(1) NOT NULL default '1',
  acctype int(1) NOT NULL default '1', 
  error decimal(15,2) NOT NULL default '1.00',
  freemblimit decimal(15,3) NOT NULL default '0.000',
  check_mb int NOT NULL default '1',      
  bonus decimal(15,3) NOT NULL default '0.000',
  activatedate datetime,
  laststatsupdate timestamp NOT NULL,
  address varchar(255) NOT NULL default '',
  password varchar(64) NOT NULL default '',
  newpassword varchar(64) NOT NULL default '',
  in_pipe int(11) NOT NULL default '0',
  out_pipe int(11) NOT NULL default '0',
  out_ip varchar(15) NOT NULL default '0.0.0.0',
  in_ip varchar(15) NOT NULL default '0.0.0.0',
  id_pool varchar(64) NOT NULL default '',
  id_sluice int(11) NOT NULL default '0',
  session_timeout int NOT NULL default '86400',
  idle_timeout varchar(64) NOT NULL default '0',
  check_calling int NOT NULL default '0',
  pipe_method int NOT NULL default '0',
  newuser int NOT NULL default '0',
  role varchar(64) NOT NULL default 'user',
  PRIMARY KEY  (id),
  KEY username (username(32)),
  KEY groupname (groupname(32)),
  KEY password (password(32)),
  KEY surname (surname(32)),
  KEY name (name(32)),
  KEY address (address(32)),
  KEY in_ip (in_ip),
  KEY mac (mac)
) ENGINE=INNODB;

#
# Table structure for table 'snapshot_user'
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
  user varchar(64) NOT NULL default '',
  pass varchar(64) NOT NULL default '',
  reply varchar(32) NOT NULL default '',
  date timestamp(14) NOT NULL,
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
  dailyfee decimal(15,2) NOT NULL default '0.00',
  freebyte bigint NOT NULL default '0',
  bonus int(11) NOT NULL default '0',
  mindeposit decimal(15,2) NOT NULL default '0.00',
  freemblimit decimal(15,3) NOT NULL default '0.000',
  pricein decimal(15,2) NOT NULL default '0.00',
  priceout decimal(15,2) NOT NULL default '0.00',
  in_pipe int(11) NOT NULL default '0',
  out_pipe int(11) NOT NULL default '0',
  dateofcheck int(2) NOT NULL default '0',	
  check_mb int NOT NULL default '1',      
  flag int NOT NULL default '1',
  weightmb decimal(4,3) NOT NULL default '1',
  id_sluice int(11) NOT NULL default '0',
  id_pool varchar(64) NOT NULL default '',
  del int(11) NOT NULL default 0,
  PRIMARY KEY (id),
  KEY (tariffname)
)ENGINE=INNODB;


# Table structure for table 'zones'
#
CREATE TABLE zones (
  id int(11) NOT NULL auto_increment,
  zonename varchar(64) NOT NULL default 'New zone',
  src varchar(253) NOT NULL default '',
  prio int(11) NOT NULL default 0,
  del int(1) NOT NULL default 0,
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
  weightmb decimal(4,3) NOT NULL default '1',
  in_pipe int(11) NOT NULL default '0',
  out_pipe int(11) NOT NULL default '0',
  flag varchar(5) NOT NULL default '0', #in or other freeByte
  PRIMARY KEY (id),
  KEY (idtariff),
  KEY (idzone)
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
  PRIMARY KEY (id),
  KEY (iduser),
  KEY (datepayment)
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
    id_period int(11) NOT NULL default '1',
    PRIMARY KEY (id),
    KEY (username),
    KEY (attribute),
    KEY (value)
)ENGINE=INNODB;

#Table structure for table periods
#
CREATE TABLE periods(
  id int(11) NOT NULL,
  periodname varchar(128) NOT NULL default 'New period',
  PRIMARY KEY (id)
)ENGINE=INNODB;

INSERT INTO periods (id, periodname)
    VALUES (1, '������');

INSERT INTO periods (id, periodname)
    VALUES (2, '���������');

INSERT INTO periods (id, periodname)
    VALUES (3, '����������');


# Table structure for table 'sluice'
#
CREATE TABLE sluice (
    id int(11) NOT NULL AUTO_INCREMENT,
    sluicename varchar(64) NOT NULL default '',
    is_default int(1) NOT NULL default '0',
    sluiceval varchar(15) NOT NULL default '',
    PRIMARY KEY (id)
)ENGINE=INNODB;

# Table structure for table 'pool'
#
CREATE TABLE pools (
    id int(11) NOT NULL AUTO_INCREMENT,
    poolname varchar(64) NOT NULL default '',
    poolval varchar(64) NOT NULL default '',
    PRIMARY KEY (id)
)ENGINE=INNODB;

# Table structure for table 'flags'
#
CREATE TABLE flags (
  id int NOT NULL,
  flagname varchar(128) NOT NULL default 'New flag',
  PRIMARY KEY (id),
  KEY (flagname)
)ENGINE=INNODB;

INSERT INTO flags (id, flagname)
    VALUES (1, '� �������� ����� ��� ��');

INSERT INTO flags (id, flagname)
    VALUES (2, '������ � ��������');

#
# Table structure for table "taskattribute"
#
CREATE TABLE taskattribute (
  id int(11) unsigned NOT NULL auto_increment,
  attrname varchar(64) NOT NULL default '',
  description varchar(253) NOT NULL default '',
  prio int NOT NULL default 0,
  PRIMARY KEY  (id),
  KEY attrname (attrname(64))
) ENGINE=INNODB;

INSERT INTO taskattribute (attrname, description, prio) values ('Monthly-fee', '��������� �� �����', 4);
INSERT INTO taskattribute (attrname, description, prio) values ('Daily-fee', '��������� �� ����', 3);
INSERT INTO taskattribute (attrname, description, prio) values ('Subscribe', 'E-Mail ��������', 5);
INSERT INTO taskattribute (attrname, description, prio) values ('Change-tariff', '����� ������', 2);
INSERT INTO taskattribute (attrname, description, prio) values ('Activate', '��������', 1);
INSERT INTO taskattribute (attrname, description, prio) values ('Deactivate', '��������', 1);

#
# Table structure for table "usersettings"
#
CREATE TABLE usersettings (
  id_user int(11) NOT NULL default 0,
  var varchar(64) NOT NULL default '',
  value text NOT NULL default '',
  description varchar(253) NOT NULL default ''
) ENGINE=INNODB;

#
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
  PRIMARY KEY  (acctuniqueid),
  KEY acctsessionid (acctsessionid(32)),
  KEY callingstationid (callingstationid(32)),
  KEY nasipaddress (nasipaddress(32)),
  KEY iface (iface),
  KEY framedipaddress (framedipaddress),
  KEY username (username(32))
) ENGINE=INNODB;

CREATE TABLE admin (
  id int(11) unsigned NOT NULL auto_increment,
  username varchar(64) NOT NULL default '',
  password varchar(64) NOT NULL default '',
  lastlogin datetime,
  role varchar(64) NOT NULL default 'guest',
  PRIMARY KEY  (id),
  KEY username (username(32)),
  KEY password (password(32))
) ENGINE=INNODB;
  
# Add default admin
#
INSERT INTO admin (username,password,role)
    VALUES ('admin','admin','administrator');  

#    
# Table structure for table 'nas'
#
CREATE TABLE nas (
  id int(10) NOT NULL auto_increment,
  nasname varchar(128) NOT NULL,
  shortname varchar(32),
  nastype varchar(30) DEFAULT 'other',
  ports int(5),
  secret varchar(60) DEFAULT 'secret' NOT NULL,
  community varchar(50),
  username varchar(64) NOT NULL default '',
  password varchar(64) NOT NULL default '',
  description varchar(200) DEFAULT 'RADIUS Client',
  PRIMARY KEY (id),
  KEY nasname (nasname)
);

