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
//						'add',
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
//			'add'=>array(
//				'arpwatch'=>array(
//					'addcard',
//				),
//			),
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
//		'add'=>array(
//			'arpwatch'=>'Добавление карты',
//		),
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
		$aData = array( 'totalCount'=>$aCount,
						'data' => $aRows);
		return $aData;
	}
}