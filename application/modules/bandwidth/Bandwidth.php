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
        $dataX = array(7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6);
        $dataY = array(7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6);
        shuffle($dataX);
        shuffle($dataY);
        return $dataX;
    }
}
