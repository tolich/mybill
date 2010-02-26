<?php
/**
 * Контролллер проверки данных пользователя для логирования в системе
 * Шаблон: Отсутствует
 */

class Ajax_AuthController extends Zend_Controller_Action
{                                                                                                                                   
   
	/**
	 * Получает имя пользователя и пароль от диалога авторизации в систему и возвращает ему
	 * параметры пользователя или ошибку. 
	 * право: submit
	 */
    public function indexAction()                                                                                                   
    {  
		$oAuth = new Authorize('users');
		$result = $oAuth->Login($this->_getParam('username'), $this->_getParam('password'));
		$this->_helper->json($result);
    }                                                                                                                               
	
	/**
	 * право: view
	 * @return 
	 */
    public function adminAction()                                                                                                   
    {  
		$oAuth = new Authorize('admins');
		$result = $oAuth->Login($this->_getParam('username'), $this->_getParam('password'));
		$this->_helper->json($result);
    }                                                                                                                               
	
	/**
	 * право: submit
	 * @return 
	 */
	
    public function unloginAction()                                                                                                   
    {  
		$oAuth = new Authorize();
		$result = $oAuth->UnLogin();
		$this->_helper->json($result);
    }
	
	/**
	 * Сохраняет персольные настройки администратора
	 * право: view
	 */                                              
	 public function setsettingsAction()
	 {
		$oUsers = new Users();
		$result = $oUsers->SetSettings($this->_getParam('settings'));
		$this->_helper->json($result);
	 }                                                                                  

	/**
	 * Удаляет персольные настройки администратора
	 * право: delete
	 */                                              
	 public function delsettingsAction()
	 {
		$oUsers = new Users();
		$result = $oUsers->DelSettings();
		$this->_helper->json($result);
	 }                                                                                  

	/**
	 * Возвращает персольные настройки администратора
	 * право: view
	 */                                              
	 public function getsettingsAction()
	 {
		$oUsers = new Users();
		$result = $oUsers->GetSettings();
		$this->_helper->json($result);
	 }                                                                                  
}
?>
