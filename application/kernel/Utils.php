<?php

/**
 * Вспомогательный класс с набором статичных методов, используется для
 * реализации наиболее общих функций и выноса их из глобальной области
 * видимости.
 */
class Utils
{
    /**
     * Добавляет новый путь к конфигурационной переменной include_path
     * @param string $path Путь
     * @param boolean $before (optional) Если true, то путь будет добавлен
     * перед всеми остальными, уже присутствующими в include_path
     */
    public static function AppendToIncludePath($path, $before = false) 
    {
        if (file_exists($path) and is_dir($path)) {
	        $incPath = '';
	        $delim = PATH_SEPARATOR;
	        $currIncPath = get_include_path();
	        
	        if (!empty($currIncPath)) {
	            $dpos = strpos($currIncPath, $delim);
	            if ($before and substr($currIncPath, 0, $dpos + 1) == '.' and substr($currIncPath, 0, $dpos + 1) != '..')
	                $currIncPath = substr($currIncPath, $dpos + 1);
	            if ($before)
	                $incPath = '.'.$delim.$path.$delim.$currIncPath;
	            else
	                $incPath = $currIncPath.$delim.$path;
	        } else {
	            $incPath = '.'.$delim.$path;
	        }
	        
	        @ini_set('include_path', $incPath);
        }
    }
    
    /** 
     * Очищает данные POST запроса, от ненужных полей.
     * Возвращает массив полей ключи которых, присутствуют
     * в значениях второго параметра
     * Если $expand=true расширяет данные запроса недостающими ключами
     */
	public static function ClearPostData(array $post, array $need, $expand=false, $expval='')
    {
		$post=array_intersect_key($post,array_fill_keys($need,null));
		if ($expand){
			$post=array_merge(array_fill_keys($need,$expval),$post);
		}
		return $post;
    }

//    /** 
//     * Очищает данные POST запроса, от ненужных полей.
//     * Возвращает массив полей ключи которых, присутствуют
//     * в значениях второго параметра
//     * @param array $post Массив POST запроса
//     * @param array $need Массив ключей, которые должны быть оставлены 
//     * в результирующем массиве
//     * Приводит к нижмему регистру
//     */
//    public static function ClearPostData(array $post, array $need)
//    {
//		foreach ($post as $k => $v) {
//		    if (!in_array($k, $need)) {
//		        unset($post[$k]);
//		        continue;
//		    }
//		}
//		return $post;
//    }
    
//    /**
//     * Генерирует из массива (ключи которого совпадают с именами полей в таблице)
//     * строку для вставки или обновления записи
//     * @param array $data Данные для вставки или обновления
//     * @param Zend_Db_Adapter_Abstract $db (optional) Объект соединения с БД, если передается,
//     * то для всех идентификаторов (т.е. имен полей) вызывается метод quoteIdentifier()
//     * @return string
//     */
//    public static function GenerateSQLPairs(array $data, Zend_Db_Adapter_Abstract $db = null) 
//    {
//        $result = '';
//        foreach ($data as $k => $v) {
//            if ($db) $k = $db->quoteIdentifier($k);
//            if ($v==null)
//            	$result .= $k.' = NULL, ';
//            else
//            {
//	            if ($db) $v = $db->quote($v);
//	            $result .= $k.' = '.$v.', ';
//            }
//        }
//        
//        if ($result) $result = substr($result, 0, -2);
//        return $result;
//    }
    
    /**
     * Выполняет массив запросов в транзакции
     * @param array $tsql Массив запросов
     * @param Zend_Db_Adapter_Abstract $db Объект соединения с БД
     * @return true
     */
//    public static function MultipleTransactQuery(array $tsql)
//    {
//    	$db = Zend_Registry::get('db');
//        $db->beginTransaction();
//		try {
//	        foreach ($tsql as $sql)
//	            $db->query($sql);
//		    $db->commit();
//	        return true;
//		} catch (Exception $e) {
//		    $db->rollBack();
//		    return $e->getMessage();
//		}
//    }

    /**
     * Возвращает относительный путь с локалью
     * @param array $params
     * Параметр type определяет способ формирования URI  
     * @return string
     */
//    public function URI($params=array())
//	{
//		$session=Zend_Registry::get('session');
//		empty($params['type']) ? $type=0 : $type=$params['type'];
//		switch ($type)
//		{
//			case 0: 
//				$path='/' . $session->locale;
//				break;
//			case 1: 
//				$path='';
//				break;
////		Вариант вывода в виде http(s)://<server_name>/<locale>
////			case 2:
////				global $_PROTO;
////				$path=$_PROTO . $_SERVER['SERVER_NAME'] . '/' . $session->locale;
////				break;
//				
//		}
//		return $path;
//	}
	
	/**
	 * Формирует строку для записи в лог
	 * @param string $msg Текст сообщения
	 * @param string $init 
	 */
//	public static function getErrMessage ($msg, $init='')
//	{
//		return date("l, j F Y, G:i:s") . "\t[$init]\n\t$msg";
//	}
	
	/**
	 * Преобразовывает символы строки из кодировки проекта в другую кодировку
	 * @param string $string
	 * @param string $out_charset
	 */
	public static function encode (&$string, $out_charset=null)
	{
		$in_charset=PROJECT_DATABASE_CHARSET;
		if ($out_charset===null) $out_charset='UTF-8';
		if (is_array($string)){
			array_walk($string, array('self', 'array_encode'));
		} else {
			$string = iconv($in_charset, $out_charset, $string);
		}
        return $string;
	}

	/**
	 * Преобразовывает символы строки из другой кодировки в кодировку проекта
	 * @param string $string
	 * @param string $in_charset
	 */
	public static function decode (&$string, $in_charset=null)
	{
		$out_charset=PROJECT_DATABASE_CHARSET;
		if ($in_charset===null) $in_charset='UTF-8';
		if (is_array($string)){
			array_walk($string, array('self', 'array_decode'));
		} else {
			$string = iconv($in_charset, $out_charset, $string);
		}
        return $string;
	}

	/**
	 * Преобразует HTML сущности в соответствующие символы в кодировке проекта
	 * @param string $string
	 * @param string $in_charset
	 */
	public static function html_decode ($string)
	{
		$charset=PROJECT_DATABASE_CHARSET;
		if (is_array($string)){
			array_walk($string, array('self', 'array_html_decode'));
		} else {
		    $string = html_entity_decode($string, ENT_COMPAT, $charset);
        }
		return $string;
	}
	
	/**
	 * Преобразовывает символы строки из кодировки проекта в другую кодировку
	 * оболочка для упрощенного вызова iconv совместно с array_...
	 * @param string $string
	 * @param mixed $key
	 * @param string $out_charset
	 */	
	public static function array_encode (&$item, $key, $out_charset=null)
	{
		if (is_string($item))
			self::encode($item, $out_charset);
		if (is_array($item))
			array_walk($item, array('self', 'array_encode'));
	}

	/**
	 * Преобразовывает символы строки из другой кодировки в кодировку проекта
	 * оболочка для упрощенного вызова iconv совместно с array_...
	 * @param string $string
	 * @param mixed $key
	 * @param string $out_charset
	 */	
	public static function array_decode (&$item, $key, $out_charset=null)
	{
		if (is_string($item))
			self::decode($item, $out_charset);
		if (is_array($item))
			array_walk($item, array('self', 'array_decode'));
	}

	/**
	 * Преобразует HTML сущности в соответствующие символы в кодировке проекта
	 * оболочка для упрощенного вызова html_entity_decode совместно с array_...
	 * @param string $string
	 * @param mixed $key
	 * @param string $in_charset
	 */	
	public static function array_html_decode (&$item, $key)
	{
		$item=self::html_decode($item);
	}
	
//	/**
//	 * Выводит строку с отладочной информацией в файл LOGS_DIR
//	 * Файл доступен для браузера  
//	 */
//	public static function Debug($rvalue)
//	{
// 		if ($handle = fopen(LOGS_DIR.'log.txt', 'a'))
//		 {
//				fwrite($handle, "\n");
//			  	fwrite($handle, var_export($rvalue,true));
//			  	 
//			  	fclose($handle);
//		 }
//	}
	
	/**
	 * Возвращает параметры клиентский браузер
	 * @param string $browser
	 */
	public static function isBrowser ($browser)
	{
		$info=$_SERVER['HTTP_USER_AGENT'];
		if (strpos(strtoupper($info), strtoupper($browser))===false)
			return false;
		else
			return true; 
	}

	/**
	 * Форматирует переменную согласно настроек локали
	 * @param $var переменная, которую необходимо отформатировать
	 * @param $type тип форматирования, определяется константами
	 * FM_NUMBER	= 0
	 * FM_CURRENCY	= 1
	 * FM_DATE		= 2
	 * FM_TIME		= 3
	 * FM_DATETIME	= 4
	 * @param $locale по-умолчанию - текущая локаль
	 */
	public static function Format($var, $type, $locale=null)
	{
		$aSearch 	= array('%D', '%M', '%Y', '%H', '%m');
		$aReplace	= array('d', 'm', 'Y', 'H', 'i');
		if (is_null($locale)) $locale=$_COOKIE['locale'];
		$NLocale 	= new NLocale();
		$aVars		= $NLocale->GetVars($locale);
		foreach ($aVars as &$val)
			$val = preg_replace("/'(.*|\s*)'/", "\${1}", $val);
		switch ($type)
		{
			case FM_NUMBER:
				if (isset($aVars[3]) && isset($aVars[4]) && isset($aVars[8]))
					return number_format($var, $aVars[8], $aVars[3], $aVars[4]);
				else
					return isset($aVars[8]) ? number_format($var, $aVars[8]) : $var;
				break;
			case FM_CURRENCY:
				if (isset($aVars[5]))
				{
					if (isset($aVars[3]) && isset($aVars[4]) && isset($aVars[8]))
						$fm_num = number_format($var, $aVars[8], $aVars[3], $aVars[4]);
					else
						$fm_num = isset($aVars[8]) ? number_format($var, $aVars[8]) : $var;
					return str_replace ("%s", $fm_num, $aVars[5]);
				}
				else
					return $var;
				break;
			case FM_DATE:
				if (isset($aVars[1]))
				{
					$format = str_replace($aSearch, $aReplace, $aVars[1]);
					return date($format, is_string($var) ? strtotime($var) : $var);
				} 
				else
					return $var;
				break;
			case FM_TIME:
				if (isset($aVars[2]))
				{
					$format = str_replace($aSearch, $aReplace, $aVars[2]);
					return date($format, is_string($var) ? strtotime($var) : $var);
				}
				else
					return $var;
				break;
			case FM_DATETIME:
				if (isset($aVars[1]) && isset($aVars[2]))
				{
					$format = str_replace($aSearch, $aReplace, $aVars[1]." ".$aVars[2]);
					return date($format, is_string($var) ? strtotime($var) : $var);
				}
				else
					return $var;
				break;
			default:
				return $var;
				break;
		}
	}
}

?>