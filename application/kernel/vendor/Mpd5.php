<?php
class Mpd5 extends Vendor
{
    private $_response;
    
    public function getSessions(){
        $url = "http://{$this->_login}:{$this->_password}@{$this->_host}/bincmd?show%20sessions";
        $this->_request($url);
        $sessions = $this->_getBody();
        $info = $this->_getInfo();
		switch ($info['http_code']){
		    case '200':
//		    case '404':
    			$aSessions=array();
				preg_match_all("/^ng.*$/im",$sessions,$aSessions);
                $result = $aSessions[0];                
            break;
		    case '0':
                $result = array();                
            break;
            default:
                $result = false;
		}
        return $result;
    }
    
    public function getSessionsId(){
        $sessions = $this->getSessions();
        if (false === $sessions){
            return false;
        }
		$aSessionsId = array();
		foreach ($sessions as $session){
			$link = preg_split('/\s+/',$session);
			$aSessionsId[]=$link[6];
		}
        return $aSessionsId;
    } 
    
    public function closeSession($id){
		if (preg_match("/\w+-(\w+-\w+)/",$id,$match)){
            $url = "http://{$this->_login}:{$this->_password}@{$this->_host}/bincmd?link%20{$match[1]}&close";
            $this->_request($url);
            $info = $this->_getInfo();
   			return $info['http_code']=='200';
        }
   		return false;	     
    }
    
    // private
    private function _request($url){
        $this->_lastResponse = array();
        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, $url );
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
        $this->_lastResponse['body'] = curl_exec( $ch );
        $this->_lastResponse['info'] = curl_getinfo( $ch );
        curl_close ( $ch );
        return $this;
    }
    
    private function _getBody(){
        return $this->_lastResponse['body'];
    }
    
    private function _getInfo(){
        return $this->_lastResponse['info'];
    }
}

