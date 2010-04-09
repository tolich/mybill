<?php
/**
 * Администраторы
 */
class Admins
{
	/**
	* Дискриптор базы данных
	* $var resource
	*/
	protected $Db=null;
	
	protected $_script='admin';
	
	protected $_roles = array (
		'guest'			=> 'Гость',
		'staff'			=> 'Сотрудник',
		'cashier'		=> 'Кассир',
		'manager'		=> 'Менеджер',
		'director'		=> 'Директор',
		'administrator'	=> 'Администратор'
	);


	/**
	 * Применять регистронезависимое сравнение в where или нет
	 * по умолчанию регистронезависимый true
	 * Для изменения используйте метод setWhereCaseInsensitive()
	 */
	protected $whereCaseInsensitive='true';

	/**
     * Конструктор
     * @param Zend_Db_Adapter_Abstract $db Объект соединения с БД
	 */
	function __construct()
	{	
		$this->Db = Zend_Registry::get('db');
	}

	/**
	 * Устанавливает режим сравнения в where
	 * @param bool $insensitive по-умолчанию true
	 */
	public function setWhereCaseInsensitive($insensitive=true)
	{
		$this->whereCaseInsensitive=$insensitive;
	}

    /**
     * Проверяет зарегистрирован ли пользователь с определенными параметрами
     * @param array $aParam параметры пользователя. Ассоциативный массив.
     * Ключи - названия полей, значения - значения полей.
     * @return Информация о пользователе или false
     */
    public function GetUserInfo($aParam) {
    	$select=$this->Db->select();
    	$select->from('admin');
    	foreach ($aParam as $key=>$val)
    	{
    		if ($this->whereCaseInsensitive)
    		{
    			$select->where('UPPER(admin.' . $key . ') = UPPER(?)',  (string)$val);
    		} 
    		else
    		{
    			$select->where('admin.' . $key . '= ?',  (string)$val);
    		}
    	}
    	$aInfo = $this->Db->fetchRow($select);
   		return $aInfo;
    }
	
	public function getScript(){
		return $this->_script;
	}
	
	/**
	 * Список 
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($sort=null, $dir=null)
	{
		$sql = $this->Db->select()
					->from('admin', array('id', 'username', 'lastlogin', 'role'));
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		foreach ($aRows as &$aRow){
			$aRow['rolename']=$this->_roles[$aRow['role']];
		}
		return $aRows;
	}
	
	/**
	 * Добавляет
	 * @param $param array
	 */
	public function Add ($param)
	{
		$aKey = array('username', 'wwwpassword', 'role');
		$aInsData = Utils::ClearPostData($param, $aKey);
		Utils::decode($aInsData);
		//array_walk($aInsData, array('Utils', 'array_decode'));
		$r = $this->Db->insert('admin', $aInsData);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('error'=>'Error');
		return $aResult;
	}

	/**
	 * Изменяет
	 * @param $param array
	 */
	public function Edit ($param)
	{
	    if ($param['wwwpassword']){
    		$aKey = array('username', 'wwwpassword', 'role');
	    } else {
    		$aKey = array('username', 'role');
	    }
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		Utils::decode($aUpdateData);
		//array_walk($aUpdateData, array('Utils', 'array_decode'));
		$r = $this->Db->update('admin', $aUpdateData, $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}

	/**
	 * Удаляет
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$where = $this->Db->quoteInto('id=?',$id);
		$r = $this->Db->delete('admin', $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}
	
	public function GetRoleList(){
		$aRoles = array();
		foreach ($this->_roles as $role=>$rolename){
			$aRoles[]=array(
				'role'		=>$role,
				'rolename'	=>$rolename
			);
		}
		return $aRoles;
	}
	
	public function setTimeLogin(){
		$this->Db->update('admin',array('lastlogin'=>new Zend_Db_Expr('now()')),$this->Db->quoteInto('id = ?',Context::GetUserData('id')));
	}
}
?>