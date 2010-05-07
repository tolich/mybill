<?php
class Loader
{
    public function Load($scripts){
        $aResult = array();
        foreach ($scripts as $filename){
            if (file_exists(UX_DIR.$filename)) {
                $filecache = md5(UX_DIR.$filename.filemtime(UX_DIR.$filename)).'_compressed.js';
                if (file_exists(CACHE_DIR.$filecache)){
                    $aResult[] = array(
                        'filename' => $filename,
                        'content'  => file_get_contents(CACHE_DIR.$filecache)
                    );                
                } else {
                    if (is_dir(CACHE_DIR)){
                        chmod(CACHE_DIR, 0755);
                    } else {
                        mkdir(CACHE_DIR, 0755, true);
                    }
                    
                    $content = JSMin::minify(file_get_contents(UX_DIR.$filename));
                    file_put_contents(CACHE_DIR.$filecache, $content);
                    chmod(CACHE_DIR, 0555);
                    
                    $aResult[] = array(
                        'filename' => $filename,
                        'content'  => $content
                    );                
                }
            }
        }
        return $aResult;
    }
}