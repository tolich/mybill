<?php
class Db {
    public static function factory($type='default'){
        $aParams = Zend_Registry::get('db_params');
        if (isset($aParams[$type])){
        	return Zend_Db::factory(DB_DRIVER, $aParams[$type]);
        } else {
            throw new AppException('Db config not found!');
        }
    }
}
