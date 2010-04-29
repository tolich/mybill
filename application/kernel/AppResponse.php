<?php
class AppResponse {
    const LOCK     = '-1';
    const NORMAL   = '0';
    const REDIRECT = '1';
    
	public static function redirect($url){
 		return array('success'=>true, 'url'=>$url, 'id'=>self::REDIRECT);
	}
    
	public static function failure($msg){
 		return array('success'=>false, 'errors'=>array('msg'=>$msg));
	}
    
	public static function denied($msg){
	    $errId = self::NORMAL;
	    if (Context::getScript()!='user') $errId=self::LOCK;
 		return array('success'=>false, 'errors'=>array('msg'=>$msg), 'id'=>$errId); // -1 для вызова окна авторизации
	}
}
