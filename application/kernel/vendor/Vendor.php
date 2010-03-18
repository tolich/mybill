<?php
abstract class Vendor
{
    protected $_host;
    protected $_login;
    protected $_password;
    protected $_code;

    public function __construct($host=null,$login=null,$password=null)
    {
        if (null!==$host){
            $this->setHost($host);
        }
        if (null!==$login && null!==$password){
            $this->setAuth($login,$password);
        }
    }
    
    public function setHost($host){
        $this->_host = trim($host,'/');
        return $this;
    }
    
    public function setAuth($login,$password){
        $this->_login = $login;
        $this->_password = $password;
        return $this;        
    }
    
    abstract public function getSessions();    

    abstract public function getSessionsId();    

    abstract public function closeSession($id);    
}
