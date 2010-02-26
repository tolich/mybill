<?php
/**
 * Класс реализует автозагрузку файлов описания классов.
 */

	include 'Zend/Loader.php';
	require_once DOCUMENT_ROOT . 'application/kernel/Utils.php';
	
	foreach (glob(DOCUMENT_ROOT.'application/*') as $dir) {
		Utils::AppendToIncludePath($dir);
	}
	foreach (glob(DOCUMENT_ROOT.'application/ajax/*') as $dir) {
		Utils::AppendToIncludePath($dir);
	}
	foreach (glob(DOCUMENT_ROOT.'application/modules/*') as $dir) {
		Utils::AppendToIncludePath($dir);
	}

	function __autoload($name) 
	{
	    $zend ='zend_';	
		if (substr(strtolower($name), 0, strlen($zend)) == $zend)
			Zend_Loader::loadClass($name);
		else
	        if (Zend_Loader::isReadable($name.'.php'))
	        	require_once ($name.'.php');
	}

?>
