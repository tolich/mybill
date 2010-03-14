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
		$oNas = new Nas();
		$aNas = $oNas->GetList();
		$total = 0;
		foreach ($aNas as $nas){
            $url = "http://{$nas['nasname']}:{$nas['ports']}/bincmd?show%20sessions";
            $client = new Zend_Http_Client($url);
            $client->setAuth($nas['username'],$nas['password']);
            $response = $client->request();
			AppLog::output("getting sessions from {$nas['nasname']}:{$nas['ports']}");
			$aSessions=array();
			$aSessionId = array();
            $isClean = false;
    		AppLog::output($response->getMessage());
			switch ($response->getStatus()){
			    case '200':
                    $sessions = $response->getBody();
    				preg_match_all("/^ng.*$/im",$sessions,$aSessions);
        		    AppLog::output("find ".count($aSessions[0])." sessions");
                    $isClean = true;
        			foreach ($aSessions[0] as $session){
        				$link = preg_split('/\s+/',$session);
        				$aSessionId[]=$link[6];
        				AppLog::output("{$link[6]}");
        			}
			    case '404':
			    case '0':
                    $isClean = true;
                break;
			}
            if ($isClean){
                $aWhere=array();
                $aWhere[] = "acctsessionid not in ('".implode("','",$aSessionId)."')";
                $aWhere[] = "nasipaddress='{$nas['nasname']}'";
    			$n = $this->Db->delete('sessions', $aWhere);
                $aWhere[] = "acctstoptime='0000-00-00 00:00:00'";
                $this->Db->update('radacct',array('acctstoptime'=>date('Y-m-d H:i:s')),$aWhere);
    			AppLog::output("clean $n session(s) on {$nas['nasname']}:{$nas['ports']}");
                $total += $n;
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
						->join('nas','sessions.nasipaddress=nas.nasname',array('nasname','ports','username','password'))
						->where('acctuniqueid=?',$id);
		$session = $this->Db->fetchRow($sql);
		if (preg_match("/\w+-(\w+-\w+)/",$session['acctsessionid'],$match)){
            $url = "http://{$session['nasname']}:{$session['ports']}/bincmd?link%20{$match[1]}&close";
            $client = new Zend_Http_Client($url);
            $client->setAuth($session['username'],$session['password']);
            $response = $client->request();
    		AppLog::output($response->getMessage());
			if ($response->getStatus()=='200'){
				$aResult = array('success'=>true);
			} else {
				$aResult = array('errors'=>array('msg'=>$info['error']));
            }
		} else {
			$aResult = array('errors'=>array('msg'=>'Link extract failed'));
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
					->from('acctperiod',array(
						'datestart','now' => new Zend_Db_Expr("UNIX_TIMESTAMP(CURDATE())")))
					->where('status=0');
		$aRow=$this->Db->fetchRow($sql);

		$sql = $this->Db->select()
						->from('sessions',array('acctsessionid'))
						->join('usergroup','sessions.username=usergroup.username',array())
						->join('nas','sessions.nasipaddress=nas.nasname',array('nasname','ports','username','password'))
						->where("(deposit < mindeposit) and (UNIX_TIMESTAMP(DATE_ADD('{$aRow['datestart']}', INTERVAL dateofcheck DAY)) <= '{$aRow['now']}') or (freebyte + bonus < freemblimit and check_mb=1)")
						->orWhere('access=0');
		$aSessions = $this->Db->fetchAll($sql);
		$aResult = array(
			'success' => 0,
			'failed'  => 0 
		);
		foreach ($aSessions as $session){
			if (preg_match("/\w+-(\w+-\w+)/",$session['acctsessionid'],$match)){
                $url = "http://{$session['nasname']}:{$session['ports']}/bincmd?link%20{$match[1]}&close";
                $client = new Zend_Http_Client($url);
                $client->setAuth($session['username'],$session['password']);
                $response = $client->request();
        		AppLog::output($response->getMessage());
    			if ($response->getStatus()=='200'){
					$aResult['success']++;
				} else{
					$aResult['failed']++;
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
					->from('sessions', array('COUNT(*)'))
					->join('radacct','radacct.acctuniqueid = sessions.acctuniqueid')
					->join('usergroup','sessions.username = usergroup.username');
		if (is_array($filter)) $this->_filter($sql, $filter, $as);
		$aCount = $this->Db->fetchOne($sql);

		$sql = $this->Db->select()
					->from('sessions')
					->join('radacct','radacct.acctuniqueid = sessions.acctuniqueid',array('acctinputoctets','acctoutputoctets','acctsessiontime'))
					->join('usergroup','sessions.username = usergroup.username',array('name','surname','address'))
					->order(array("$sort $dir"))
					->limit($limit, $start);
		if (is_array($filter)) $this->_filter($sql, $filter, $as);
		$aRows = $this->Db->fetchAll($sql);
		Utils::encode($aRows);
		foreach ($aRows as &$aRow){
			if ($aRow['acctsessiontime']!=0){
				$aRow['rateoutput']=ceil((int)$aRow['acctinputoctets']/(int)$aRow['acctsessiontime']);
				$aRow['rateinput']=ceil((int)$aRow['acctoutputoctets']/(int)$aRow['acctsessiontime']);
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