<?php
/**
 * Платежные карты
 */
class Paycard extends Modules {
    public $author = 'tolich (tolich@svs.pl.ua)';
    public $description = 'Карты пополнения счета';
	public $moduleId = 'paycard';
	public $rights	= array(
		'paycard' => array(
			'manager' => array(
				'allow' => array(
					'paycard' => array( 
						'view',
						'add',
						'edit',
						'delete',
						'submit'
					)
				),
				'deny' => array(
				)
			),
			'user' => array(
				'allow' => array(
					'paycard' => array(
						'submit'
					)
				)
			)
		)
	);
	public $installData = array(
		'resource' => array(
			'resource'		=> 'paycard',
			'resourcename'	=> 'Карты пополнения счета',
		),
		'rightaction'=>array(
			'view'=>array(
				'paycard'=>array(
					'list',
					'getprintdata'
				),
			),
			'add'=>array(
				'paycard'=>array(
					'addcard',
				),
			),
			'edit'=>array(
				'paycard'=>array(
					'hold',
					'restore',
					'sale'
				),
			),
			'delete'=>array(
				'paycard'=>array(
				),
			),
			'submit'=>array(
				'paycard'=>array(
					'checkcard',
					'activate',
					'checkforaccess',
					'accesson',
					'checkformb',
					'tomb',
				),
			)
		),
	);

	public $rn = array(
		'view'=>array(
			'paycard'=>'Просмотр списка карт',
		),
		'add'=>array(
			'paycard'=>'Добавление карты',
		),
		'edit'=>array(
			'paycard'=>'Аннулирование, восстановление, продажа карты',
		),
		'delete'=>array(
			'paycard'=>'Удаление карты',
		),
		'submit'=>array(
			'paycard'=>'Активация карты, перевод депозита в Мб',
		)
	);
		
	public $status = array(
		'new'			=> 0,
		'sold'			=> 1,
		'activate'		=> 2,
		'hold'			=> 3
	);
	
	public $actions = array(
		'list' 			=> 'GetList',
		'activate'		=> 'ActivateCard',
		'checkforaccess'=> 'CheckDepositForAccess',
		'checkformb'	=> 'CheckDepositForMb',
	);
	
	private $_printData = array();

	public function Init(){
		$aSettings = Context::GetSettings(SETTINGS_BILLING);
		$this->_printData = array(
			'countOnPage' => 4,
			'width'		  => 9,
			'width_alt'	  => 5,
			'height'	  => 5,
			'url'		  => $aSettings['URL']
		);
	}
	
	public function GetPrintData(){
		return $this->_printData;
	}
	
	public function GetList(){
		$arg = array_merge(array('start'=>null, 'limit'=>null, 'sort'=>null, 'dir'=>null, 'query'=>null, 'filter'=>null, 'status'=>0),$this->_getAllParams());
		$sql = $this->Db->select()
					->from('paycard', array('COUNT(*)'))
					->where('paycard.status = ?',$arg['status']);
		if ($arg['status']==$this->status['activate']){
			$sql->join('payments','payments.id=paycard.id_payment',array())
				->join('usergroup','payments.iduser=usergroup.id',array('username'));
		}
		if ($arg['query']){
			$q = Utils::decode($arg['query']);
			$sql-> where("usergroup.id LIKE ?", "%$q%")
				-> orWhere("paycard.code LIKE ?", "%$q%")
				-> orWhere("paycard.nominal LIKE ?", "%$q%");
			if ($arg['status']==$this->status['activate']){
				$sql->orWhere("usergroup.username LIKE ?", "%$q%");
			}
		}
		if (is_array($arg['filter']))
			$this->_filter($sql,$arg['filter']);
		$aCount = $this->Db->fetchOne($sql);
		$fields = array('id','datecreate','nominal','code');			
		if ($arg['status']==$this->status['activate']){
			$fields[]='dateactivate';
		}
		$sql = $this->Db->select()
					->from('paycard',$fields)
					->limit($arg['limit'],$arg['start'])
					->order("{$arg['sort']} {$arg['dir']}")
					->where('paycard.status = ?', $arg['status']);
		if ($arg['status']==$this->status['activate']){
			$sql->join('payments','payments.id=paycard.id_payment',array())
				->join('usergroup','payments.iduser=usergroup.id',array('username','name','surname','address'));
		}
		
		if ($arg['query']){
			$q = Utils::decode($arg['query']);
			$sql-> where("usergroup.id LIKE ?", "%$q%")
				-> orWhere("paycard.code LIKE ?", "%$q%")
				-> orWhere("paycard.nominal LIKE ?", "%$q%");
			if ($arg['status']==$this->status['activate']){
				$sql->orWhere("usergroup.username LIKE ?", "%$q%");
			}
		}
		if (is_array($arg['filter']))
			$this->_filter($sql,$arg['filter']);
		$aRows = $this->Db->fetchAll($sql);
		foreach ($aRows as &$aRow)
		{
			$aRow['nominal']=sprintf("%0.2f", $aRow['nominal']/1024/1024);
			//array_walk($aRow, array('Utils', 'array_encode'));
		}
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}

	/**
	 * Создает карты пополнея
	 * @return 
	 * @param object $nominal
	 * @param object $count
	 */
	public function AddCard(){
		$arg = array_merge(array('nominal'=>0, 'count'=>0),$this->_getAllParams());
		$i = $arg['count'];
		while ($i)
		{
			$code = '';
			for ($j = 0; $j < 4; $j++){
				$code .=sprintf('%04u',mt_rand(0,9999));
			}
			$card=array(
				'nominal'	=> $arg['nominal']*1024*1024,
				'code'		=> $code,
				'md5'		=> md5($code),
				'datecreate'=> date('Y-m-d H:i:s'),
				'status'	=> $this->status['new']
			);
			try {
				$this->Db->insert('paycard',$card);
				$i--;
			} catch (Exception $e) {
//				Utils::Debug($card);		
			}
		}
		return array('success'=>true);
	}
	
	/**
	 * Анулирует карту
	 * @return 
	 * @param object $arg
	 */
	public function Hold(){
		$arg = array_merge(array('id'=>null),$this->_getAllParams());
		if ($arg['id']){
			$aWhere = array();
			$aWhere[] = $this->Db->quoteInto("id = ?",$arg['id']);
			$aWhere[] = "status <> {$this->status['activate']}";
			$this->Db->update('paycard',array('status'=>$this->status['hold']),$aWhere);
			return array('success'=>true);
		} else {
			return array('success'=>false);
		}
	}

	/**
	 * Отправляет выбранные карты в подажу
	 * @return 
	 * @param object $arg
	 */
	public function Sale(){
		$arg = array_merge(array('id'=>null),$this->_getAllParams());
		if ($arg['id']){
			$aWhere = array();
			$aWhere[] = "id in (".implode(',',Zend_Json::decode($arg['id'])).")";
			$aWhere[] = "status = {$this->status['new']}";
			$this->Db->update('paycard',array('status'=>$this->status['sold']),$aWhere);
			return array('success'=>true);
		} else {
			return array('success'=>false);
		}
	}

	/**
	 * Восстанавливает карту из анулированых
	 * @return 
	 * @param object $arg
	 */
	public function Restore(){
		$arg = array_merge(array('id'=>null),$this->_getAllParams());
		if ($arg['id']){
			$aWhere = array();
			$aWhere[] = $this->Db->quoteInto("id = ?",$arg['id']);
			$aWhere[] = "status = {$this->status['hold']}";
			$this->Db->update('paycard',array('status'=>$this->status['new']),$aWhere);
			return array('success'=>true);
		} else {
			return array('success'=>false);
		}
	}

	/**
	 * Проверяет правильность кода и возвращает номинал
	 * @return 
	 * @param object $arg
	 */
	public function CheckCard(){
		$arg = array_merge(array('hash'=>null),$this->_getAllParams());
		if ($arg['hash']){
			$sql = $this->Db->select()
						->from('paycard',array('nominal'))
						->where("md5 = ?",$arg['hash'])
						->where("status in ({$this->status['new']},{$this->status['sold']})");
			$aResult = $this->Db->fetchRow($sql);
			if ($aResult!==false){
				$aResult['nominal'] = $aResult['nominal']/1024/1024;
			} else {
				$aResult = AppResponse::failure('Карта пополнения с указанным Вами кодом не найдена!');
			}
		}
		return $aResult;
	}

	public function ActivateCard(){
		$arg = array_merge(array('hash'=>null),$this->_getAllParams());
		if ($arg['hash']){
			$sql = $this->Db->select()
						->from('paycard',array('id','nominal'))
						->where("status <> {$this->status['activate']}")
						->where("md5 = ?",$arg['hash']);
			$aCard = $this->Db->fetchRow($sql);
			if ($aCard!==false){
		        $this->Db->beginTransaction();
				try {
					$sql = $this->Db->select()
								->from('acctperiod',array('id'))
								->where('status=0');
					$idAcctperiod=$this->Db->fetchOne($sql);
					$sql = $this->Db->select()
									->from	('usergroup', array('id', 'deposit', 'freebyte', 'bonus'))
									->where	('id=?', Context::GetUserData('id'));
					$aData = $this->Db->fetchRow($sql);
					$aInsData = array(
						'iduser'		=> Context::GetUserData('id'),
						'amount'		=> $aCard['nominal'],
						'amountdeposit'	=> $aCard['nominal'],
						'status'		=> $this->status['activate'], 
						'lastdeposit'	=> $aData['deposit'], 
						'lastfreebyte'	=> $aData['freebyte'], 
						'lastbonus'		=> $aData['bonus'], 
						'id_acctperiod'	=> $idAcctperiod,
						'description'	=> "Карта №{$aCard['id']}"
					);
					$this->Db->insert('payments', $aInsData);
					$idPayment = $this->Db->lastInsertId();
					$where = $this->Db->quoteInto('id=?', Context::GetUserData('id'));
					$this->Db->update('usergroup',array('deposit'=>new Zend_Db_Expr('deposit + '.$aCard['nominal'])),$where);
					$where = $this->Db->quoteInto("md5 = ?",$arg['hash']);
					$aUpdateData = array(
						'status'		=> $this->status['activate'],
						'dateactivate'	=> date('Y-m-d H:i:s'),
						'id_payment'	=> $idPayment
					);
					$this->Db->update('paycard',$aUpdateData,$where);
				    $this->Db->commit();
					$aResult = array('success'=>true);
				} catch (Exception $e) {
				    $this->Db->rollBack();
					$aResult = AppResponse::failure('Сообщите эту ошибку администратору: '.$e->getMessage());
				}
			} else {
				$aResult = AppResponse::failure('Карта пополнения с указанным Вами кодом не найдена!');
			}
		} else {
			$aResult = AppResponse::failure('Карта пополнения с указанным Вами кодом не найдена!');
		}
		return $aResult;
	}

	public function CheckDepositForAccess(){
		$sql = $this->Db->select()
						->from	('usergroup', array('id', 'deposit', 'freebyte', 'bonus', 'access'))
						->join ('tariffs','usergroup.id_tariff=tariffs.id',array('tariffname','monthlyfee','dailyfee'))
						->where	('usergroup.id=?', Context::GetUserData('id'));
		$aData = $this->Db->fetchRow($sql);
		if ($aData!==false){
			if ($aData['access']==0){
				if ((float)$aData['deposit']>=(float)$aData['monthlyfee']+(float)$aData['dailyfee']){
					$aResult = Utils::ClearPostData($aData, array('tariffname','monthlyfee','dailyfee'));
					$aResult['monthlyfee'] = $aResult['monthlyfee']/1024/1024;
					$aResult['dailyfee'] = $aResult['dailyfee']/1024/1024;
				} else {
					$aResult = AppResponse::failure('Недостаточно средств на Вашем счету!');
				}
			} else {
				$aResult = AppResponse::failure('Доступ к Интернету в данный момент включен! Если у Вас закончились предоплаченные МБ воспользуйтесь функцией перевода средств с депозита в МБ.');
			}
		} else {
			$aResult = AppResponse::failure('Активация Вашей учетной записи не возможна. Обратитесь к администратору!');
		}
		return $aResult;
	}

	public function CheckDepositForMb(){
		$arg = array_merge(array('amount'=>null),$this->_getAllParams());
		$sql = $this->Db->select()
						->from	('usergroup', array('id', 'deposit', 'access'))
						->join ('tariffs','usergroup.id_tariff=tariffs.id',array('tariffname','price'))
						->where	('usergroup.id=?', Context::GetUserData('id'));
		$aData = $this->Db->fetchRow($sql);
		if ($aData!==false){
			if ($aData['access']==1){
				if ((float)$aData['price']!=0){
					if ((float)$aData['deposit']>=(float)$arg['amount']*1024*1024){
						$aResult = Utils::ClearPostData($aData, array('tariffname','price'));
						$aResult['mb'] = floor(($arg['amount']/$aResult['price']*1000)/1000);
					} else {
						$aResult = AppResponse::failure('Недостаточно средств на Вашем счету!');
					}
				} else {
					$aResult = AppResponse::failure('Ошибка при обработке данных. Обратитесь к администратору!');
				}	
			} else {
				$aResult = AppResponse::failure('Невозможно выполнить перевод! Доступ к Интернету в данный момент отключен!');
			}
		} else {
			$aResult = AppResponse::failure('Невозможно выполнить перевод. Обратитесь к администратору!');
		}
		return $aResult;
	}

	public function ToMb(){
		$arg = array_merge(array('amount'=>null),$this->_getAllParams());
        $this->Db->beginTransaction();
		try {
			$sql = $this->Db->select()
							->from	('usergroup', array('id', 'deposit', 'freebyte', 'bonus', 'access'))
							->join ('tariffs','usergroup.id_tariff=tariffs.id',array('price'))
							->where	('usergroup.id=?', Context::GetUserData('id'));
			$aData = $this->Db->fetchRow($sql);
			if ($aData!==false){
				if ($aData['access']==1){
					if ((float)$aData['price']!=0){
						if ((float)$aData['deposit']>=(float)$arg['amount']*1024*1024){
							$mb = floor(($arg['amount']/$aData['price']*1000)/1000);
							$sql = $this->Db->select()
										->from('acctperiod',array('id'))
										->where('status=0');
							$idAcctperiod=$this->Db->fetchOne($sql);
							$aInsData = array(
								'iduser'		=> Context::GetUserData('id'),
								'amountdeposit'	=> -$arg['amount']*1024*1024,
								'amountfreebyte'=> $arg['amount']/$aData['price']*1024*1024,
								'status'		=> '1', 
								'lastdeposit'	=> $aData['deposit'], 
								'lastfreebyte'	=> $aData['freebyte'], 
								'lastbonus'		=> $aData['bonus'], 
								'id_acctperiod'	=> $idAcctperiod,
								'description'	=> "Перевод с депозита ({$arg['amount']}) на пакетные Мб $mb"
							);
							$this->Db->insert('payments', $aInsData);
							$idPayment = $this->Db->lastInsertId();
							$where = $this->Db->quoteInto('id=?', Context::GetUserData('id'));
							$this->Db->update('usergroup',array(
								'deposit'=>new Zend_Db_Expr('deposit - '.(float)$arg['amount']*1024*1024),
								'freebyte'=>new Zend_Db_Expr('freebyte + '.(float)($arg['amount']/$aData['price']*1024*1024))
								),$where);
						    $this->Db->commit();
							$aResult = array('success'=>true);
						} else {
							throw new AppException('Недостаточно средств на Вашем счету!');
						}
					} else {
						throw new AppException('Невозможно выполнить перевод! Доступ к Интернету в данный момент отключен!');
					}
				} else {
					throw new AppException('Ошибка при обработке данных. Обратитесь к администратору!');
				}	
			} else {
				throw new AppException('Невозможно выполнить перевод. Обратитесь к администратору!');
			}
		} catch (Exception $e) {
		    $this->Db->rollBack();
			$aResult = AppResponse::failure('Сообщите эту ошибку администратору: '.$e->getMessage());
		} catch (AppException $e) {
		    $this->Db->rollBack();
			$aResult = $e->getResponse();
		}
		return $aResult;
	}

	public function AccessOn(){
		$sql = $this->Db->select()
						->from	('usergroup', array('id', 'deposit', 'freebyte', 'bonus', 'access'))
						->join ('tariffs','usergroup.id_tariff=tariffs.id',array('tariffname','monthlyfee','dailyfee'))
						->where	('usergroup.id=?', Context::GetUserData('id'));
		$aData = $this->Db->fetchRow($sql);
		if ($aData!==false){
			if ($aData['access']==0){
				if ((float)$aData['deposit']>=(float)$aData['monthlyfee']+(float)$aData['dailyfee']){
					$oUsers = new Users();
					$oUsers->On(Context::GetUserData('id'));
					$oUsers->DailyFee(Context::GetUserData('id'),false);
					$oUsers->MonthlyFee(Context::GetUserData('id'),false);
					$aResult = array('success'=>true);
				} else {
					$aResult = AppResponse::failure('Недостаточно средств на Вашем счету!');
				}
			} else {
				$aResult = AppResponse::failure('Доступ к Интернету в данный момент включен! Если Вам не удается подключиться, возможно, у Вас закончились предоплаченные МБ. Воспользуйтесь функцией перевода средств с депозита в МБ.');
			}
		} else {
			$aResult = AppResponse::failure('Активация Вашей учетной записи не возможна. Обратитесь к администратору!');
		}
		return $aResult;
	}
				
	/**
	 * Добавляет в Zend_Db_Select условие из массива фильтров
	 */
	private function _filter(Zend_Db_Select &$sql, array $filter)  
	{
		foreach ($filter as $flt){
			$value = Utils::decode($flt['data']['value']);
			switch (strtolower($flt['field'])){
				case 'nominal':
					$value = (int)$value*1024*1024;
					$field=$flt['field'];
				break;
				default:
					$field=$flt['field'];
				break;
			};
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
