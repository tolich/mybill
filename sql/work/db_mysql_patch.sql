CONNECT brbill;
#
# Table structure for table 'usergroup'
#

ALTER TABLE usergroup add
  address varchar(255) NOT NULL default '';
ALTER TABLE usergroup add
  password varchar(64) NOT NULL default '';
ALTER TABLE usergroup add
  in_pipe int NOT NULL default 0;
ALTER TABLE usergroup add
  out_pipe int NOT NULL default 0;
ALTER TABLE usergroup add
  out_ip varchar(15) NOT NULL default '0.0.0.0';
ALTER TABLE usergroup change IP
  in_ip varchar(15) NOT NULL default '0.0.0.0';
ALTER TABLE usergroup modify groupname
  varchar(64) NOT NULL default 'user';
ALTER TABLE usergroup change sluice
  id_sluice int NOT NULL default 0;
ALTER TABLE usergroup add
  session_timeout int NOT NULL default '86400';
ALTER TABLE usergroup add
  idle_timeout varchar(64) NOT NULL default '0';
ALTER TABLE usergroup add
  check_calling int NOT NULL default 0;
ALTER TABLE usergroup add
  pipe_method int NOT NULL default 0;
ALTER TABLE usergroup add
  maxlogin int NOT NULL default '1';

#
# Table structure for table 'usersettings'
#

DROP TABLE usersettings;

#
# Table structure for table 'payments'
#
ALTER TABLE payments add
	amountbonus decimal(15,3) NOT NULL default '0.000';
ALTER TABLE payments add
	lastbonus decimal(15,3) NOT NULL default '0.000';
ALTER TABLE payments modify datepayment 
	timestamp NOT NULL;
ALTER TABLE payments modify amountfreebyte 
	decimal(15,3) NOT NULL default '0.000';
ALTER TABLE payments modify lastfreebyte 
	decimal(15,3) NOT NULL default '0.000';

# Table structure for table 'sluice'
#
ALTER TABLE sluice add
  sluiceip varchar(18) NOT NULL default '0.0.0.0';

# Add default sluice
#
INSERT INTO sluice (sluicename, sluiceip)
    VALUES ('default','0.0.0.0');  