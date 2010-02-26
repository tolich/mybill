<?php
	require_once '../configs/config.php';
	
	class SettingServer
	{
		protected $Db=null;
		
	    function __construct ()
	    {
	    	global $aDBParams;
	    	$this->Db = Zend_Db::factory(DB_DRIVER, $aDBParams); //Zend_Registry::get('db');
	    }
	    
	    function __destruct()
	    {
	    }
	    
	    function __call ($method, $param)
	    {
		    throw new SoapFault("Server", "Method " . $method . "undefined!");
	    }
	    
	    function GetIP ($login, $password)
	    {
	    	$sql = $this->Db->select()
	    					->from('usergroup')
	    					->where('usergroup.username=?', $login)
	    					->where('MD5(usergroup.password)=?', $password);
	    	$row = $this->Db->fetchRow($sql);
			if ($row!=false)
				$settings = array('err'=>0, 'ip'=>array($row['in_ip']), 'mask'=>array('255.255.0.0'), 'dns'=>array('172.16.0.1'));
			else 
				$settings = array('err'=>1);

			return Zend_Json::encode($settings);
	    }
	}
	$server = new Zend_Soap_Server(WSDL_DIR."set.wsdl");
	$server->setClass("SettingServer");
	$server->setReturnResponse(true);
	$response = $server->handle();
	echo $response;
	//$server->handle();
?>