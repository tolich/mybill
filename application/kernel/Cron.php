<?php
class Cron {
	private $obj;
	protected $Db=null;
	public function __construct(){
		if (Context::IsAuthorize()===false){
			$oSettings = new Settings();
			Context::SetSettings($oSettings->GetAppParams());
		}
		AppLog::output("Starting cron script");
		$this->obj = array(
			'users'		=>new Users(),
			'tasks'		=>new Tasks(),
			'sessions'	=>new Sessions()
		);
		$this->Db = Zend_Registry::get('db');
	}
	
	public function __destruct(){
		AppLog::output("Cron script stopped.");
	}
	
	public function daily(){
		AppLog::output("\tdaily");
		$this->ChangeTariff();
		$this->Deactivate();
		$this->Activate();
		$this->DailyFee();
		$this->MonthlyFee();
		$this->ChangeAcctPeriod();
		$this->CloseCreditSessions();
	}
	
	public function sessions(){
		AppLog::output("\tsessions");
		$r = $this->obj['sessions']->CheckSessions();
		AppLog::output("\ttotal clean $r session(s)");
	}
	
	/**
	 * Смена тарифа
	 * @return 
	 */	
	private function ChangeTariff(){
		$aTasks=$this->obj['tasks']->GetTaskByAttr('Change-tariff');
		foreach ($aTasks as $task){
			$param = array (
			  'username'=>$task['username'],
			  'id_tariff' => $task['value'],
			  'in_pipe' => '0',
			  'out_pipe' => '0'
			);
			$this->obj['users']->ChangeTariff($param);
			$this->obj['tasks']->SetStatus($task['id'],'Successful');
			$this->obj['tasks']->Periodic($task['id_period']);
			AppLog::output("Change tariff for user(s) {$task['username']}");
		}
	}
	
	/**
	 * Абонплата за месяц
	 * @return 
	 */
	private function MonthlyFee(){
		$aTasks=$this->obj['tasks']->GetTaskByAttr('Monthly-fee');
		foreach ($aTasks as $task){
			$this->obj['users']->MonthlyFee($task['username'],false,$task['opdate']);
			$this->obj['tasks']->SetStatus($task['id'],'Successful');
			$this->obj['tasks']->Periodic($task['id']);
			AppLog::output("Monthly fee for user(s) {$task['username']}");
		}
	}

	/**
	 * Абонплата за день
	 * @return 
	 */
	private function DailyFee(){
		$aTasks=$this->obj['tasks']->GetTaskByAttr('Daily-fee');
		foreach ($aTasks as $task){
			$this->obj['users']->DailyFee($task['username'],false,$task['opdate']);
			$this->obj['tasks']->SetStatus($task['id'],'Successful');
			$this->obj['tasks']->Periodic($task['id']);
			AppLog::output("Daily fee for user(s) {$task['username']}");
		}
	}

	/**
	 * Активация пользователя
	 * @return 
	 */
	private function Activate(){
		$aTasks=$this->obj['tasks']->GetTaskByAttr('Activate');
		foreach ($aTasks as $task){
			$this->obj['users']->On($task['username']);
			$this->obj['tasks']->SetStatus($task['id'],'Successful');
			$this->obj['tasks']->Periodic($task['id']);
			AppLog::output("Activate user(s) {$task['username']}");
		}
	}

	/**
	 * Деактивация пользователя
	 * @return 
	 */
	private function Deactivate(){
		$aTasks=$this->obj['tasks']->GetTaskByAttr('Deactivate');
		foreach ($aTasks as $task){
			$this->obj['users']->Off($task['username']);
			$this->obj['tasks']->SetStatus($task['id'],'Successful');
			$this->obj['tasks']->Periodic($task['id']);
			AppLog::output("Deactivate user(s) {$task['username']}");
		}
	}

	/**
	 * EMail рассылка
	 * @return 
	 */
	private function Email(){
		Email::Send();		
	}
	
	/**
	 * Смена расчетного периода.
	 * Происходит Settings::Billing('date_fee') числа каждого месяца
	 */
	private function ChangeAcctPeriod(){

		if (date("d")==Settings::Billing('date_fee')){
			$this->Db->beginTransaction();
			try {
				AppLog::output("Change current acctperiod");
				$sql = $this->Db->select()
							->from('acctperiod',array('id','name'))
							->where('status=0');
				$aAcctPeriod = $this->Db->fetchRow($sql);			
				$idAcctperiod = $aAcctPeriod['id'];
				$nameAcctperiod = $aAcctPeriod['name'];
				$sql = $this->Db->select()
							->from('payments', array('iduser','payment_amount'=> new Zend_Db_Expr('SUM(amount)')))
							->join('usergroup','usergroup.id=payments.iduser')
							->where("id_acctperiod=$idAcctperiod")
							->where('usergroup.is_repl=1')
							->group('iduser');
				$aData = $this->Db->fetchPairs($sql);
				
				$sql = $this->Db->select()
							->from('accruals',array('id_user'))
							->where("id_acctperiod=$idAcctperiod");
				$aUserAccruals = $this->Db->fetchCol($sql);			

				foreach ($aData as $id=>$deposit){
					$aWhere=array();
					$aWhere[] = "id_acctperiod=$idAcctperiod";
					$aWhere[] = "id_user=$id";
					if (in_array($id,$aUserAccruals)){
						$this->Db->update('accruals', array('payment_amount'=>$deposit), $aWhere);
					} else {
						$this->Db->insert('accruals', array('id_user'=>$id,'id_acctperiod'=>$idAcctperiod,'payment_amount'=>$deposit,'description'=>$nameAcctperiod));
						$aUserAccruals[] = $id;
					};
				}
				$sql = $this->Db->select()
							->from('usergroup', array('id','deposit'))
							->where('is_repl=1');
				$aData = $this->Db->fetchPairs($sql);
				foreach ($aData as $id=>$deposit){
					$aWhere=array();
					$aWhere[] = "id_acctperiod=$idAcctperiod";
					$aWhere[] = "id_user=$id";
					if (in_array($id,$aUserAccruals)){
						$this->Db->update('accruals', array('end_deposit'=>$deposit), $aWhere);
					} else {
						$this->Db->insert('accruals', array('id_user'=>$id,'id_acctperiod'=>$idAcctperiod,'end_deposit'=>$deposit,'description'=>$nameAcctperiod));
						$aUserAccruals[] = $id;
					};
				}
				$this->Db->update('acctperiod', array('status'=>1,'datefinish'=>new Zend_Db_Expr('CURDATE()')), "id=$idAcctperiod");
				
				// Новый отчетный период
				$this->Db->insert('acctperiod', array('name'=>date("F Y"),'datestart'=>new Zend_Db_Expr('CURDATE()')));
				$idAcctperiod = $this->Db->lastInsertId();
				foreach ($aData as $id=>$deposit){
					$this->Db->insert('accruals', array('id_user'=>$id,'id_acctperiod'=>$idAcctperiod,'begin_deposit'=>$deposit,'description'=>date("F Y")));
				}
				$this->Db->commit();
			} catch (Exception $e){
				$this->Db->rollBack();
				AppLog::output($e->getMessage());
			}
		}
	}

	/**
	 * Сброс всех сессий должников
	 * @return 
	 */
	private function CloseCreditSessions(){
		AppLog::output("Finalizing debtor's sessions");
		$r = $this->obj['sessions']->CloseCredits();
		AppLog::output("\tsuccess close {$r['success']} session(s)");
		AppLog::output("\tfailed close {$r['failed']} session(s)");
	}
}
?>