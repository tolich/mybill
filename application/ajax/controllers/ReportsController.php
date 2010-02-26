<?php
class Ajax_ReportsController extends Zend_Controller_Action 
{

    public function statAction()
	{
		$oReports = new Reports();
		$result = $oReports->GetStatList($this->_getParam('start'), $this->_getParam('limit'),
								   $this->_getParam('sort'),  $this->_getParam('dir'), 
								   $this->_getParam('username'));
		$this->_helper->json($result);
	}

    public function paymentsAction()
	{
		$oReports = new Reports();
		$result = $oReports->GetPayList($this->_getParam('start'), $this->_getParam('limit'),
								   $this->_getParam('sort'),  $this->_getParam('dir'), 
								   $this->_getParam('userid'));
		$this->_helper->json($result);
	}

    public function tariffAction()
	{
		$oReports = new Reports();
		$result = $oReports->GetTariffList($this->_getParam('start'), $this->_getParam('limit'),
								   $this->_getParam('sort'),  $this->_getParam('dir'), 
								   $this->_getParam('username'));
		$this->_helper->json($result);
	}

    public function intariffAction()
	{
		$oUsers = new Users();
		$result = $oUsers->GetInTariffInfo();
		$this->_helper->json($result);
	}
}
?>