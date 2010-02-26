#
# Скорость для каждой зоны в intariffs
#
 
ALTER TABLE intariffs add
  in_pipe int(11) NOT NULL default '0';
ALTER TABLE intariffs add
  out_pipe int(11) NOT NULL default '0';
ALTER TABLE intariffs add
  weightmb decimal(4,3) NOT NULL default '1';
ALTER TABLE intariffs add
  weightmb decimal(4,3) NOT NULL default '1';
  
ALTER TABLE tariffs add
  pricein decimal(15,2) NOT NULL default '0.00';
ALTER TABLE tariffs add
  priceout decimal(15,2) NOT NULL default '0.00';
ALTER TABLE tariffs add
  dailyfee decimal(15,2) NOT NULL default '0.00';
ALTER TABLE tariffs add
  weightmb decimal(4,3) NOT NULL default '1';
ALTER TABLE tariffs add
  flag int NOT NULL default '1';
  