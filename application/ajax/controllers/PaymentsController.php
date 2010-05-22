<?php
/**
 * Платежи
 */

class Ajax_PaymentsController extends Zend_Controller_Action 
{
 
 	public function indexAction()
	{
	}
	
	/**
	 * Создает новый платеж
   	 * право: add
	 */
	public function addAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->Add($this->_getAllParams());
		$this->_helper->json($result);
	}

	/**
   	 * право: edit
	 * @return 
	 */
	public function editAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->Edit($this->_getAllParams());
		$this->_helper->json($result);
	}

	/**
   	 * право: delete
	 * @return 
	 */
	public function deleteAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->delete($this->_getParam('id'));
		$this->_helper->json($result);
	}

	/**
	 * Проводит платеж
   	 * право: submit
	 */
	public function applyAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->Apply($this->_getParam('id'));
		$this->_helper->json($result);
	}

	/**
	 * Данные для построения списка платежей
   	 * право: view
	 */
	public function gridAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->GetList($this->_getParam('start'), $this->_getParam('limit'),  
								   $this->_getParam('sort'),  $this->_getParam('dir'),  
								   $this->_getParam('query'), $this->_getParam('status'));
		$this->_helper->json($result);
	}

	/**
	 * Данные для построения списка платежей по дням
   	 * право: view
	 */
	public function dategridAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->GetListByDay($this->_getParam('start'), $this->_getParam('limit'),  
								   $this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	}

	/**
	 * Данные для построения списка платежей по месяцам
   	 * право: view
	 */
	public function monthgridAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->GetListByMonth($this->_getParam('start'), $this->_getParam('limit'),  
								   $this->_getParam('sort'),  $this->_getParam('dir'));
		$this->_helper->json($result);
	}

	public function genAction()
	{
		$oPayments = new Payments();
		$result = $oPayments->GenCard($this->_getParam('nominal'),$this->_getParam('col'));
		$this->_helper->json($result);
	}
	public function payAction(){
		$oUsers = new Users();
		$result = $oUsers->Pay($this->_getAllParams());
		$this->_helper->json($result);
	}
	public function paymonthlyAction(){
		$oUsers = new Users();
		$result = $oUsers->PayMonthly($this->_getAllParams());
		$this->_helper->json($result);
	}
	
	public function paydailyAction(){
		$oUsers = new Users();
		$result = $oUsers->PayDaily($this->_getAllParams());
		$this->_helper->json($result);
	}

	public function settingsAction()
	{
		$oPayments = new Payments();
        $post = $this->_getParam('data');
        switch ($this->_getParam('xaction')){
            case 'destroy':
        		$result = $oPayments->DestroySettings($post);
            break;
            case 'update':
        		$result = $oPayments->UpdateSettings($post);
            break;
            case 'read':
        		$result = $oPayments->ReadSettings();
            break;    
            case 'create':
        		$result = $oPayments->CreateSettings($post);
            break;    
        }
		$this->_helper->json($result);
	}
    
    public function getuserAction(){
		$oAdmins = new Admins();
		$result = $oAdmins->GetList();
		$this->_helper->json($result);
    }

    public function getgroupAction(){
		$oPayments = new Payments();
		$result = $oPayments->GetGroups();
		$this->_helper->json($result);
    }
}

