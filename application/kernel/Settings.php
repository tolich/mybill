<?php

class Settings {

	private $Db;
	
	public function __construct(){
		$this->Db = Zend_Registry::get('db');
	}

	public function DeinstallModules(){
		AppLog::output("Deinstall modules ...");
		$oManager = new Manager();
		$aModules = $oManager->GetAllModules();
		foreach ($aModules as $k=>$v){
			$aResult = array();
			$module = ucfirst((string)$k);
			if (class_exists($module)){
				$oModule = new $module();
				$result = $oModule->DeInstall();
				if ($result===true){
					AppLog::output("$module success");
				} else {
					AppLog::output("$module failed");
				}
			} else {
    			AppLog::output("$module failed");
			}
		}
	}

	public function SetDefPeriods(){
		AppLog::output("Periods ...");
		$aData = array(
			array(
				'id'		=> '1',
				'periodname'=> 'Разово'
			),
			array(
				'id'		=> '2',
				'periodname'=> 'Ежедневно'
			),
			array(
				'id'		=> '3',
				'periodname'=> 'Ежемесячно'
			),
		);
		Utils::decode($aData);
		$this->Db->delete('periods');
		foreach ($aData as $aInsData){
			$this->Db->insert('periods',$aInsData);
		}
	}

	public function SetDefFlags(){
		AppLog::output("Flags ...");
		$aData = array(
			array(
				'id'		=> '1',
				'flagname'=> 'С депозита когда нет Мб'
			),
			array(
				'id'		=> '2',
				'flagname'=> 'Только с депозита'
			),
		);
		Utils::decode($aData);
		$this->Db->delete('flags');
		foreach ($aData as $aInsData){
			$this->Db->insert('flags',$aInsData);
		}
	}
	
	public function SetDefTaskattribute(){
		AppLog::output("Taskattribute ...");
		$aData = array(
			array(
				'attrname'		=> 'Monthly-fee',
				'description'	=> 'Абонплата за месяц',
				'prio'			=> '3',
			),
			array(
				'attrname'		=> 'Daily-fee',
				'description'	=> 'Абонплата за день',
				'prio'			=> '2',
			),
			array(
				'attrname'		=> 'Subscribe',
				'description'	=> 'E-Mail рассылка',
				'prio'			=> '5',
			),
			array(
				'attrname'		=> 'Change-tariff',
				'description'	=> 'Смена тарифа',
				'prio'			=> '1',
			),
			array(
				'attrname'		=> 'Activate',
				'description'	=> 'Включить',
				'prio'			=> '4',
			),
			array(
				'attrname'		=> 'Deactivate',
				'description'	=> 'Отключить',
				'prio'			=> '4',
			),
		);
		Utils::decode($aData);
		$this->Db->delete('taskattribute');
		foreach ($aData as $aInsData){
			$this->Db->insert('taskattribute',$aInsData);
		}
	}
	
	public function SetDefRole(){
		AppLog::output("Role ...");
		$aData = array(
			array(
				'id'		=> '1',
				'role'		=> 'guest',
				'rolename'	=> 'Гость',
				'type'		=> '0'
			),
			array(
				'id'		=> '2',
				'role'		=> 'user',
				'rolename'	=> 'Пользователь',
				'type'		=> '0'
			),
			array(
				'id'		=> '3',
				'role'		=> 'staff',
				'rolename'	=> 'Сотрудник',
				'type'		=> '0'
			),
			array(
				'id'		=> '4',
				'role'		=> 'cashier',
				'rolename'	=> 'Кассир',
				'type'		=> '0'
			),
			array(
				'id'		=> '5',
				'role'		=> 'manager',
				'rolename'	=> 'Менеджер',
				'type'		=> '0'
			),
			array(
				'id'		=> '6',
				'role'		=> 'director',
				'rolename'	=> 'Директор',
				'type'		=> '0'
			),
			array(
				'id'		=> '7',
				'role'		=> 'administrator',
				'rolename'	=> 'Администратор',
				'type'		=> '0'
			),
		);
		Utils::decode($aData);
		$this->Db->delete('role');
		foreach ($aData as $aInsData){
			$this->Db->insert('role',$aInsData);
		}
	}
	
	public function SetDefRoleparent(){
		AppLog::output("Roleparent ...");
		$aData = array(
			array(
				'id_role'		=> '2',
				'id_parent'		=> '1',
			),
			array(
				'id_role'		=> '3',
				'id_parent'		=> '1',
			),
			array(
				'id_role'		=> '4',
				'id_parent'		=> '3',
			),
			array(
				'id_role'		=> '5',
				'id_parent'		=> '3',
			),
			array(
				'id_role'		=> '6',
				'id_parent'		=> '3',
			),
		);
		$this->Db->delete('roleparent');
		foreach ($aData as $aInsData){
			$this->Db->insert('roleparent',$aInsData);
		}
	}
	
	public function SetDefResource(){
		AppLog::output("Resource ...");
		$aData = array(
			array(
				'resource'		=> 'auth',
				'resourcename'	=> 'Авторизация',
			),
			array(
				'resource'		=> 'admin',
				'resourcename'	=> 'Администрирование',
			),
			array(
				'resource'		=> 'nas',
				'resourcename'	=> 'Сервера доступа',
			),
			array(
				'resource'		=> 'payments',
				'resourcename'	=> 'Платежи',
			),
			array(
				'resource'		=> 'pools',
				'resourcename'	=> 'Пулы IP адресов',
			),
			array(
				'resource'		=> 'reports',
				'resourcename'	=> 'Отчеты',
			),
			array(
				'resource'		=> 'redirect',
				'resourcename'	=> 'Перенаправление',
			),
			array(
				'resource'		=> 'sessions',
				'resourcename'	=> 'Активные сессии',
			),
			array(
				'resource'		=> 'settings',
				'resourcename'	=> 'Настройки',
			),
			array(
				'resource'		=> 'sluices',
				'resourcename'	=> 'Шлюзы',
			),
			array(
				'resource'		=> 'stat',
				'resourcename'	=> 'Статистика',
			),
			array(
				'resource'		=> 'tariffs',
				'resourcename'	=> 'Тарифы',
			),
			array(
				'resource'		=> 'tasks',
				'resourcename'	=> 'Планировщик',
			),
			array(
				'resource'		=> 'users',
				'resourcename'	=> 'Пользователи',
			),
			array(
				'resource'		=> 'zones',
				'resourcename'	=> 'Зоны',
			),
			array(
				'resource'		=> 'modules',
				'resourcename'	=> 'Модули',
			),
		);
		Utils::decode($aData);
		$this->Db->delete('resource');
		foreach ($aData as $aInsData){
			$this->Db->insert('resource',$aInsData);
		}
	}
	
	public function SetDefRightaction(){
		AppLog::output("Rightaction ...");
		$aData = array(
            'all' =>array(
				'tariffs'=>array(
					'list',
                ),
                'modules'=>array(
                    'load'
                ),
                'payments'=>array(
                    'getgroup'
                )
            ),
			'view'=>array(
				'admin'=>array(
					'filter',
					'role',
					'grid',
				),
				'auth'=>array(
					'admin',
                    'unlock',
					'getsettings',
				),
				'modules'=>array(
					'list',
					'allow'
				),
				'nas'=>array(
					'grid',
				),
				'payments'=>array(
					'monthgrid',
					'dategrid',
					'grid'
				),
				'pools'=>array(
					'filter',
					'list',
					'grid',
				),
				'users'=>array(
					'getbyid',
					'grid',
					'list'
				),
				'reports'=>array(
					'stat',
					'statday',
					'statmonth',
					'payments',
					'tariff',
					'intariff'
				),
				'sessions'=>array(
					'grid',
				),
				'settings'=>array(
					'get',
					'setmain'
				),
				'sluices'=>array(
					'grid',
					'filter',
					'list',
				),
				'tariffs'=>array(
					'filter',
					'grid',
					'intariff',
					'tree',
					'wintariff',
					'winintariff'
				),
				'tasks'=>array(
					'tree',
					'grid',
					'oldgrid',
					'wintask',
				),
				'zones'=>array(
					'grid'
				),
			),
			'add'=>array(
				'admin'=>array(
					'add',
				),
				'modules'=>array(
					'install'
				),
				'nas'=>array(
					'add',
				),
				'users'=>array(
					'add',
				),
				'payments'=>array(
					'add',
					'pay',
					'paymonthly',
					'paydaily'
				),
				'pools'=>array(
					'add',
				),
				'sluices'=>array(
					'add',
				),
				'tariffs'=>array(
					'add'
				),
				'tasks'=>array(
					'add',
				),
				'zones'=>array(
					'add'
				),
			),
			'edit'=>array(
				'admin'=>array(
					'edit',
				),
				'auth'=>array(
					'setsettings',
				),
				'nas'=>array(
					'edit',
				),
				'users'=>array(
					'edit',
					'checkmbon',
					'checkmboff',
					'newuseron',
					'newuseroff',
				),
				'payments'=>array(
					'edit'
				),
				'pools'=>array(
					'edit',
				),
				'settings'=>array(
					'setcompany'
				),
				'sluices'=>array(
					'edit',
				),
				'tariffs'=>array(
					'edit',
					'addzone',
					'editzone',
					'deletezone',
				),
				'tasks'=>array(
					'edit',
				),
				'zones'=>array(
					'edit'
				),
			),
			'delete'=>array(
				'admin'=>array(
					'delete',
				),
				'modules'=>array(
					'deinstall'
				),
				'auth'=>array(
					'delsettings',
				),
				'nas'=>array(
					'delete',
				),
				'payments'=>array(
					'delete'
				),
				'pools'=>array(
					'delete',
				),
				'sessions'=>array(
					'delete',
				),
				'sluices'=>array(
					'delete',
				),
				'tariffs'=>array(
					'delete'
				),
				'tasks'=>array(
					'delete',
				),
				'zones'=>array(
					'delete'
				),
			),
			'submit'=>array(
				'auth'=>array(
					'index',
					'unlogin',
				),
				'modules'=>array(
				),
				'users'=>array(
					'debtsoff',
					'daily',
					'monthly',
					'off',
					'on',
					'chtariff'
				),
				'settings'=>array(
					'setbilling'
				),
				'payments'=>array(
					'apply'
				),
				'tariffs'=>array(
					'apply',
					'deny',
					'allow'
				),
				'reports'=>array(
					'order',
				),
				'sessions'=>array(
					'close'
				)
			),
            'settings'=>array(
                'payments'=>array(
                    'settings',
                    'getuser',
                    'togroup'
                )
            )
		);
		$this->Db->delete('rightaction');
		foreach ($aData as $right=>$aResource){
			foreach ($aResource as $controller=>$aActions){
				foreach ($aActions as $action){
					$aInsData = array(
						'rights'	=> $right, 
						'controller'=> $controller,
						'action'	=> $action
					);
					$this->Db->insert('rightaction',$aInsData);
				}
			}
		}
	}

	public function SetDefSettings(){
		AppLog::output("Settings ...");
		$aData = array(
			array(
				'text'		=> 'Наименование',
				'param'		=> 'name',
				'value'		=> '',
				'answer'	=> array(),							
				'type'		=> SETTINGS_COMPANY
			),
			array(
				'text'		=> 'Адрес',
				'param'		=> 'address',
				'value'		=> '',
				'answer'	=> array(),							
				'type'		=> SETTINGS_COMPANY
			),
			array(
				'text'		=> 'Телефон',
				'param'		=> 'tel',
				'value'		=> '',
				'answer'	=> array(),							
				'type'		=> SETTINGS_COMPANY
			),
			array(
				'text'		=> 'Факс',
				'param'		=> 'fax',
				'value'		=> '',
				'answer'	=> array(),							
				'type'		=> SETTINGS_COMPANY
			),
			array(
				'text'		=> 'ICQ',
				'param'		=> 'icq',
				'value'		=> '',
				'answer'	=> array(),							
				'type'		=> SETTINGS_COMPANY
			),
			array(
				'text'		=> 'Путь для резервного копирования',
				'param'		=> 'backup_path',
				'value'		=> '/tmp',
				'answer'	=> array(),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'День абонплаты',
				'param'		=> 'date_fee',
				'value'		=> '1',
				'answer'	=> array(),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Роль назначаемая пользователю',
				'param'		=> 'role',
				'value'		=> 'user',
				'answer'	=> array(),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Перенаправять на страницу приветствия новых пользователей',
				'param'		=> 'newuser',
				'value'		=> '0',
				'answer'	=> array(
									array('rvalue'	=> '0',
										  'name'	=> 'Нет'),
									array('rvalue'	=> '1',
										  'name'	=> 'Да'),
								),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Накоплять бесплатные МБ',
				'param'		=> 'keep_freebyte',
				'value'		=> '1',
				'answer'	=> array(
									array('rvalue'	=> '0',
										  'name'	=> 'Нет'),
									array('rvalue'	=> '1',
										  'name'	=> 'Да'),
								),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Накоплять бонусные МБ',
				'param'		=> 'keep_bonus',
				'value'		=> '0',
				'answer'	=> array(
									array('rvalue'	=> '0',
										  'name'	=> 'Нет'),
									array('rvalue'	=> '1',
										  'name'	=> 'Да'),
								),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Маска подсети для печати',
				'param'		=> 'mask',
				'value'		=> '0.0.0.0',
				'answer'	=> array(),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'DNS для печати',
				'param'		=> 'DNS',
				'value'		=> '0.0.0.0',
				'answer'	=> array(),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'URL статистики для печати',
				'param'		=> 'URL',
				'value'		=> 'http://',
				'answer'	=> array(),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Валюта',
				'param'		=> 'currency',
				'value'		=> 'грн',
				'answer'	=> array(),							
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Детализация логов',
				'param'		=> 'log_priority',
				'value'		=> '4',
				'answer'	=> array(							
									array('rvalue'	=> '1',
										  'name'	=> 'Тревога'),
									array('rvalue'	=> '2',
										  'name'	=> 'Критические'),
									array('rvalue'	=> '3',
										  'name'	=> 'Ошибки'),
									array('rvalue'	=> '4',
										  'name'	=> 'Предупреждения'),
									array('rvalue'	=> '5',
										  'name'	=> 'Информация'),
									array('rvalue'	=> '6',
										  'name'	=> 'Все'),
							   ),
				'type'		=> SETTINGS_BILLING
			),
			array(
				'text'		=> 'Тема оформления',
				'param'		=> 'theme',
				'value'		=> 'default',
				'answer'	=> array(							
									array('rvalue'	=> 'default',
										  'name'	=> 'default'),
									array('rvalue'	=> 'gray',
										  'name'	=> 'gray'),
									array('rvalue'	=> 'darkgray',
										  'name'	=> 'darkgray'),
									array('rvalue'	=> 'vistablack',
										  'name'	=> 'vistablack'),
									array('rvalue'	=> 'vistablue',
										  'name'	=> 'vistablue'),
									array('rvalue'	=> 'vistaglass',
										  'name'	=> 'vistaglass')
							   ),
				'type'		=> SETTINGS_MAIN
			),
			array(
				'text'		=> 'Сохранять настройки при выходе',
				'param'		=> 'save_settings',
				'value'		=> '1',
				'answer'	=> array(							
									array('rvalue'	=> '1',
										  'name'	=> 'Да'),
									array('rvalue'	=> '0',
										  'name'	=> 'Нет'),
							   ),
				'type'		=> SETTINGS_MAIN
			),
		);
		$this->Db->delete('settings');
		foreach ($aData as $aInsData){
			$aInsData['answer'] = Zend_Json::encode($aInsData['answer']);
    		Utils::decode($aInsData);
			$this->Db->insert('settings',$aInsData);
		}
	}

	/**
	 * Defaults SettingServer
	 */
	public function SetDefault(){
		//deinstall modules
		$this->DeinstallModules();
		//periods
		$this->SetDefPeriods();
		//flags
		$this->SetDefFlags();
		//taskattribute
		$this->SetDefTaskattribute();
		//role
		$this->SetDefRole();
		//roleparent
		$this->SetDefRoleparent();
		//resource
		$this->SetDefResource();
		//rightaction
		$this->SetDefRightaction();
		// settings
		$this->SetDefSettings();
		//update tasks
		$this->Db->update('tasks',array('id_period'=>'1'),"attribute='Change-tariff'");
		$this->Db->update('tasks',array('id_period'=>'2'),"attribute='Subscribe'");
		$this->Db->update('tasks',array('id_period'=>'3'),"attribute='Monthly-fee'");
	}

	public function GetMainParams($keys=null){
		$sql = $this->Db->select()
						->from('usersettings', array('var','value'))
						->where('id_user = ?', Context::GetUserData('id'));
		if (is_array($keys))		
			$sql->where("var in ('".implode("','",$keys)."')");
		elseif ($keys)
			$sql->where("var = ?",$keys);
        $aParams = $this->Db->fetchPairs($sql);    
        //Utils::encode($aParams);
		return $aParams;
	}	

	/**
	 * Извлекает массив параметров из БД 
	 * @return 
	 * @param object $key[optional]
	 */
	public function GetParams(){
		$aResult = array();
		$sql = $this->Db->select()->from('settings',array('param','value'))->where('type=?',SETTINGS_BILLING);
		$aResult[SETTINGS_BILLING] = $this->Db->fetchPairs($sql);
		$sql = $this->Db->select()->from('settings',array('param','value'))->where('type=?',SETTINGS_COMPANY);
		$aResult[SETTINGS_COMPANY] = $this->Db->fetchPairs($sql);
		$sql = $this->Db->select()->from('settings',array('param','value'))->where('type=?',SETTINGS_MAIN);
		$aResult[SETTINGS_MAIN] = $this->Db->fetchPairs($sql);
		$mainKeys = array_keys($aResult[SETTINGS_MAIN]);
		$aMain = $this->GetMainParams($mainKeys);
		$aResult[SETTINGS_MAIN]=array_merge($aResult[SETTINGS_MAIN],$aMain);
        Utils::encode($aResult);
		return $aResult;
	}

	/**
	 * Извлекает массив параметров из БД 
	 * @return 
	 * @param object $key[optional]
	 */
	public function GetAppParams(){
		$aResult = array();
		$sql = $this->Db->select()->from('settings',array('param','value'))->where('type=?',SETTINGS_BILLING);
		$aResult[SETTINGS_BILLING] = $this->Db->fetchPairs($sql);
		$sql = $this->Db->select()->from('settings',array('param','value'))->where('type=?',SETTINGS_COMPANY);
		$aResult[SETTINGS_COMPANY] = $this->Db->fetchPairs($sql);
        Utils::encode($aResult);
		return $aResult;
	}
	/**
	 * Возвращает настройки
	 * @return 
	 * @param object $key[optional]
	 */
	public static function Main($key=null)
    {
		$aSettings = Context::GetSettings();
    	if ($key && isset($aSettings[SETTINGS_MAIN][$key]))
    		return $aSettings[SETTINGS_MAIN][$key];
   		else
   			return $aSettings[SETTINGS_MAIN];
    }
	/**
	 * Возвращает настройки компании
	 * @return 
	 * @param object $key[optional]
	 */
	public static function Company($key=null)
    {
		$aSettings = Context::GetSettings();
    	if ($key && isset($aSettings[SETTINGS_COMPANY][$key]))
    		return $aSettings[SETTINGS_COMPANY][$key];
   		else
   			return $aSettings[SETTINGS_COMPANY];
    }
	/**
	 * Возвращает настройки биллинга
	 * @return 
	 * @param object $key[optional]
	 */
	public static function Billing($key=null)
    {
		$aSettings = Context::GetSettings();
    	if ($key && isset($aSettings[SETTINGS_BILLING][$key]))
    		return $aSettings[SETTINGS_BILLING][$key];
   		else
   			return $aSettings[SETTINGS_BILLING];
    }
	
	public function GetProperties($type){
		$aResult = array();
		$sql = $this->Db->select()
					->from('settings', array('param','value','text','answer'))
					->where('type = ?', $type);
		$aSettings = $this->Db->fetchAssoc($sql);
		Utils::encode($aSettings);
		$mainKeys = array_keys($aSettings);
		$aMain = $this->GetMainParams($mainKeys);
		foreach ($aSettings as $param=>$aValue){
			$answers = Zend_Json::decode($aValue['answer']);
			$aResult[$param]=array(
				'name'		=> $aValue['text'],
				'answers'	=> $answers,
				'type'		=> count($answers)==0?1:2,
				'rvalue'	=> $aValue['value']				
			);
			if (array_key_exists($param, $aMain))
				$aResult[$param]['rvalue'] = $aMain[$param];
		}
		return $aResult;
	}
	
	public function SetProperties($prop){
		$sql = $this->Db->select()->from('settings', array('param','id'));
		$aSettingsId = $this->Db->fetchPairs($sql);
		$aSettings = Zend_Json::decode($prop);
		Utils::decode($aSettings);
		foreach ($aSettings as $param=>$value){
			$this->Db->update('settings',array('value'=>$value),"id='{$aSettingsId[$param]}'");
		};
		Context::SetSettings($this->GetParams());
		return array('success'=>true);
	}

	public function SetMainProperties($prop)
	{
		$aSettings = Zend_Json::decode($prop);
		foreach ($aSettings as $param=>$value){
			$sql = $this->Db->select()
							->from('usersettings', new Zend_Db_Expr('COUNT(*)'))
							->where('id_user = ?', Context::GetUserData('id'))		
							->where('var = ?', $param);
			$aWhere = array();
			if ($this->Db->fetchOne($sql)!=0)	
			{
				$aWhere[]=$this->Db->quoteInto('id_user = ?', Context::GetUserData('id'));
				$aWhere[]=$this->Db->quoteInto('var = ?', $param);
				$aUpdateData=array('value'=>$value);							
				$this->Db->update('usersettings', $aUpdateData, $aWhere);
			} else {
				$aInsData=array('id_user'=>Context::GetUserData('id'), 'var'=>$param, 'value'=>$value);							
				$this->Db->insert('usersettings', $aInsData);
			}
		};
		Context::SetSettings($this->GetParams());
		return array('success'=>true);
	}
}