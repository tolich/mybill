#!/usr/local/bin/php
<?php
	require_once realpath(dirname(__FILE__).'/../configs/config.php');
    $db = Db::factory();
	Zend_Registry::set('db', $db);
	$oCron = new Cron();
	$oCron->daily();