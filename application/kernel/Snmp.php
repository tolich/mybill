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
        $inoctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.10.3");
        $outoctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.16.3");
        $aData = array(
            'inoctets' => $inoctets,
            'outoctets'=> $outoctets,
            'iface'    => 3
        );
        $this->Db->insert('rate',$aData);
    }
}
