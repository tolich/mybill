<?php
class Ajax_ErrorController extends Zend_Controller_Action
{

    public function deniedAction()
    {
		$response = AppResponse::failure(Utils::encode('У Вас не достаточно прав для выполнения запрашиваемого действия!'));
		$this->_helper->json($response);
    }
}
?>