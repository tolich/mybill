<?php
/**
 * Новости в персональном разделе пользователя
 */
class InfoController extends Zend_Controller_Action
{
    public function indexAction()
    {   
        $title = Zend_Registry::get('info_title');
    	$this->view->assign('info_title',$title);
    }

    public function accountAction()
    {   
    	$Users = new Users();
    	$title=array('t_tariffname'=>'Тариф',
    				 't_deposit'=>'Депозит, '.Settings::Billing('currency'),
    				 't_freebyte'=>'Остаток пакетных Мб',
    				 't_bonus'=>'Остаток бонусных Мб',
    				 't_dateofcheck'=>'Отстрочка платежа, дн.',
    				 't_freemblimit'=>'Минимальный остаток Мб'
   				 );
    	$title = array_merge($title,$Users->GetAccountInfo());
    	$this->view->assign($title);
    }

    public function tariffAction()
    {   
    	$Users = new Users();
    	$title=array('t_tariffname'=>'Наименование',
    				 't_freebyte'=>'Количество пакетных Мб',
    				 't_freemblimit'=>'Минимальный остаток Мб',
    				 't_mindeposit'=>'Минимальный депозит',
    				 't_bonus'=>'Количество бонусных Мб',
    				 't_dateofcheck'=>'Отстрочка платежа, дн.',
    				 't_monthlyfee'=>'Абонплата за месяц',
    				 't_dailyfee'=>'Абонплата за день',
    				 'intariff'=>'Подробная информация по зонам',
   				 );
    	$title = array_merge($title,$Users->GetTariffInfo());
    	$this->view->assign($title);
    }

    public function personalAction()
    {   
    	$Users = new Users();
    	$title=array('t_surname'=>'Фамилия',
    				 't_name'=>'Имя',
    				 't_address'=>'Адрес',
//    				 't_in_pipe'=>Utils::encode('Вх. скорость, кбит/с'),
//    				 't_out_pipe'=>Utils::encode('Исх. скорость, кбит/с'),
    				 't_in_ip'=>'IP адрес',
    				 't_email'=>'email',
    				 'notify'=>'Если Вы заметили неточность в этом разделе сообщите в абон.отдел '. Settings::Company('name').' по тел. '. Settings::Company('tel')
    				 );
    	$title = array_merge($title,$Users->GetAccountInfo());
    	$this->view->assign($title);
    }

    public function messageAction()
    {   
    	$title=array('nomessage'=>'Новых сообщений нет');
    	$this->view->assign($title);
    }

    public function wellcomeAction(){
    	$Users = new Users();
    	$statusMsg = "В данный момент доступ в Интернет %s.";
    	$statusDescr = "";
    	$status = $Users->GetUserStatus();
    	switch ($status['status']){
    		case 0:
    			$statusMsg = sprintf($statusMsg, 'отключен');
    			$statusDescr = "Возможно, Вы забыли заплатить абонплату за текущий месяц.";
    			break;
    		case 1:
    			$statusMsg = sprintf($statusMsg, 'включен');
    			$statusDescr = "Если Вам не удается подключится к Интернету сообщите код ошибки в абон.отдел ". Settings::Company('name');
    			break;
    		case 3:
    			$statusMsg = sprintf($statusMsg, 'временно отключен');
    			$statusDescr = "Возможно, на Вашем счету недостаточно средств для продолжения работы в этом месяце.";
    			break;
    	}
		$this->view->assign('check_mac',Context::GetUserData('check_calling'));
    	$checkMsg = "У Вас включена дополнительная проверка сетевого идентификатора.";
    	$checkDescr = "Если у Вас новый компьютер или сетевая карта, и при подключении к интернету возникает ошибка при проверке пароля - обратитесь за помощью по тел. ".Settings::Company('tel');
    	$infoMsg = "Новый акционный тариф БЕЗЛИМИТНЫЙ 10+!";
    	$infoDescr = "Настоящий безлимитный со скоростью до 20 Мбит/сек! ВНИМАНИЕ! Срок дествия тарифа ограничен! Информация по тел. ".Settings::Company('tel');
    	$title=array('wellcome'=>sprintf("%s, %s", Context::GetUserData('username'), 'добро пожаловать на персональную страницу!'),
    				 'statusmsg'=>$statusMsg,
    				 'statusdescr'=>$statusDescr,
    				 'checkmsg'=>$checkMsg,
    				 'checkdescr'=>$checkDescr,
    				 'infomsg'=>$infoMsg,
    				 'infodescr'=>$infoDescr,
		);
    	$title = array_merge($title,$status);
    	$this->view->assign($title);
    }
    
	public function orderAction(){
		$oUser = new Users();
	   	$aTitle=$oUser->getUserInfo(array('id'=>$this->_getParam('id')));
        Utils::encode($aTitle);
    	$aTitle = array_merge($aTitle,
			array(
				'mask'=>Settings::Billing('mask'),
				'DNS'=>Settings::Billing('DNS'),
				'URL'=>Settings::Billing('URL'),
				'tel'=>Settings::Company('tel'),
			)
		);
    	$this->view->assign($aTitle);
	}

	public function modulesAction(){
		$moduleRenderCmd = "var m=App.getModule('%s');if(m)m.render();";
		$aModules =  Context::GetModules();
		foreach ($aModules as $module=>$v)
			$this->view->inlineScript()->appendScript(sprintf($moduleRenderCmd,$module));

	}
}