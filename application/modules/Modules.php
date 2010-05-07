<?php
abstract class Modules {
	/**
	* Дескриптор базы данных
	* $var resource
	*/
	public $Db=null;
	public $author = '';
	public $description = '';
	public $deInstallData = '';
	public $installData = array();
	public $actions = array();
	public $rn = array();
	
	protected $acl;
	protected $params = array();
	
	/**
     * Конструктор
     * @param Zend_Db_Adapter_Abstract $db Объект соединения с БД
	 */
	public function __construct()
	{	
		$this->Db = Zend_Registry::get('db');
		$this->acl= Zend_Registry::get('acl');
		$this->Init();
		//Utils::decode($this->rn);
	}
	
	public function Init(){}
	
	public function __call($action,$args){
   		$isAllowed = $this->acl->isAllowed(Context::GetRole(),$this->_getModuleName(),$action);
		if ($isAllowed){
			$result = $this->_dispatch($action);
		} else {
			$result = AppResponse::failure('У Вас не достаточно прав для выполнения запрашиваемого действия!');
		}
		return $result;
	}
	
	public function setAllParams($params){
		$this->params = $params;
	}

	/**
	 * Инсталирует модуль в систему
	 */
	public function Install(){
		Utils::decode($this->installData);
		$this->Db->beginTransaction();
		try {
			$newModule = $this->moduleId;
			$this->Db->insert('resource',$this->installData['resource']);
			foreach ($this->installData['rightaction'] as $right=>$aResource){
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
			$config = new Zend_Config_Ini(MODULES_DIR.'modules.ini');
			if (isset($config->general)&&isset($config->general->modules)){
				$aModules = $config->general->modules->toArray();
			} else {
				$aModules=array();
			}
			$aSections = array();
			foreach ($aModules as $k=>$v){
				$aSections[$k] = $config->$k->toArray();				
			}
			$config = new Zend_Config(array(), true);
			$config->general = array();
			$config->$newModule = array();
			$config->general->modules = $aModules;
			$config->general->modules->$newModule = '1';
			foreach ($aSections as $k=>$v){
				$config->$k = $v;
			}
			$config->$newModule = array();
			$config->$newModule->author = $this->author;
			$config->$newModule->description = $this->description;
			$config->$newModule->rights = $this->rights;
			$writer = new Zend_Config_Writer_Ini();
			$writer->write(MODULES_DIR.'modules.ini', $config);
			$this->_refresh();
			$this->Db->commit();
			return true;
		} catch (Exception $e){
			$this->Db->rollBack();
			return $e->getMessage();
		}
	}

	public function DeInstall(){
		Utils::decode($this->deInstallData);
		$this->Db->beginTransaction();
		try {
			$removeModule = $this->moduleId;
			$where = $this->Db->quoteInto("resource = ?", $removeModule);
			$this->Db->delete('resource',$where);
			$where = $this->Db->quoteInto("controller = ?", $removeModule);
			$this->Db->delete('rightaction',$where);
			$config = new Zend_Config_Ini(MODULES_DIR.'modules.ini');
			if (isset($config->general)){
				$aGeneral = $config->general->toArray();
				unset ($aGeneral[$removeModule]);
				if (isset($config->general->modules)){
					$aModules = $config->general->modules->toArray();
					unset ($aModules[$removeModule]);
				} else {
					$aModules=array();				
				}
			} else {
				$aGeneral=array();
				$aModules=array();				
			}
			$aSections = array();
			foreach ($aModules as $k=>$v){
				$aSections[$k] = $config->$k->toArray();				
			}
			$config = new Zend_Config(array(), true);
			$config->general = $aGeneral;
			$config->general->modules = $aModules;
			foreach ($aSections as $k=>$v){
				$config->$k = $v;
			}
			$writer = new Zend_Config_Writer_Ini();
			$writer->write(MODULES_DIR.'modules.ini', $config);
			$this->_refresh();
			$this->Db->commit();
			return true;
		} catch (Exception $e){
			$this->Db->rollBack();
			return $e->getMessage();
		}
	}

	private function _refresh(){
		$oManager = new Manager();
		$oManager->SetContext();
	}
	
	private function _getModuleName(){
		return strtolower(get_class($this));	
	}
	
	private function _dispatch($action){
		if (method_exists($this,$action)){
			return $this->$action();
		}
		$action = strtolower($action);
		if (isset($this->actions[$action])){
			$action = (string)$this->actions[$action];
			if (method_exists($this,$action)){
				return $this->$action();
			}
		}
		return $this->_noAction();
	}
	
	private function _noAction(){
		$this->arguments = array();
		$this->params = array();
		return AppResponse::failure('Метод не найден!');
	}

	protected function _filter(Zend_Db_Select &$sql, array $filter)  
	{
		foreach ($filter as $flt){
			$value = Utils::decode($flt['data']['value']);
			$field=$flt['field'];
			switch($flt['data']['type']){
				case 'string' : 
					$sql->where("$field LIKE ?", "%".str_replace('*','%',$value)."%"); 
				break;
				case 'list' : 
					if (strstr($value,',')){
						$sql->where("$field IN (?)", explode(',',$value)); 
					}else{
						$sql->where("$field = ?", $value); 
					}
				break;
				case 'boolean' : 
					$sql->where("$field = ?", $value=='true'?'1':'0'); 
				break;
				case 'numeric' : 
					switch ($flt['data']['comparison']) {
						case 'eq' : $sql->where("$field = ?", $value); break;
						case 'lt' : $sql->where("$field < ?", $value);  break;
						case 'gt' : $sql->where("$field > ?", $value);  break;
					}
				break;
				case 'date' : 
					switch ($flt['data']['comparison']) {
						case 'eq' : $sql->where("$field = ?", date('Y-m-d',strtotime($value))); break;
						case 'lt' : $sql->where("$field < ?", date('Y-m-d',strtotime($value))); break;
						case 'gt' : $sql->where("$field > ?", date('Y-m-d',strtotime($value))); break;
					}
				break;
			}
		}
	}

	protected function _getAllParams(){
		return $this->params;
	}

	protected function _getParam($key){
		return array_key_exists($key,$this->params)?$this->params[$key]:null;
	}

	protected function _unsetParam($key){
	    $param = array_key_exists($key,$this->params)?$this->params[$key]:null;
        unset($this->params[$key]);
		return $param;
	}
    
}