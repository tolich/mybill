#
#���������� ������� flags
#�������� �������� ���� flag ������� intariffs
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
