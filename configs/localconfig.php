<?php
/**
 * Локальная конфигурация.
 */

// База данных

// Параметры соединения с БД (MySQL)
define('DB_DRIVER', 'PDO_MYSQL');
define('_DBNAME',   'mybill');
define('_DBUSER',   'svsadmin');
define('_DBPASS',   'statflvby');
define('_DBHOST',   '192.168.168.200');

// Массив параметров для создания объекта Zend_DB
global $aDBParams;
$aDBParams = array (
	'dbname'   => _DBNAME,
	'username' => _DBUSER,
	'password' => _DBPASS, 
	'host'     => _DBHOST,
	'driver_options' => array(
		PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_DATABASE_CHARSET
	)
);

// Часовой пояс
date_default_timezone_set('Europe/Kiev');

?>