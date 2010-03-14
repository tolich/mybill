<?php
class Authorize
{
	private $claim=null;
	
	public function __construct($claim=null){
		if (null!==$claim){
			$class = ucfirst($claim);
			$this->claim = new $class;
		}
	}

	public function Unlock($strName,$strPassword)
	{
		$aResult = false;
		if (null!==$this->claim){
		    if ($strName == Context::GetUserData('username')){
    			$aInfo=$this->claim->GetUserInfo(array('username'=>$strName,'wwwpassword'=>$strPassword));
    			if ($aInfo!==false)
    			{
    				$aResult = array('success'=>true, 'username'=>$strName);
                    AppLog::info('Разблокировка');
    			}
    			else
    			{
                    AppLog::warn('Неудачная разблокировка',$strName);
    				$aResult = array('success'=>false,'errors'=>array(array('id'=>'username', 'msg'=>'Пользователь не найден...'),
    												 array('id'=>'password', 'msg'=>'или неверный пароль')));
    			}
            }
		}
		return $aResult;
	}
    
	/**
	 * Проверяет логин/пароль пользователя и его статус.
	 * @param string $strName
	 * @param string $strPassword
	 * @param bool $isAdmin=false
	 * @return true|false 
	 */
	public function Login($strName,$strPassword)
	{
		$aResult = array('success'=>false);
		if (null!==$this->claim){
	
			if($strName=='')
			{
				$aResult = array('success'=>false,'errors'=>array(array('id'=>'username', 'msg'=>'Обязательное поле')));
			}
			else
			{
				$aInfo=$this->claim->GetUserInfo(array('username'=>$strName,'wwwpassword'=>$strPassword));
				if ($aInfo!==false)
				{
					Context::SetScript($this->claim->getScript());
					Context::SetUserData($aInfo);
					Context::SetRole($aInfo['role']);
					Context::SetAuthorize(true);
					$oSettings = new Settings();
					Context::SetSettings($oSettings->GetParams());
					$oManager = new Manager();
					Context::SetModules($oManager->GetModules());
					$aResult = array('success'=>true, 'username'=>$strName);
					if (method_exists($this->claim,'setTimeLogin')) $this->claim->setTimeLogin();
                    AppLog::info('Авторизация');
				}
				else
				{
                    AppLog::warn('Неудачная авторизация',$strName);
					$aResult = array('success'=>false,'errors'=>array(array('id'=>'username', 'msg'=>'Пользователь не найден...'),
													 array('id'=>'password', 'msg'=>'или неверный пароль')));
				}
			}
		}
		return $aResult;
	}

	public function UnLogin()
	{
		Context::SetScript(false);
		Context::SetUserData(array());
		Context::SetRole('guest');
		Context::SetAuthorize(false);
		Context::SetAcl(array(
		 	'role'		=> false,
		 	'resource'	=> false,
		 	'right'		=> false,
		 	'action'	=> false
		));
		$aResult = array('success'=>true);
		return $aResult;
	}
}
?>