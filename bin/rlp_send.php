#!/usr/local/bin/php
<?php
require_once realpath(dirname(__FILE__).'/../configs/config.php');
array_shift($argv);
if ($argv) {
    $rpl = new Dklab_Realplexor(
        "192.168.168.3", // host at which Realplexor listens for incoming data
        "10010"     // incoming port (see IN_ADDR in dklab_realplexor.conf)
        //"radlog"     // namespace to use (optional)
    ); 
    $channel = array_shift($argv);   
    $rpl->send($channel, $argv[0]);    
}
