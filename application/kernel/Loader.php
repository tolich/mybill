<?php
class Loader
{
    public function Load($scripts){
        $aResult = array();
        foreach ($scripts as $filename){
            if (file_exists(UX_DIR.$filename)){
                $aResult[] = array(
                    'filename' => $filename,
                    'content'  => file_get_contents(UX_DIR.$filename)
                );                
            }
        }
        return $aResult;
    }
}