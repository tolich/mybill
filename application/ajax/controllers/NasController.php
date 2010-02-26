<?php
/**
 * Класс для работы с NAS
 */
class Ajax_NasController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}
	

	 
 	/**
 	 * Формирует ответ для построения списка
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
	 	$oNas = new Nas();
		$result = $oNas->GetList($this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	 }

	 /**
	  * Добавляет ноый
   	  * право: add
	  */ 
	  public function addAction()
	  {
	 	$oNas = new Nas();
		$result = $oNas->Add($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Изменяет 
   	  * право: edit
	  */ 
	  public function editAction()
	  {
	 	$oNas = new Nas();
		$result = $oNas->Edit($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Удаляет 
   	  * право: delete
	  */ 
	  public function deleteAction()
	  {
	 	$oNas = new Nas();
		$result = $oNas->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}
?>