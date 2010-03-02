<?php
/**
 * Индексный контроллер
 */
class IndexController extends Zend_Controller_Action
{
	public function preDispatch()
    {
    	$view 	= Context::GetScript();
    	if ($view)
			$this->_helper->viewRenderer($view);
    }

    public function indexAction()
    {   
		$aModules =  Context::GetModules();

		$doctypeHelper = new Zend_View_Helper_Doctype();
		$doctypeHelper->doctype('HTML4_STRICT');
		if (Context::IsAuthorize()){
			$this->view->headTitle(Settings::Company('name').' - '.Context::GetUserData('username'));
		}
		
		$this->view->headMeta()
			->appendHttpEquiv('Content-Type','text/html; charset='.PROJECT_LOCALE_CODEPAGE)
            ->appendHttpEquiv('Content-Language', PROJECT_LOCALE);
				 
		$this->view->headLink()
			->appendStylesheet("/extjs/resources/css/ext-all.css")
			->appendStylesheet("/shared/js/ux/css/ux-all.css")
			->appendStylesheet("/shared/css/rowactions.css");

		if (Context::IsAuthorize()){
			if (Context::GetScript()=='admin'){
            	$theme 	= Settings::Main('theme');
        		if ($theme!='default'){
        			$this->view->headLink()
        				->appendStylesheet("/shared/themes/$theme/css/xtheme-$theme.css");
        		}
				$this->view->headLink()->appendStylesheet("/css/admin/layer.css");

				//Modules
				foreach ($aModules as $module=>$v){
					foreach (glob(MODULES_DIR."$module/admin/css/*.css") as $css){
						if (file_exists($css))
							$this->view->headLink()->appendStylesheet("/modules/$module/admin/css/".basename($css));
					}					
				}
				
			} else {
				$this->view->headLink()->appendStylesheet("/css/user/layer.css");

				//Modules
				foreach ($aModules as $module=>$v){
					foreach (glob(MODULES_DIR."$module/user/css/*.css") as $css){
						if (file_exists($css))
							$this->view->headLink()->appendStylesheet("/modules/$module/user/css/".basename($css));
					}					
				}
			}
		}

		if (DEBUG_MODE)	{
			$this->view->headScript()->appendFile("/extjs/adapter/ext/ext-base-debug.js")
									 ->appendFile("/extjs/ext-all-debug.js")
									 ->appendFile("/shared/js/ux/ux-all-debug.js");
		} else {
			$this->view->headScript()->appendFile("/extjs/adapter/ext/ext-base.js")
									 ->appendFile("/extjs/ext-all.js")
									 ->appendFile("/shared/js/ux/ux-all.js");
		}
			
		$this->view->headScript()
			->appendFile("/shared/js/ext31patch.js")
			->appendFile("/shared/js/ext-lang-ru.js")
			->appendFile("/shared/js/ext-lang-ru-ux.js")
    		->appendFile("/shared/js/cookies.js")
			->appendFile("/js/proxy.js")
			->appendFile("/js/winlogin.js");

		if (Context::IsAuthorize()){
			if (Context::GetScript()=='admin'){
				$this->view->headScript()
					->appendFile("/js/app.js")
					->appendFile("/shared/js/app-ux.js")
					->appendFile("/js/admin/users.js")
					->appendFile("/js/admin/payments.js")
					->appendFile("/js/admin/zones.js")
					->appendFile("/js/admin/sluices.js")
					->appendFile("/js/admin/tariffs.js")
					->appendFile("/js/admin/pools.js")
					->appendFile("/js/admin/tasks.js")
					->appendFile("/js/admin/nas.js")
					->appendFile("/js/admin/admin.js")
					->appendFile("/js/admin/sessions.js")
					->appendFile("/js/admin/settings.js")
					->appendFile("/js/user/reports.js")
					->appendFile("/js/admin/print.js")
					->appendFile("/js/admin/modules.js")
					->appendFile("/js/admin/layer.js");						

				//Modules
				foreach ($aModules as $module=>$v){
					foreach (glob(MODULES_DIR."$module/admin/js/*.js") as $js){
						if (file_exists($js))
							$this->view->headScript()->appendFile("modules/$module/admin/js/".basename($js));
					}					
				}
			} else {
				$this->view->headScript()
					->appendFile("/shared/js/TabCloseMenu.js")
					->appendFile("/js/app.js")
					->appendFile("/js/user/layer.js")
					->appendFile("/js/user/reports.js");

				//Modules
				foreach ($aModules as $module=>$v){
					foreach (glob(MODULES_DIR."$module/user/js/*.js") as $js){
						if (file_exists($js))
							$this->view->headScript()->appendFile("modules/$module/user/js/".basename($js));
					}					
				}
			}
		} else {
			$this->view->headScript()
				->appendFile("/js/index/userlogin.js");
		}
    }
}

