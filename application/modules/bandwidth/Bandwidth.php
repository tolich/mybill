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
			'resource'		=> 'bandwidth',
			'resourcename'	=> 'График загрузки внешнего канала',
		),
		'rightaction'=>array(
			'view'=>array(
				'bandwidth'=>array(
					'getdata'
				),
			),
//			'all'=>array(
//				'bandwidth'=>array(
//				),
//			),
		),
	);

	public $rn = array(
		'view'=>array(
			'bandwidth'=>'Просмотр графика',
		),
		'all'=>array(
			'bandwidth'=>'Вспомагательные функции для других модулей',
		),
	);

    public function Init(){
		$this->DbLog = Db::factory('log');
    }
    
    public function getData(){
        $aData = array(
            'indata' => array(),
            'outdata'=> array()
        );
        $aPrev = array();
        $sql = $this->DbLog->select()
                    ->from('rate', array('datecreate','inoctets','outoctets'))
                    ->where('datecreate > adddate(now(), interval -6 hour)');
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
                $outrate = ((float)$v['outoctets'] - (float)$aPrev['outoctets'] + $outd)/((float)$v['datecreate'] - (float)$aPrev['datecreate']);
                $aData['indata'][] = array((float)$v['datecreate'],$inrate/1024/1024);
                $aData['outdata'][] = array((float)$v['datecreate'],$outrate/1024/1024);
            }
            $aPrev = array(
                'date' => (float)$v['datecreate'],
                'inoctets' => (float)$v['inoctets'],
                'outoctets' => (float)$v['outoctets'],
            );
        }
        return $aData;
    }

}
