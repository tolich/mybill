<?php
class Pools
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
	 * Список пулов
	 */
	public function GetSmallList()
	{
		$sql = $this->Db->select()
					->from('pools', array('poolval', 'poolname'))
					->order("poolname DESC");
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		return $aRows;
	}
	/**
	 * Список пулов
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($sort=null, $dir=null)
	{
		$sql = $this->Db->select()
					->from('pools', array('id', 'poolname', 'poolval'));
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		return $aRows;
	}
	
	/**
	 * Добавляет пул
	 * @param $param array
	 */
	public function Add ($param)
	{
		$aKey = array('poolname', 'poolval');
		$aInsData = Utils::ClearPostData($param, $aKey);
		array_walk($aInsData, array('Utils', 'array_decode'));
		$r = $this->Db->insert('pools', $aInsData);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('error'=>'Error');
		return $aResult;
	}

	/**
	 * Изменяет пул
	 * @param $param array
	 */
	public function Edit ($param)
	{
		$aKey = array('poolname', 'poolval');
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		array_walk($aUpdateData, array('Utils', 'array_decode'));
		$r = $this->Db->update('pools', $aUpdateData, $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}

	/**
	 * Удаляет пул
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$where = $this->Db->quoteInto('id=?',$id);
		$r = $this->Db->delete('pools', $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}

}
