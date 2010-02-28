#
# Table structure for table 'replication'
#
CREATE TABLE replication(
  id int(11) NOT NULL auto_increment,
  datestart datetime default '0000-00-00 00:00:00',
  status int NOT NULL default 0, #0-new, 1-success, 2-failed, 3-undefined
  PRIMARY KEY id (id),
  KEY datestart (datestart),
  KEY status (status)
)ENGINE=INNODB;

ALTER TABLE usergroup ADD COLUMN id_1c int(11);
ALTER TABLE usergroup ADD COLUMN id_repl int(11);
ALTER TABLE usergroup ADD COLUMN repl_status int(11) NOT NULL default 2;
ALTER TABLE usergroup ADD COLUMN is_repl int(11) NOT NULL default 1;

ALTER TABLE payments ADD COLUMN id_acctperiod int(11);
ALTER TABLE payments ADD COLUMN id_repl int(11);
ALTER TABLE payments ADD COLUMN repl_status int(11) NOT NULL default 0;


#
#Table structure for table 'accruals'
#
CREATE TABLE accruals(
	id int(11) NOT NULL auto_increment,
	id_user int NOT NULL default 0,
	id_acctperiod int NOT NULL default 0,
	begin_deposit decimal(15,2) NOT NULL default '0.00',
	payment_amount decimal(15,2) NOT NULL default '0.00',
	end_deposit decimal(15,2) NOT NULL default '0.00',
	id_repl int(11),
	repl_status int(11) NOT NULL default 0,
  	description varchar(200) NOT NULL default '',
	PRIMARY KEY id (id),
	KEY id_user (id_user),
	KEY id_acctperiod (id_acctperiod)
) ENGINE=INNODB;
	