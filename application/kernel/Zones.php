<?php
/**
 * Зоны
 */
class Zones
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
	 * Список зон для комбобокса
	 */
	public function GetSmallList()
	{
		$sql = $this->Db->select()
					->from('zones', array('id', 'zonename'))
					->order('id ASC');
		$aData = $this->Db->fetchAll($sql);
		Utils::encode($aData);
		return $aData;
	}

	/**
	 * Список зон
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($sort=null, $dir=null)
	{
		$sql = $this->Db->select()
					->from('zones', array('id', 'zonename', 'src','del','prio'));
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		foreach ($aRows as &$aRow)
		{
			if (ZONE_LIST_COLUMN)
				$aRow['src'] = preg_replace("/\s/", "\n", $aRow['src']);
		}
		return $aRows;
	}
	
	/**
	 * Добавляет зону
	 * @param $param array
	 */
	public function Add ($param)
	{
		$aKey = array('zonename', 'src', 'prio');
		$param['src'] = preg_replace("/\n/", " ", $param['src']);
		$param['src'] = preg_replace("/\s{2,}/", " ", trim($param['src']));
		$aInsData = Utils::ClearPostData($param, $aKey);
		array_walk($aInsData, array('Utils', 'array_decode'));
		$this->Db->insert('zones', $aInsData);
		$aResult = array('success'=>true);
		return $aResult;
	}

	/**
	 * Изменяет зону
	 * @param $param array
	 */
	public function Edit ($param)
	{
		$aKey = array('zonename', 'src', 'prio');
		$param['src'] = preg_replace("/\n/", " ", $param['src']);
		$param['src'] = preg_replace("/\s{2,}/", " ", trim($param['src']));
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		array_walk($aUpdateData, array('Utils', 'array_decode'));
		$this->Db->update('zones', $aUpdateData, $where);
		$aResult = array('success'=>true);
		return $aResult;
	}

	/**
	 * Удаляет зону
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$this->Db->beginTransaction();
		try{
			$where = $this->Db->quoteInto('idzone=?',$id);
			$this->Db->delete('intariffs', $where);
			$where = $this->Db->quoteInto('id=?',$id);
			$this->Db->delete('zones', $where);
			$this->Db->commit();
			$aResult = array('success'=>true);
		} catch (Exception $e){	
			$this->Db->rollBack();
			$aResult = AppResponse::failure($e->getMessage());
		}
		return $aResult;
	}

	/**
	 * Разрешает зону
	 * @param $param array
	 */
	public function Allow ($param)
	{
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aUpdateData = array('action'=>'1');
		$this->Db->update('zones', $aUpdateData, $where);
		$aResult = array('success'=>true);
		return $aResult;
	}

	/**
	 * Запрещает зону
	 * @param $param array
	 */
	public function Deny ($param)
	{
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aUpdateData = array('action'=>'0');
		$this->Db->update('zones', $aUpdateData, $where);
		$aResult = array('success'=>true);
		return $aResult;
	}
}

