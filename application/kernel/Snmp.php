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
        $localtime = localtime(time(),true);
        $inOctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.10.4");
        $aInOctets = split(' ',$inOctets);
        $outOctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.16.4");
        $aOutOctets = split(' ',$outOctets);
        $aData = array(
            'datecreate'   => $localtime['tm_sec'],
            'inoctets'     => $aInOctets[1],
            'outoctets'    => $aOutOctets[1],
            'iface'        => 3
        );
        $this->Db->insert('rate',$aData);
    }
}
