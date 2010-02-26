<?php
/**
 * Для обработки информации со страницы принудительного приветствия
 */
class RedirectController extends Zend_Controller_Action
{
	public function preDispatch()
    {
        $this->_helper->viewRenderer->setNoRender();
    }

    public function indexAction()
    {   
		$oUsers = new Users();
		$result = $oUsers->NewUserByIPOff($this->_getParam('ip'));
		if ($result)
			$this->_redirect('/redirect/redirect?url='.urlencode($this->_getParam('url')));
    }
	
	public function redirectAction(){
		$this->_redirect($this->_getParam('url'));
	}
}

