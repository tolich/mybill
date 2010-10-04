<?php
class Radlog extends Modules
{
    public $author = 'tolich (tolich@svs.pl.ua)';
    public $description = 'Просмотр лога подключений';
	public $moduleId = 'radlog';
	public $rights	= array(
		'radlog' => array()
	);
	public $installData = array(
		'resource' => array(
			'resource'		=> 'radlog',
			'resourcename'	=> 'Просмотр лога подключений',
		),
		'rightaction'=>array(
			'view'=>array(
				'radlog'=>array(
                    'view'
                ),
			),
		),
	);

	public $rn = array(
		'view'=>array(
			'radlog'=>'Просмотр лога',
		),
		'all'=>array(
			'radlog'=>'Вспомагательные функции для других модулей',
		),
	);

    public function Init(){
		$this->DbLog = Db::factory('log');
    }
}
