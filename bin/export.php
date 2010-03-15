<?php
	require_once '../configs/config.php';
    $db = Db::factory('export');
	Zend_Registry::set('db', $db);
	$oIO = new IO();
	$oIO->export();