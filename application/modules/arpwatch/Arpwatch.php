<?php
/**
 * Мониторинг IP/MAC на основе arpwatch
 */
class Arpwatch extends Modules {
    public $author = 'tolich (tolich@svs.pl.ua)';
    public $description = 'Мониторинг IP/MAC на основе arpwatch';
	public $moduleId = 'arpwatch';
	public $rights	= array(
		'arpwatch' => array(
			'manager' => array(
				'allow' => array(
					'arpwatch' => array( 
						'view',
						'all',
//						'edit',
//						'delete',
//						'submit'
					)
				),
				'deny' => array(
				)
			)
		)
	);
	public $installData = array(
		'resource' => array(
			'resource'		=> 'arpwatch',
			'resourcename'	=> 'Мониторинг IP/MAC на основе arpwatch',
		),
		'rightaction'=>array(
			'view'=>array(
				'arpwatch'=>array(
					'getlist'
				),
			),
			'all'=>array(
				'arpwatch'=>array(
					'getevents',
                    'gettips'
				),
			),
//			'edit'=>array(
//				'arpwatch'=>array(
//					'hold',
//					'restore',
//					'sale'
//				),
//			),
//			'delete'=>array(
//				'arpwatch'=>array(
//				),
//			),
//			'submit'=>array(
//				'arpwatch'=>array(
//					'checkcard',
//					'activate',
//					'checkforaccess',
//					'accesson',
//					'checkformb',
//					'tomb',
//				),
//			)
		),
	);

	public $rn = array(
		'view'=>array(
			'arpwatch'=>'Просмотр списка изменений',
		),
		'all'=>array(
			'arpwatch'=>'Вспомагательные функции для других модулей',
		),
//		'edit'=>array(
//			'arpwatch'=>'Аннулирование, восстановление, продажа карты',
//		),
//		'delete'=>array(
//			'arpwatch'=>'Удаление карты',
//		),
//		'submit'=>array(
//			'arpwatch'=>'Активация карты, перевод депозита в Мб',
//		)
	);

    private $_event = array(
        'new activity'            => 'Ethernet/IP был использован впервые за 6 месяцев',
        'new station'             => 'Ethernet/IP был использован впервые',
        'flip flop'               => 'Замена адреса с одного на другой (оба были в списке)',
        'changed ethernet address'=> 'Замена на новый MAC адрес Ethernet',
        'ethernet broadcast'      => 'MAC-адрес хоста является широковещательным', 
        'ip broadcast'            => 'IP-адрес хоста является широковещательным', 
        'bogon'                   => 'Адрес отправителя IP-пакета не входит в непосредственно подключённую сеть (directly connected network) для заданного интерфейса',
        'ethernet broadcast'      => 'MAC-адрес отправителя состоит из одних нулей или одних единиц',
        'ethernet mismatch'       => 'MAC-адрес отправителя пакета не соответствует MAC-адресу указанному внутри ARP-запроса', 
        'reused old ethernet address'=> 'Ethernet-адрес изменился с известного адреса на адрес, который был замечен ранее, но не только что',
        'suppressed DECnet flip flop'=> 'Сообщение "flip flop" подавлено в связи с тем что как минимум один из двух адресов является адресом DECnet'
    );
        
    public function Init(){
		$this->DbLog = Db::factory('log');;
    }
    
	public function GetList(){
		$arg = array_merge(array('start'=>null, 'limit'=>null, 'sort'=>null, 'dir'=>null, 'query'=>null, 'filter'=>null),$this->_getAllParams());
		$sql = $this->DbLog->select()
					->from('arpwatch', array('COUNT(*)'));
		if (is_array($arg['filter']))
			$this->_filter($sql,$arg['filter']);
		$aCount = $this->DbLog->fetchOne($sql);
		$sql = $this->DbLog->select()
					->from('arpwatch')
					->limit($arg['limit'],$arg['start']);
        if ($arg['sort']!==null){
		    $sql->order("{$arg['sort']} {$arg['dir']}");
        }
		if (is_array($arg['filter']))
			$this->_filter($sql,$arg['filter']);
		$aRows = $this->DbLog->fetchAll($sql);
        foreach ($aRows as &$aRow){
            $aRow['event'] = isset($this->_event[$aRow['event']])?$this->_event[$aRow['event']]:$aRow['event'];
        }
        unset($aRow); 
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}
    
    public function GetEvents(){
        $aResult = array();
        foreach ($this->_event as $k=>$v){
            $aResult[] = array(
                'id'   => $k,
                'text' => $v
            );
        } 
        return $aResult;
    }
    
    public function GetTips(){
        $oUser = new Users();
        $aUser = $oUser->GetUserInfo(array(
            'in_ip'=>$this->_getParam('ip')
        ));
        if (false !== $aUser){
            $sql = $this->Db->select()
                            ->from('radacct', array('callingstationid','acctstarttime'))
                            ->where('username=?',$aUser['username'])
                            ->order('acctstarttime desc')
                            ->limit('1');
            $aInet = $this->Db->fetchRow($sql);
            $sql = $this->Db->select()
                            ->distinct()
                            ->from('radacct', array('callingstationid'))
                            ->where('username=?',$aUser['username'])
                            ->order('acctstarttime desc');
            $aStationId = $this->Db->fetchCol($sql);
            Utils::encode($aUser);
            $aResult = array(
                'username' => $aUser['username'],
                'name'     => "{$aUser['name']} {$aUser['surname']}",
                'address'  => $aUser['address'],
                'ip'       => $aUser['in_ip'],
                'mac'      => preg_replace('/\s*\|\s*/', ', ', $aUser['mac']),
                'inet'     => implode(', ', $aInet),
                'station'  => implode(', ', $aStationId)
            );
        } else {
            $aResult = array(
                'username' => 'Не найден!'
            );
        }
        return $aResult;
    }
}