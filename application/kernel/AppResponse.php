<?php
class AppResponse {
	public static function failure($msg){
 		return array('success'=>false, 'errors'=>array('msg'=>$msg));
	}
	public static function denied($msg){
 		return array('success'=>false, 'errors'=>array('msg'=>$msg), 'id'=>'0'); // -1 для вызова окна авторизации
	}
}
