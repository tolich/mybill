<?php
class Sessions
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
	
	public function CheckSessions(){
		$oNasObj = new Nas();
		$aNas = $oNasObj->GetList();
		$total = 0;
		foreach ($aNas as $nas){
		    $oNas = $oNasObj->getNasByVendor($nas['vendor']);
            if (false !== $oNas){
                $oNas->setHost("{$nas['ipaddress']}:{$nas['ports']}")
                     ->setAuth($nas['username'],$nas['password']);
                $sessions = $oNas->getSessionsId();
    			AppLog::output("getting sessions from {$nas['ipaddress']}:{$nas['ports']}");
                if (false!==$sessions){
        		    AppLog::output("find ".count($sessions)." sessions");
                    $aWhere=array();
                    $aWhere[] = "acctsessionid not in ('".implode("','",$sessions)."')";
                    $aWhere[] = "nasipaddress='{$nas['ipaddress']}'";
        			$n = $this->Db->delete('sessions', $aWhere);
                    $aWhere[] = "acctstoptime='0000-00-00 00:00:00'";
                    $this->Db->update('radacct',array('acctstoptime'=>date('Y-m-d H:i:s')),$aWhere);
        			AppLog::output("clean $n session(s) on {$nas['ipaddress']}:{$nas['ports']}");
                    $total += $n;
                }
			}
		}
		return $total;
	}

	/**
	 * Закрывает сессию 
	 * @param $id int
	 */
	public function Close ($id)
	{
		$sql = $this->Db->select()
				->from('sessions',array('acctsessionid'))
				->join('nas','sessions.nasipaddress=nas.ipaddress',array('ipaddress','ports','username','password','vendor'))
				->where('acctuniqueid=?',$id);
		$nas = $this->Db->fetchRow($sql);

		$oNasObj = new Nas();
	    $oNas = $oNasObj->getNasByVendor($nas['vendor']);
        if (false !== $oNas){
            $oNas->setHost("{$nas['ipaddress']}:{$nas['ports']}")
                 ->setAuth($nas['username'],$nas['password']);
   			if (false!==$oNas->closeSession($nas['acctsessionid'])){
				$aResult = array('success'=>true);
        	} else {
        		$aResult = AppResponse::failure("Не удалось удалить сессию $id");
            }
        }
		return $aResult;
	}

	/**
	 * Закрывает сессии с отрицательным балансом 
	 * @param $id int
	 */
	public function CloseCredits ()
	{
		$sql = $this->Db->select()
						->from('sessions',array('acctsessionid'))
						->join('usergroup','sessions.username=usergroup.username',array('id'))
						->join('nas','sessions.nasipaddress=nas.ipaddress',array('ipaddress','ports','username','password','vendor'));
		$aSessions = $this->Db->fetchAll($sql);
		$aResult = array(
			'success' => 0,
			'failed'  => 0 
		);
		foreach ($aSessions as $session){
    		$oUser = new Users();
    		$oNasObj = new Nas();
    	    $oNas = $oNasObj->getNasByVendor($session['vendor']);
            if (false !== $oNas){
                if (false === $oUser->IsValid($session['id'])) {
                    $oNas->setHost("{$session['ipaddress']}:{$session['ports']}")
                         ->setAuth($session['username'],$session['password']);
           			if (false!==$oNas->closeSession($session['acctsessionid'])){
        				$aResult['success']++;
        			} else{
        				$aResult['failed']++;
                    }
                }
    		} else {
    			$aResult['failed']++;
            }
		}
		return $aResult;
	}

	/**
	 * Список активных сессий
	 * @param $sort string
	 * @param $dir string
	 */
	public function GetList($start=null, $limit=null, $sort=null, $dir=null, $filter=null)
	{
		$as = array(
		    'acctsessionid'=>'sessions.acctsessionid',
		    'acctuniqueid'=>'sessions.acctuniqueid',
		    'username'=>'sessions.username',
		    'username'=>'concat_ws(" ",sessions.username,usergroup.name,usergroup.surname,usergroup.address)',
		    'callingstationid'=>'sessions.callingstationid',
		    'nasipaddress'=>'sessions.nasipaddress',
		    'iface'=>'sessions.iface',
		    'framedipaddress'=>'sessions.framedipaddress',
		    'acctstarttime'=>'sessions.acctstarttime'
		);

		$sql = $this->Db->select()
					->from('sessions')
					->join('radacct','radacct.acctuniqueid = sessions.acctuniqueid',array('acctinputoctets','acctoutputoctets','acctsessiontime'))
					->join('usergroup','sessions.username = usergroup.username',array('name','surname','address'))
                    ->join('tariffs','usergroup.id_tariff=tariffs.id',array())
                    ->join('sluice','sluice.id=tariffs.id_sluice',array('sluicename'))
					->order(array("$sort $dir"))
					->limit($limit, $start);
		if (is_array($filter)) $this->_filter($sql, $filter, $as);
        $sql = Db::sql_calc_found_rows($sql);
		$aRows = $this->Db->fetchAll($sql);
        $aCount = $this->Db->fetchOne('SELECT FOUND_ROWS()');
		Utils::encode($aRows);
		foreach ($aRows as &$aRow){
			if ($aRow['acctsessiontime']!=0){
				$aRow['rateoutput']=ceil((float)$aRow['acctinputoctets']/(float)$aRow['acctsessiontime']);
				$aRow['rateinput']=ceil((float)$aRow['acctoutputoctets']/(float)$aRow['acctsessiontime']);
			} else {
				$aRow['rateoutput']=0;
				$aRow['rateinput']=0;
            }
		}
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}

	/**
	 * Удаляет зависшую сессию
	 * @param $id int
	 */
	public function Delete ($id)
	{
		$where = $this->Db->quoteInto('acctuniqueid=?',$id);
        $this->Db->update('radacct',array('acctstoptime'=>date('Y-m-d H:i:s')),$where);
		$r = $this->Db->delete('sessions', $where);
		if ($r)
			$aResult = array('success'=>true);
		else
			$aResult = array('errors'=>array('msg'=>'Error'));
		return $aResult;
	}
	
	private function _filter(Zend_Db_Select &$sql, array $filter, array $as=array())  
	{
		foreach ($filter as $flt){
			$value = Utils::decode($flt['data']['value']);
			if (array_key_exists($flt['field'],$as))
				$field=$as[$flt['field']];
			else
				$field=$flt['field'];

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
}