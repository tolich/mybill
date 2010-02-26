<?php
class ErrorController extends Zend_Controller_Action
{
    public function errorAction()
    {
		$doctypeHelper = new Zend_View_Helper_Doctype();
		$doctypeHelper->doctype('HTML4_STRICT');
		
		$this->view->headMeta()
			->appendHttpEquiv('Content-Type','text/html; charset='.PROJECT_LOCALE_CODEPAGE)
            ->appendHttpEquiv('Content-Language', PROJECT_LOCALE);

        $errors = $this->_getParam('error_handler');

        switch ($errors->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                // ошибка 404 - не найден контроллер или действие
                $this->_redirect("/");
                break;
            default:
                // ошибка приложения; выводим страницу ошибки,
                // но не меняем код статуса
		    	$title=array(
					'title'=>Utils::encode('Произошла ошибка.'),
					'message'=>Utils::encode('Сообщите об этой ошибке администратору.')
		    	);
		    	$this->view->assign($title);
                break;
        }
    }
}
?>