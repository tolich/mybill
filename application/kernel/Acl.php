<?php
/**
 * Права доступа
 * TODO перенести в БД 
 */
class Acl {
	/**
	* Дескриптор базы данных
	* $var resource
	*/
	protected $Db=null;

	protected $acl;

	protected $rn = array(
		'view'=>array(
			'admin'=>'Просмотр списка администраторов',
			'auth'=>'Авторизация',
			'modules'=>'Просмотр списка модулей',
			'nas'=>'Просмотр списка серверов доступа',
			'payments'=>'Просмотр списка платежей',
			'pools'=>'Просмотр списка пулов IP-адресов',
			'users'=>'Просмотр списка пользователей',
			'reports'=>'Просмотр отчетов',
			'sessions'=>'Просмотр списка активных сессий',
			'settings'=>'Получение персональных настроек',
			'sluices'=>'Просмотр списка шлюзов',
			'tariffs'=>'Просмотр списка тарифов',
			'tasks'=>'Просмотр списка задач',
			'zones'=>'Просмотр списка зон',
		),
		'add'=>array(
			'admin'=>'Добавление администратора',
			'modules'=>'Добавление модуля',
			'nas'=>'Добавление сервера доступа',
			'users'=>'Добавление пользователя',
			'payments'=>'Создание платежа',
			'pools'=>'Добавление пула IP адресов',
			'sluices'=>'Добавление шлюза',
			'tariffs'=>'Добавление тарифа',
			'tasks'=>'Добавление задачи',
			'zones'=>'Добавление зоны',
		),
		'edit'=>array(
			'admin'=>'Редактирование администратора',
			'auth'=>'Сохранение персональных настроек',
			'nas'=>'Добавление сервера доступа',
			'users'=>'Редактирование пользователя, контроль Мб, новый пользователь',
			'payments'=>'Редактирование платежа',
			'pools'=>'Редактирование пула IP адресов',
			'settings'=>'Сохранение параметров предприятия',
			'sluices'=>'Редактирование шлюза',
			'tariffs'=>'Редактирование тарифа',
			'tasks'=>'Редактирование задачи',
			'zones'=>'Редактирование зоны',
		),
		'delete'=>array(
			'admin'=>'Удаление администратора',
			'modules'=>'Удаление модуля',
			'auth'=>'Удаление персональных настроек',
			'nas'=>'Удаление сервера доступа',
			'payments'=>'Удаление платежа',
			'pools'=>'Удаление пула IP адресов',
			'sessions'=>'Удаление зависшей сессии',
			'sluices'=>'Удаление шлюза',
			'tariffs'=>'Удаление тарифа',
			'tasks'=>'Удаление задачи',
			'zones'=>'Удаление зоны',
		),
		'submit'=>array(
			'auth'=>'Вход/выход в систему',
			'users'=>'Вкл/выкл., смена тарифа, списание абонплаты',
			'settings'=>'Сохранение настроек биллинга',
			'payments'=>'Проводка платежей',
			'tariffs'=>'Применение изменений тарифа к пользователям',
			'reports'=>'Печать ордера на подключение',
			'sessions'=>'Сброс активного пользователя',
			'zones'=>'Изменение доступа к зоне в тарифе'
		)
	);
	
	/**
	 * Роли
	 */
	protected $role = array();

	/**
	 * Роли по-умолчанию
	 *	protected $_role = array(
	 *		'guest'			=> null,
	 *		'user'			=> 'guest', 
	 *		'staff'			=> 'guest',
	 *		'cashier'		=> 'staff',
	 *		'manager'		=> 'staff',
	 *		'director'		=> 'staff',
	 *		'administrator'	=> null,
	 *	);
	 */
	
	/**
	 * Ресурсы
	 */
	protected $resource = array();

	/**
	 * Ресурсы по-умолчанию
	 *	protected $_resource = array(
	 *		'auth'			=> null,
	 *		'admin'			=> null,
	 *		'nas'			=> null,
	 *		'payments'		=> null,
	 *		'pools'			=> null,
	 *		'reports'		=> null,
	 *		'redirect'		=> null,
	 *		'sessions'		=> null,
	 *		'sluices'		=> null,
	 *		'stat'			=> null,
	 *		'tariffs'		=> null,
	 *		'tasks'			=> null,
	 *		'users'			=> null,
	 *		'zones'			=> null,
	 *	);
	 */
	
	/**
	 * Права
	 */
	protected $right = array();

	/**
	 * Права по-умолчанию
	 */
	protected $_right = array(
		'guest'				=> array(
			'allow'			=> array(
				'auth'		=> array(	// Авторизация
					'view',				// Открытие 
					'submit',			// Вход и выход из системы
				),
				'redirect'	=> null
			),
			'deny'			=> array(
			)
		),
		'user'				=> array(
			'allow'			=> array(
				'reports'	=> array(	// Отчеты на персональной странице
					'view',				// Открытие 	
				),
			),
			'deny'			=> array(
			)
		),
		'staff'				=> array( 
			'allow'			=> array(
				'auth'		=> array(	// Авторизация
					'edit',				// Сохранение настроек грида пользователей
					'delete',			// Удаление настроек грида пользователей
				),
				'users'		=> array(	// Пользователи
					'view',				// Просмотр информации в гриде
				),
				'reports'	=> array(
					'submit',			// Печать отчетов
				),
				'settings'=>array(		
					'view',				// Просмотр свойств
				),
				'sessions'	=> array(
					'view',				// Просмотр информации о подключенных пользователях
				),
			),
			'deny'			=> array(
			)
		),
		'cashier'			=> array(
			'allow'			=> array(
				'payments'	=> array(	// Платежи	
					'view',				// Просмотр истории платежей
					'add',				// Создание платежа
					'edit',				// Редактирование платежа
					'delete'			// Удаление платежа
				),
			),
			'deny'			=> array(
				'sessions'	=> array(
					'view',				// Просмотр информации о подключенных пользователях
					'delete',			// Удаление сессии
					'submit'			// Разрыв сессии
				),
			)
		),
		'manager'			=> array(
			'allow'			=> array(
				'users'		=> null,	// Все операции с пользователями
				'payments'	=> null,	// Все операции с платежами
				'reports'	=> null,	// Все операции с отчетами
				'tasks'		=> array(	// Запланированные задачи
					'view',				// Просмотр задач
					'add',				// Создание задачи
					'edit',				// Редактирование задачи
					'delete',			// Удаление задачи
				),
				'settings'=>array(		
					'edit',				// Изменение свойств (фирма)
				),
				'sessions'	=> array(
					'delete',			// Удаление сессии
					'submit'			// Разрыв сессии
				),
			),
			'deny'			=> array(
			)
		),
		'director'			=> array(
			'allow'			=> array(
				'payments'	=> array(	// Платежи	
					'view',				// Просмотр платежей
				),
				'reports'	=> array(	// Отчеты
					'view',				// Просмотр отчетов
				),
			),
			'deny'			=> array(
			)
		),
		'administrator'		=> array(
			'allow'			=> null,	// Доступ ко всему
			'deny'			=> array(
			)
		),
	);

	/**
	 * Права доступа на действия
	 */
	protected $action = array();

	/**
     * Конструктор
     * @param Zend_Db_Adapter_Abstract $db Объект соединения с БД
	 */
	public function __construct()
	{	
		$this->Db = Zend_Registry::get('db');
		$this->_init();
	}
	
	public function reInit(){
		$this->_init(true);
	}
		
	/**
	 * Возвращает true если у $role есть $right на $resource 
	 * @return 
	 * @param object $role
	 * @param object $controller[optional]
	 * @param object $action[optional]
	 */
	public function isAllowed($role, $controller=null, $action=null){
		foreach ($this->action as $privilege=>$aResource){
			if (array_key_exists($controller,$aResource)&&in_array($action,$aResource[$controller]))
				return $this->acl->isAllowed($role,$controller,$privilege);
		}
		return $this->acl->isAllowed($role,$controller);
	}
	
	/**
	 * Возвращает родительскую роль
	 * @return 
	 * @param object $role
	 */
	public function getParentRole($role){
		$aRoles = Context::getAcl('role');
		$parentRole = is_array($aRoles[$role])?$aRoles[$role][0]:$aRoles[$role];
		return $parentRole;
	}
	
	/**
	 * Возвращает все права доступа с учетом наследования
	 * для роли
	 * @param object $role
	 * @return array
	 */	
	 public function getAllRights($role){
		$aRights = array(
			'allow' => array(),
			'deny'	=> null
		);
	 	if ($role !== null){
			$tmpAllow = array();
			$tmpDeny = array();
			$aResource = array_keys($this->resource);
			$aPrivilege = array_keys($this->action);
			foreach ($aResource as $resource){
				foreach ($aPrivilege as $privilege){
					if (in_array($resource,array_keys($this->action[$privilege]))) {
						if ($this->acl->isAllowed($role,$resource,$privilege)){
							$tmpAllow[$resource][] = $privilege;					
						} else {
							$tmpDeny[$resource][] = $privilege;					
						}
					}
				}
				if (array_key_exists($resource,$tmpAllow)&&$tmpAllow[$resource]==$aPrivilege) $tmpAllow[$resource]=null;
				if (array_key_exists($resource,$tmpDeny)&&$tmpDeny[$resource]==$aPrivilege) $tmpDeny[$resource]=null;
				$aRights= array(
					'allow' => $tmpAllow,
					'deny'	=> $tmpDeny
				);
			}
		}
		return $aRights;
	 }
	
	public function getAllRightsList(){
		return array_keys($this->rn);
	}
	
	/**
	 * Список прав модуля
	 * @return 
	 * @param object $module
	 */
	public function getRightsList($module){
		$aResult = array();
		foreach($this->rn as $k=>$aVal){
			if (in_array($module,array_keys($aVal))) {
				$aResult[] = $k;
			};
		}
		sort($aResult);
		return $aResult;
	}
	
	/**
	 * Массив пар право=>название_права модуля
	 * @return 
	 * @param object $module
	 */
	public function getRightsName($module){
		$aResult = array();
		$oManager = new Manager();
		$aModules = $oManager->GetModules();
		$rn = $this->rn;
		foreach ($aModules as $mod=>$allow){
			$oModule = new $mod();
			$rn = array_merge_recursive($rn, $oModule->rn);
		}
		foreach($rn as $k=>$aVal){
			if (in_array($module,array_keys($aVal))) {
				$aResult[$k] = $aVal[$module];
			};
		}
		return $aResult;
	}

	/**
	 * Массив пар id_роли=>роль
	 * @return 
	 */
	public function getRolePairs(){
		$sql = $this->Db->select()
					->from('role',array('id','role'));
		$aRoles = $this->Db->fetchPairs($sql);
		return $aRoles;
	}
	
	/**
	 * Массив пар ресурс=>название_ресурса
	 * @return 
	 */
	public function getResourcesName(){
		$sql = $this->Db->select()
					->from('resource',array('resource','resourcename'));
		$aResources = $this->Db->fetchPairs($sql);
		Utils::encode($aResources);
		return $aResources;
	}

	/**
	 * Массив пар id_ресурса=>ресурс
	 * @return 
	 */
	public function getResourcePairs(){
		$sql = $this->Db->select()
					->from('resource',array('id','resource'));
		$aResources = $this->Db->fetchPairs($sql);
		return $aResources;
	}
	
	/**
	 * Формирует роли
	 * @return 
	 */
	private function _prepareRole(){
		$aContextRole = Context::GetAcl('role');
		if ($aContextRole===false) {
			$sql = $this->Db->select()
							->from('role', array('id','role','rights'));
			$aRoles = $this->Db->fetchAll($sql);
			foreach ($aRoles as $v){
				$sql = $this->Db->select()
								->from('role', array('role'))
								->join('roleparent', 'role.id=roleparent.id_parent', array())
								->where('id_role=?',$v['id']);
				$aParents = $this->Db->fetchRow($sql,array(),Zend_Db::FETCH_NUM);
				if (is_array($aParents)) 
					$this->role[$v['role']]=$aParents;
				else
					$this->role[$v['role']]=null;
				if ($v['rights']!='')
					$this->right[$v['role']]=Zend_Json::decode($v['rights']);
			}
			Context::SetAcl($this->role,'role');
		} else {
			$this->role = $aContextRole;
		}
	}

	/**
	 * Формирует ресурсы
	 * @return 
	 */
	private function _prepareResource(){
		$aContextResource = Context::GetAcl('resource');
		if ($aContextResource===false) {
			$sql = $this->Db->select()
							->from('resource', array('id','resource'));
			$aResources = $this->Db->fetchAll($sql);
			foreach ($aResources as $v){
				$sql = $this->Db->select()
								->from('resource', array('resource'))
								->join('resourceparent', 'resource.id=resourceparent.id_parent', array())
								->where('id_resource=?',$v['id']);
				$aParents = $this->Db->fetchRow($sql,array(),Zend_Db::FETCH_NUM);
				if (is_array($aParents)) 
					$this->resource[$v['resource']]=$aParents;
				else
					$this->resource[$v['resource']]=null;
			}
			Context::SetAcl($this->resource,'resource');
		} else {
			$this->resource = $aContextResource;
		}
	}

	/**
	 * Формирует права
	 * @return 
	 */
	private function _prepareRight(){
		$aContextRight = Context::GetAcl('right');
		if ($aContextRight===false) {
			$oManager = new Manager();
			$aModulesRights = $oManager->GetAllModulesRight();
			//Utils::debug($this->right);
			if (count($this->right)==0){
				$this->right = $this->_right;
				foreach ($aModulesRights as $module=>$right){
					$this->right = array_merge_recursive($this->right,$right);
				}
			} else {
				$_right = $this->_right;
				foreach ($aModulesRights as $module=>$right){
					$_right = array_merge_recursive($_right,$right);
				}
				$this->right = array_merge($_right,$this->right);			
			}
			Context::SetAcl($this->right,'right');
		} else {
			$this->right = $aContextRight;
		}
	}
	
	/**
	 * Формирует права-действия
	 * @return 
	 */
	private function _prepareAction(){
		$aContextAction = Context::GetAcl('action');
		if ($aContextAction===false) {
			$sql = $this->Db->select()
							->from('rightaction', array('rights','controller','action'));
			$aActions = $this->Db->fetchAll($sql);
			foreach ($aActions as $v){
				if (!array_key_exists($v['rights'],$this->action))
					$this->action[$v['rights']]=array();
				if (!array_key_exists($v['controller'],$this->action[$v['rights']]))
					$this->action[$v['rights']][$v['controller']]=array();
				$this->action[$v['rights']][$v['controller']][]=$v['action'];
			}
			Context::SetAcl($this->action,'action');
		} else {
			$this->action = $aContextAction;
		}
	}
	
	/**
	 * Инициализирует Zend_Acl
	 * Права - view, add, edit, delete, submit
	 * TODO Кеш
	 */
	private function _initAcl(){
		$this->acl = new Zend_Acl();
		foreach($this->role as $role=>$aParent)
			$this->acl->addRole(new Zend_Acl_Role($role),$aParent);
		foreach($this->resource as $resource=>$aParent)	
			$this->acl->add(new Zend_Acl_Resource($resource),$aParent);
		foreach($this->right as $role=>$aRight)
			foreach($aRight as $right=>$aResources)
				if (is_array($aResources))
					foreach($aResources as $resource=>$aPrivilege){
						$this->acl->$right($role,$resource,$aPrivilege);
					}
				else
					$this->acl->$right($role);
	}

	private function _init($force=false){
		if ($force){
			$this->acl = array();
			$this->role = array();
			$this->resource = array();
			$this->right = array();
			$this->action = array();
			Context::SetAcl(array(
			 	'role'		=> false,
			 	'resource'	=> false,
			 	'right'		=> false,
			 	'action'	=> false
			));
		}
		$this->_prepareRole();
		$this->_prepareResource();
		$this->_prepareRight();
		$this->_prepareAction();
		$this->_initAcl();
	}
}
