<?php
class Logger
{
    const OUTPUT = 8;
    const USER = 9;
    const filename = 'log.txt';
    private $_logger;

    public function __construct(){
        $this->_logger = new Zend_Log();
    }    
    
    public function __call($method, $params){
        $initMethod = '_init'.$method;
        if (method_exists($this, $initMethod)){
            $this->$initMethod();
        } else {
            $this->_initLog();
        }
        $message = array_shift($params);
        $extras  = array_merge(array(
                'remote_addr' => $_SERVER['REMOTE_ADDR'],
                'http_user_agent'=> $_SERVER['HTTP_USER_AGENT']
            ),(array)array_shift($params));
        $this->_logger->$method($message,$extras);
    }
    
    private function _initOutput(){
        $this->_logger->addPriority('OUTPUT', self::OUTPUT);
        $writer = new Zend_Log_Writer_Stream('php://output');
        $format = date('d.m.Y H:i:s').': %message%' . (php_sapi_name()=='cli'?PHP_EOL:' <br>');
        $formatter = new Zend_Log_Formatter_Simple($format);
        $writer->setFormatter($formatter);
        $filter = new Zend_Log_Filter_Priority(self::OUTPUT);
        $writer->addFilter($filter);
        $this->_logger->addWriter($writer);
    }
    
    private function _initLog(){
        $columnMapping = array(
            'date_log'        => 'timestamp',
            'level'           => 'priority', 
            'msg'             => 'message',
            'username'        => 'username',
            'remote_addr'     => 'remote_addr',
            'http_user_agent' => 'http_user_agent',
        );
        $writer = new Zend_Log_Writer_Db(Db::factory('log'), 'log', $columnMapping);
        $filter = new Zend_Log_Filter_Priority((int)Settings::Billing('log_priority'));
        $writer->addFilter($filter);
        $this->_logger->addWriter($writer);
    }

    private function _initUser(){
        $this->_logger->addPriority('USER', self::USER);
        $columnMapping = array(
            'date_log'    => 'timestamp',
            'level'       => 'priority', 
            'msg'         => 'message',
            'username'    => 'username',
            'admin'       => 'admin',
        );
        $writer = new Zend_Log_Writer_Db(Db::factory('log'), 'user_log', $columnMapping);
        $filter = new Zend_Log_Filter_Priority(self::USER);
        $writer->addFilter($filter);
        $this->_logger->addWriter($writer);
    }
    
    private function _initDebug(){
        $writer = new Zend_Log_Writer_Stream(LOGS_DIR.self::filename);
        $filter = new Zend_Log_Filter_Priority(Zend_Log::DEBUG);
        $writer->addFilter($filter);
        $this->_logger = new Zend_Log($writer);
    }
}
