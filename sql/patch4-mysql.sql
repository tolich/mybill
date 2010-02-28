#
#Поле для перерасчета доплаченных мегабайт
#Когда пакетные сохраняются а бонусные нет
#
ALTER TABLE usergroup ADD COLUMN paybyte decimal(15,3) NOT NULL default '0.000';
ALTER TABLE payments ADD COLUMN amountpaybyte decimal (15,3) NOT NULL default '0.000';
