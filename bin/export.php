<?php
	require_once '../configs/config.php';
	$aExpDBParams = array (
		'dbname'   => 'brbill',
		'username' => 'svs',
		'password' => 'svsstatdb', 
		'host'     => '192.168.168.2',
		'driver_options' => array(
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_LOCALE_CODEPAGE
		)
	);
	$db = Zend_Db::factory(DB_DRIVER, $aExpDBParams);
	Zend_Registry::set('db', $db);
	$oIO = new IO();
	$oIO->export();
?>