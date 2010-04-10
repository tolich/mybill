<?php
/**
 * @license Public domain
 */
class Zend_View_Helper_minifyHeadLink extends Zend_View_Helper_Abstract
{
    protected $_itemKeys = array('charset', 'href', 'hreflang', 'media', 'rel', 'rev', 'type', 'title', 'extras');
    
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

    public function setSymlinks($symlinks){
        $this->_params['symlinks']=array_merge($this->_params['symlinks'],$symlinks);
        return $this;    
    }

    public function setEncode($encode=true){
        if (strpos(GZIP_MODE,'css')!==false){
            $this->_params['encode']=$encode;
        }
        return $this;    
    }

    public function setCompress($compress=false){
        $this->_params['compress']=$compress;
        return $this;    
    }
    
    public function minifyHeadLink($params=array())
    {
        $this->_params = array_merge($this->_params,$params);
        return $this;
    }
    
    public function __toString(){
        if (!DEBUG_MODE && strpos(MINIFY_MODE,'css')!==false) {
            foreach ($this->view->headLink() as $k=>$item) {
                if (!$this->_isValid($item)) {
                    continue;
                }
                if ($this->isCachable($item)) {
                    $this->cache($item,$k);
                }
            }
            $this->view->headLink()->appendStylesheet($this->getCompiledUrl());
        }
        return $this->view->headLink()->__toString();
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

    public function isCachable($item)
    {
        $attributes = (array) $item;
        if (isset($attributes['conditionalStylesheet'])
            && !empty($attributes['conditionalStylesheet'])
            && is_string($attributes['conditionalStylesheet']))
        {
            return false;
        }
        if (!isset($attributes['href']) || false===$this->_getRealPath($attributes['href'])) {
             return false;
        }
        return true;
    }
    
    public function cache($item,$k)
    {
        $attributes = (array) $item;
        $filePath = $this->_getRealPath($attributes['href']);
        $import = array();
        $import = array_merge($import,CSSMin::imported($filePath,array(
                        'symlinks'=>$this->_params['symlinks'],
                        'documentRoot'=>DOCUMENT_ROOT
                    )));
        $this->_cache[$k] = array(
            'baseuri'=>dirname($attributes['href']),
            'filepath' => $filePath,
            'mtime' => filemtime($filePath),
            'import' => $import
        );
    }
    
    private function getCompiledUrl()
    {
        $filename = md5(serialize($this->_cache));
        $path = $this->_params['cacheDir'] . $filename . ($this->_params['compress']? '_compressed' : '') . ($this->_params['encode']? '.css.gz' : '.css');
        if (!file_exists($path)) {
            if (!is_dir(dirname($path))){
                mkdir(dirname($path), 0755, true);
            } else {
                chmod(dirname($path), 0755);
            }
            $cssContent = '';
            foreach ($this->_cache as $k=>$css) {
                $cssContent .= @file_get_contents($css['filepath']);
                foreach ($css['import'] as $alias=>$import){
                    $importContent = @file_get_contents($import['filepath']);
                    $cssContent = str_replace($alias, $importContent, $cssContent);
                    $this->_base = $import['baseuri'];
                }
                $this->_base = $css['baseuri'];
                $cssContent = $this->_toAbsoluteUrl($cssContent);
                unset($this->view->headLink()->$k);
            }
            if ($this->_params['compress']) {
                $cssContent = CSSMin::minify($cssContent);
            }
            if ($this->_params['encode']){
                $cssContent = gzencode($cssContent);
            }
            file_put_contents($path, $cssContent);
            chmod(dirname($path), 0555);
        } else {
            foreach ($this->_cache as $k=>$js) {
                unset($this->view->headLink()->$k);
            }
        }
        
        $url = str_replace(DOCUMENT_ROOT, '/', $path);
        return $url;
    }

    private function _toAbsoluteUrl($data)
    {
        if (false !== strpos($data, "url")) {
            $data = preg_replace_callback('/
                    url \s* \( \s* ["\']? ([^"\'()]+) ["\']? \s* \)
                /sxi',
                array($this, '_processToAbsolute'),
                $data);
        };
        return $data;
    }

    private function _processToAbsolute($m)
    {
        $uri =$m[1];
        if (preg_match('{^\w+://}s', $uri)) {
            return $uri;
        }
        if (substr($uri, 0, 1) != '/') {
            $uri = $this->_base . (substr($this->_base, -1) == '/'? '' : '/') . $uri;
        }
        return 'url('.$uri.')';
    }

    protected function _isValid($value)
    {
        if (!$value instanceof stdClass) {
            return false;
        }

        $vars         = get_object_vars($value);
        $keys         = array_keys($vars);
        $intersection = array_intersect($this->_itemKeys, $keys);
        if (empty($intersection)) {
            return false;
        }

        return true;
    }
    
}
