<?php
/**
 * ����� ��������� ������ ����������� � �������������� ������������
 */

class AuthPlugin extends Zend_Controller_Plugin_Abstract
{
	/**
     * Instance of Zend_Controller_Dispatcher_Interface
     * @var Zend_Controller_Dispatcher_Interface
     */
	protected $_dispatcher = null;
	
	/**
	 * ��� ����������� �� ������� ��������������
	 */
	protected $_fwController = 'login';	

	/**
	 * ��� ������� ����������� �� ������� ��������������
	 */
	protected $_fwAction = '';	
	
	/**
	 * ���������� ���� ������
	 */
	protected $Db = null;
	
	/**
	 * ����������� � ������� �������� ��������� ������
	 */
	protected $_allowController = array('login', 'checklogin', 'test');

	public function __construct()
	{
		$this->_dispatcher=Zend_Controller_Front::getInstance()->getDispatcher();
		$this->Db=Zend_Registry::get('db');
	}

    /**
     * Called before Zend_Controller_Front begins evaluating the
     * request against its routes.
     *
     * @param Zend_Controller_Request_Abstract $request
     * @return void
     */
    public function routeStartup(Zend_Controller_Request_Abstract $request)
    {
    	if (NContext::IsAuthorize()===true)
    	{
    		$m_NUserList = new NUserList();
    		$id_user = NContext::GetUserData('id');
			$host_ip = $_SERVER['REMOTE_ADDR'];
			$session = @$_COOKIE['key'];
			$sql = $this->Db->select()
    						->from	('user_act')
    						->where ('id_user = ?', $id_user)
    						->where ('hostip = ?', $host_ip)
    						->where ('session = ?', $session);
    		$aUserAct = $this->Db->fetchAll($sql);
			if ((count($aUserAct)==1))
    		{
    			if (($dtlogin = strtotime($aUserAct[0]['DTLOGIN'])) !== -1)
    			{
					if ((time()-$dtlogin) > IDLE_TIME)
    				{
						$m_NUserList->UnLogin();
    				}
    			}
    			$aWhere = array();
    			$aWhere[] = $this->Db->quoteInto('id_user = ?', $id_user);
    			$aWhere[] = $this->Db->quoteInto('hostip = ?', $host_ip);
    			$aWhere[] = $this->Db->quoteInto('session = ?', $session);
    			$this->Db->update('user_act', array('dtlogin'=>new Zend_Db_Expr('timestamp')), implode(' AND ', $aWhere));
    		}
    		else
    		{
				$m_NUserList->UnLogin();
    		}
    	}
    }

	
	/**
	 * @param Zend_Controller_Request_Abstract|null $request
	 */
	public function routeShutdown(Zend_Controller_Request_Abstract $request)
	{
// ��������� ������������� �� ������������
		if (NContext::IsAuthorize()===false)
		{
//���� ������� ��� � ���� �������������
			if (@$_COOKIE['remember'])
			{
				$m_NUserList = new NUserList();
				if (!$m_NUserList->Authorize($_COOKIE['memberType'], $_COOKIE['key']))
				{
					if (USER_GUEST_ID)
					{
						$m_NUserList = new NUserList();
						if (!$m_NUserList->Authorize(USER_GUEST_ID, USER_GUEST_ID))
						{
							$path = ($request->getModuleName()!='default' ? '/'.$request->getModuleName() : '').
									(strlen($this->_fwController) ? '/'.$this->_fwController : '').
									(strlen($this->_fwAction) ? '/'.$this->_fwAction : '');
							$this->getResponse()->setRedirect($path);
						}
					}
				}
			} 
			else 
			{
				if (!in_array(strtolower($request->getControllerName()), $this->_allowController))
				{
					$path = ($request->getModuleName()!='default' ? '/'.$request->getModuleName() : '').
							(strlen($this->_fwController) ? '/'.$this->_fwController : '').
							(strlen($this->_fwAction) ? '/'.$this->_fwAction : '');
					$this->getResponse()->setRedirect($path);
				}
			}
		} 
	}
}

?>