<?php
/**
 * Локальная конфигурация.
 */

// База данных

// Параметры соединения с БД (MySQL)
define('DB_DRIVER', 'PDO_MYSQL');

// Массив параметров для создания объекта Zend_DB
$aDBConfigs = array (
    'default'=>array(
    	'dbname'   => 'mybill',
    	'username' => 'svsadmin',
    	'password' => 'statflvby', 
    	'host'     => '192.168.168.200',
    	'driver_options' => array(
    		PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_DATABASE_CHARSET
    	)
    ),
	'import' => array (
		'dbname'   => 'mybill',
		'username' => 'root',
		'password' => '1q2w3e', 
		'host'     => '127.0.0.1',
		'driver_options' => array(
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_LOCALE_CODEPAGE
		)
	),
	'export' => array (
		'dbname'   => 'brbill',
		'username' => 'svs',
		'password' => 'svsstatdb', 
		'host'     => '192.168.168.2',
		'driver_options' => array(
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_LOCALE_CODEPAGE
		)
	),
    'log'=>array(
    	'dbname'   => 'mybill_log',
    	'username' => 'svsadmin',
    	'password' => 'statflvby', 
    	'host'     => '192.168.168.200',
    	'driver_options' => array(
    		PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_DATABASE_CHARSET
    	)
    ),
);
Zend_Registry::set('db_params', $aDBConfigs);

// Часовой пояс
date_default_timezone_set('Europe/Kiev');

?>