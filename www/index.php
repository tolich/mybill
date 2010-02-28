<?php
	require_once '../configs/config.php';

    $db = Db::factory();
	Zend_Registry::set('db', $db);

    $acl = new Acl();
    Zend_Registry::set('acl', $acl);
    
	$frontController = Zend_Controller_Front::getInstance()
					-> setParam('useModules', true)
					-> throwExceptions(DEBUG_MODE)
					-> setControllerDirectory(array(
							'default'	=>DOCUMENT_ROOT.'application/controllers',
							'ajax'		=>DOCUMENT_ROOT.'application/ajax/controllers'));

	foreach($_PLUGINS as $plugin)
	{
		$frontController->registerPlugin(new $plugin);
	}
	$frontController->dispatch();
