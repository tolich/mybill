<?php
/**
 * Управляет модулями
 */
class Manager {
	public $Db = null;
	
	public $_modules = null;
	/**
     * Конструктор
     * @param Zend_Db_Adapter_Abstract $db Объект соединения с БД
	 */
	public function __construct()
	{	
		$this->Db = Zend_Registry::get('db');
		if (Context::GetModules()){
			$this->_modules = Context::GetModules();
		} else {
			$this->_modules = $this->GetModules();
			Context::SetModules($this->_modules);
		}
	}
	
	/**
	 * Возвращает список всех модулей для грида
	 * @return 
	 */
	public function GetAllModulesList(){
		$aModules = $this->GetAllModules();
		$aModulesList = array();
		foreach ($aModules as $name=>$status){
			$aModulesList[]=array_merge(array('name'=>$name,'status'=>$status),$this->GetParams($name));	
		}
		return $aModulesList;
	}	

	/**
	 * Возвращает все модули
	 * @return 
	 */
	public function GetAllModules(){
		$aModules = array();
		$config = new Zend_Config_Ini(MODULES_DIR.'modules.ini');
		if (isset($config->general->modules)){
			$aModules = $config->general->modules->toArray();
		}
		return $aModules;
	}	

	/**
	 * Возвращает все доступные, неустановленные модули
	 * @return 
	 */
	public function GetAllowModules(){
		$aModules = array();
		$aInstallModules = $this->GetModules();
		foreach (glob(MODULES_DIR."*") as $dir){
			if (is_dir($dir)&&!array_key_exists(basename($dir,''),$aInstallModules))
				$aModules[] = array('name'=>basename($dir,''));
		}					
		return $aModules;
	}	
	
	/**
	 * Возвращает активные модули
	 * @return 
	 */
	public function GetModules(){
		return array_intersect($this->GetAllModules(), array("1"));
	}

	/**
	 * Возвращает права на модуль для Acl
	 * @return 
	 * @param object $modules
	 */
	public function GetRights($modules){
		$aRights = array();
		$config = new Zend_Config_Ini(MODULES_DIR.'modules.ini', $modules);
		if (isset($config->rights)){
			$aRights = $config->rights->toArray();
		}
		return $aRights;
	}	

	/**
	 * Возвращает параметры модуля за исключением прав
	 * @return 
	 * @param object $modules
	 */
	public function GetParams($modules){
		$aParams = array();
		$config = new Zend_Config_Ini(MODULES_DIR.'modules.ini', $modules);
		if (isset($config)){
			$aParams = $config->toArray();
		}
		unset($aParams['rights']);
		//array_walk($aParams, array('Utils', 'array_encode'));
		return $aParams;
	}	
	
	/**
	 * Возвращает суммарные права на все модули для Acl
	 * @return 
	 */
	public function GetAllModulesRight(){
		$aRights = array();
		foreach ($this->_modules as $k=>$v){
			$aRights = array_merge_recursive($aRights, $this->GetRights($k));
		}
		return $aRights;
	}
	
	public function SetContext(){
		Context::SetModules($this->GetModules());
	}	
}
