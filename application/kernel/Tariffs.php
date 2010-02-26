<?php
/**
 * Тарифы
 */
class Tariffs
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
	 * Список тарифов для фильтра в меню
	 */
	public function GetFilterList()
	{
		$sql = $this->Db->select()
						->from('tariffs', array('id'=>'tariffname', 'text'=>'tariffname'));
		$aData = $this->Db->fetchAll($sql);
		Utils::encode($aData);
		return $aData;
	}
	

	/**
	 * Список тарифов
	 */
	public function GetSmallList()
	{
		$sql = $this->Db->select()
					->from('tariffs', array('id', 'tariffname', 'mindeposit', 'freemblimit','dateofcheck','id_sluice','check_mb'))
					->where('tariffs.del = ?', 0)
					->order("tariffname DESC");
		$aData = $this->Db->fetchAll($sql);
		Utils::encode($aData);
		foreach ($aData as &$aRow){
			$aRow['freemblimit']=sprintf("%0.3f", $aRow['freemblimit']/1024/1024);
			$aRow['mindeposit']=sprintf("%0.2f", $aRow['mindeposit']/1024/1024);
		}
		return $aData;
	}

	/**
	 * Список тарифов для дерева
	 */
	public function GetTreeList()
	{
		$sql = $this->Db->select()
					->from('tariffs', array('id', 'text'=>'tariffname'))
					->where('tariffs.del = ?', 0)
					->order('tariffname ASC');
		$aData = $this->Db->fetchAll($sql);
		Utils::encode($aData);
		foreach ($aData as &$aRow)
		{
			$sql = $this->Db->select()
						->from('usergroup', array('count'=>new Zend_Db_Expr('COUNT(*)')))
						->where('id_tariff = ?', $aRow['id']);
			$aRow['count'] = $this->Db->fetchOne($sql);
			$aRow['text'] .= " ({$aRow['count']})"; 
			$aRow['iconCls'] = 'tariff_go';
			$aRow['leaf'] = true;
		}
		return $aData;
	}

	/**
	 * Список арифов для грида
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($sort=null, $dir=null)
	{
		$sql = $this->Db->select()
					->from('tariffs')
					->joinLeft('sluice', 'tariffs.id_sluice=sluice.id', array('sluicename'));
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		foreach ($aRows as &$aRow)
		{
			$sql = $this->Db->select()
						->from('usergroup', array('count'=>new Zend_Db_Expr('COUNT(*)')))
						->where('id_tariff = ?', $aRow['id']);
			$aRow['count'] = $this->Db->fetchOne($sql);
			$aRow['dailyfee']=sprintf("%0.2f", $aRow['dailyfee']/1024/1024);
			$aRow['monthlyfee']=sprintf("%0.2f", $aRow['monthlyfee']/1024/1024);
			$aRow['freebyte']=sprintf("%0.3f", $aRow['freebyte']/1024/1024);
			$aRow['freemblimit']=sprintf("%0.3f", $aRow['freemblimit']/1024/1024);
			$aRow['mindeposit']=sprintf("%0.2f", $aRow['mindeposit']/1024/1024);
			$aRow['bonus']=sprintf("%0.3f", $aRow['bonus']/1024/1024);
//			$aRow['pricein']=sprintf("%0.2f", $aRow['pricein']/1024/1024);
//			$aRow['priceout']=sprintf("%0.2f", $aRow['priceout']/1024/1024);
			//$aRow['pricein']=sprintf("%0.3f", $aRow['pricein']);
			//$aRow['priceout']=sprintf("%0.3f", $aRow['priceout']);
			//$aRow['price']=sprintf("%0.3f", $aRow['price']);
			if ($aRow['id_sluice']=='0') $aRow['sluicename']='Не установлен!';
		}
		return $aRows;
	}

	/**
	 * Список арифов для грида
	 * @param $id string
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetIntariffList($id, $sort=null, $dir=null)
	{
		$nums = array('0','1','2','3','4','5','6');
//		$days = array('Вс. ', 'Пн. ', 'Вт. ', 'Ср. ', 'Чт. ', 'Пт. ', 'Сб. ');
//		$cb	  = array('cb_0', 'cb_1', 'cb_2', 'cb_3', 'cb_4', 'cb_5', 'cb_6');
		$sql = $this->Db->select()
					->from('intariffs')
					->join('flags', 'intariffs.flag=flags.id', array('flagname'))
					->joinLeft('zones', 'intariffs.idzone=zones.id', array('zonename','action'))
					->where('idtariff=?', $id);
		if ($sort!=null && $dir!=null)
			$sql->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		foreach ($aRows as &$aRow)
		{
			
//			foreach ($cb as $key=>$val)
//			{
//				if (strpos($aRow['days'], (string)$key)!==false)
//					$aRow[$val] = 1;
//				else
//					$aRow[$val] = 0;
//			}	
//			$aRow['pricein']=sprintf("%0.2f", $aRow['pricein']/1024/1024);
//			$aRow['priceout']=sprintf("%0.2f", $aRow['priceout']/1024/1024);
			$aRow['allow']=$aRow['action']==1;
			$aRow['deny']=$aRow['action']==0;
			$aRow['pricein']=sprintf("%0.2f", $aRow['pricein']);
			$aRow['priceout']=sprintf("%0.2f", $aRow['priceout']);
//			$aRow['days']=trim(str_replace($nums, $days, $aRow['days']));
		}
		return $aRows;
	}

	/**
	 * Добавляет тариф
	 * @param $param array
	 */
	public function Add ($param)
	{
		$aKey = array('tariffname', 'dailyfee','monthlyfee', 'freebyte', 'bonus', 'mindeposit', 'freemblimit', 'pricein', 'priceout','price',
						'in_pipe', 'out_pipe', 'dateofcheck', 'check_mb', 'id_sluice', 'weightmb');
		$param['dailyfee']=$param['dailyfee']*1024*1024;
		$param['monthlyfee']=$param['monthlyfee']*1024*1024;
		$param['freebyte']=$param['freebyte']*1024*1024;
		$param['freemblimit']=$param['freemblimit']*1024*1024;
		$param['mindeposit']=$param['mindeposit']*1024*1024;
		$param['bonus']=$param['bonus']*1024*1024;
//		$param['pricein']=sprintf("%0.2f", $param['pricein']*1024*1024);
//		$param['priceout']=sprintf("%0.2f", $param['priceout']*1024*1024);
		$aInsData = Utils::ClearPostData($param, $aKey);
		array_walk($aInsData, array('Utils', 'array_decode'));
		$this->Db->insert('tariffs', $aInsData);
		$aResult = array('success'=>true);
		return $aResult;
	}


	/**
	 * Изменяет тариф
	 * @param $param array
	 */
	public function Edit ($param)
	{
		$aKey = array('tariffname', 'dailyfee', 'monthlyfee', 'freebyte', 'bonus', 'mindeposit', 'freemblimit', 'pricein', 'priceout','price',
						'in_pipe', 'out_pipe', 'dateofcheck', 'check_mb', 'id_sluice', 'weightmb');
		$where = $this->Db->quoteInto('id=?',$param['id']);
		$param['dailyfee']=$param['dailyfee']*1024*1024;
		$param['monthlyfee']=$param['monthlyfee']*1024*1024;
		$param['freebyte']=$param['freebyte']*1024*1024;
		$param['freemblimit']=$param['freemblimit']*1024*1024;
		$param['mindeposit']=$param['mindeposit']*1024*1024;
		$param['bonus']=$param['bonus']*1024*1024;
//		$param['pricein']=sprintf("%0.2f", $param['pricein']*1024*1024);
//		$param['priceout']=sprintf("%0.2f", $param['priceout']*1024*1024);
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		array_walk($aUpdateData, array('Utils', 'array_decode'));
		$this->Db->update('tariffs', $aUpdateData, $where);
		$aResult = array('success'=>true);
		return $aResult;
	}

	/**
	 * Удаляет тариф
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$this->Db->beginTransaction();
		try{
			$where = $this->Db->quoteInto('idtariff=?',$id);
			$this->Db->delete('intariffs', $where);
			$where = $this->Db->quoteInto('id_tariff=?',$id);
			$this->Db->update('usergroup', array('id_tariff'=>0), $where);
			$where = $this->Db->quoteInto('id=?',$id);
			$this->Db->delete('tariffs', $where);
			$this->Db->commit();
			$aResult = array('success'=>true);
		} catch (Exception $e){	
			$this->Db->rollBack();
			$aResult = array('errors'=>array('msg'=>$e->getMessage()));
		}
		return $aResult;
	}
	
	/**
	 * wintariff 
	 */
	public function WinTariff ()
	{
	 	$oSluices = new Sluices();
		$sluice = $oSluices->GetSmallList();
		$aResult = array(
			'success'	=> true,
			'sluice'	=> $sluice
		);
		return $aResult;
	}

	/**
	 * wintariff 
	 */
	public function WinInTariff ()
	{
	 	$oZones = new Zones();
		$zone = $oZones->GetSmallList();
		//--- Возможно перенести работу с флагами в отдельный класс
		$sql = $this->Db->select()
						->from('flags', array('id', 'flagname'));
		$flag = $this->Db->fetchAll($sql);

		foreach ($flag as &$aRow)
			array_walk($aRow, array('Utils', 'array_encode'));
		//---
		$aResult = array(
			'success'	=> true,
			'zone'		=> $zone,
			'flag'		=> $flag
		);
		return $aResult;
	}
	
	/**
	 * Добавляет зону
	 * @param $param array
	 */
	public function AddZone ($param)
	{
		$aKey = array('days','flag','idtariff','idzone','in_pipe','out_pipe','pricein','priceout','weightmb'); //,'timestart','timestop');
		//$aDays = Utils::ClearPostData($param, array('cb_0', 'cb_1', 'cb_2', 'cb_3', 'cb_4', 'cb_5', 'cb_6'));
		//$param['days']= $this->_makeDays($aDays);
//		$param['pricein']=$param['pricein']*1024*1024;
//		$param['priceout']=$param['priceout']*1024*1024;
		$aInsData = Utils::ClearPostData($param, $aKey);
		array_walk($aInsData, array('Utils', 'array_decode'));
		$this->Db->insert('intariffs', $aInsData);
		$aResult = array('success'=>true);
		return $aResult;
	}

	/**
	 * Изменяет зону
	 * @param $param array
	 */
	public function EditZone ($param)
	{
		$aKey = array('days','flag','idtariff','idzone','in_pipe','out_pipe','pricein','priceout','weightmb'); //,'timestart','timestop');
		//$aDays = Utils::ClearPostData($param, array('cb_0', 'cb_1', 'cb_2', 'cb_3', 'cb_4', 'cb_5', 'cb_6'));
		$where = $this->Db->quoteInto('id=?',$param['id']);
		//$param['days']= $this->_makeDays($aDays);
//		$param['pricein']=$param['pricein']*1024*1024;
//		$param['priceout']=$param['priceout']*1024*1024;
		$aUpdateData = Utils::ClearPostData($param, $aKey);
		array_walk($aUpdateData, array('Utils', 'array_decode'));
		$this->Db->update('intariffs', $aUpdateData, $where);
		$aResult = array('success'=>true);
		return $aResult;
	}
	
	/**
	 * Удаляет зону из тарифа
	 * @param $id int
	 */
	public function DeleteZone ($id)
	{
		$where = $this->Db->quoteInto('id=?',$id);
		$this->Db->delete('intariffs', $where);
		$aResult = array('success'=>true);
		return $aResult;
	}
	
	/**
	 * Применяет изменения в тарифе у клиентов
	 * @param $id int
	 * @param $path
	 */
	public function Apply ($id, $path)
	{
		$oUsers = new Users();
		switch($path)
		{
			case 'zone':
				$oUsers->ChangeZone($id);	
			break;					
			case 'sluice':
				$sql = $this->Db->select()
								->from('tariffs', array('id_sluice'))
								->where('id=?',$id);
				$aTariff= $this->Db->fetchRow($sql);
				$oUsers->ChangeSluice($id, $aTariff);	
			break;					
			case 'min':
				$sql = $this->Db->select()
								->from('tariffs', array('mindeposit', 'freemblimit'))
								->where('id=?',$id);
				$aTariff = $this->Db->fetchRow($sql);
				$oUsers->ChangeMin($id, $aTariff);	
			break;					
			case 'all':
				$sql = $this->Db->select()
								->from('tariffs', array('id_sluice', 'mindeposit', 'freemblimit'))
								->where('id=?',$id);
				$aTariff = $this->Db->fetchRow($sql);
				$oUsers->ChangeAll($id, $aTariff);	
			break;					
		}
		$aResult = array('success'=>true);
		return $aResult;
	}

	public function ApplyAll(){
		$oUsers = new Users();
		$sql = $this->Db->select()
						->from('tariffs', array('id','id_sluice', 'mindeposit', 'freemblimit'));
		$aTariffs = $this->Db->fetchAll($sql);
		foreach ($aTariffs as $aTariff){
			$oUsers->ChangeAll($aTariff['id'], Utils::ClearPostData($aTariff,array('id_sluice', 'mindeposit', 'freemblimit')));	
		}
	}

	/**
	 * Создает days
	 * @param array 
	 */
	private function _makeDays($aMask)
	{
		$days='';
		foreach ($aMask as $key=>$mask)
		{
			if (strtolower($mask)=='true') $days.= substr($key, 3);
		}
		return $days;
	}
}
?>
