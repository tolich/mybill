<?php
class AppException  extends Exception {
	public function getResponse(){
		return AppResponse::failure($this->getMessage());
	}
}
