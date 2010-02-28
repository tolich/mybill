<?php
	require_once '../configs/config.php';
    $aDBParams = Zend_Registry::get('db_params');
    $db = Db::factory();
	Zend_Registry::set('db', $db);
    $acl = new Acl();
    Zend_Registry::set('acl', $acl);
	$oIO = new IO();
	$oIO->defsettings();
?>