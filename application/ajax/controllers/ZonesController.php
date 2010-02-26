<?php
/**
 * Класс для работы с зонами.
 */
class Ajax_ZonesController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}
	
 	/**
 	 * Формирует ответ для построения списка зон
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oZones = new Zones();
		$result = $oZones->GetList($this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	 }

	 /**
	  * Добавляет новую зону
   	  * право: add
	  */ 
	  public function addAction()
	  {
		$oZones = new Zones();
		$result = $oZones->Add($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Изменяет зону
   	  * право: edit
	  */ 
	  public function editAction()
	  {
		$oZones = new Zones();
		$result = $oZones->Edit($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Удаляет зону
   	  * право: delete
	  */ 
	  public function deleteAction()
	  {
		$oZones = new Zones();
		$result = $oZones->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	  }

	 /**
	  * Запрещает зону
   	  * право: submit
	  */ 
	  public function denyAction()
	  {
		$oZones = new Zones();
		$result = $oZones->Deny($this->_getParam('id'));
		$this->_helper->json($result);
	  }

	 /**
	  * Разрешает зону
   	  * право: submit
	  */ 
	  public function allowAction()
	  {
		$oZones = new Zones();
		$result = $oZones->Allow($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}
?>