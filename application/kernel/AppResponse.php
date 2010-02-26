<?php
class AppResponse {
//	public function success($msg){
// 		return array('success'=>true, 'errors'=>array('msg'=>$msg));
//	}
	public static function failure($msg){
 		return array('success'=>false, 'errors'=>array('msg'=>$msg));
	}
}
