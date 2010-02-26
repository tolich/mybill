<?php

class Ajax_TasksController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}

	 /**
	  * Список тарифов для дерева
   	  * право: view
	  */
	 public function treeAction()
	 {
	 	$oTasks = new Tasks();
		$result = $oTasks->GetTreeList();
		$this->_helper->json($result);
	 }

 	/**
 	 * Формирует ответ для построения списка новых задач
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oTasks = new Tasks();
		$result = $oTasks->GetList( $this->_getParam('sort'),  $this->_getParam('dir'),
									$this->_getParam('from'),  $this->_getParam('tail'), 
									$this->_getParam('query'), $this->_getParam('attrname'));
		$this->_helper->json($result);
	 }

 	/**
 	 * Формирует ответ для построения списка выполненных задач
   	 * право: view
 	 */ 	
	 public function oldgridAction()
	 {
		$oTasks = new Tasks();
		$result = $oTasks->GetOldList(  $this->_getParam('start'), $this->_getParam('limit'),
										$this->_getParam('sort'),  $this->_getParam('dir'),
										$this->_getParam('query'));
		$this->_helper->json($result);
	 }

	 /**
	  * Списки комбобоксов для окна задач
   	  * право: view
	  */
	 public function wintaskAction(){
		$oTasks = new Tasks();
		$result = $oTasks->WinTask($this->_getParam('attr'));
		$this->_helper->json($result);
	 }

	 /**
	  * Добавляет задачу
   	  * право: add
	  */
	 public function addAction()
	 {
		$oTasks = new Tasks();
		$result = $oTasks->Add($this->_getAllParams());
		$this->_helper->json($result);
	 } 
	 
	 /**
	  * Изменяет задачу
   	  * право: edit
	  */
	 public function editAction()
	 {
		$oTasks = new Tasks();
		$result = $oTasks->Edit($this->_getAllParams());
		$this->_helper->json($result);
	 } 


	 /**
	  * Удаляет задачу
   	  * право: delete
	  */
	 public function deleteAction()
	 {
		$oTasks = new Tasks();
		$result = $oTasks->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	 } 

}