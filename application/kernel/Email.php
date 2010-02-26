<?php
class Email{
	public static function Send(){
		$tr = new Zend_Mail_Transport_Smtp('mail.svs.pl.ua');
		Zend_Mail::setDefaultTransport($tr);
		$mail = new Zend_Mail();
		$mail->setBodyText('This is the text of the mail.');
		$mail->setFrom('admin@svs-tv.org.ua', 'Some Sender');
		$mail->addTo('tolich@svs.pl.ua', 'Some Recipient');
		$mail->setSubject('TestSubject');
		$mail->send();
	}
}
?>