#
#Изменение структуры таблицы Tafiffs
#для смены тарифа
#

ALTER TABLE tariffs add
  in_pipe int(11) NOT NULL default '0';
ALTER TABLE tariffs add
  out_pipe int(11) NOT NULL default '0';
ALTER TABLE tariffs add
  dateofcheck int(2) NOT NULL default '0';	
ALTER TABLE tariffs add
  check_mb int NOT NULL default '1';      
ALTER TABLE tariffs add
  id_sluice int(11) NOT NULL default '0';
ALTER TABLE tariffs add
  mindeposit decimal(15,2) NOT NULL default '0.00';
ALTER TABLE tariffs add
  freemblimit decimal(15,3) NOT NULL default '0.000';
  