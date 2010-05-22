<?php
/**
 *
 */
class Payments
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
	 * Создает новый платеж
	 * @param $param array
	 */
	public function Add($param)
	{
		$aResult = array();
		$aKey = array('iduser','amount', 'amountdeposit', 'amountfreebyte', 'amountpaybyte', 'amountbonus', 'description','id_paymentgroup');
		$aInsData = Utils::ClearPostData($param, $aKey);
		$aInsData['amount']=$aInsData['amount']*1024*1024;
		$aInsData['amountdeposit']=$aInsData['amountdeposit']*1024*1024;
		$aInsData['amountfreebyte']=$aInsData['amountfreebyte']*1024*1024;
		$aInsData['amountpaybyte']=$aInsData['amountpaybyte']*1024*1024;
		$aInsData['amountbonus']=$aInsData['amountbonus']*1024*1024;
		$aInsData['datepayment']=date('Y-m-d H:i:s');
		array_walk($aInsData, array('Utils', 'array_decode'));
		$r = $this->Db->insert('payments', $aInsData);
		if ($r)
		{
			if ($param['apply']=='false'||$param['apply']===false)
			{
				$id = $this->Db->lastInsertId();
				$res = $this->_Apply($id);
				if ($res===true)
					$aResult = array('success'=>true);
				else
					$aResult = array('errors'=>array(array('id'=>1, 'msg'=>$res)));
			}
			else
				$aResult = array('success'=>true);
		}
		else
		{
			$aResult = array('errors'=>array(array('id'=>2, 'msg'=>Utils::encode('Ошибка при создании платежа!'))));
		}
		return $aResult;
	}

	public function Edit($param)
	{
		$aResult = array();
		$aKey = array('id','amount', 'amountdeposit', 'amountfreebyte', 'amountbonus', 'description', 'id_paymentgroup');
		$aUpdData = Utils::ClearPostData($param, $aKey);
		$aUpdData['amount']=$aUpdData['amount']*1024*1024;
		$aUpdData['amountdeposit']=$aUpdData['amountdeposit']*1024*1024;
		$aUpdData['amountfreebyte']=$aUpdData['amountfreebyte']*1024*1024;
		$aUpdData['amountbonus']=$aUpdData['amountbonus']*1024*1024;
		array_walk($aUpdData, array('Utils', 'array_decode'));
		$where = $this->Db->quoteInto('id=?', $aUpdData['id']);
		$r = $this->Db->update('payments', $aUpdData, $where);
		if (false !== $r)
		{
			if ($param['apply']=='false')
			{
				$id = $aUpdData['id'];
				$res = $this->_Apply($id);
				if ($res===true)
					$aResult = array('success'=>true);
				else
					$aResult = array('errors'=>array(array('id'=>1, 'msg'=>$res)));
			}
			else
				$aResult = array('success'=>true);
		}
		else
		{
			$aResult = array('errors'=>array(array('id'=>3, 'msg'=>Utils::encode('Ошибка при редактировании платежа!'))));
		}
		return $aResult;
	}

	public function Delete($id)
	{
		$where = $this->Db->quoteInto('id=?', $id);
		$r = $this->Db->delete('payments', $where);
		if (false !== $r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array(array('id'=>5, 'msg'=>$r)));
		return $aResult;
	}

	/**
	 * Проводит платеж с заданым идентификатором
	 * @param $id int 
	 */
	public function Apply($id)
	{
		$res = $this->_Apply($id);
		if ($res===true)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array(array('id'=>1, 'msg'=>$res)));
		return $aResult;
	}
	
	private function _Apply($id)
	{
        $this->Db->beginTransaction();
		try {
			$sql = $this->Db->select()
						->from('acctperiod',array('id'))
						->where('status=0');
			$idAcctperiod=$this->Db->fetchOne($sql);
			$sql = $this->Db->select()
							->from	('usergroup', array('id', 'deposit', 'freebyte', 'bonus'))
							->join	('payments', 'usergroup.id=payments.iduser', array('amount', 'amountfreebyte', 'amountbonus', 'amountdeposit','amountpaybyte'))
							->where	('payments.id=?', $id);
			$aData = $this->Db->fetchRow($sql);
			$where = $this->Db->quoteInto('id = ?', $id);
			$aUpdateData = array(
				'status'=>'1', 
				'lastdeposit'=>$aData['deposit'], 
				'lastfreebyte'=>$aData['freebyte'], 
				'lastbonus'=>$aData['bonus'], 
				'id_acctperiod'=>$idAcctperiod
			);
			$this->Db->update('payments', $aUpdateData, $where);				
			$where = $this->Db->quoteInto('id = ?', $aData['id']);
			$aUpdateData = array(
				'deposit'=>new Zend_Db_Expr('deposit + '.$aData['amountdeposit']), 
				'freebyte'=>new Zend_Db_Expr('freebyte + '.$aData['amountfreebyte']), 
				'paybyte'=>new Zend_Db_Expr('paybyte + '.$aData['amountpaybyte']), 
				'bonus'=>new Zend_Db_Expr('bonus + '.$aData['amountbonus'])
			);
			$this->Db->update('usergroup', $aUpdateData, $where);				
		    $this->Db->commit();
	        return true;
		} catch (Exception $e) {
		    $this->Db->rollBack();
		    return $e->getMessage();
		}
	} 

	/**
	 * Список платежей
	 */
	public function GetList($start=null, $limit=null, $sort=null, $dir=null, $query=null, $status='%')
	{
	    $query = Utils::decode($query);
//		$sql = $this->Db->select()
//					->from('payments', array('COUNT(*)'))
//					->join('usergroup','payments.iduser=usergroup.id', array())
//					->where('payments.status LIKE ?', $status);
//		if ($query){
//			$sql-> where("username LIKE ?", '%'.$query.'%')
//				-> orWhere("name LIKE ?", '%'.$query.'%')
//				-> orWhere("surname LIKE ?", '%'.$query.'%')
//				-> orWhere("address LIKE ?", '%'.$query.'%');
//		}
//		$aCount = $this->Db->fetchOne($sql);
					
		$sql = $this->Db->select()
					->from('payments', array('id', 'datepayment', 'amount', 'amountdeposit', 'amountfreebyte',
							'amountbonus', 'lastdeposit', 'lastfreebyte', 'lastbonus', 'status', 'description'))
					->join('usergroup', 'payments.iduser=usergroup.id',array('username', 'name', 'surname', 'address'))
					->joinLeft('paymentgroup', 'payments.id_paymentgroup=paymentgroup.id',array('id_paymentgroup'=>'id','paymentname'=>'name'))
					->limit($limit,$start)
					->order("$sort $dir")
					->where('payments.status LIKE ?', $status);
		if ($query){
			$sql-> where("username LIKE ?", '%'.$query.'%')
				-> orWhere("name LIKE ?", '%'.$query.'%')
				-> orWhere("surname LIKE ?", '%'.$query.'%')
				-> orWhere("address LIKE ?", '%'.$query.'%');
		}
        $sql = Db::sql_calc_found_rows($sql);
		$aRows = $this->Db->fetchAll($sql);
        $aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');

		Utils::encode($aRows);
		foreach ($aRows as &$aRow)
		{
			$aRow['amount']=sprintf("%0.2f", $aRow['amount']/1024/1024);
			$aRow['amountfreebyte']=sprintf("%0.3f", $aRow['amountfreebyte']/1024/1024);
			$aRow['amountdeposit']=sprintf("%0.2f", $aRow['amountdeposit']/1024/1024);
			$aRow['amountbonus']=sprintf("%0.3f", $aRow['amountbonus']/1024/1024);
			$aRow['lastfreebyte']=sprintf("%0.3f", $aRow['lastfreebyte']/1024/1024);
			$aRow['lastdeposit']=sprintf("%0.2f", $aRow['lastdeposit']/1024/1024);
			$aRow['lastbonus']=sprintf("%0.3f", $aRow['lastbonus']/1024/1024);
		}
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}
	
	/**
	 * Список платежей по дням
	 */
	public function GetListByDay($start=null, $limit=null, $sort=null, $dir=null)
	{
//		$sql = $this->Db->select()
//						->from('payments', array('count'=>new Zend_Db_Expr("COUNT(DISTINCT DATE(datepayment), paymentgroup.name)")))
//    					->joinLeft('paymentgroup', 'payments.id_paymentgroup=paymentgroup.id',array('paymentname'=>'name'))
//						->group('paymentname')
//						->where('status=1');
//		$aCount = $this->Db->fetchOne($sql);
		$sql = $this->Db->select()
						->from('payments', array('rdate'=>new Zend_Db_Expr('DATE(datepayment)'), 'sumamount'=>new Zend_Db_Expr('SUM(amount)'),'count'=>new Zend_Db_Expr('COUNT(*)')))
						->where('status=1')
    					->joinLeft('paymentgroup', 'payments.id_paymentgroup=paymentgroup.id',array('paymentname'=>'name'))
						->group('rdate')
						->group('paymentname')
						->limit($limit, $start)
						->order("$sort $dir");
        $sql = Db::sql_calc_found_rows($sql);
		$aRows = $this->Db->fetchAll($sql);
        $aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');
        Utils::encode($aRows);
		foreach ($aRows as &$aRow)
		{
			$aRow['sumamount']=sprintf("%0.2f", $aRow['sumamount']/1024/1024);
		}	
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;

	}

	/**
	 * Список платежей по месяцам
	 */
	public function GetListByMonth($start=null, $limit=null, $sort=null, $dir=null)
	{
//		$sql = $this->Db->select()
//						->from('payments', array('count'=>new Zend_Db_Expr("COUNT(DISTINCT date_format(datepayment, '%Y-%m-01')), paymentgroup.name")))
//    					->joinLeft('paymentgroup', 'payments.id_paymentgroup=paymentgroup.id',array('paymentname'=>'name'))
//						->group('paymentname')
//						->where('status=1');
//		$aCount = $this->Db->fetchOne($sql);

		$sql = $this->Db->select()
						->from('payments', array('rdate'=>new Zend_Db_Expr("date_format(datepayment, '%Y-%m-01')"), 'sumamount'=>new Zend_Db_Expr('SUM(amount)'),'count'=>new Zend_Db_Expr('COUNT(*)'),'avg'=>new Zend_Db_Expr('AVG(amount)')))
						->where('status=1')
    					->joinLeft('paymentgroup', 'payments.id_paymentgroup=paymentgroup.id',array('paymentname'=>'name'))
						->group('rdate')
						->group('paymentname')
						->limit($limit, $start)
						->order("$sort $dir");
        $sql = Db::sql_calc_found_rows($sql);
		$aRows = $this->Db->fetchAll($sql);
        $aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');
        Utils::encode($aRows);
		
		foreach ($aRows as &$aRow)
		{
//			$aRow['rdate']=$aRow['rdate']."/1";
			$aRow['sumamount']=sprintf("%0.2f", $aRow['sumamount']/1024/1024);
			$aRow['avg']=sprintf("%0.2f", $aRow['avg']/1024/1024);
		}	
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;

	}
    
    public function DestroySettings($post){
        $id = trim($post,'"');
        $where = $this->Db->quoteInto('id_paymentgroup=?', $id);
        $this->Db->delete('paymentuser',$where);
        $where = $this->Db->quoteInto('id=?', $id);
        $this->Db->delete('paymentgroup',$where);
        return array('success'=>true);
    }

    public function UpdateSettings($post){
        $aData = Zend_Json::decode($post);
   		Utils::decode($aData);
        $id =  $aData['id'];
        unset($aData['id']);
        if (isset($aData['users'])){
            $where = $this->Db->quoteInto('id_paymentgroup=?', $id);
            $this->Db->delete('paymentuser',$where);
            $aUsers = Zend_Json::decode($aData['users']);
            unset($aData['users']);
            foreach($aUsers as $v){
                $this->Db->insert('paymentuser',array(
                    'id_admin' =>$v,
                    'id_paymentgroup' => $id
                ));
            }
        }
        if (count($aData)){
            $where = $this->Db->quoteInto('id=?', $id);
            $this->Db->update('paymentgroup',$aData,$where);
        }
        return array('success'=>true);
    }

    public function CreateSettings($post){
        $aData = Zend_Json::decode($post);
   		Utils::decode($aData);
        $this->Db->insert('paymentgroup',$aData);
        return array('success'=>true);
    }
    
    public function ReadSettings(){
        $sql = $this->Db->select()
                    ->from('paymentuser',array('id_paymentgroup', 'id_admin'));
        $aUsers = $this->Db->fetchAll($sql);
        $sql = $this->Db->select()
                    ->from('paymentgroup',array('id','name','description'));
        $aGroups = $this->Db->fetchAll($sql);
   		Utils::encode($aGroups);
        foreach ($aGroups as &$v){
            $users = array_filter($aUsers,create_function('$var', 'return $var["id_paymentgroup"]=='.$v['id'].';'));
            array_walk($users,create_function('&$item', '$item=$item["id_admin"];'));
            $v['users'] = Zend_Json::encode(array_values($users));
        }
        unset($v);
        $aData = array(
            'data' => $aGroups
        );
        return $aData;
    }

    public function GetGroups(){
        $sql = $this->Db->select()
                    ->from('paymentgroup',array('id','name'));
        $aData = $this->Db->fetchAll($sql);
   		Utils::encode($aData);
        return $aData;
    }
    
}

