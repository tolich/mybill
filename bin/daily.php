#!/usr/local/bin/php
<?php
	require_once realpath(dirname(__FILE__).'/../configs/config.php');
	$db = Zend_Db::factory(DB_DRIVER, $aDBParams);
	Zend_Registry::set('db', $db);
	$oCron = new Cron();
	$oCron->daily();
?>	