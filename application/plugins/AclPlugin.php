<?php
/**
 * Класс реализует плагин прав доступа пользователя
 */

class AclPlugin extends Zend_Controller_Plugin_Abstract
{
	protected $acl;

	public function __construct()
	{
		$this->acl=Zend_Registry::get('acl');
	}
	
	/**
	 * @param Zend_Controller_Request_Abstract|null $request
	 */
	public function routeShutdown(Zend_Controller_Request_Abstract $request)
	{
    	if($request->getModuleName()=='ajax'){
			if ($request->isXmlHttpRequest()){
				$oManager = new Manager();
				$aModules = $oManager->GetModules();
				//Utils::debug($aModules);
	    		if ($request->getControllerName()=='modules'&&array_key_exists($request->getActionName(),$aModules)){
		    		$isAllowed = $this->acl->isAllowed(Context::GetRole(),$request->getActionName(),$request->getParam('act'));
					//Utils::debug("modules:::".$request->getActionName()."->".$request->getParam('act')." для ".Context::GetRole().($isAllowed?" разрешен" : " запрещен"));
					if (!$isAllowed){
						$request->setControllerName('error');
						$request->setActionName('denied');
					}
	    		} else {
		    		$isAllowed = $this->acl->isAllowed(Context::GetRole(),$request->getControllerName(),$request->getActionName());
					//Utils::debug($request->getControllerName()."->".$request->getActionName()." для ".Context::GetRole().($isAllowed?" разрешен" : " запрещен"));
					if (!$isAllowed){
						$request->setControllerName('error');
						$request->setActionName('denied');
					}
				}
			} else {
				$request->setModuleName('default');
				$request->setControllerName('index');
				$request->setActionName('index');
			}
		}
	}
}

?>