#!/usr/local/bin/php
<?php
    
/**
 *  Файл для сбора статистики по snmp для модуля Bandwidth
 */

require_once realpath(dirname(__FILE__).'/../configs/config.php');
$db = Db::factory('log');
$sql = $db->select()
          ->from('bandwidth_settings');
$aSettings = $db->fetchAll($sql);
foreach ($aSettings as $aSetting){
    $iface = $aSetting['iface'];
    $time = time();
    $inOctets = snmpget($aSetting['ip'], $aSetting['secret'], $aSetting['inmib']);
    $aInOctets = split(' ',$inOctets);
    $outOctets = snmpget($aSetting['ip'], $aSetting['secret'], $aSetting['outmib']);
    $aOutOctets = split(' ',$outOctets);
    $aData = array(
        'datecreate'   => $time,
        'inoctets'     => $aInOctets[1],
        'outoctets'    => $aOutOctets[1],
        'iface'        => $iface
    );
    $db->insert('bandwidth_rate',$aData);
}