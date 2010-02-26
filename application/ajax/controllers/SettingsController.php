<?php
/**
 * Класс для работы с настройками
 */
class Ajax_SettingsController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}
	
 	/**
 	 * Свойства биллинга
   	 * право: view
 	 */ 	
	 public function getAction()
	 {
		$result = array();
		$oSettings = new Settings();
		$result = $oSettings->GetProperties($this->_getParam('type'));
		$this->_helper->json($result);
	 }

	 /**
	  * Сохранить свойства
  	  * право: edit
	  */
	 public function setcompanyAction()
	 {
		$result = array();
		$oSettings = new Settings();
		$result = $oSettings->SetProperties($this->_getParam('prop'));
		$this->_helper->json($result);
	 }
	 /**
	  * Сохранить свойства
  	  * право: view
	  */
	 public function setmainAction()
	 {
		$result = array();
		$oSettings = new Settings();
		$result = $oSettings->SetMainProperties($this->_getParam('prop'));
		$this->_helper->json($result);
	 }
	 /**
	  * Сохранить свойства
  	  * право: submit
	  */
	 public function setbillingAction()
	 {
		$result = array();
		$oSettings = new Settings();
		$result = $oSettings->SetProperties($this->_getParam('prop'));
		$this->_helper->json($result);
	 }
	 
}