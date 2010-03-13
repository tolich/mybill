<?php
class AppResponse {
	public static function failure($msg){
 		return array('success'=>false, 'errors'=>array('msg'=>$msg));
	}
	public static function denied($msg){
	    $errId = '0';
	    if (Context::getScript()=='admin') $errId= '-1';
 		return array('success'=>false, 'errors'=>array('msg'=>$msg), 'id'=>$errId); // -1 для вызова окна авторизации
	}
}
