#!/usr/local/bin/php
<?php
require_once realpath(dirname(__FILE__).'/../configs/config.php');
array_shift($argv);
if ($argv) {
    $aRlpConfig = Zend_Registry::get('rlp_params');
    $rpl = new Dklab_Realplexor(
        $aRlpConfig['host'],
        $aRlpConfig['port']
    ); 
    $aKey = array(
        'level',
        'username',
        'msg'
    );
    $aMsg = preg_split("/<:{2}>/", array_shift($argv));
    if (count($aMsg)!=count($aKey)){
        $aMsg = array_pad($aMsg, count($aKey), '');
    }
    $aMsg = array_combine($aKey, $aMsg); 
    $aMsg['logdate'] = date('d.m.Y H:i:s');
    $rpl->send($argv, $aMsg); 
}
