<?php
/**
 * Локальная конфигурация.
 */

// Часовой пояс
date_default_timezone_set('Europe/Kiev');

// Персональная страница пользователя
$aBlock = array(
    'account'   => true,
    'personal'  => true,
    'tariff'    => true,
    'message'   => false 
);
Zend_Registry::set('info_block', $aBlock);

$aTitle = array(
// Первый блок стандартный. 
    array(
        'title' => 'Отчеты', 
        'items' => array(
            array(
                'text'    => 'Статистика подключений',
                'onclick' => 'Reports.showStat()',
                'tpl'    => '<a href="javascript:;" onclick="{onclick}">{text}</a>'
            ),
            array(
                'text'    => 'История платежей',
                'onclick' => 'Reports.showPayments()',
                'tpl'    => '<a href="javascript:;" onclick="{onclick}">{text}</a>'
            ),
            array(
                'text'    => 'История тарифов',
                'onclick' => 'Reports.showTariffs()',
                'tpl'    => '<a href="javascript:;" onclick="{onclick}">{text}</a>'
            )
        )
    ),
    array(
        'title' => 'Посетите', 
        'items' => array(
//            array(
//                'text'    => 'Наш сайт',
//                'href'    => 'http://svs-tv.lan',
//                'tpl'    => '<a href="{href}" target="blank">{text}</a>'
//            ),
            array(
                'text'    => 'Форум',
                'href'    => 'http://svs-tv.lan/forum',
                'tpl'    => '<a href="{href}" target="blank">{text}</a>'
            ),
            array(
                'text'    => 'Фотогалерея',
                'href'    => 'http://svs-tv.lan/foto',
                'tpl'    => '<a href="{href}" target="blank">{text}</a>'
            ),
        ),
    ),
    array(
        'title' => 'Поддержка',
        'items' => array(
            array(
                'text'    => 'Телефон абон.отдела',
                'tel'     => Settings::Company('tel'),
                'tpl'    => '{text} {tel}'
            ),
            array(
                'text'    => 'ICQ',
                'icq'     => Settings::Company('icq'),
                'tpl'    => '{text} {icq}'
            ),
        ),
        'title' => 'Сетевые ресурсы',
        'items' => array(
            array(
                'text'    => '\\\\\share.svs-tv.lan\share',
                'tpl'    => '{text}'
            ),
        )
    )
);
Zend_Registry::set('info_title', $aTitle);

// База данных
// Параметры соединения с БД (MySQL)
define('DB_DRIVER', 'PDO_MYSQL');

// Массив параметров для создания объекта Zend_DB
$aDBConfigs = array (
    'default'=>array(
    	'dbname'   => 'mybill',
    	'username' => 'svsadmin',
    	'password' => 'statflvby', 
    	'host'     => '192.168.168.200',
    	'driver_options' => array(
    		PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_DATABASE_CHARSET
    	)
    ),
	'import' => array (
		'dbname'   => 'mybill',
		'username' => 'root',
		'password' => '1q2w3e', 
		'host'     => '127.0.0.1',
		'driver_options' => array(
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_DATABASE_CHARSET
		)
	),
	'export' => array (
		'dbname'   => '',
		'username' => '',
		'password' => '', 
		'host'     => '',
		'driver_options' => array(
			PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_DATABASE_CHARSET
		)
	),
    'log'=>array(
    	'dbname'   => 'mybill_log',
    	'username' => 'svsadmin',
    	'password' => 'statflvby', 
    	'host'     => '192.168.168.200',
    	'driver_options' => array(
    		PDO::MYSQL_ATTR_INIT_COMMAND => "SET CHARSET ".PROJECT_DATABASE_CHARSET
    	)
    ),
);
Zend_Registry::set('db_params', $aDBConfigs);
