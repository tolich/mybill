#
#Изменение таблицы Zones
#
ALTER TABLE zones MODIFY del int(1) NOT NULL default 0;
ALTER TABLE zones ADD prio int(11) NOT NULL default 0;