<?php
/**
 * NAS
 */
class Nas
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
	 * Список NAS
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($sort=null, $dir=null)
	{
		$sql = $this->Db->select()
					->from('nas', array('id','nasname','shortname','description','ports','username','password'));
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		return $aRows;
	}
	
	/**
	 * Добавляет NAS
	 * @param $param array
	 */
	public function Add ($param)
	{
		$aKey = array('nasname','shortname','nastype','description','ports','username','password');
		$aInsData = Utils::ClearPostData($param, $aKey);
		array_walk($aInsData, array('Utils', 'array_decode'));
		$r = $this->Db->insert('nas', $aInsData);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('error'=>'Error');
		return $aResult;
	}

	/**
	 * Изменяет NAS
	 * @param $param array
	 */
	public function Edit ($param)
	{
		$aKey = array('nasname','shortname','nastype','description','ports','username','password');
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		array_walk($aUpdateData, array('Utils', 'array_decode'));
		$r = $this->Db->update('nas', $aUpdateData, $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}

	/**
	 * Удаляет NAS
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$where = $this->Db->quoteInto('id=?',$id);
		$r = $this->Db->delete('nas', $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}

	
}
?>
