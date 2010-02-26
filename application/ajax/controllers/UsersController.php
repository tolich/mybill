<?php
/**
 * Класс для работы с пользователями.
 */
class Ajax_UsersController extends Zend_Controller_Action 
{

 	public function indexAction()
	{
	}
	
 	/**
 	 * Формирует ответ для построения списка пользователей
   	 * право: view
 	 */ 	
	 public function gridAction()
	 {
		$oUsers = new Users();
        switch ($this->_getParam('xaction')){
            case 'update':
        		$result = $oUsers->QuickEdit($this->_getParam('data'));
            break;
            case 'read':
            default:
        		$result = $oUsers->GetList($this->_getParam('start'), $this->_getParam('limit'),  
        								   $this->_getParam('sort'),  $this->_getParam('dir'),  
        								   $this->_getParam('query'), $this->_getParam('access'),
        								   $this->_getParam('filter'));
        }
		$this->_helper->json($result);
	 }
	 
	 /**
	  * Добавляет нового пользователя
   	  * право: add
	  */ 
	  public function addAction()
	  {
		$oUsers = new Users();
		$result = $oUsers->Add($this->_getAllParams());
		$this->_helper->json($result);
	  }

	 /**
	  * Изменяет данные пользователя
   	  * право: edit
	  */ 
	  public function editAction()
	  {
		$oUsers = new Users();
		$result = $oUsers->Edit($this->_getAllParams());
		$this->_helper->json($result);
	  }

//	  public function changetariffAction()
//	  {
//		$oUsers = new Users();
//		$result = $oUsers->ChangeTariff($this->_getAllParams());
//		echo Zend_Json::encode($result);
//	  }
	   
	/**
	 * Возвращает данные пользователя для изменения
   	 * право: view
	 */
	public function getbyidAction()
	{
		if ($this->_getParam('id'))
		{
			$oUsers = new Users();
			$result['user'] = $oUsers->GetById($this->_getParam('id'));
		}
	 	$oSluices = new Sluices();
		$result['sluice'] = $oSluices->GetSmallList();
	 	$oTariffs = new Tariffs();
		$result['tariff'] = $oTariffs->GetSmallList();
	 	$oPools = new Pools();
		$result['pool'] = $oPools->GetSmallList();
		$this->_helper->json($result);
	} 
	/**
	 * Смена тарифа
   	 * право: submit
	 */
	public function chtariffAction()
	{
		$oUsers = new Users();
		$result = $oUsers->ChangeTariff($this->_getAllParams());
		$this->_helper->json($result);
	}
	/**
	 * Включает доступ в интернет
   	 * право: submit
	 */
	public function onAction()
	{
		$oUsers = new Users();
		$result = $oUsers->On($this->_getParam('id'));
		$this->_helper->json($result);
	}

	/**
	 * Отключает доступ в интернет
   	 * право: submit
	 */
	public function offAction()
	{
		$oUsers = new Users();
		$result = $oUsers->Off($this->_getParam('id'));
		$this->_helper->json($result);
	}

	/**
	 * Включает контроль за остатком Мб
   	 * право: edit
	 */
	public function checkmbonAction()
	{
		$oUsers = new Users();
		$result = $oUsers->CheckMbOn($this->_getParam('id'));
		$this->_helper->json($result);
	}

	/**
	 * Отключает контроль за остатком Мб
   	 * право: edit
	 */
	public function checkmboffAction()
	{
		$oUsers = new Users();
		$result = $oUsers->CheckMbOff($this->_getParam('id'));
		$this->_helper->json($result);
	}

	/**
	 * Включает перенаправление на страницу приветствия
   	 * право: edit
	 */
	public function newuseronAction()
	{
		$oUsers = new Users();
		$result = $oUsers->NewUserOn($this->_getParam('id'));
		$this->_helper->json($result);
	}

	/**
	 * Отлючает перенаправление на страницу приветствия	 
   	 * право: edit
	 */
	public function newuseroffAction()
	{
		$oUsers = new Users();
		$result = $oUsers->NewUserOff($this->_getParam('id'));
		$this->_helper->json($result);
	}


 	/**
 	 * Возвращает список пользователей
   	 * право: view
 	 */ 	
	 public function listAction()
	 {
		$oUsers = new Users();
		$result = $oUsers->GetSmallList($this->_getParam('start'), $this->_getParam('limit'),  
									   $this->_getParam('query'));
		$this->_helper->json($result);
	 }
	 
	 /**
	  * Снимает абонплату за месяц
   	  * право: submit
	  */ 
	  public function monthlyAction()
	  {
		$oUsers = new Users();
		$result = $oUsers->MonthlyFee($this->_getParam('id'));
		$this->_helper->json($result);
	  }

	 /**
	  * Снимает абонплату за день
   	  * право: submit
	  */ 
	  public function dailyAction()
	  {
		$oUsers = new Users();
		$result = $oUsers->DailyFee($this->_getParam('id'));
		$this->_helper->json($result);
	  }

	 /**
	  * Списывает задолженность
   	  * право: submit
	  */ 
	  public function debtsoffAction()
	  {
		$oUsers = new Users();
		$result = $oUsers->DebtsOff($this->_getParam('id'));
		$this->_helper->json($result);
	  }
}
?>
