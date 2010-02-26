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

INSERT INTO taskattribute (attrname, description, prio) values ('Monthly-fee', 'Абонплата за месяц', 4);
INSERT INTO taskattribute (attrname, description, prio) values ('Daily-fee', 'Абонплата за день', 3);
INSERT INTO taskattribute (attrname, description, prio) values ('Subscribe', 'E-Mail рассылка', 5);
INSERT INTO taskattribute (attrname, description, prio) values ('Change-tariff', 'Смена тарифа', 2);
INSERT INTO taskattribute (attrname, description, prio) values ('Activate', 'Включить', 1);
INSERT INTO taskattribute (attrname, description, prio) values ('Deactivate', 'Включить', 1);

