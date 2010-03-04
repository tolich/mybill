<?php
	error_reporting(E_ALL|E_STRICT);

	/**
	 * Версия
	 */
	define('VERSION',				    '0.2.0');
	
    /**
     * Список подключаемых плагинов
     */ 
	$_PLUGINS = array('AclPlugin');
	
	$_PROTO = (@$_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://'); 

	/**
	 * Режим отладки extjs
	 */
	define('DEBUG_MODE',				true);
	
	/**
	 * Сортировка в php грида пользователей
	 */
	define('PHP_SORT', 					false);
	
	/**
	 *  Типы настроек
	 */
	define('SETTINGS_BILLING', 				0);
	define('SETTINGS_COMPANY', 				1);
	define('SETTINGS_MAIN', 				2);
	
	/**
	 * Отображение списка зон в столбец в textarea
	 */
	define('ZONE_LIST_COLUMN', 			true);
	
	/**
	 * Настройки локали
	 */
	define('PROJECT_LOCALE',      		'ru_RU');
	define('PROJECT_LOCALE_PATH', 		'ru');
	define('PROJECT_LOCALE_NAME', 		'Русский');
	define('PROJECT_LOCALE_CODEPAGE',	'utf-8');
	define('PROJECT_DATABASE_CHARSET',	'cp1251');
	
	setlocale(LC_ALL, PROJECT_LOCALE);

	/**
	 * Пути 
	 */
	define('DOCUMENT_ROOT',				realpath(dirname(__FILE__).'/..').'/');
	define('MODULES_DIR', 				DOCUMENT_ROOT.'application/modules/');
	define('LOGS_DIR', 					DOCUMENT_ROOT.'logs/');
	define('TMP_DIR', 					DOCUMENT_ROOT.'tmp/');
	define('WSDL_DIR', 					DOCUMENT_ROOT.'soap/');

	set_include_path(
        implode(PATH_SEPARATOR, 
            array(
                '.',
                DOCUMENT_ROOT.'./library',
                DOCUMENT_ROOT.'./application/',
                get_include_path()
            )
        )
    );
	
	require_once DOCUMENT_ROOT . 'configs/autoloader.php';
	require_once DOCUMENT_ROOT . 'configs/localconfig.php';
