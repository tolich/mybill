<?php
/**
 * Класс для работы со шлюзами
 */
class Ajax_SluicesController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}
	
 	/**
 	 * Возвращает список доступных шлюзов для фильтра в меню
   	 * право: view
 	 */ 	
	 public function filterAction()
	 {
	 	$oSluices = new Sluices();
		$result = $oSluices->GetFilterList();
		$this->_helper->json($result);
	 }

 	/**
 	 * Возвращает список доступных шлюзов для комбобокса
   	 * право: view
 	 */ 	
	 public function listAction()
	 {
	 	$oSluices = new Sluices();
		$result = $oSluices->GetSmallList();
		$this->_helper->json($result);
	 }
	 
 	/**
 	 * Формирует ответ для построения списка шлюзов
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oSluices = new Sluices();
		$result = $oSluices->GetList($this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	 }

	 /**
	  * Добавляет ноый шлюз
   	  * право: add
	  */ 
	  public function addAction()
	  {
		$oSluices = new Sluices();
		$result = $oSluices->Add($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Изменяет шлюз
   	  * право: edit
	  */ 
	  public function editAction()
	  {
		$oSluices = new Sluices();
		$result = $oSluices->Edit($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Удаляет шлюз
   	  * право: delete
	  */ 
	  public function deleteAction()
	  {
		$oSluices = new Sluices();
		$result = $oSluices->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}
?>
