<?php
class Reports
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
	 * Список платежей
	 */
	public function GetStatList($start=null, $limit=null, $sort=null, $dir=null, $username=null)
	{
		if (null===$username) $username = Context::GetUserData('username');
					
		$sql = $this->Db->select()
					->from('radacct', array('acctstarttime', 'acctstoptime', 'acctsessiontime',
							'callingstationid'))
                    ->join('radacctzone', 'radacct.acctuniqueid=radacctzone.acctuniqueid', array(
                            'suminputoctets'=>new Zend_Db_Expr('SUM(radacctzone.acctinputoctets)'),
                            'sumoutputoctets'=>new Zend_Db_Expr('SUM(radacctzone.acctoutputoctets)'),
                    ))
					->where('radacct.username = ?', $username)
					->limit($limit, $start)
                    ->group('radacct.acctuniqueid')
					->order(array("$sort $dir"));
        $sql = Db::sql_calc_found_rows($sql);
		$aRows = $this->Db->fetchAll($sql);
		$aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}

	public function GetStatDayList($start=null, $limit=null, $sort=null, $dir=null, $username=null)
	{
		if (null===$username) $username = Context::GetUserData('username');
        $joinSql = $this->Db->select()
                            ->from('radacctzone', array(
                                    'acctuniqueid',
                                    'suminputoctets'=>new Zend_Db_Expr('SUM(radacctzone.acctinputoctets)'),
                                    'sumoutputoctets'=>new Zend_Db_Expr('SUM(radacctzone.acctoutputoctets)'),
                            ))
                            ->group('acctuniqueid')
        					->where('username = ?', $username);
                        
		$sql = $this->Db->select()
					->from('radacct', array(
                            'rdate'=>new Zend_Db_Expr('DATE(acctstarttime)'), 
                            'sumsessiontime'=>new Zend_Db_Expr('SUM(acctsessiontime)'),
                            'countsessions'=>new Zend_Db_Expr('COUNT(*)'),
						   ))
                    ->join(array('z'=>$joinSql), 'radacct.acctuniqueid=z.acctuniqueid', array(
                            'dsuminputoctets'=>new Zend_Db_Expr('SUM(suminputoctets)'),
                            'dsumoutputoctets'=>new Zend_Db_Expr('SUM(sumoutputoctets)'),
                    ))
					->where('radacct.username = ?', $username)
					->limit($limit, $start)
                    ->group('rdate')
					->order(array("$sort $dir"));
        $sql = Db::sql_calc_found_rows($sql);
		$aRows = $this->Db->fetchAll($sql);
		$aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}

	public function GetStatMonthList($start=null, $limit=null, $sort=null, $dir=null, $username=null)
	{
		if (null===$username) $username = Context::GetUserData('username');
        //За месяц
//		$sql = $this->Db->select()
//					->from('radacct', array(
//                            'rdate'=>new Zend_Db_Expr("date_format(acctstarttime, '%Y-%m-01')"), 
//                            'sumsessiontime'=>new Zend_Db_Expr('SUM(acctsessiontime)'),
//                            'suminputoctets'=>new Zend_Db_Expr('SUM(acctinputoctets)'),
//                            'sumoutputoctets'=>new Zend_Db_Expr('SUM(acctoutputoctets)'),
//                            'countsessions'=>new Zend_Db_Expr('COUNT(*)'),
//						   ))
//					->where('radacct.username = ?', $username)
//					->limit($limit, $start)
//                    ->group('rdate')
//					->order(array("$sort $dir"));

        //За отчетный период
        $joinSql = $this->Db->select()
                            ->from('radacctzone', array(
                                    'acctuniqueid',
                                    'suminputoctets'=>new Zend_Db_Expr('SUM(radacctzone.acctinputoctets)'),
                                    'sumoutputoctets'=>new Zend_Db_Expr('SUM(radacctzone.acctoutputoctets)'),
                            ))
                            ->group('acctuniqueid')
        					->where('username = ?', $username);
		$sql = $this->Db->select()
					->from('radacct', array(
                            'sumsessiontime'=>new Zend_Db_Expr('SUM(acctsessiontime)'),
                            'countsessions'=>new Zend_Db_Expr('COUNT(*)'),
						   ))
                    ->joinLeft('acctperiod','true',array('datestart', 'rdatefinish'=>new Zend_Db_Expr('adddate(datefinish, interval "-1" day)')))
                    ->join(array('z'=>$joinSql), 'radacct.acctuniqueid=z.acctuniqueid', array(
                            'msuminputoctets'=>new Zend_Db_Expr('SUM(suminputoctets)'),
                            'msumoutputoctets'=>new Zend_Db_Expr('SUM(sumoutputoctets)'),
                    ))
                    ->where('acctstarttime between datestart and datefinish')
					->where('radacct.username = ?', $username)
                    ->where('status = 1')
					->limit($limit, $start)
                    ->group('acctperiod.id')
					->order(array("$sort $dir"));
        $sql = Db::sql_calc_found_rows($sql);
		$aRows = $this->Db->fetchAll($sql);
		$aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');
		$sql = $this->Db->select()
					->from('radacct', array(
                            'sumsessiontime'=>new Zend_Db_Expr('SUM(acctsessiontime)'),
                            'countsessions'=>new Zend_Db_Expr('COUNT(*)'),
						   ))
                    ->joinLeft('acctperiod','true',array('datestart', 'rdatefinish'=>new Zend_Db_Expr('adddate(datefinish, interval "-1" day)')))
                    ->join(array('z'=>$joinSql), 'radacct.acctuniqueid=z.acctuniqueid', array(
                            'msuminputoctets'=>new Zend_Db_Expr('SUM(suminputoctets)'),
                            'msumoutputoctets'=>new Zend_Db_Expr('SUM(sumoutputoctets)'),
                    ))
                    ->where('acctstarttime >= datestart')
					->where('radacct.username = ?', $username)
                    ->where('status = 0')
					->limit($limit, $start)
                    ->group('acctperiod.id')
					->order(array("$sort $dir"));
		$aRow = $this->Db->fetchRow($sql);
        if ($aRow) {
            array_unshift($aRows, $aRow);
            $aCount++;
        }
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}

	public function GetTariffList($start=null, $limit=null, $sort=null, $dir=null, $username=null)
	{
		if (null===$username) $username = Context::GetUserData('username');
		$sql = $this->Db->select()
					->from('tasks', array('COUNT(*)'))
					->where('tasks.username = ?', $username)
					->where('tasks.attribute = ?', 'Change-tariff')
					->where('tasks.execresult = ?', 'Successful');
		$aCount = $this->Db->fetchOne($sql);
					
		$sql = $this->Db->select()
					->from('tasks', array('rdate'=>'execdate'))
					->join('tariffs', 'tasks.value=tariffs.id', array('tariffname'))
					->where('tasks.username = ?', $username)
					->where('tasks.attribute = ?', 'Change-tariff')
					->where('tasks.execresult = ?', 'Successful')
					->limit($limit, $start)
					->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}

	public function GetPayList($start=null, $limit=null, $sort=null, $dir=null, $userid=null)
	{
		if (null===$userid) $userid = Context::GetUserData('id');
		$sql = $this->Db->select()
					->from('payments', array('COUNT(*)'))
					->where('payments.iduser = ?', $userid);
		$aCount = $this->Db->fetchOne($sql);
					
		$sql = $this->Db->select()
					->from('payments', array('id','datepayment', 'amount', 'amountdeposit',
							'amountfreebyte', 'amountbonus','lastdeposit', 'lastfreebyte', 'lastbonus', 'description', 'status'))
					->where('payments.iduser = ?', $userid)
					->where('payments.status = 1')
					->limit($limit, $start)
					->order(array("$sort $dir"));
		$aRows = $this->Db->fetchAll($sql);

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

}
?>