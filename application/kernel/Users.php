<?php
/**
 * Пользователи
 */
class Users
{
	/**
	* Дискриптор базы данных
	* $var resource
	*/
	protected $Db=null;

	protected $_script='user';

	private $_acctperiod=null;
	/**
	 * Применять регистронезависимое сравнение в where или нет
	 * по умолчанию регистронезависимый true
	 * Для изменения используйте метод setWhereCaseInsensitive()
	 */
	protected $whereCaseInsensitive='true';

	/**
     * Конструктор
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
    	$select->from('usergroup');
    	foreach ($aParam as $key=>$val)
    	{
    		if ($this->whereCaseInsensitive)
    		{
    			$select->where('UPPER(usergroup.' . $key . ') = UPPER(?)',  (string)$val);
    		} 
    		else
    		{
    			$select->where('usergroup.' . $key . '= ?',  (string)$val);
    		}
    	}
    	$aInfo = $this->Db->fetchRow($select);
   		return $aInfo;
    }


	/**
	 * Список пользователей с разбивкой на страницы
	 * @param $start int
	 * @param $limit int
	 * @param $sort string
	 * @param $dir string
	 * @param $query string
	 * @param $access
	 * @param $filter
	 */
	public function GetList($start=null, $limit=null, 
                            $sort=null, $dir=null, $query=null, 
                            $access='%',$filter=null)
	{
	    $as = array('fullname'=>"CONCAT_WS(' ', usergroup.surname, usergroup.name)");
        if (isset($as[$sort])) $sort=$as[$sort]; 
		//$now = getdate();
//		$sql = $this->Db->select()
//					->from('usergroup', array('COUNT(*)'))
//					->joinLeft('tariffs', 'usergroup.id_tariff=tariffs.id', array('tariffname'))
//					->joinLeft('sluice', 'usergroup.id_sluice=sluice.id', array('sluicename'))
//					->where('usergroup.groupname != ?', 'admin')
//					->where('usergroup.access like ?', $access);
//
		if (is_array($filter)) $this->_filter($sql, $filter);
		if ($query) $query=str_replace('*','%',Utils::decode($query));
		if ($query){
			$sql -> where("username LIKE '%$query%' or code LIKE '%$query%' or surname LIKE '%$query%' or name LIKE '%$query%' or address LIKE '%$query%' or in_ip LIKE '%$query%' or detail LIKE '%$query%' or mac LIKE '%$query%'");
		}
//		$aCount = $this->Db->fetchOne($sql);

		if (PHP_SORT){
			$sql = $this->Db->select()
					->from('usergroup', array_unique(array(new Zend_Db_Expr("CONCAT_WS('_', $sort, usergroup.id) as 'key'"), 'id', 'code', 'username', 'deposit',
							'freebyte', 'mindeposit', 'dateofcheck', 'wwwpassword', 'email', 'maxlogin', 'id_pool',
							'name', 'surname', 'detail', 'in_ip', 'out_ip', 'in_pipe', 'out_pipe','mac', 'access', 
							'freemblimit', 'bonus', 'laststatsupdate', 'address', 'check_mb','newuser','activatedate')))
					->joinLeft('tariffs', 'usergroup.id_tariff=tariffs.id', array('tariffname',
							't_in_pipe'=>'in_pipe', 't_out_pipe'=>'out_pipe','monthlyfee','dailyfee','price'))
					->joinLeft('sluice', 'usergroup.id_sluice=sluice.id', array('sluicename'))
					->where('usergroup.groupname != ?', 'admin')
					->where('usergroup.access LIKE ?', $access);
	
			if (is_array($filter)) $this->_filter($sql, $filter);

			if ($query){
				$sql -> where("username LIKE '%$query%' or code LIKE '%$query%' or surname LIKE '%$query%' or name LIKE '%$query%' or address LIKE '%$query%' or in_ip LIKE '%$query%' or detail LIKE '%$query%' or mac LIKE '%$query%'");
			}
			
            $sql = Db::sql_calc_found_rows($sql);
    		$aRows = $this->Db->fetchAll($sql);
            $aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');

			if (strtolower($dir)=='asc')
			{
				ksort($aRows);
			}
			else
			{
				krsort($aRows);
			}
			$aRows = array_values($aRows);
			if ($start!=null && $limit!=null )
				$aRows = array_slice($aRows, $start, $limit);
		} else {
			$sql = $this->Db->select()
					->from('usergroup', array('id', 'code', 'username', 'deposit', 'maxlogin', 
							'freebyte', 'mindeposit', 'dateofcheck', 'wwwpassword', 'email', 'id_pool',
							'name', 'surname', 'detail', 'in_ip', 'out_ip', 'in_pipe', 'out_pipe','mac', 'access', 
							'freemblimit', 'bonus', 'laststatsupdate', 'address', 'check_mb','activatedate'))
					->joinLeft('tariffs', 'usergroup.id_tariff=tariffs.id', array('tariffname',
							't_in_pipe'=>'in_pipe', 't_out_pipe'=>'out_pipe','monthlyfee','dailyfee','price'))
					->joinLeft('sluice', 'usergroup.id_sluice=sluice.id', array('sluicename'))
//                        ->joinLeft(array('t'=>$tsql),'t.username=usergroup.username', array('taskscount'))
					->where('usergroup.groupname = ?', 'user')
					->where('usergroup.access LIKE ?', $access)
					->limit($limit,$start)
					->order(array("$sort $dir"));

			if (is_array($filter)) $this->_filter($sql, $filter);
			
			if ($query){
				$sql -> where("username LIKE '%$query%' or code LIKE '%$query%' or surname LIKE '%$query%' or name LIKE '%$query%' or address LIKE '%$query%' or in_ip LIKE '%$query%' or detail LIKE '%$query%' or mac LIKE '%$query%'");
			}

            $sql = Db::sql_calc_found_rows($sql);
    		$aRows = $this->Db->fetchAll($sql);
            $aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');

		}	
		Utils::encode($aRows);
	    $sql = $this->Db->select()
                ->from('tasks', array('username','taskscount'=>new Zend_Db_Expr('COUNT(tasks.id)')))
                ->where('tasks.execresult = ""')
                ->group('username');
        $aTasks = $this->Db->fetchPairs($sql);
		foreach ($aRows as &$aRow)
		{
			$aRow['fullname']="{$aRow['surname']} {$aRow['name']}";
			$aRow['iconcls'] = 'icon-'.$this->_getStatus($aRow['id']);
			$aRow['freebyte']=sprintf("%0.3f", $aRow['freebyte']/1024/1024);
			$aRow['freemblimit']=sprintf("%0.3f", $aRow['freemblimit']/1024/1024);
			$aRow['deposit']=sprintf("%0.2f", floor($aRow['deposit']*100/1024/1024)/100);
			$aRow['mindeposit']=sprintf("%0.2f", $aRow['mindeposit']/1024/1024);
			$aRow['bonus']=sprintf("%0.3f", $aRow['bonus']/1024/1024);
			$aRow['mac']=str_replace("|", " ", $aRow['mac']);
			$aRow['tariffs'] = strlen($aRow['tariffname']) ? $aRow['tariffname'] : 'Не установлен!';
			$aRow['sluicename'] = strlen($aRow['sluicename']) ? $aRow['sluicename'] : 'Не установлен!';
			$aRow['monthlyfee']=sprintf("%0.2f", $aRow['monthlyfee']/1024/1024);
			$aRow['dailyfee']=sprintf("%0.2f", $aRow['dailyfee']/1024/1024);
            if (array_key_exists($aRow['username'],$aTasks)){
                $aRow['taskscount'] = $aTasks[$aRow['username']];
            }else{
                $aRow['taskscount'] = 0;
            }
		}
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}

	/**
	 * Короткий список пользователей с разбивкой на страницы
	 * @param $start int
	 * @param $limit int
	 * @param $query string
	 */
	public function GetSmallList($start=null, $limit=null, $query=null)
	{
		$sql = $this->Db->select()
			->from('usergroup', array('COUNT(*)'))
			->where('usergroup.groupname = ?', 'user');
		if ($query)
			$sql->where("CONCAT_WS(' ', username, surname, name, address) LIKE ?", '%'.Utils::decode(str_replace('*','%',$query)).'%');
		$aCount = $this->Db->fetchOne($sql);

		if (PHP_SORT)
		{
			$sql = $this->Db->select()
						->from('usergroup', array_unique(array(new Zend_Db_Expr("CONCAT_WS('_', username, usergroup.id) as 'key'"), 'id', 'username',
								'name', 'surname', 'address')))
						->where('usergroup.groupname = ?', 'user');
	
			if ($query)
				$sql->where("CONCAT_WS(' ', username, surname, name, address) LIKE ?", '%'.Utils::decode(str_replace('*','%',$query)).'%');
			
			
			$aRows = $this->Db->fetchAssoc($sql);
			ksort($aRows);
			$aRows = array_values($aRows);
    		Utils::encode($aRows);
			array_unshift($aRows, array('id'=>'%', 'username'=>'Все пользователи'));
			if ($start!=null && $limit!=null )
				$aRows = array_slice($aRows, $start, $limit);
		} 
		else
		{
			$sql = $this->Db->select()
						->from('usergroup', array('id', 'username',	'name', 'surname','address'))
						->where('usergroup.groupname = ?', 'user');
			
			if ($start!=null && $limit!=null )
				$sql->limit($limit-(int)($start==0), $start-(int)($start>0));
			if ($query)
				$sql->where("CONCAT_WS(' ', username, surname, name, address) LIKE ?", '%'.Utils::decode(str_replace('*','%',$query)).'%');
			$aRows = $this->Db->fetchAll($sql);
    		Utils::encode($aRows);
			if ($start==0)
				array_unshift($aRows, array('id'=>'%', 'username'=>'Все пользователи'));
		}

		foreach ($aRows as &$aRow)
		{
			$aRow = Utils::ClearPostData($aRow, array('id', 'username'));	
		}
		
		$aData = array( 'totalCount'=>$aCount+1,
						'data' => $aRows);
		return $aData;
	}
	
	/**
	 * Добавляет нового пользователя
	 * @param $param array Массив параметров
	 * key название поля
	 * value значение поля
	 */
	public function Add ($param)
	{
		$aKey = array('username', 'code', 'wwwpassword', 'email', 'surname', 'name',
					  'address', 'detail', 'id_tariff', 'in_ip', 'out_ip', 'id_sluice',
					  'mindeposit', 'password', 'check_mb', 'maxlogin', 'id_pool',
					  'in_pipe', 'out_pipe', 'dateofcheck', 'session_timeout', 'freemblimit',
					  'idle_timeout', 'check_calling', 'mac', 'pipe_method', 'access'
	  				 );
		$aCheckAttr=array('password');
		$aReplyAttr=array('out_ip', 'session_timeout', 'idle_timeout', 'in_pipe', 'out_pipe','id_pool');
		$aFltReplyAttr=array('id_tariff', 'in_pipe', 'out_pipe');
		$username = $param['username'];
		$param['mac']=preg_replace("/\s+/", "|", strtolower(trim($param['mac'])));
		if ($param['in_ip'])
		{
			$aInfo=$this->GetUserInfo(array('in_ip'=>$param['in_ip'], 'access'=>1, 'groupname'=>'User'));
			if ($aInfo!==false)
				return array('success'=>false,'errors'=>array('msg'=>'Внутренний ip '.$param['in_ip'].' уже используется!<br><br>Пользователь <b>'.$aInfo['username'].'</b> (id='.$aInfo['id'].')'));
		}
		if ($param['out_ip'])
		{
			$aInfo=$this->GetUserInfo(array('out_ip'=>$param['out_ip'], 'access'=>1, 'groupname'=>'User'));
			if ($aInfo!==false)
				return array('success'=>false,'errors'=>array('msg'=>'Внешний ip '.$param['out_ip'].' уже используется!<br><br>Пользователь <b>'.$aInfo['username'].'</b> (id='.$aInfo['id'].')'));
		}
		if ($this->GetUserInfo(array('username'=>$param['username']))===false)
		{
			$aInsData = Utils::ClearPostData($param, $aKey);
			$aInsData['freemblimit']=$aInsData['freemblimit']*1024*1024;
			$aInsData['mindeposit']=$aInsData['mindeposit']*1024*1024;
			$aInsData['newuser']=Settings::Billing('newuser');
			$aInsData['role']=Settings::Billing('role');
			$aInsData['activatedate']=date('Y-m-d H:i:s');
			array_walk($aInsData, array('Utils', 'array_decode'));
			$r = $this->Db->insert('usergroup', $aInsData);
			$aCheckData = Utils::ClearPostData($param, $aCheckAttr);
			$this->_SetCheckAttr($username, $aCheckData);
			$aReplyData = Utils::ClearPostData($param, $aReplyAttr);
			$this->_SetReplyAttr($username, $aReplyData);
			$aFltReplyData = Utils::ClearPostData($param, $aFltReplyAttr);
			$this->_SetFltReplyAttr($username, $aFltReplyData);
			$aResult = array('success'=>true);
		}
		else
		{
			$aResult = array('success'=>false,'errors'=>array('msg'=>'Пользователь с таким логином существует!'));
		}
		return $aResult;
	} 

	/**
	 * Изменяет данные пользователя
	 * @param $param array
	 */
	public function Edit($param){
		$aKey = array('username', 'code', 'wwwpassword', 'email', 'surname', 'name',
					  'address', 'detail', 'id_tariff', 'in_ip', 'out_ip', 'id_sluice',
					  'mindeposit', 'freemblimit', 'password', 'check_mb', 'maxlogin',
					  'in_pipe', 'out_pipe', 'dateofcheck', 'session_timeout', 'id_pool',
					  'idle_timeout', 'check_calling', 'mac', 'pipe_method', 'access','is_repl','repl_status'
	  				 );
		$aCheckAttr=array('password','check_calling', 'mac');
		$aReplyAttr=array('out_ip', 'session_timeout', 'idle_timeout','id_pool');
		$aFltReplyAttr=array('id_tariff', 'in_pipe', 'out_pipe');
		$id = $param['id'];
		$username = $param['username'];
		$param['mac']=preg_replace("/\s+/", "|", strtolower(trim($param['mac'])));
		//$id_sluice = $param['id_sluice'];
		if ($param['in_ip'])
		{
			$aInfo=$this->GetUserInfo(array('in_ip'=>$param['in_ip'], 'access'=>1, 'groupname'=>'User'));
			if ($aInfo!==false && $aInfo['id']!=$id)
				return array('success'=>false,'errors'=>array('msg'=>'Внутренний ip '.$param['in_ip'].' уже используется!<br><br>Пользователь <b>'.$aInfo['username'].'</b> (id='.$aInfo['id'].')'));
		}
		if ($param['out_ip'])
		{
			$aInfo=$this->GetUserInfo(array('out_ip'=>$param['out_ip'], 'access'=>1, 'groupname'=>'User'));
			if ($aInfo!==false && $aInfo['id']!=$id)
				return array('success'=>false,'errors'=>array('msg'=>'Внешний ip '.$param['out_ip'].' уже используется!<br><br>Пользователь <b>'.$aInfo['username'].'</b> (id='.$aInfo['id'].')'));
		}
		$aInfo = $this->GetUserInfo(array('username'=>$username));
		if ($aInfo===false || $aInfo['id']==$id)
		{
			$aInfo = $this->GetUserInfo(array('id'=>$id));
			$where = $this->Db->quoteInto('username = ?', $aInfo['username']);
			$this->Db->delete('radcheck', $where);
			$this->Db->delete('radreply', $where);
			$aEditData = Utils::ClearPostData($param, $aKey);
			$aEditData['freemblimit']=$aEditData['freemblimit']*1024*1024;
			$aEditData['mindeposit']=$aEditData['mindeposit']*1024*1024;
			Utils::decode($aEditData);
			$where = $this->Db->quoteInto('id = ?', $id);
			$this->Db->update('usergroup', $aEditData, $where);
			$aCheckData = Utils::ClearPostData($param, $aCheckAttr);
			$this->_SetCheckAttr($username, $aCheckData);
			$aReplyData = Utils::ClearPostData($param, $aReplyAttr);
			$this->_SetReplyAttr($username, $aReplyData);
			$aFltReplyData = Utils::ClearPostData($param, $aFltReplyAttr);
			$this->_SetFltReplyAttr($username, $aFltReplyData);
			$aResult = array('success'=>true);
		}
		else
		{
			$aResult = array('success'=>false,'errors'=>array('msg'=>'Пользователь с таким логином существует!'));
		}
		return $aResult;
	}	

	/**
	 * Изменяет данные пользователя
	 * TODO Не забыть об 1С
	 * @param $param array
	 */
	public function QuickEdit($param){
        $param = Zend_Json::decode($param);
		$aKey = array('username', 'code', 'wwwpassword', 'email', 'surname', 'name',
					  'address', 'detail', 'id_tariff', 'in_ip', 'out_ip', 'id_sluice',
					  'mindeposit', 'freemblimit', 'password', 'check_mb', 'maxlogin',
					  'in_pipe', 'out_pipe', 'dateofcheck', 'session_timeout', 'id_pool',
					  'idle_timeout', 'check_calling', 'mac', 'pipe_method', 'access','is_repl','repl_status'
	  				 );
//		$aCheckAttr=array('password','check_calling', 'mac');
//		$aReplyAttr=array('out_ip', 'session_timeout', 'idle_timeout','id_pool');
		$id = $param['id'];
        if (isset($param['fullname'])){
    		preg_match("/(\S*)\s+(.+)/",$param['fullname'],$aName);
            if (count($aName)){
                unset($aName[0]);
                 $param['surname'] = array_shift($aName);
                 $param['name'] = implode($aName);
            }
//            if (isset($aName[0])) $param['surname'] = $aName[0];
//            if (isset($aName[1])) $param['name'] = $aName[1];
        }

        if (isset($param['mac'])){
    		$param['mac']=preg_replace("/\s+/", "|", strtolower(trim($param['mac'])));
        }
		//$id_sluice = $param['id_sluice'];
		if (isset($param['in_ip']))
		{
			$aInfo=$this->GetUserInfo(array('in_ip'=>$param['in_ip'], 'access'=>1, 'groupname'=>'User'));
			if ($aInfo!==false && $aInfo['id']!=$id)
				return array('success'=>false,'errors'=>array('msg'=>'Внутренний ip '.$param['in_ip'].' уже используется!<br><br>Пользователь <b>'.$aInfo['username'].'</b> (id='.$aInfo['id'].')'));
		}
		if (isset($param['out_ip']))
		{
			$aInfo=$this->GetUserInfo(array('out_ip'=>$param['out_ip'], 'access'=>1, 'groupname'=>'User'));
			if ($aInfo!==false && $aInfo['id']!=$id)
				return array('success'=>false,'errors'=>array('msg'=>'Внешний ip '.$param['out_ip'].' уже используется!<br><br>Пользователь <b>'.$aInfo['username'].'</b> (id='.$aInfo['id'].')'));
		}
        if (isset($param['username'])){
    		$username = $param['username'];
    		$aInfo = $this->GetUserInfo(array('username'=>$username));
        } else {
            $aInfo = false;
        }
		if ($aInfo===false || $aInfo['id']==$id)
		{
			$aInfo = $this->GetUserInfo(array('id'=>$id));
			$where = $this->Db->quoteInto('username = ?', $aInfo['username']);
//			$this->Db->delete('radcheck', $where);
//			$this->Db->delete('radreply', $where);
			$aEditData = Utils::ClearPostData($param, $aKey);
            if (isset($aEditData['freemblimit']))
    			$aEditData['freemblimit']=$aEditData['freemblimit']*1024*1024;
            if (isset($aEditData['mindeposit']))
    			$aEditData['mindeposit']=$aEditData['mindeposit']*1024*1024;
			Utils::decode($aEditData);
			$where = $this->Db->quoteInto('id = ?', $id);
			$this->Db->update('usergroup', $aEditData, $where);
//			$aCheckData = Utils::ClearPostData($param, $aCheckAttr);
//			$this->_SetCheckAttr($username, $aCheckData);
//			$aReplyData = Utils::ClearPostData($param, $aReplyAttr);
//			$this->_SetReplyAttr($username, $aReplyData);
//			$aFltReplyData = Utils::ClearPostData($param, $aFltReplyAttr);
//			$this->_SetFltReplyAttr($username, $aFltReplyData);
			$aResult = array('success'=>true);
		}
		else
		{
			$aResult = array('success'=>false,'errors'=>array('msg'=>'Пользователь с таким логином существует!'));
		}
		return $aResult;
	}	
	
	/**
	 * Изменяет зоны и шейпер для выбраного тарифа
	 * @param $id
	 */
	public function ChangeZone($id)
	{
		$sql = $this->Db->select()
						->from('usergroup', array('username','id_tariff', 'in_pipe', 'out_pipe'))
						->where('id_tariff=?', $id);
		$aUsers = $this->Db->fetchAll($sql);
		foreach ($aUsers as $aUser)
		{
			$username = array_shift($aUser);
			$this->Db->delete('radreply',"`username`='$username' and `attribute` in ('mpd-limit', 'mpd-filter')");
			$this->_SetFltReplyAttr($username, $aUser);
		}
	}

	/**
	 * Изменяет шлюз для выбраного тарифа
	 * @param $id
	 * @param $param
	 */
	public function ChangeSluice($id, $param)
	{
		$where = $this->Db->quoteInto('id_tariff=?', $id);
		$this->Db->update('usergroup',$param, $where);
	}

	/**
	 * Изменяет минимальный депозит и минимальный остаток Мб для выбраного тарифа
	 * @param $id
	 * @param $param
	 */
	public function ChangeMin($id, $param)
	{
		$where = $this->Db->quoteInto('id_tariff=?', $id);
		$this->Db->update('usergroup',$param, $where);
	}

	/**
	 * Изменяет 
	 * зоны и шейпер
	 * шлюз
	 * минимальный депозит и минимальный остаток Мб
	 * для выбраного тарифа
	 * @param $id
	 * @param $param
	 */
	public function ChangeAll($id, $param)
	{
		$this->ChangeZone($id);
		$where = $this->Db->quoteInto('id_tariff=?', $id);
		$this->Db->update('usergroup',$param, $where);
	}
	

	/**
	 * Добавляет RAD_CHECK аттрибуты
	 * @param $username string логин пользователя
	 * @param $attr array массив аттрибутов
	 */
	private function _SetCheckAttr($username, $attr){
		$aAttributes = array();
		foreach ($attr as $key=>$val)
		{
			switch ($key)
			{
				case 'password':
					$aAttributes[]=array('username'	=> $username,
										 'attribute'=> 'User-Password',
										 'op'		=> ':=',
										 'value'	=> $val
										);			
					break;
				case 'check_calling':
					if ($val==1)
						$aAttributes[]=array('username'	=> $username,
											 'attribute'=> 'Calling-Station-Id',
											 'op'		=> '=~',
											 'value'	=> $attr['mac']
											);			
					break;
			}
		}
		foreach ($aAttributes as $aAttr)
			$this->Db->insert('radcheck', $aAttr);
	} 

	/**
	 * Добавляет RAD_REPLY аттрибуты
	 * @param $username string логин пользователя
	 * @param $attr array массив аттрибутов
	 */
	private function _SetReplyAttr($username, $attr){
		$aAttributes = array();
		foreach ($attr as $key=>$val)
		{
			switch ($key)
			{
				case 'out_ip':
					if ($val)
						$aAttributes[]=array('username'	=> $username,
											 'attribute'=> 'Framed-IP-Address',
											 'op'		=> ':=',
											 'value'	=> $val
											);			
					break;
				case 'session_timeout':
					if ($val)
						$aAttributes[]=array('username'	=> $username,
											 'attribute'=> 'Session-Timeout',
											 'op'		=> ':=',
											 'value'	=> $val
											);			
					break;
				case 'idle_timeout':
					if ($val)
						$aAttributes[]=array('username'	=> $username,
											 'attribute'=> 'Idle-Timeout',
											 'op'		=> ':=',
											 'value'	=> $val
											);			
					break;
				case 'id_pool':
					if ($val)
						$aAttributes[]=array('username'	=> $username,
											 'attribute'=> 'Framed-Pool',
											 'op'		=> ':=',
											 'value'	=> $val
											);			
					break;
			}
		}
		foreach ($aAttributes as $aAttr)
			$this->Db->insert('radreply', $aAttr);
	} 

	/**
	 * Добавляет RAD_REPLY аттрибуты для каждой зоны тарифа
	 * Если задана скорость для пользователя то берем ее
	 * Иначе - берем скорость из тарифа
	 * @param $username string логин пользователя
	 * @param $attr array массив аттрибутов
	 */
	private function _SetFltReplyAttr($username, $attr)
	{
		$aAttributes = array();
		$fcount = 1;
		$sql = $this->Db->select()
						->from('tariffs', array('in_pipe', 'out_pipe'))
						->where('tariffs.id=?', $attr['id_tariff']);
						
		$aTariff = $this->Db->fetchRow($sql);

		$sql = $this->Db->select()
						->from('intariffs', array('idzone', 'in_pipe', 'out_pipe','action'))
						->join('zones', 'intariffs.idzone=zones.id', array('src'))
						->order('zones.prio')
						->where('intariffs.idtariff=?', $attr['id_tariff']);
						
		$aZones = $this->Db->fetchAll($sql);
		
		foreach($aZones as $aZone)
		{
			$aSrc = explode(' ', $aZone['src']);
			$rcount = 1;
			foreach ($aSrc as $src)
			{
				$aAttribute = array('username'	=> $username,
									 'attribute'=> 'mpd-filter',
									 'op'		=> '+=',
									);
				if (substr($src,0,1)=='!')
				{
					$aAttribute['value']=($fcount*2-1).'#'.$rcount.'=nomatch dst net '.trim(substr($src,1));
					$aAttributes[]=$aAttribute;
					$aAttribute['value']=($fcount*2).'#'.$rcount.'=nomatch src net '.trim(substr($src,1));
					$aAttributes[]=$aAttribute;
				}
				else
				{
					$aAttribute['value']=($fcount*2-1).'#'.$rcount.'=match dst net '.trim($src);
					$aAttributes[]=$aAttribute;
					$aAttribute['value']=($fcount*2).'#'.$rcount.'=match src net '.trim($src);
					$aAttributes[]=$aAttribute;
				}
				$rcount++;
			}
			$aAttribute = array('username'	=> $username,
								 'attribute'=> 'mpd-limit',
								 'op'		=> '+=',
								);
			
//			if ($attr['in_pipe'])
//			{
//				$in_pipe=$attr['in_pipe'];
//			} else {
				$in_pipe=$aZone['in_pipe'];
//			}

			if ($in_pipe)
			{
				$aAttribute['value']='out#'.$fcount.'#Zone'.$aZone['idzone'].'=flt'.($fcount*2).' shape ' . $in_pipe*1024 . ' 4000'.($aZone['action']=='1'?' pass':' deny');
			}else{
				$aAttribute['value']='out#'.$fcount.'#Zone'.$aZone['idzone'].'=flt'.($fcount*2).($aZone['action']=='1'?' pass':' deny');
			}
			$aAttributes[]=$aAttribute;

//			if ($attr['out_pipe'])
//			{
//				$out_pipe=$attr['out_pipe'];
//			} else {
				$out_pipe=$aZone['out_pipe'];
//			}

			if ($out_pipe)
				$aAttribute['value']='in#'.$fcount.'#Zone'.$aZone['idzone'].'=flt'.($fcount*2-1).' shape ' . $out_pipe*1024 . ' 4000'.($aZone['action']=='1'?' pass':' deny');
			else
				$aAttribute['value']='in#'.$fcount.'#Zone'.$aZone['idzone'].'=flt'.($fcount*2-1).($aZone['action']=='1'?' pass':' deny');

			$aAttributes[]=$aAttribute;
			$fcount++;
		}	

		if ($attr['in_pipe'])
		{
			$in_pipe=$attr['in_pipe'];
		} else {
			$in_pipe=$aTariff['in_pipe'];
		}
		if ($in_pipe)
			$aAttributes[]=array('username'	=> $username,
								 'attribute'=> 'mpd-limit',
								 'op'		=> '+=',
								 'value'	=> 'out#'.$fcount.'#Other=all shape ' . $in_pipe*1024 . ' 4000'
								);			
		else
			$aAttributes[]=array('username'	=> $username,
								 'attribute'=> 'mpd-limit',
								 'op'		=> '+=',
								 'value'	=> 'out#'.$fcount.'#Other=all'
								);			

		if ($attr['out_pipe'])
		{
			$out_pipe=$attr['out_pipe'];
		} else {
			$out_pipe=$aTariff['out_pipe'];
		}
		if ($out_pipe)
			$aAttributes[]=array('username'	=> $username,
								 'attribute'=> 'mpd-limit',
								 'op'		=> '+=',
								 'value'	=> 'in#'.$fcount.'#Other=all shape ' . $out_pipe*1024 . ' 4000'
								);			
		else
			$aAttributes[]=array('username'	=> $username,
								 'attribute'=> 'mpd-limit',
								 'op'		=> '+=',
								 'value'	=> 'in#'.$fcount.'#Other=all'
								);			
		foreach ($aAttributes as $aAttr)
			$this->Db->insert('radreply', $aAttr);
	}
	
	/**
	 * Возвращает данные пользователя по id
	 * @param $id int
	 */
	public function getById($id)
	{
		$aKey = array('username', 'code', 'wwwpassword', 'email', 'surname', 'name','maxlogin',
					  'address', 'detail', 'id_tariff', 'in_ip', 'out_ip', 'id_sluice',
					  'deposit', 'mindeposit', 'freebyte', 'bonus', 'password',  'id_pool',
					  'in_pipe', 'out_pipe', 'dateofcheck', 'session_timeout', 'freemblimit',
					  'idle_timeout', 'check_calling', 'mac', 'pipe_method', 'access','check_mb','is_repl'
	  				 );
		$aData = $this->GetUserInfo(array('id'=>$id));
		$aData['freebyte']=sprintf("%0.3f", $aData['freebyte']/1024/1024);
		$aData['freemblimit']=sprintf("%0.3f", $aData['freemblimit']/1024/1024);
		$aData['deposit']=sprintf("%0.2f", $aData['deposit']/1024/1024);
		$aData['mindeposit']=sprintf("%0.2f", $aData['mindeposit']/1024/1024);
		$aData['bonus']=sprintf("%0.3f", $aData['bonus']/1024/1024);
		$aData['mac']=str_replace("|", " ", $aData['mac']);
		$aData = Utils::ClearPostData($aData, $aKey);
		array_walk($aData, array('Utils', 'array_encode'));
		return $aData;
	} 
	
	/**
	 * Возвращает состояние счета пользователя
	 * @param $id
	 * @return array
	 */
	public function GetAccountInfo($id=null)
	{
		if (null == $id)
			$id = Context::GetUserData('id');
		$sql = $this->Db->select()
					->from('usergroup', array('id', 'code', 'username', 'deposit', 
							'freebyte', 'mindeposit', 'dateofcheck', 'wwwpassword', 'email',
							'name', 'surname', 'detail', 'in_ip', 'out_ip', 'in_pipe', 'out_pipe','mac', 'access', 
							'freemblimit', 'bonus', 'laststatsupdate', 'address'))
					->joinLeft('tariffs', 'usergroup.id_tariff=tariffs.id', array('tariffname'))
					->joinLeft('sluice', 'usergroup.id_sluice=sluice.id', array('sluicename'))
					->where('usergroup.id = ?', $id);
		$aRow = $this->Db->fetchRow($sql);
		Utils::encode($aRow);
		$aRow['freebyte']=sprintf("%0.3f", $aRow['freebyte']/1024/1024);
		$aRow['freemblimit']=sprintf("%0.3f", $aRow['freemblimit']/1024/1024);
		$aRow['deposit']=sprintf("%0.2f", floor($aRow['deposit']*100/1024/1024)/100);
		$aRow['mindeposit']=sprintf("%0.2f", $aRow['mindeposit']/1024/1024);
		$aRow['bonus']=sprintf("%0.3f", $aRow['bonus']/1024/1024);
		$aRow['tariffs'] = strlen($aRow['tariffname']) ? $aRow['tariffname'] : 'Не установлен!';
		$aRow['sluicename'] = strlen($aRow['sluicename']) ? $aRow['sluicename'] : 'Не установлен!';
		return $aRow;
	}
	

	/**
	 * Возвращает массив с ключем status статус пользователя 
	 * @return array 
	 */
	public function GetUserStatus($id=null)
	{
		$aData = array('status'=>$this->_getStatus($id));
		return $aData;
	}

    /**
     * Возвращает разрешен доступ клиенту с $id или нет
     * @return 
     * @param object $id[optional]
     */
    public function IsValid($id=null)
    {
        return $this->_getStatus($id)==1;    
    }
    
	/**
	 * Возвращает статус пользователя 
	 * @return int код статуса 
	 */
	private function _getStatus($id=null){
		if (null == $id){
			$id = Context::GetUserData('id');
			$username = Context::GetUserData('username');
		} else {
			$aInfo = $this->GetUserInfo(array('id'=>$id));
			$username = $aInfo['username'];
		} 
		$sql = $this->Db->select()
			->from('usergroup', array('deposit','freebyte', 'mindeposit', 'dateofcheck','access', 
					'freemblimit','check_mb','bonus'))
			->where('usergroup.id = ?', $id);
		$aRow = $this->Db->fetchRow($sql);
		if ($this->_acctperiod===null){
			$sql = $this->Db->select()
						->from('acctperiod',array(
							'datestart'=> new Zend_Db_Expr("UNIX_TIMESTAMP(datestart)"),
							'now'		 => new Zend_Db_Expr("UNIX_TIMESTAMP(CURDATE())")))
						->where('status=0');
			$this->_acctperiod=$this->Db->fetchRow($sql);
		}
		if ($aRow['access']==0){
			$status = 0;
		} else {
			if ((($aRow['deposit']<$aRow['mindeposit'])&&
				($this->_acctperiod['datestart']+$aRow['dateofcheck']*86400<=$this->_acctperiod['now']))||
				(($aRow['freebyte']+$aRow['bonus']<=$aRow['freemblimit']) && ($aRow['check_mb']==1))){
					$status = 3;
			} else {
				$status = 1;
            }
		}
		return $status;
	}
		
	/**
	 * Включает доступ в интернет
	 */
	public function On($id)
	{
		$aData = array('access'=>1);
		$where = $this->Db->quoteInto('id = ? or username like ?', $id);
		$this->Db->update('usergroup', $aData, $where);
		return array('success'=>true);
	}

	/**
	 * Отключает доступ в интернет
	 */
	public function Off($id)
	{
		$aData = array('access'=>0);
		$where = $this->Db->quoteInto('id = ? or username like ?', $id);
		$this->Db->update('usergroup', $aData, $where);
        $sql = $this->Db->select()
    				->from('sessions',array('acctuniqueid'))
                    ->join('usergroup','usergroup.username=sessions.username')
                    ->where('usergroup.id = ?', $id);
        $aSessions = $this->Db->fetchCol($sql);
        if (count($aSessions)){
            $oSessions = new Sessions();
            foreach ($aSessions as $uid){
                $oSessions->Close($uid);
            }
        }
		return array('success'=>true);
	}

	/**
	 * Включает контроль за остатком Мб
	 */
	public function CheckMbOn($id)
	{
		$aData = array('check_mb'=>1);
		$where = $this->Db->quoteInto('id = ?', $id);
		$this->Db->update('usergroup', $aData, $where);
		return array('success'=>true);
	}

	/**
	 * Отключает контроль за остатком Мб
	 */
	public function CheckMbOff($id)
	{
		$aData = array('check_mb'=>0);
		$where = $this->Db->quoteInto('id = ?', $id);
		$this->Db->update('usergroup', $aData, $where);
		return array('success'=>true);
	}

	/**
	 * Включает перенаправление на страницу приветствия
	 */
	public function NewUserOn($id)
	{
		$aData = array('newuser'=>1);
		$where = $this->Db->quoteInto('id = ?', $id);
		$this->Db->update('usergroup', $aData, $where);
		return array('success'=>true);
	}

	/**
	 * Отключает перенаправление на страницу приветствия
	 */
	public function NewUserOff($id)
	{
		$aData = array('newuser'=>0);
		$where = $this->Db->quoteInto('id = ?', $id);
		$this->Db->update('usergroup', $aData, $where);
		return array('success'=>true);
	}
	
	/**
	 * Отключает перенаправлению на страницу приветствия по ip
	 * @return 
	 * @param object $sql
	 * @param object $filter
	 */
	public function NewUserByIPOff($ip)
	{
		$sql = $this->Db->select()
						->from('sessions',array('username'))
						->where('framedipaddress=?',$ip);
		$username=$this->Db->fetchOne($sql);
		$aData = array('newuser'=>0);
		$where = $this->Db->quoteInto('username = ?', $username);
		return $this->Db->update('usergroup', $aData, $where);
	}
	/**
	 * Добавляет в Zend_Db_Select условие из массива фильтров
	 */
	private function _filter(Zend_Db_Select &$sql, array $filter)  
	{
		foreach ($filter as $flt){
			$value = Utils::decode($flt['data']['value']);
			switch (strtolower($flt['field'])){
			    case 'fullname':
				case 'surname':
				case 'name':
					$field = "CONCAT_WS(' ', usergroup.surname, usergroup.name)";
				break;
				case 'deposit':
				case 'freemblimit':
				case 'bonus':
				case 'mindeposit':
				case 'freebyte':
					$field="usergroup.{$flt['field']}";
					$value = (int)$value*1024*1024;
				break;
				case 'check_mb':
					$field="usergroup.{$flt['field']}";
				break;
				case 'tariffname':
					$field="tariffs.{$flt['field']}";
				break;
				case 'sluicename':
					$field="sluice.{$flt['field']}";
				break;
				default:
					$field=$flt['field'];
				break;
			};
			
			switch($flt['data']['type']){
				case 'string' : 
					$sql->where("$field LIKE ?", "%".str_replace('*','%',$value)."%"); 
				break;
				case 'list' : 
					if (strstr($value,',')){
						$sql->where("$field IN (?)", explode(',',$value)); 
					}else{
						$sql->where("$field = ?", $value); 
					}
				break;
				case 'boolean' : 
					$sql->where("$field = ?", $value=='true'?'1':'0'); 
				break;
				case 'numeric' : 
					switch ($flt['data']['comparison']) {
						case 'eq' : $sql->where("$field = ?", $value); break;
						case 'lt' : $sql->where("$field < ?", $value);  break;
						case 'gt' : $sql->where("$field > ?", $value);  break;
					}
				break;
				case 'date' : 
					switch ($flt['data']['comparison']) {
						case 'eq' : $sql->where("$field = ?", date('Y-m-d',strtotime($value))); break;
						case 'lt' : $sql->where("$field < ?", date('Y-m-d',strtotime($value))); break;
						case 'gt' : $sql->where("$field > ?", date('Y-m-d',strtotime($value))); break;
					}
				break;
			}
		}	
	}
	
	/**
	 * Сохраняет настройки главного грида
	 * @settings array
	 */
	public function SetSettings($settings)
	{
		$aResult = array('success'=>true);
		$sql = $this->Db->select()
						->from('usersettings', new Zend_Db_Expr('COUNT(*)'))
						->where('id_user = ?', Context::GetUserData('id'))		
						->where('var = ?', 'cookie');
		if ($this->Db->fetchOne($sql)!=0)	
		{
			$aWhere[]=$this->Db->quoteInto('id_user = ?', Context::GetUserData('id'));
			$aWhere[]=$this->Db->quoteInto('var = ?', 'cookie');
			$aUpdateData=array('value'=>$settings);							
			$this->Db->update('usersettings', $aUpdateData, $aWhere);
		} else {
			$aInsData=array('id_user'=>Context::GetUserData('id'), 'var'=>'cookie', 'value'=>$settings);							
			$this->Db->insert('usersettings', $aInsData);
		}
		return $aResult;
	}

	/**
	 * Удаляет настройки главного грида
	 */
	public function DelSettings()
	{
		$aResult = array('success'=>true);
		$sql = $this->Db->delete('usersettings', $this->Db->quoteInto('id_user = ?', Context::GetUserData('id')));
		return $aResult;
	}

	/**
	 * Возвращает настройки главного грида
	 * и права доступа для залогиненого пользователя
	 */
	public function GetSettings()
	{
		$aResult = array('success'=>true); 
        if (Context::GetScript()=='admin'){
    		$sql = $this->Db->select()
    						->from('usersettings', array('value'))
    						->where('id_user = ?', Context::GetUserData('id'))		
    						->where('var = ?', 'cookie');
    		$aResult['settings'] = $this->Db->fetchOne($sql);
        } else {
    		$aResult['settings'] = Zend_Json::encode(Zend_Registry::get('info_block'));
        }
		$aResult['mainsettings'] = Settings::Main();
		$aResult['billsettings'] = array(
                            'currency'=>Settings::Billing('currency')
                        );
		$acl=Zend_Registry::get('acl');
		$aResult['rights'] = $acl->getAllRights(Context::GetRole());
		return $aResult;
	}
	
	/**
	 * Снимает абонплату за месяц
	 * @param id
	 */ 
	public function MonthlyFee($id,$force=true,$opdate=false)
	{
		$sql = $this->Db->select()
						->from('usergroup', array('id','um'=>'deposit','md'=>'mindeposit','ufb'=>'freebyte','upb'=>'paybyte', 'ub'=>'bonus','dateofcheck','freemblimit','check_mb','now'=> new Zend_Db_Expr("UNIX_TIMESTAMP(CURDATE())")))
						->join('tariffs', 'usergroup.id_tariff=tariffs.id', array('tm'=>'monthlyfee', 'tfb'=>'freebyte', 'tb'=>'bonus'))
						->where('usergroup.id=?', $id)
						->orWhere('usergroup.username like ?', $id);
		if ($force==false) $sql->where('access=1');
		$aAllData = $this->Db->fetchAll($sql);
		foreach ($aAllData as $aData){
			if (($dateofcheck=strtotime($opdate))===false) $dateofcheck=$aData['now'];
			$dateofcheck += $aData['dateofcheck']*86400;
			if (($force==false)&&($aData['um']-$aData['md']<$aData['tm'])&&($dateofcheck<=$aData['now'])){
				if (Settings::Billing('keep_freebyte')==1){ 
					$freebyte = $aData['ufb'];
				}else{
					$freebyte = 0;
				};
				if (Settings::Billing('keep_bonus')==1){ 
					$bonus = $aData['ub'];
				}else{
					$bonus = 0;
				};
				$aUpdateData = array(
					'freebyte'=>$freebyte,
					'bonus'=>$bonus,
					'access'=>0
				);
			}
			else {
				if (Settings::Billing('keep_freebyte')==1){
					if (Settings::Billing('keep_bonus')==0&&$aData['upb']>$aData['ufb']){
						if ($aData['upb']-$aData['ufb']>$aData['ub']){
							$freebyte = $aData['ufb']+$aData['tfb']+$aData['ub'];
						}else{
							$freebyte = $aData['tfb']+$aData['upb'];
						};
					}else{
						$freebyte = $aData['ufb']+$aData['tfb'];
					};
				}else{
					$freebyte = $aData['tfb'];
				};
				if (Settings::Billing('keep_bonus')==1){ 
					$bonus = $aData['ub']+$aData['tb'];
				}else{
					$bonus = $aData['tb'];
				};
				$aUpdateData = array(
					'deposit'=>$aData['um']-$aData['tm'],
					'freebyte'=>$freebyte,
					'paybyte'=>0,
					'bonus'=>$bonus
				);
			}
			$where=$this->Db->quoteInto('id = ?', $aData['id']);
			$this->Db->update('usergroup', $aUpdateData, $where);
		}
		return array('success'=>true);
	}

	 /**
	  * Снимает абонплату за месяц
	  */ 
	public function DailyFee($id,$force=true,$opdate=false)
	{
		$sql = $this->Db->select()
						->from('usergroup', array('id','um'=>'deposit','md'=>'mindeposit','dateofcheck','now'=> new Zend_Db_Expr("UNIX_TIMESTAMP(CURDATE())")))
						->join('tariffs', 'usergroup.id_tariff=tariffs.id', array('tm'=>'dailyfee'))
						->where('usergroup.id=?', $id)
						->orWhere('usergroup.username like ?', $id);
		if ($force==false) $sql->where('access=1');
		$aAllData = $this->Db->fetchAll($sql);
		foreach ($aAllData as $aData){
			if (($dateofcheck=strtotime($opdate))===false) $dateofcheck=$aData['now'];
			$dateofcheck += $aData['dateofcheck']*86400;
			if (($force==false)&&($aData['um']-$aData['md']<$aData['tm'])&&($dateofcheck<=$aData['now'])){
//			if (($force==false)&&($aData['um']-$aData['md']<$aData['tm']))
				$aUpdateData = array(
					'access'=>0
				);
			} else {
				$aUpdateData = array(
					'deposit'=>$aData['um']-$aData['tm']
				);
			}
			$where=$this->Db->quoteInto('id = ?', $aData['id']);
			$this->Db->update('usergroup', $aUpdateData, $where);
		}
		return array('success'=>true);
	}
	
	/**
	 * Изменяет тариф для пользователя
	 * @param $param array
	 */
	public function ChangeTariff($param){
		$username = $param['username'];
		$aWhere[] = $this->Db->quoteInto('username = ?', $username);
		$aWhere[] = 'attribute = "mpd-filter" or attribute = "mpd-limit"';
		$this->Db->delete('radreply', $aWhere);
		$sql = $this->Db->select()
					->from('tariffs',array('id_tariff'=>'id','dateofcheck','check_mb','mindeposit','freemblimit','id_sluice'))
					->where('id = ?',$param['id_tariff']);
		$aEditData = $this->Db->fetchRow($sql);
		$aEditData ['repl_status'] = 0;
		$where = $this->Db->quoteInto('username = ?', $username);
		$this->Db->update('usergroup', $aEditData, $where);
		$aKey = array('id_tariff','in_pipe', 'out_pipe' );
		$aEditData = Utils::ClearPostData($param, $aKey);
		$this->_SetFltReplyAttr($username, $aEditData);
		return array('success'=>true);
	}	

	/**
	 * Списывает задолженность для пользователя
	 * @param $param array
	 */
	public function DebtsOff($id){
		$where = $this->Db->quoteInto('id = ?', $id);
		$aEditData = array('deposit'=>0);
		$this->Db->update('usergroup', $aEditData, $where);
		return array('success'=>true);
	}	

	public function getScript(){
		return $this->_script;
	}

	/**
	 * Возвращает информацию о тарифе пользователя
	 * @param $id
	 * @return array
	 */
	public function GetTariffInfo($id=null)
	{
		if (null == $id)
			$id = Context::GetUserData('id');
		$sql = $this->Db->select()
					->from('tariffs',array('tariffname','freebyte','freemblimit','bonus','monthlyfee',
							'dailyfee','mindeposit','dateofcheck'))
					->joinLeft('usergroup', 'usergroup.id_tariff=tariffs.id', array())
					->where('usergroup.id = ?', $id);
		$aRow = $this->Db->fetchRow($sql);
		Utils::encode($aRow);
		if ($aRow){
			$aRow['freebyte']=sprintf("%0.3f", $aRow['freebyte']/1024/1024);
			$aRow['freemblimit']=sprintf("%0.3f", $aRow['freemblimit']/1024/1024);
			$aRow['bonus']=sprintf("%0.3f", $aRow['bonus']/1024/1024);
			$aRow['mindeposit']=sprintf("%0.2f", $aRow['mindeposit']/1024/1024);
			$aRow['monthlyfee']=sprintf("%0.2f", $aRow['monthlyfee']/1024/1024);
			$aRow['dailyfee']=sprintf("%0.2f", $aRow['dailyfee']/1024/1024);
		}
		return $aRow;
	}

	/**
	 * Возвращает информацию о зонах тарифа пользователя
	 * @param $id
	 * @return array
	 */
	public function GetInTariffInfo($id=null)
	{
		if (null == $id)
			$id = Context::GetUserData('id');
		$sql = $this->Db->select()
					->from('tariffs',array('id','weightmb','pricein','priceout','in_pipe','out_pipe'))
					->joinLeft('usergroup', 'usergroup.id_tariff=tariffs.id', array())
					->joinLeft('flags', 'flags.id=tariffs.flag', array('flagname'))
					->where('usergroup.id = ?', $id);
		$aRow = $this->Db->fetchRow($sql);
		$idtariff = $aRow['id'];
		unset($aRow['id']);
		$aRow['zonename']='Internet';
		$sql = $this->Db->select()
					->from('intariffs',array('weightmb','pricein','priceout','in_pipe','out_pipe'))
					->joinLeft('flags', 'flags.id=intariffs.flag', array('flagname'))
					->joinLeft('zones', 'zones.id=intariffs.idzone', array('zonename'))
					->where('idtariff = ?', $idtariff);
		$aResult = $this->Db->fetchAll($sql);
		array_unshift($aResult,$aRow);
		Utils::encode($aResult);
		foreach ($aResult as &$item){
			$item['in_pipe']=$item['in_pipe']/8*1024;
			$item['out_pipe']=$item['out_pipe']/8*1024;
		}
		return $aResult;
	}

	/**
	 * Начисляет и снимает абонплату за месяц
	 * @return 
	 * @param object $param
	 */	
	public function PayMonthly($param){
		$param['amountdeposit']=$param['amount'];
		$param['apply']= false;
		$param['amountfreebyte']=0;
		$param['amountbonus']=0;
		$param['amountpaybyte']=0;
		$oPayments = new Payments();
		$aResult = $oPayments->Add($param);
		if ($aResult['success']===true && $param['fee']=='1'){
			$this->On($param['iduser']);
			$indulgence = $this->GetUserInfo(array('id'=>$param['iduser'],'dateofcheck'=>0));
			if ($indulgence!==false)
				$aResult = $this->MonthlyFee($param['iduser'],false);
		}
		return $aResult;
	}
	
	/**
	 * Начисляет и снимает абонплату за день
	 * @return 
	 * @param object $param
	 */
	public function PayDaily($param){
		$param['amountdeposit']=$param['amount'];
		$param['apply']= false;
		$param['amountfreebyte']=0;
		$param['amountbonus']=0;
		$param['amountpaybyte']=0;
		$oPayments = new Payments();
		$aResult = $oPayments->Add($param);
		if ($aResult['success'] && $param['fee']=='1'){
			$this->On($param['iduser']);
			$aResult = $this->DailyFee($param['iduser'],false);
		}
		return $aResult;
	}

	/**
	 * Начисляет доплату
	 * @return 
	 * @param object $param
	 */
	public function Pay($param){
		$param['amountdeposit']=0;
		$param['amountbonus']=0;
		$param['amountpaybyte']=$param['amountfreebyte'];
		$param['apply']= false;
		$oPayments = new Payments();
		$aResult = $oPayments->Add($param);
		return $aResult;
	}
}
?>
