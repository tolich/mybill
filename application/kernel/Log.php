<?php
class Log {
	/**
	 * Пишет событие в консоль
	 */
	public static function writeCliLog($msg){
		$date = date('d.m.Y H:i:s');
		echo "$date\t",str_replace('%','All',$msg),"\n";
	}	
}
?> 