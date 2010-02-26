<?php
/**
 * Класс для работы с тарифами
 */
class Ajax_TariffsController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}

 	/**
 	 * Возвращает список доступных тарифов для фильтра в меню
   	 * право: view
 	 */ 	
	 public function filterAction()
	 {
		$oTariffs = new Tariffs();
		$result = $oTariffs->GetFilterList();
		$this->_helper->json($result);
	 }

 	/**
 	 * Формирует ответ для построения списка тарифов
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oTariffs = new Tariffs();
		$result = $oTariffs->GetList($this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	 }
 	/**
 	 * Формирует ответ для построения списка 
   	 * право: view
 	 */ 	
	 public function intariffAction()
	 {
		$oTariffs = new Tariffs();
		$result = $oTariffs->GetIntariffList($this->_getParam('id'),$this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	 }
	
 	/**
 	 * Возвращает список доступных тарифов
   	 * право: view
 	 */ 	
	 public function listAction()
	 {
	 	$oTariffs = new Tariffs();
		$result = $oTariffs->GetSmallList();
		$this->_helper->json($result);
	 }
	 
	 /**
	  * Список тарифов для дерева
   	  * право: view
	  */
	 public function treeAction()
	 {
	 	$oTariffs = new Tariffs();
		$result = $oTariffs->GetTreeList();
		$this->_helper->json($result);
	 }

	 /**
	  * Добавляет новый тариф
   	  * право: add
	  */ 
	  public function addAction()
	  {
		$oTariffs = new Tariffs();
		$result = $oTariffs->Add($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Изменяет тариф
   	  * право: edit
	  */ 
	  public function editAction()
	  {
		$oTariffs = new Tariffs();
		$result = $oTariffs->Edit($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Удаляет тариф
   	  * право: delete
	  */ 
	  public function deleteAction()
	  {
		$oTariffs = new Tariffs();
		$result = $oTariffs->Delete($this->_getParam('id'));
		$this->_helper->json($result);
	  }
	 
	 /**
	  * Списки комбобоксов для окна тарифов 
   	  * право: view
	  */
	 public function wintariffAction(){
		$oTariffs = new Tariffs();
		$result = $oTariffs->WinTariff();
		$this->_helper->json($result);
	 }

	 /**
	  * Списки комбобоксов для окна зон тарифов 
   	  * право: view
	  */
	 public function winintariffAction(){
		$oTariffs = new Tariffs();
		$result = $oTariffs->WinInTariff();
		$this->_helper->json($result);
	 }

	 /**
	  *  Добавление зоны в тариф
   	  * право: edit
	  */
	 public function addzoneAction(){
		$oTariffs = new Tariffs();
		$result = $oTariffs->AddZone($this->_getAllParams());
		$this->_helper->json($result);
	 }

	 /**
	  *  Изменение зоны в тарифе
   	  * право: edit
	  */
	 public function editzoneAction(){
		$oTariffs = new Tariffs();
		$result = $oTariffs->EditZone($this->_getAllParams());
		$this->_helper->json($result);
	 }


	 /**
	  *  Удаление зоны из тариф
   	  * право: edit
	  */
	 public function deletezoneAction(){
		$oTariffs = new Tariffs();
		$result = $oTariffs->DeleteZone($this->_getParam('id'));
		$this->_helper->json($result);
	 }
	
	/**
   	 * право: submit
	 * @return 
	 */
	public function applyAction(){
		$oTariffs = new Tariffs();
		$result = $oTariffs->Apply($this->_getParam('id'), $this->_getParam('path'));
		$this->_helper->json($result);
	}

	 /**
	  * Запрещает зону
   	  * право: submit
	  */ 
	  public function denyAction()
	  {
		$oTariffs = new Tariffs();
		$result = $oTariffs->Deny($this->_getParam('id'));
		$this->_helper->json($result);
	  }

	 /**
	  * Разрешает зону
   	  * право: submit
	  */ 
	  public function allowAction()
	  {
		$oTariffs = new Tariffs();
		$result = $oTariffs->Allow($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}

