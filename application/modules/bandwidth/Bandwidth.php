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
                    'getsettings',
                    'setsettings'
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
    
    public function getData(){
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

}
