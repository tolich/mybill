<?php
class AuthPlugin extends Zend_Controller_Plugin_Abstract
{
	/**
	 * @param Zend_Controller_Request_Abstract|null $request
	 */
    public function routeStartup(Zend_Controller_Request_Abstract $request)
	{
	    if (Context::IsAuthorize()){
	        switch (Context::GetScript()){
	            case 'user':
        	        $module = 'Users';
                break;
	            case 'admin':
        	        $module = 'Admins';
                break;
	        }
            $claim = new $module;
			$aInfo=$claim->GetUserInfo(array('username'=>Context::GetUserData('username')));
			if ($aInfo!==false)
			{
				Context::SetUserData($aInfo);
            }
	    }
    }
}