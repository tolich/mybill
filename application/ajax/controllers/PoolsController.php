<?php
/**
 * Класс для работы со шлюзами
 */
class Ajax_PoolsController extends Zend_Controller_Action 
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
	 	$oPools = new Pools();
		$result = $oPools->GetFilterList();
		$this->_helper->json($result);
	 }

 	/**
 	 * Возвращает список доступных шлюзов для комбобокса
   	 * право: view
 	 */ 	
	 public function listAction()
	 {
	 	$oPools = new Pools();
		$result = $oPools->GetSmallList();
		$this->_helper->json($result);
	 }
	 
 	/**
 	 * Формирует ответ для построения списка шлюзов
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oPools = new Pools();
		$result = $oPools->GetList($this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	 }

	 /**
	  * Добавляет ноый шлюз
   	  * право: add
	  */ 
	  public function addAction()
	  {
		$oPools = new Pools();
		$result = $oPools->Add($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Изменяет шлюз
   	  * право: edit
	  */ 
	  public function editAction()
	  {
		$oPools = new Pools();
		$result = $oPools->Edit($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Удаляет шлюз
   	  * право: delete
	  */ 
	  public function deleteAction()
	  {
		$oPools = new Pools();
		$result = $oPools->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}
?>
