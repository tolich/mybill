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
        $iface = 4;
        $time = time();
        $inOctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.10.$iface");
        $aInOctets = split(' ',$inOctets);
        $outOctets = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.16.$iface");
        $aOutOctets = split(' ',$outOctets);
        $aData = array(
            'datecreate'   => $time,
            'inoctets'     => $aInOctets[1],
            'outoctets'    => $aOutOctets[1],
            'iface'        => $iface
        );
        $this->Db->insert('rate',$aData);
    }
}
