<?php
$syscontact = snmprealwalk("192.168.168.11", "public", ".1.3.6.1.2.1.2.2.1.10");

print_r($syscontact);

$syscontact = snmpget("192.168.168.11", "public", ".iso.3.6.1.2.1.2.2.1.10.1");

print_r($syscontact);