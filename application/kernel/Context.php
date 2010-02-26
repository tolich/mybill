<?php

/**
 * Хранит информацию о контексте во время выполнения
 */
class Context {

    protected $_UserData=array();

    /**
     * @var array $_Acl
     * имеет вид
     * 		array (
	 *			'role'		=> array(),
	 *			'resource'	=> array(),
	 *			'right'		=> array(),
	 *			'action'	=> array()
     * 		)
	 */
    protected $_Acl = array (
	 	'role'		=> false,
	 	'resource'	=> false,
	 	'right'		=> false,
	 	'action'	=> false
     );

    /**
     * Авторизирован пользователь или нет
     * @var bool
     */
    protected $_IsAuthorize = false;
	
    /**
     * Скрипт для отображения. 
     * Завист от привилегий пользователя.
     * @var string|bool
     */
    protected $_Script = false;
	
    /**
     * Роль пользователя. 
     * Завист от привилегий пользователя.
     * @var string
     */
    protected $_Role = 'guest';
    
    /**
     * Язык интерфейса. По-умолчанию используется PROJECT_LOCALE_PATH
     * @var string
     */
    protected $_Locale = PROJECT_LOCALE_PATH;
    
	/**
	 * Массив настроек
	 * @var array
	 */
	protected $_Settings = false;

	/**
	 * Массив подключенных модулей
	 * @var array
	 */
	protected $_Modules = false;
	
    private function __construct()
    {
    }

    /**
     * Возвращает содержимое контекста в сессии
     * @return Context 
     */
    public static function Get()
    {
	   	if (Zend_Registry::isRegistered('session')===false){
	 		$session = new Zend_Session_Namespace('mybill');
	    	Zend_Registry::set('session', $session);
	   	} else {
	    	$session = Zend_Registry::get('session');
	   	}
    	if (isset($session->context))
    		return unserialize($session->context);
    	else
    		return new self();
    }
    
    /**
     * Возвращает строковое (serialize) представление объекта
     * @return string
     */
    public function __toString()
    {
    	return serialize($this);
    }
    
    /**
     * Заносит данные о пользователе после авторизации
     * @param array
     */
    public static function SetUserData($UserData)
    {
    	$me=self::Get();
    	$me->_UserData=$UserData;
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
    }

    /**
     * Возвращает данные о пользователе
     * @param $key
     * @return массив если $key=null или значение ключа $key
     * имеет вид
     *		array (
     *		  'id' 				=> '',
     *		  'code' 			=> '',
     *		  'username' 		=> '',
     *		  'groupname' 		=> '',
     *		  'priority' 		=> '',
     *		  'id_tariff' 		=> '',
     *		  'deposit' 		=> '',
     *		  'freebyte' 		=> '',
     *		  'mindeposit'		=> '',
     *		  'dateofcheck' 	=> '',
     *		  'wwwpassword' 	=> '',
     *		  'email' 			=> '',
     *		  'name' 			=> '',
     *		  'surname' 		=> '',
     *		  'detail'	 		=> '',
     *		  'ip' 				=> '',
     *		  'mac' 			=> '',
     *		  'access' 			=> '',
     *		  'acctype' 		=> '',
     *		  'error' 			=> '',
     *		  'freemblimit' 	=> '',
     *		  'check_mb' 		=> '',
     *		  'bonus' 			=> '',
     *		  'laststatsupdate' => '',
     *		  'address' 		=> '',
     *		  'password' 		=> '',
     *		  'in_pipe' 		=> '',
     *		  'out_pipe'	 	=> '',
     *		  'out_ip' 			=> '',
     *		  'in_ip' 			=> '',
     *		  'id_sluice' 		=> '',
     *		  'session_timeout' => '',
     *		  'idle_timeout' 	=> '',
     *		  'check_calling' 	=> '',
     *		  'pipe_method' 	=> '',
     *		  'maxlogin' 		=> '',
     *		  'id_pool' 		=> '',
     *		  'role'			=> '',	
     *		)
     * 
     */
    public static function GetUserData($key=null)
    {
    	if ($key)
   			return self::Get()->_UserData[$key];
   		else
   			return self::Get();
    }
    
    /**
     * Возвращает текущее состояние
     * @return bool
     */
    public static function IsAuthorize()
    {
  		return self::Get()->_IsAuthorize;
    }
    
    /**
     * Ставит флаг зарегистрирован пользователь или нет
     * @param bool true|false
     */
    public static function SetAuthorize($flag=null)
    {
    	$me=self::Get();
    	if (($flag===true) || ($flag===false))
    	{
    		$me->_IsAuthorize=$flag;
    	}
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
    }
    
	public static function SetLocale($locale)
	{
		$me=self::Get();
		$me->_Locale=$locale;
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
	}

	public static function GetLocale()
	{
		return self::Get()->_Locale;
	}

	public static function SetScript($script)
	{
		$me=self::Get();
		$me->_Script=$script;
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
	}

	public static function GetScript()
	{
		return self::Get()->_Script;
	}

	public static function SetRole($role)
	{
		$me=self::Get();
		$me->_Role=$role;
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
	}

	public static function GetRole()
	{
		return self::Get()->_Role;
	}

	public static function SetAcl($acl,$key=null)
	{
		$me=self::Get();
    	if (null===$key)
			$me->_Acl=$acl;
   		else
			$me->_Acl[$key]=$acl;
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
	}

	public static function GetAcl($key=null)
	{
    	if (null===$key)
			return self::Get()->_Acl;
   		else
   			return self::Get()->_Acl[$key];
	}

	public static function SetSettings($settings,$key=null)
	{
		$me=self::Get();
    	if (null===$key)
			$me->_Settings=$settings;
   		else
			$me->_Settings[$key]=$settings;
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
	}

	public static function GetSettings($key=null)
	{
    	if (null===$key)
			return self::Get()->_Settings;
   		else
   			return self::Get()->_Settings[$key];
	}

	public static function SetModules($modules,$key=null)
	{
		$me=self::Get();
    	if (null===$key)
			$me->_Modules=$modules;
   		else
			$me->_Modules[$key]=$modules;
    	$session = Zend_Registry::get('session');
   		$session->context=$me;
	}

	public static function GetModules($key=null)
	{
    	if (null===$key)
			return self::Get()->_Modules;
   		else
   			return self::Get()->_Modules[$key];
	}


}

?>