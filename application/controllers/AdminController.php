<?php
/**
 * Индексный контроллер
 */
class AdminController extends Zend_Controller_Action
{
    public function indexAction()
    {   
		$doctypeHelper = new Zend_View_Helper_Doctype();
		$doctypeHelper->doctype('HTML4_STRICT');
		
		$this->view->headMeta()
			->appendHttpEquiv('Content-Type','text/html; charset='.PROJECT_LOCALE_CODEPAGE)
            ->appendHttpEquiv('Content-Language', PROJECT_LOCALE);
				 
		$this->view->headLink()
			->appendStylesheet("/extjs/resources/css/ext-all.css");

		if (DEBUG_MODE)	{
			$this->view->headScript()->appendFile("/extjs/adapter/ext/ext-base-debug.js")
									 ->appendFile("/extjs/ext-all-debug.js");
		} else {
			$this->view->headScript()->appendFile("/extjs/adapter/ext/ext-base.js")
									 ->appendFile("/extjs/ext-all.js");
		}
		$this->view->headScript()
			->appendFile("/shared/js/ext-lang-ru-cp1251.js")
			->appendFile("/js/proxy.js")
			->appendFile("/js/index/adminlogin.js");
	}
}

