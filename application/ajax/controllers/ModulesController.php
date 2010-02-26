<?php
/**
 * Контроллер модулей
 */
class Ajax_ModulesController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
		
	}

 	public function listAction()
	{
		$oManager = new Manager();
		$result = $oManager->GetAllModulesList();
		$this->_helper->json($result);
	}

 	public function allowAction()
	{
		$oManager = new Manager();
		$result = $oManager->GetAllowModules();
		$this->_helper->json($result);
	}
	
	public function installAction()
	{
		$aResult = array();
		$module = ucfirst((string)$this->_getParam('name'));
		if (class_exists($module)){
			$oModule = new $module();
			$result = $oModule->Install();
			if ($result===true){
				$aResult['success']=true;
			} else {
				$aResult=AppResponse::failure($result);
			}
		} else {
			$aResult=AppResponse::failure('Модуль поврежден или имеет неправильный формат!');
		}
		//array_walk($aResult, array('Utils', 'array_encode'));
 		$this->_helper->json($aResult);
	}

	public function deinstallAction()
	{
		$aResult = array();
		$module = ucfirst((string)$this->_getParam('name'));
		if (class_exists($module)){
			$oModule = new $module();
			$result = $oModule->DeInstall();
			if ($result===true){
				$aResult['success']=true;
			} else {
				$aResult=AppResponse::failure($result);
			}
		} else {
			$aResult=AppResponse::failure('Модуль поврежден или имеет неправильный формат!');
		}
		//array_walk($aResult, array('Utils', 'array_encode'));
 		$this->_helper->json($aResult);
	}
	
	public function __call($method, $args)
	{
        if ('Action' == substr($method, -6)) {
			$acl=Zend_Registry::get('acl');
        	$result = array('success'=>false);
			$module = ucfirst(substr($method,0,-6));
			$action = (string)$this->_getParam('act');
			if (class_exists($module)){
				$oModule = new $module();
				$oModule->setAllParams(array_diff_key(
					$this->_getAllParams(),
					array('module'=>'','controller'=>'','action'=>'')
				));
				$aResult = $oModule->$action();
			} else {
				$aResult=AppResponse::failure('Модуль поврежден или имеет неправильный формат!');
			}
			//if (is_array($aResult))	array_walk($aResult, array('Utils', 'array_encode'));
	 		$this->_helper->json($aResult);
        } else {
	        throw new Exception('Invalid method "'.$method.'" called',500);
		}
	}
}