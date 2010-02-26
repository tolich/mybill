#
# Table structure for table 'role'
#
DROP TABLE IF EXISTS role;
CREATE TABLE role(
  id int(11) NOT NULL auto_increment,
  role varchar(32) NOT NULL default '',
  rolename varchar(255)  NOT NULL default '',
  rights text NOT NULL default '',
  PRIMARY KEY (id),
  KEY role (role)
)ENGINE=INNODB;

# Add default role
#
INSERT INTO role (id,role,rolename) VALUES (1,'guest','Гость');  
INSERT INTO role (id,role,rolename) VALUES (2,'user','Пользователь');  
INSERT INTO role (id,role,rolename) VALUES (3,'staff','Сотрудник');  
INSERT INTO role (id,role,rolename) VALUES (4,'cashier','Кассир');  
INSERT INTO role (id,role,rolename) VALUES (5,'manager','Менеджер');  
INSERT INTO role (id,role,rolename) VALUES (6,'director','Директор');  
INSERT INTO role (id,role,rolename) VALUES (7,'administrator','Администратор');  

#
# Table structure for table 'roleparent'
#
DROP TABLE IF EXISTS roleparent;
CREATE TABLE roleparent(
  id_role int(11),
  id_parent int(11),
  KEY role(id_role,id_parent)
)ENGINE=INNODB;

INSERT INTO roleparent (id_role,id_parent) VALUES (2,1);  
INSERT INTO roleparent (id_role,id_parent) VALUES (3,1);  
INSERT INTO roleparent (id_role,id_parent) VALUES (4,3);  
INSERT INTO roleparent (id_role,id_parent) VALUES (5,3);  
INSERT INTO roleparent (id_role,id_parent) VALUES (6,3);  

#
# Table structure for table 'resource'
#
DROP TABLE IF EXISTS resource;
CREATE TABLE resource(
  id int(11) NOT NULL auto_increment,
  resource varchar(32) NOT NULL default '',
   resourcename varchar(255)  NOT NULL default '',
  PRIMARY KEY (id),
  KEY resource (resource)
)ENGINE=INNODB;

# Add default resource
#
INSERT INTO resource (resource,resourcename) VALUES ('auth','Авторизация');  
INSERT INTO resource (resource,resourcename) VALUES ('admin','Администрирование');  
INSERT INTO resource (resource,resourcename) VALUES ('nas','Сервера доступа');  
INSERT INTO resource (resource,resourcename) VALUES ('payments','Платежи');  
INSERT INTO resource (resource,resourcename) VALUES ('pools','Пулы ip адресов');  
INSERT INTO resource (resource,resourcename) VALUES ('reports','Отчеты');  
INSERT INTO resource (resource,resourcename) VALUES ('redirect','Перенаправление на страницу приветствия');  
INSERT INTO resource (resource,resourcename) VALUES ('sessions','Активные сессии');  
INSERT INTO resource (resource,resourcename) VALUES ('sluices','Шлюзы');  
INSERT INTO resource (resource,resourcename) VALUES ('stat','Статистика');  
INSERT INTO resource (resource,resourcename) VALUES ('tariffs','Тарифы');  
INSERT INTO resource (resource,resourcename) VALUES ('tasks','Планировщик');  
INSERT INTO resource (resource,resourcename) VALUES ('users','Пользователи');  
INSERT INTO resource (resource,resourcename) VALUES ('zones','Зоны');  

#
# Table structure for table 'resourceparent'
#
DROP TABLE IF EXISTS resourceparent;
CREATE TABLE resourceparent(
  id_resource int(11),
  id_parent int(11),
  KEY resource(id_parent)
)ENGINE=INNODB;


#
# Table structure for table 'rightaction'
#
DROP TABLE IF EXISTS rightaction;
CREATE TABLE rightaction(
  id int(11) NOT NULL auto_increment,
  rights varchar(32) NOT NULL default '',
  controller varchar(32) NOT NULL default '',
  action varchar(32) NOT NULL default '',
  PRIMARY KEY id (id),
  KEY rights(rights),
  KEY controller (controller),
  KEY action (action)
)ENGINE=INNODB;

# Add default rightaction
#

INSERT INTO rightaction (rights, controller, action) VALUES ('view','admin','filter');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','admin','role');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','admin','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','auth','admin');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','auth','setsettings');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','auth','getsettings');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','nas','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','payments','monthgrid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','payments','dategrid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','payments','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','pools','filter');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','pools','list');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','pools','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','users','getbyid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','users','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','users','list');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','reports','stat');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','reports','payments');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','reports','tariff');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','sessions','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','sluices','filter');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','sluices','list');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','sluices','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tariffs','filter');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tariffs','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tariffs','intariff');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tariffs','list');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tariffs','tree');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tariffs','wintariff');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tariffs','winintariff');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tasks','tree');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tasks','grid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tasks','oldgrid');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','tasks','wintask');  
INSERT INTO rightaction (rights, controller, action) VALUES ('view','zone','grid');  

INSERT INTO rightaction (rights, controller, action) VALUES ('add','admin','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','nas','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','users','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','payments','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','pools','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','sluices','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','tariffs','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','tasks','add');  
INSERT INTO rightaction (rights, controller, action) VALUES ('add','zone','add');  

INSERT INTO rightaction (rights, controller, action) VALUES ('edit','admin','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','auth','setsettings');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','nas','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','users','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','users','checkmbon');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','users','checkmboff');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','users','newuseron');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','users','newuseroff');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','payments','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','pools','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','sluices','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','tariffs','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','tariffs','addzone');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','tariffs','editzone');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','tariffs','deletezone');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','tasks','edit');  
INSERT INTO rightaction (rights, controller, action) VALUES ('edit','zone','edit');  

INSERT INTO rightaction (rights, controller, action) VALUES ('delete','admin','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','auth','delsettings');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','nas','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','payments','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','pools','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','sessions','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','sluices','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','tariffs','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','tasks','delete');  
INSERT INTO rightaction (rights, controller, action) VALUES ('delete','zone','delete');  

INSERT INTO rightaction (rights, controller, action) VALUES ('submit','auth','index');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','auth','unlogin');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','users','debtsoff');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','users','daily');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','users','monthly');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','users','off');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','users','on');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','payments','apply');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','tariffs','apply');  
INSERT INTO rightaction (rights, controller, action) VALUES ('submit','sessions','close');  
