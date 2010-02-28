<?php
class AppLog 
{
	/**
	 * Пишет событие в консоль
	 */
	public static function output($msg){
        $logger = new Logger();
        $logger->output(str_replace('%','All',$msg));
	}
    
    /**
     * События, касающиеся данных пользователя
     * @return 
     * @param object $username
     * @param object $msg
     * @param object $success[optional]
     */
    public static function user($username, $msg, $success = true){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->user($msg, array(
            'username'    => $username,
            'admin'       => Context::GetUserData('username'),
            'success'     => $success?1:0,
        ));    
    }    
    
    /**
     * События доступа к статистике
     * @return 
     * @param object $msg
     * @param object $success[optional]
     */
    public static function log($msg,$username=null){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->emerg($msg, array(
            'username'    => $username?$username:Context::GetUserData('username'),
        ));    
    }    

    public static function alert($msg,$username=null){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->alert($msg, array(
            'username'    => $username?$username:Context::GetUserData('username'),
        ));    
    }    

    public static function crit($msg,$username=null){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->crit($msg, array(
            'username'    => $username?$username:Context::GetUserData('username'),
        ));    
    }    

    public static function err($msg,$username=null){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->err($msg, array(
            'username'    => $username?$username:Context::GetUserData('username'),
        ));    
    }    

    public static function warn($msg,$username=null){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->warn($msg, array(
            'username'    => $username?$username:Context::GetUserData('username'),
        ));    
    }    
    
    public static function notice($msg,$username=null){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->notice($msg, array(
            'username'    => $username?$username:Context::GetUserData('username'),
        ));    
    }    

    public static function info($msg,$username=null){
        Utils::decode($msg);
        $logger = new Logger();
        $logger->info($msg, array(
            'username'    => $username?$username:Context::GetUserData('username'),
        ));    
    }    

    public static function debug($msg){
        $logger = new Logger();
        $logger->debug(var_export($msg,true));
    }
}
