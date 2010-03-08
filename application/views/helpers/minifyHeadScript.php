<?php
class Zend_View_Helper_minifyHeadScript extends Zend_View_Helper_Abstract
{
    private $_params = array(
        'cacheDir'    => '',
        'compress'    => true,
        'encode'      => false,
        'symlinks'    => array()
    );
    
    private $_cache = array();
    
    public function setCacheDir($dir){
        $this->_params['cacheDir']=$dir;
        return $this;    
    }

    public function setEncode($encode=true){
        if (strpos(GZIP_MODE,'js')!==false){
            $this->_params['encode']=$encode;
        }
        return $this;    
    }

    public function setSymlinks($symlinks){
        $this->_params['symlinks']=array_merge($this->_params['symlinks'],$symlinks);
        return $this;    
    }

    public function setCompress($compress=false){
        $this->_params['compress']=$compress;
        return $this;    
    }
    
    public function minifyHeadScript($params=array())
    {
        $this->_params = array_merge($this->_params,$params);
        return $this;
    }

    public function __toString(){
        if (!DEBUG_MODE && strpos(MINIFY_MODE,'js')!==false) {
            foreach ($this->view->headScript() as $k=>$item) {
                if (!$this->_isValid($item)) {
                    continue;
                }
                if ($this->isCachable($item)) {
                    $this->cache($item,$k);
                }
            }
            $this->view->headScript()->appendFile($this->getCompiledUrl());
        }
        return $this->view->headScript()->__toString();
    }    

    private function _getRealPath($src)
    {
        $path = DOCUMENT_ROOT.$src;
        if (is_readable($path)) {
            return $path;
        } 
        foreach ($this->_params['symlinks'] as $virtualPath => $realPath) {
            $path = DOCUMENT_ROOT.str_replace('/'.trim($virtualPath,'/').'/', '/'.trim($realPath,'/').'/', dirname($src).'/').basename($src);
            if (is_readable($path)) {
                return realpath($path);
            } 
        }
        return false;
    }    
    
    private function isCachable($item)
    {
        if (isset($item->attributes['conditional'])
            && !empty($item->attributes['conditional'])
            && is_string($item->attributes['conditional']))
        {
            return false;
        }
        
        if (!empty($item->source) && false===strpos($item->source, '//@non-cache')) {
            return true;
        }
        
        if (!isset($item->attributes['src']) || false===$this->_getRealPath($item->attributes['src'])) {
            return false;
        }
        return true;
    }
    
    private function cache($item,$k)
    {
        if (!empty($item->source)) {
            $this->_cache[$k] = $item->source;
        } else {
            $filePath = $this->_getRealPath($item->attributes['src']);
            $this->_cache[$k] = array(
                'filepath' => $filePath,
                'mtime' => filemtime($filePath)
            );
        }
    }
    
    private function getCompiledUrl()
    {
        $filename = md5(serialize($this->_cache));
        $path = $this->_params['cacheDir'] . $filename . ($this->_params['compress']? '_compressed' : '') . ($this->_params['encode']? '.js.gz' : '.js');
        if (!file_exists($path)) {
            if (!is_dir(dirname($path))){
                mkdir(dirname($path), 0777, true);
            }
            $jsContent = '';
            foreach ($this->_cache as $k=>$js) {
                if (is_array($js)) {
                    $jsContent .= file_get_contents($js['filepath']) . "\n\n";
                } else {
                    $jsContent .= $js . "\n\n";
                }
                unset($this->view->headScript()->$k);
            }
            if ($this->_params['compress']) {
                $jsContent = JSMin::minify($jsContent);
            }
            if ($this->_params['encode']){
                $jsContent = gzencode($jsContent);
            }
            file_put_contents($path, $jsContent);
        } else {
            foreach ($this->_cache as $k=>$js) {
                unset($this->view->headScript()->$k);
            }
        }
        
        $url = str_replace(DOCUMENT_ROOT, '/', $path);
        return $url;
    }


    protected function _isValid($value)
    {
        if ((!$value instanceof stdClass)
            || !isset($value->type)
            || (!isset($value->source) && !isset($value->attributes)))
        {
            return false;
        }

        return true;
    }
    
}