<?php
/**
 * Шлюзы
 */
class Sluices
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
	 * Список шлюзов для фильтра в меню
	 */
	public function GetFilterList()
	{
		$sql = $this->Db->select()
						->from('sluice', array('id'=>'sluicename', 'text'=>'sluicename'));
		$aData = $this->Db->fetchAll($sql);
		//array_unshift($aData, array('id'=>'Не установлен!', 'text'=>'Не установлен!'));
		Utils::encode($aData);
		return $aData;
	}
	
	/**
	 * Список шлюзов для комбобокса
	 */
	public function GetSmallList()
	{
		$sql = $this->Db->select()
					->from('sluice', array('id', 'sluicename'))
					->order('id ASC');
		$aData = $this->Db->fetchAll($sql);
//		array_unshift($aData, array('id'=>0, 'sluicename'=>'По-умолчанию'));
		Utils::encode($aData);
		return $aData;
	}

	/**
	 * Список шлюзов
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($sort=null, $dir=null)
	{
		$sql = $this->Db->select()
					->from('sluice', array('id', 'sluicename', 'sluiceval'));
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		return $aRows;
	}
	
	/**
	 * Добавляет шлюз
	 * @param $param array
	 */
	public function Add ($param)
	{
		$aKey = array('sluicename', 'sluiceval');
		$aInsData = Utils::ClearPostData($param, $aKey);
		array_walk($aInsData, array('Utils', 'array_decode'));
		$r = $this->Db->insert('sluice', $aInsData);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('error'=>'Error');
		return $aResult;
	}

	/**
	 * Изменяет шлюз
	 * @param $param array
	 */
	public function Edit ($param)
	{
		$aKey = array('sluicename', 'sluiceval');
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		array_walk($aUpdateData, array('Utils', 'array_decode'));
		$r = $this->Db->update('sluice', $aUpdateData, $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}

	/**
	 * Удаляет шлюз
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$where = $this->Db->quoteInto('id=?',$id);
		$r = $this->Db->delete('sluice', $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}

	
}
