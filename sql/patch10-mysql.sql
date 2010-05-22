# Paymentsgroup

CREATE TABLE paymentgroup (
	id int not null auto_increment,
	name varchar(64),
	description varchar(255),
	PRIMARY KEY id (id)
) ENGINE=INNODB;	

CREATE TABLE paymentuser (
	id int not null auto_increment,
	id_admin int,
	id_paymentgroup int,
	PRIMARY KEY id (id),
	KEY id_admin (id_admin),
	KEY id_paymentgroup (id_paymentgroup)
) ENGINE=INNODB;	

ALTER TABLE payments ADD id_paymentgroup int not null default 0;
	