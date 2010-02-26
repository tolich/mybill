#
#Добавление таблицы periods
#Содержит периоды выполнения задач
CREATE TABLE periods(
  id int(11) NOT NULL,
  periodname varchar(128) NOT NULL default 'New period',
  PRIMARY KEY (id)
)ENGINE=INNODB;

INSERT INTO periods (id, periodname)
    VALUES (1, 'Разово');

INSERT INTO periods (id, periodname)
    VALUES (2, 'Ежедневно');

INSERT INTO periods (id, periodname)
    VALUES (3, 'Ежемесячно');

ALTER TABLE tasks add
  id_period int(11) NOT NULL default '1';

  