<?php
class Snmp 
{
	protected $Db=null;


	/**
     * Конструктор
     * @param Zend_Db_Adapter_Abstract $db Объект соединения с БД
	 */
	function __construct()
	{	
		$this->Db = Db::factory('log');
	}

    public function Walk(){
        $inOctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.10.3");
        $aInOctets = split(' ',$inOctets);
        $outOctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.16.3");
        $aOutOctets = split(' ',$outOctets);
        $aData = array(
            'inoctets' => $aInOctets[1],
            'outoctets'=> $aOutOctets[1],
            'iface'    => 3
        );
        AppLog::debug($aData);
        $this->Db->insert('rate',$aData);
    }
}
