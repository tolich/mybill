#!/usr/local/bin/php
<?php
	require_once realpath(dirname(__FILE__).'/../configs/config.php');
    $db = Db::factory('import');
	Zend_Registry::set('db', $db);
	$oIO = new IO();
	$oIO->backup();