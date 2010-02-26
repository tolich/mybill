<?php
	require_once '../configs/config.php';
	$db = Zend_Db::factory(DB_DRIVER, $aDBParams);
	Zend_Registry::set('db', $db);
    $acl = new Acl();
    Zend_Registry::set('acl', $acl);
	$oIO = new IO();
	$oIO->defsettings();
?>