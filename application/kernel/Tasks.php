<?php
class Tasks
{
	/**
	* Дискриптор базы данных
	* $var resource
	*/
	protected $Db=null;

	/**
     * Конструктор
     * @param Zend_Db_Adapter_Abstract $db Объект соединения с БД
	 */
	function __construct()
	{	
		$this->Db = Zend_Registry::get('db');
	}
	/**
	 * Список задач для дерева
	 */
	public function GetTreeList()
	{
		$sql = $this->Db->select()
					->from('taskattribute', array('id'=>'attrname', 'text'=>'description'))
					->order('prio ASC');
		$aData = $this->Db->fetchAll($sql);
		Utils::encode($aData);
		foreach ($aData as &$aRow)
		{
			$aRow['iconCls'] = 'task-tree';
			$aRow['leaf'] = true;
		}
		return $aData;
	}
	
	/**
	 * Список задач для грида
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($sort=null, $dir=null, $from=null, $tail=null, $query=null, $attrname='%')
	{
		$sql = $this->Db->select()
					->from('tasks', array('id','opdate', 'username', 'attribute'))
					->join('periods', 'tasks.id_period=periods.id', array('periodid'=>'id', 'period'=>'periodname'))
					->where('execresult = ?', '')
					->where('attribute LIKE ?',$attrname);
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		if ($from!=null && $tail!=null)
		{
			$sql->where('opdate >= ?', $from);
			$sql->where('opdate <= ?', $tail);
		}
		if ($query)
			$sql->where("tasks.username LIKE ?", '%'.Utils::decode(str_replace('*','%',$query)).'%');

		switch ($attrname)
		{
			case '%':
				$sql->join('taskattribute', 'UPPER(tasks.attribute)=UPPER(taskattribute.attrname)', array('text'=>'description'));
				$sql->joinLeft('tariffs', 'tasks.value=tariffs.id', array('valueid'=>'id','value'=>'tariffname'));
			break;	
			case 'Change-tariff':
				$sql->join('tariffs', 'tasks.value=tariffs.id', array('valueid'=>'id','value'=>'tariffname'));
			break;
		}
		
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		foreach ($aRows as &$aRow)
		{
			$aRow['username'] = str_replace('%', 'Все', $aRow['username']);
		}
		return $aRows;
	}

	/**
	 * Список выполненных задач
	 */
	public function GetOldList($start=null, $limit=null, $sort=null, $dir=null, $query=null)
	{
		$sql = $this->Db->select()
					->from('tasks', array('COUNT(*)'))
					->where('execresult != ?', '');
		$aCount = $this->Db->fetchOne($sql);
		$sql = $this->Db->select()
					->from('tasks', array('opdate', 'username', 'execdate', 'execresult'))
					->where('execresult != ?', '')
					->join('taskattribute', 'UPPER(tasks.attribute)=UPPER(taskattribute.attrname)', array('attribute'=>'description'))
					->joinLeft('tariffs', 'tasks.value=tariffs.id', array('value'=>'tariffname'));
		if ($query)
			$sql->where("tasks.username LIKE ?", '%'.Utils::decode(str_replace('*','%',$query)).'%');
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		if ($start!=null && $limit!=null )
			$sql->limit($limit, $start);
		$aRows = $this->Db->fetchAll($sql);
		//Utils::debug($sql->__toString());
		Utils::encode($aRows);
		foreach ($aRows as &$aRow)
		{
			$aRow['username'] = str_replace('%', 'Все', $aRow['username']);
		}
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}
	
	/**
	 * wintask
	 * @param attr
	 */
	public function WinTask ($attr)
	{
		$oTariffs = new Tariffs();
		$aResult = array('success'	=> true);
		$sql = $this->Db->select()
						->from('periods');
		$aResult['period'] = $this->Db->fetchAll($sql);
		Utils::encode($aResult);
		switch ($attr){
			case 'Change-tariff':
				$aResult['tariff'] = $oTariffs->GetSmallList();
		}
		return $aResult;
	}
	
	/**
	 * Создать задачу
	 * @param
	 */ 
	 public function Add($param)
	 {
	 	if ($param['username']!='%')
		{
			$sql = $this->Db->select()
							->from	('usergroup', array('username'))
							->where ('id = ?', $param['username']);
			$param['username'] = $this->Db->fetchOne($sql);
		}
		$aKey = array('attribute', 'username', 'opdate', 'value', 'id_period');
		$aInsData = Utils::ClearPostData($param, $aKey);
		array_walk($aInsData, array('Utils', 'array_decode'));
		$this->Db->insert('tasks', $aInsData);
		$aResult = array('success'=>true);
		return $aResult;
	 }

	/**
	 * Изменить задачу
	 * @param
	 */ 
	 public function Edit($param)
	 {
	 	if ($param['username']!='%')
		{
			$sql = $this->Db->select()
							->from	('usergroup', array('username'))
							->where ('id = ?', $param['username']);
			$param['username'] = $this->Db->fetchOne($sql);
		}
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aKey = array('attribute', 'username', 'opdate', 'value', 'id_period');
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		array_walk($aUpdateData, array('Utils', 'array_decode'));
		$this->Db->update('tasks', $aUpdateData, $where);
		$aResult = array('success'=>true);
		return $aResult;
	 }

	/**
	 * Повторная задача
	 * @return 
	 * @param object $id
	 */
	public function Periodic($id){
		$sql = $this->Db->select()
						->from('tasks')
						->where('id = ?',$id);
		$aTask = $this->Db->fetchRow($sql);
		$aInsData = array();
		switch ($aTask['id_period']){
			case '2'://daily
				$aInsData = array(
					'attribute'	=> $aTask['attribute'], 
					'username'	=> $aTask['username'],
					'opdate'	=> new Zend_Db_Expr("adddate('{$aTask['opdate']}', interval 1 day)"),
					'value'		=> $aTask['value'],
					'id_period'	=> $aTask['id_period']
				);
				$this->Db->insert('tasks', $aInsData);
				break;
			case '3'://monthly
				$aInsData = array(
					'attribute'	=> $aTask['attribute'], 
					'username'	=> $aTask['username'],
					'opdate'	=> new Zend_Db_Expr("adddate('{$aTask['opdate']}', interval 1 month)"),
					'value'		=> $aTask['value'],
					'id_period'	=> $aTask['id_period']
				);
				$this->Db->insert('tasks', $aInsData);
				break;
		}
		$aResult = array('success'=>true);
		return $aResult;
		
	}
	
	/**
	 * Удаляет задачу
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$where = $this->Db->quoteInto('id=?',$id);
		$this->Db->delete('tasks', $where);
		$aResult = array('success'=>true);
		return $aResult;
	}

	 /**
	  * Возвращает актуальные задачу по атрибуту для пользователя
	  * param $username
	  * param $attr
	  */
	 public function GetTaskByAttr($attr,$username='%')
	 {
	 	$sql = $this->Db->select()
						->from('tasks')
						->where('attribute = ?',$attr)
						->where('opdate <= now()')
						->where('execresult <> ?','Successful')
						->order('opdate asc');
		if ($username=='%')
			$sql->where("username like '%'");
		else
			$sql->where("username = ? or username = '%'",$username);

		return $this->Db->fetchAll($sql);
	 } 
	 
	 /**
	  * Изменяет статус задачи
	  */
	 public function SetStatus($id,$status)
	 {
		$aUpdateData=array(
			'execdate'=>new Zend_Db_Expr('now()'),
			'execresult'=>$status
		);
		$where = $this->Db->quoteInto('id=?',$id);
		$this->Db->update('tasks', $aUpdateData, $where);
	 } 
}
