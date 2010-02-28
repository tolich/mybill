<?php
	require_once '../configs/config.php';
    $db = Db::factory('import');
	Zend_Registry::set('db', $db);
	$oIO = new IO();
	$oIO->import();
?>