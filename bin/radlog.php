#!/usr/local/bin/php
<?php
	require_once realpath(dirname(__FILE__).'/../configs/config.php');
    $db = Db::factory();
	Zend_Registry::set('db', $db);

$row = "Fri Oct  1 20:05:59 2010 : Auth: Login OK: [mp_naumochkin] (from client nas1 port 50 cli 00e04ce903ea / 00:e0:4c:e9:03:ea / em2)";
$row = "Fri Oct  1 20:26:43 2010 : Auth: Invalid user: [rudenko/<no User-Password attribute>] (from client nas1 port 25 cli 172.16.2.182 /  / )";
$match = array();
if (preg_match("/(\w+\s\w+\s{1,2}\d{1,2}\s[\d:]+\s\d{4})[\s:]*(\w+):\s([\w\s]+):\s\[([\w\s]+)\/?\<?([\w\s-]*)\>?\]\s\((.+)\)/s", $row,$match)){
    print_r($match);
    $rpl = new Dklab_Realplexor(
        "192.168.168.3", // host at which Realplexor listens for incoming data
        "10010"     // incoming port (see IN_ADDR in dklab_realplexor.conf)
        //"radlog"     // namespace to use (optional)
    );    
    $rpl->send(array("admin", "user"), $match[0]);    
}