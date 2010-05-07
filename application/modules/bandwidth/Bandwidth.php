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
					'getdata'
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
	);

    public function Init(){
		$this->DbLog = Db::factory('log');
    }

    public function GetData(){
        $offset = 6; //часов
        $iface = 4; 

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
                $inrate = ((float)$v['inoctets'] - (float)$aPrev['inoctets'] + $ind)/((float)$v['datecreate'] - (float)$aPrev['datecreate']);
                $inrate = sprintf('%0.2f',$inrate*8/1024/1024);
                $outrate = ((float)$v['outoctets'] - (float)$aPrev['outoctets'] + $outd)/((float)$v['datecreate'] - (float)$aPrev['datecreate']);
                $outrate = sprintf('%0.2f',$outrate*8/1024/1024);
                $aData['indata'][] = array((float)$v['datecreate']*1000,(float)$inrate);
                $aData['outdata'][] = array((float)$v['datecreate']*1000,(float)$outrate);
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

    private function _prepare(){
        try {
            $aData = Zend_Json::decode($this->_getParam('data'));
            $ifDescr = @snmpwalk($aData['ip'], $aData['secret'], ".iso.3.6.1.2.1.2.2.1.2");  
            if (false===$ifDescr){
                throw new Exception("Не удалось соединиться с хостом {$aData['ip']}!");
            }
            $key = array_search('"'.$aData['ifacename'].'"',$ifDescr);
            if (false===$key){
                throw new Exception("Неизвестный интерфейс {$aData['ifacename']}!");
            }
            $ifIndex = @snmpwalk($aData['ip'], $aData['secret'], ".iso.3.6.1.2.1.2.2.1.1");        
            if (false===$ifIndex){
                throw new Exception("Не удалось соединиться с хостом {$aData['ip']}!");
            }
            $index = $ifIndex[$key];
            if (!$index){
                throw new Exception("Индекс интерфейса {$aData['ifacename']} не найден!");
            }
            $aData = array_merge($aData, array(
                    'iface' => $index,
                    'inmib' => ".iso.3.6.1.2.1.2.2.1.10.$index",
                    'outmib'=> ".iso.3.6.1.2.1.2.2.1.16.$index"
                )
            );
            return $aData;
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }
    
    private function _destroy(){
        $id = Zend_Json::decode($this->_getParam('data'));
        $where = $this->DbLog->quoteInto('id=?', $id);
        $this->DbLog->delete('bandwidth_settings',$where);
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
                    ->from('bandwidth_settings',array('id','name','ifacename','ip','secret','invert'));
        $aData = array(
            'data' => $this->DbLog->fetchAll($sql)
        );
        return $aData;
    }
}
