#!/usr/local/bin/php
<?php
    
/**
 *  SMS
 */

require_once realpath(dirname(__FILE__).'/../configs/config.php');
$db = Db::factory('sms');

//$aData = array(
//    'sign'       => 'SVS.Stream',
//    'number'     => '+380668341399',
//    'message'    => 'ra_derkach rh9zgen4vm',
//    'wappush'    => '',
//    'send_time'  => date('Y-m-d H:i')
//);
//$db->insert('tolich',$aData);
//AppLog::debug($db->lastInsertId());
$sql = $db->select()
          ->from('tolich');
$aAll = $db->fetchAll($sql);
AppLog::debug($aAll);
