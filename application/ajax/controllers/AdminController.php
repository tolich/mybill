<?php
/**
 * Класс для работы с администраторами
 */
class Ajax_AdminController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}
	
 	/**
 	 * Возвращает список доступных для фильтра в меню
 	 * право: view
	 */ 	
	 public function filterAction()
	 {
	 	$oAdmins = new Admins();
		$result = $oAdmins->GetFilterList();
		$this->_helper->json($result);
	 }

 	/**
 	 * Возвращает список доступных для комбобокса
 	 * право: view
 	 */ 	
	 public function roleAction()
	 {
	 	$oAdmins = new Admins();
		$result = $oAdmins->GetRoleList();
		$this->_helper->json($result);
	 }
	 
 	/**
 	 * Формирует ответ для построения списка
 	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oAdmins = new Admins();
		$result = $oAdmins->GetList($this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	 }

	 /**
	  * Добавляет ноый
 	  * право: add
	  */ 
	  public function addAction()
	  {
		$oAdmins = new Admins();
		$result = $oAdmins->Add($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Изменяет
   	  * право: edit
	  */ 
	  public function editAction()
	  {
		$oAdmins = new Admins();
		$result = $oAdmins->Edit($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Удаляет
 	  * право: delete
	  */ 
	  public function deleteAction()
	  {
		$oAdmins = new Admins();
		$result = $oAdmins->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}
?>
