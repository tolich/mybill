<?php
/**
 * Класс для работы со шлюзами
 */
class Ajax_SessionsController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}
	
// 	/**
// 	 * Возвращает список доступных шлюзов для фильтра в меню
// 	 */ 	
//	 public function filterAction()
//	 {
//	 	$oSessions = new Sessions();
//		$result = $oSessions->GetFilterList();
//		$this->_helper->json($result);
//	 }
//
// 	/**
// 	 * Возвращает список доступных шлюзов для комбобокса
// 	 */ 	
//	 public function listAction()
//	 {
//	 	$oSessions = new Sessions();
//		$result = $oSessions->GetSmallList();
//		$this->_helper->json($result);
//	 }
	 
 	/**
 	 * Формирует ответ для построения списка
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oSessions = new Sessions();
		$result = $oSessions->GetList($this->_getParam('start'), $this->_getParam('limit'),  
								   $this->_getParam('sort'),  $this->_getParam('dir'),  
								   $this->_getParam('filter'));
		$this->_helper->json($result);
	 }

//	 /**
//	  * Добавляет ноый шлюз
//	  */ 
//	  public function addAction()
//	  {
//		$oSessions = new Sessions();
//		$result = $oSessions->Add($this->_getAllParams());
//		$this->_helper->json($result);
//	  }
//
//	 /**
//	  * Изменяет шлюз
//	  */ 
//	  public function editAction()
//	  {
//		$oSessions = new Sessions();
//		$result = $oSessions->Edit($this->_getAllParams());
//		$this->_helper->json($result);
//	  }

	 /**
	  * Закрывает сессию
   	  * право: delete
	  */ 
	  public function closeAction()
	  {
		$oSessions = new Sessions();
		$result = $oSessions->Close($this->_getParam('id'));
		$this->_helper->json($result);
	  }

	 /**
	  * Удаляет
   	  * право: delete
	  */ 
	  public function deleteAction()
	  {
		$oSessions = new Sessions();
		$result = $oSessions->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}
?>
