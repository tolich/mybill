<?php
	require_once '../configs/config.php';
	$aImpDBParams = array (
		'dbname'   => 'mybill',
		'username' => 'root',
		'password' => '1q2w3e', 
		'host'     => '127.0.0.1',
		'driver_options' => array(
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_LOCALE_CODEPAGE
		)
	);
	$db = Zend_Db::factory(DB_DRIVER, $aImpDBParams);
	Zend_Registry::set('db', $db);
	$oIO = new IO();
	$oIO->import();
?>