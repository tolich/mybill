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
    
    public static function prepare($sql){
        $sql = $sql->__toString();
        return str_replace('SELECT ', 'SELECT SQL_CALC_FOUND_ROWS ', $sql);
    }
}
