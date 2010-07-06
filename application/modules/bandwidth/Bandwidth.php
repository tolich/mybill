<?php
class Bandwidth extends Modules
{
    public $author = 'tolich (tolich@svs.pl.ua)';
    public $description = 'График загрузки внешнего канала';
	public $moduleId = 'bandwidth';
	public $rights	= array(
		'bandwidth' => array(
			'manager' => array(
				'allow' => array(
					'bandwidth' => array( 
						'view',
					)
				),
				'deny' => array(
				)
			)
		)
	);
	public $installData = array(
		'resource' => array(
			'resource'		=> 'bandwidth',
			'resourcename'	=> 'График загрузки внешнего канала',
		),
		'rightaction'=>array(
			'view'=>array(
				'bandwidth'=>array(
					'getdata',
                    'charts'
				),
			),
			'edit'=>array(
				'bandwidth'=>array(
                    'settings'
				),
			),
		),
	);

	public $rn = array(
		'view'=>array(
			'bandwidth'=>'Просмотр графика',
		),
		'edit'=>array(
			'bandwidth'=>'Настройка параметров модуля',
		),
		'all'=>array(
			'bandwidth'=>'Вспомагательные функции для других модулей',
		),
	);

    public function Init(){
		$this->DbLog = Db::factory('log');
    }

    public function GetData(){
        $offset = 24; //часов
        $iface = $this->_getParam('iface'); 
        $sql = $this->DbLog->select()
                    ->from('bandwidth_settings', array('invert'))
                    ->where('id = ?',$iface);
        $invert =  $this->DbLog->fetchOne($sql);
        $time = time() - $offset*3600;
        $aData = array(
            'indata' => array(),
            'outdata'=> array()
        );
        $aPrev = array();
        $sql = $this->DbLog->select()
                    ->from('bandwidth_rate', array('datecreate','inoctets','outoctets'))
                    ->where('datecreate > ?',$time)
                    ->where('iface = ?',$iface);
        $aAllData =  $this->DbLog->fetchAll($sql);
        foreach ($aAllData as $v){
            if (count($aPrev)){
                if ((float)$v['inoctets'] < (float)$aPrev['inoctets']){
                    $ind = 4294967295;
                } else {
                    $ind = 0;
                }
                if ((float)$v['outoctets'] < (float)$aPrev['outoctets']){
                    $outd = 4294967295;
                } else {
                    $outd = 0;
                }
                $timed = (float)$v['datecreate'] - (float)$aPrev['datecreate'];
                if ($timed){
                    $inrate = ((float)$v['inoctets'] - (float)$aPrev['inoctets'] + $ind)/$timed;
                } else {
                    $inrate = 0;
                }
                $inrate = sprintf('%0.6f',$inrate*8/1024/1024);
                if ($timed){
                    $outrate = ((float)$v['outoctets'] - (float)$aPrev['outoctets'] + $outd)/$timed;
                } else {
                    $outrate = 0;
                }
                $outrate = sprintf('%0.6f',$outrate*8/1024/1024);
                if ($invert){
                    $aData['outdata'][] = array((float)$v['datecreate']*1000,(float)$inrate);
                    $aData['indata'][] = array((float)$v['datecreate']*1000,(float)$outrate);
                } else {
                    $aData['indata'][] = array((float)$v['datecreate']*1000,(float)$inrate);
                    $aData['outdata'][] = array((float)$v['datecreate']*1000,(float)$outrate);
                } 
            }
            $aPrev = array(
                'datecreate' => (float)$v['datecreate'],
                'inoctets' => (float)$v['inoctets'],
                'outoctets' => (float)$v['outoctets'],
            );
        }
        return $aData;
    }

    public function Settings()
    {
        switch ($this->_getParam('xaction')){
            case 'destroy':
         		$result = $this->_destroy();
            break;
            case 'update':
         		$result = $this->_update();
            break;
            case 'read':
         		$result = $this->_read();
            break;    
            case 'create':
         		$result = $this->_create();
            break;    
        }
        return $result;
    }

    public function Charts(){
        $sql = $this->DbLog->select()
                  ->from('bandwidth_settings')
                  ->where('disabled=0');
        return $this->DbLog->fetchAll($sql);
    }

    private function _prepare(){
        try {
            $aData = Zend_Json::decode($this->_getParam('data'));
            if (false === $aData['disabled']){
                $ifDescr = @snmpwalk($aData['ip'], $aData['secret'], ".iso.3.6.1.2.1.2.2.1.2");  
                if (false===$ifDescr){
                    throw new Exception("Не удалось соединиться с хостом {$aData['ip']}!");
                }
                if (strtoupper(substr(php_uname(), 0, 3)) === 'WIN'){
                    $key = array_search('"'.$aData['ifacename'].'"',$ifDescr);
                } else {
                    $key = array_search("STRING: {$aData['ifacename']}",$ifDescr);
                }
                if (false===$key){
                    throw new Exception("Неизвестный интерфейс {$aData['ifacename']}!");
                }
                $ifIndex = @snmpwalk($aData['ip'], $aData['secret'], ".iso.3.6.1.2.1.2.2.1.1");        
                if (false===$ifIndex){
                    throw new Exception("Не удалось соединиться с хостом {$aData['ip']}!");
                }
                if (strtoupper(substr(php_uname(), 0, 3)) === 'WIN'){
                    $index = $ifIndex[$key];
                } else {
                    $aIndex = split(' ', $ifIndex[$key]);
                    if (!isset($aIndex[1])){
                        throw new Exception("Получен неверный ответ {$ifIndex[$key]}!");
                    }
                    $index = $aIndex[1];                        
                }
                if (!$index){
                    throw new Exception("Индекс интерфейса {$aData['ifacename']} не найден!");
                }
                $aData = array_merge($aData, array(
                        'iface' => $index,
                        'inmib' => ".iso.3.6.1.2.1.2.2.1.10.$index",
                        'outmib'=> ".iso.3.6.1.2.1.2.2.1.16.$index"
                    )
                );
            }
            return $aData;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    
    private function _destroy(){
//        $id = Zend_Json::decode($this->_getParam('data'));
        $id = trim($this->_getParam('data'),'"');
        $where = $this->DbLog->quoteInto('id=?', $id);
        $this->DbLog->delete('bandwidth_settings',$where);
        $where = $this->DbLog->quoteInto('iface=?', $id);
        $this->DbLog->delete('bandwidth_rate',$where);
        return array('success'=>true);
    }

    private function _update(){
        $aData = $this->_prepare();
        if (is_array($aData)){
            $where = $this->DbLog->quoteInto('id=?', $aData['id']);
            $this->DbLog->update('bandwidth_settings',$aData,$where);
            return array('success'=>true);
        } else {
            return AppResponse::failure($aData);
        }
    }

    private function _create(){
        $aData = $this->_prepare();
        if (is_array($aData)){
            $this->DbLog->insert('bandwidth_settings',$aData);
            return array('success'=>true);
        } else {
            return AppResponse::failure($aData);
        }
    }
    
    private function _read(){
        $sql = $this->DbLog->select()
                    ->from('bandwidth_settings',array('id','name','ifacename','ip','secret','invert','disabled'));
        $aData = array(
            'data' => $this->DbLog->fetchAll($sql)
        );
        return $aData;
    }
}
