<?php
/**
 * cssmin.php - A simple CSS minifier.
 * --
 * 
 * <code>
 * include("cssmin.php");
 * file_put_contents("path/to/target.css", cssmin::minify(file_get_contents("path/to/source.css")));
 * </code>
 * --
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * --
 *
 * @package 	cssmin
 * @author 		Joe Scylla <joe.scylla@gmail.com>
 * @copyright 	2008 Joe Scylla <joe.scylla@gmail.com>
 * @license 	http://opensource.org/licenses/mit-license.php MIT License
 * @version 	1.0 (2008-01-31)
 */
class CSSMin
{
    private $_params=array();
    private $_import=array();
    private $_documentRoot;
    private $_basePath;
    private $_re = '/
                @import (?:
                    \s+ url \s* \( \s* ["\']? ([^"\'()]+) ["\']? \s* \)
                    |
                    \s+ ["\']? ([^"\';()]+) ["\']?
                ) \s* ;
            /sxi';
    
            
    public static function minify($css) {
        $cssmin = new CSSMin();
        return $cssmin->min($css);
    }

    public static function imported($path,$params=array()) {
        $cssmin = new CSSMin($params);
        return $cssmin->inc($path);
    }
    
    
    public function __construct($params=array()){
        $this->_params = array_merge($this->_params,$params);
        if (isset($this->_params['documentRoot'])){
            $this->_documentRoot = $this->_params['documentRoot'];
        } else {
            $this->_documentRoot = $_SERVER['DOCUMENT_ROOT'];
        }
    }
	/**
	 * Minifies stylesheet definitions
	 *
	 * @param 	string	$v	Stylesheet definitions as string
	 * @return 	string		Minified stylesheet definitions
	 */
	public function min($v) 
	{
		$v = trim($v);
		$v = str_replace("\r\n", "\n", $v);
        $search = array("/\/\*[\d\D]*?\*\/|\t+/", "/\s+/", "/\}\s+/");
        $replace = array(null, " ", "}\n");
		$v = preg_replace($search, $replace, $v);
		$search = array("/\\;\s/", "/\s+\{\\s+/", "/\\:\s+\\#/", "/,\s+/i", "/\\:\s+\\\'/i", "/\\:\s+([0-9]+|[A-F]+)/i");
        $replace = array(";", "{", ":#", ",", ":\'", ":$1");
        $v = preg_replace($search, $replace, $v);
        $v = str_replace("\n", null, $v);
    	return $v;	
	}

    public function inc($path){
        if ($this->_params!==array()){
            $this->_basePath = dirname($path);
            $data = @file_get_contents($path);        
            $this->_processCss($data);
        }
        return $this->_import;
    }

    /**
     * @author dklab
     */
 
    /**
     * Process @import directives and remove comments in a CSS file.
     *
     * @param string $data  CSS data.
     * @param string $uri   URI from which this CSS is loaded
     * @return string       Expanded result.
     */
    private function _processCss($data)
    {
        $data = preg_replace('{/\* .*? \*/}xs', '', $data);
        if (false !== strpos($data, "@import")) {
            preg_replace_callback($this->_re,
                array($this, '_processImportsCallback'),
                $data);
        };
    }

    private function _processImportsCallback($m)
    {
        $uri = strlen($m[1])? $m[1] : $m[2];
        if (preg_match('{^\w+://}s', $uri)) {
            return $m[0];
        }
        if (strpos($uri,'/')===0){
            $this->_basePath = $this->_documentRoot;
        }
        $path=$this->_getRealPath($uri,$this->_basePath);
        if ($path){
            $this->_import[$m[0]]=array(
                'baseuri'=>dirname($uri),
                'filepath' => $path,
                'mtime' => filemtime($path)
            );
            $data = @file_get_contents($path);
            $this->_basePath = dirname($path);       
            $this->_processCss($data);
        }
    }

    /**
     * My
     */    
    private function _getRealPath($src,$basePath)
    {
        $path = $basePath.$src;
        if (is_readable($path)) {
            return $path;
        } 
        foreach ($this->_params['symlinks'] as $virtualPath => $realPath) {
            $path = $basePath.'/'.str_replace('/'.trim($virtualPath,'/').'/', '/'.trim($realPath,'/').'/', dirname($src).'/').basename($src);
            if (is_readable($path)) {
                return realpath($path);
            } 
        }
        return false;
    }    
}