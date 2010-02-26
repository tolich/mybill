<?php

require_once(dirname(__FILE__).'/../../configs/localConfig.php');

class SvsIPServer
{
    function __construct ()
    {
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
		$DB=DB::Connect();
		$stmt=$DB->prepare('SELECT usergroup.*  FROM usergroup 
							JOIN usersettings ON usergroup.id=usersettings.id_user
							WHERE usergroup.username=? AND MD5(usersettings.user_password)=?');
		$stmt->execute(array($login, $password));
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if ($row!=false)
			$settings = array('err'=>0, 'ip'=>array($row['ip']), 'mask'=>array('255.255.0.0'), 'dns'=>array('172.16.0.1', '195.5.50.5'));
		else 
			$settings = array('err'=>1);
		return json_encode($settings);
    }
}
$server = new SoapServer("../svs.wsdl"); 
$server->setClass("SvsIPServer"); 
$server->handle(); 
?> 
