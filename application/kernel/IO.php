<?php
class IO {
	private $Db;
	private $path = '/usr/local/billing/tmp';
	//таблицы для экспорта
	private $etable = array(
		array(
			'tablename'=>'usergroup',
			'fields'=>array(
				'id','code','username','groupname','id_tariff','deposit','freebyte','mindeposit','dateofcheck','wwwpassword',
				'email','name','surname','detail','mac','access','freemblimit','check_mb','bonus','address',
				'password','out_ip','in_ip','id_sluice','session_timeout','idle_timeout','check_calling'
			),
		),
		array(
			'tablename'=>'sluice',
			'fields'=>array(
				'id','sluicename','sluiceval'
			)
		),
		array(
			'tablename'=>'tariffs',
			'fields'=>array(
				'id','tariffname','monthlyfee','freebyte','bonus','in_pipe','out_pipe','dateofcheck','check_mb',
				'id_sluice','mindeposit','freemblimit'
			)
		),
		array(
			'tablename'=>'radcheck',
			'fields'=>array(
				'username','attribute','op','value'
			)
		),
		array(
			'tablename'=>'radreply',
			'fields'=>array(
				'username','attribute','op','value'
			),
			'where'=>"`attribute`='Framed-IP-Address'"
		),
		array(
			'tablename'=>'payments',
			'fields'=>array(
				'iduser','datepayment','amount','amountdeposit','amountfreebyte','lastdeposit','lastfreebyte',
				'description','status','amountbonus','lastbonus'
			)
		),
		array(
			'tablename'=>'tasks',
			'fields'=>array(
				'id','username','attribute','value','opdate','execdate','execresult'
			)
		),
		array(
			'tablename'=>'radacct',
			'fields'=>array(
				'radacctid','acctsessionid','acctuniqueid','username','groupname','nasipaddress','nasportid',
				'nasporttype','acctstarttime','acctstoptime','acctsessiontime','acctinputoctets','acctoutputoctets',
				'calledstationid','callingstationid','framedipaddress'
			),
			'where'=>'adddate(`acctstarttime`, interval 1 MONTH) > now()'
		),
	);

	//таблицы для импорта
	private $itable = array(
		array(
			'tablename'=>'usergroup',
			'fields'=>array(
				'id','code','username','groupname','id_tariff','deposit','freebyte','mindeposit','dateofcheck','wwwpassword',
				'email','name','surname','detail','mac','access','freemblimit','check_mb','bonus','address',
				'password','out_ip','in_ip','id_sluice','session_timeout','idle_timeout','check_calling'
			),
		),
		array(
			'tablename'=>'sluice',
			'fields'=>array(
				'id','sluicename','sluiceval'
			)
		),
		array(
			'tablename'=>'tariffs',
			'fields'=>array(
				'id','tariffname','monthlyfee','freebyte','bonus','in_pipe','out_pipe','dateofcheck','check_mb',
				'id_sluice','mindeposit','freemblimit'
			)
		),
		array(
			'tablename'=>'radcheck',
			'fields'=>array(
				'username','attribute','op','value'
			)
		),
		array(
			'tablename'=>'radreply',
			'fields'=>array(
				'username','attribute','op','value'
			)
		),
		array(
			'tablename'=>'payments',
			'fields'=>array(
				'iduser','datepayment','amount','amountdeposit','amountfreebyte','lastdeposit','lastfreebyte',
				'description','status','amountbonus','lastbonus'
			)
		),
		array(
			'tablename'=>'tasks',
			'fields'=>array(
				'id','username','attribute','value','opdate','execdate','execresult','id_period'
			)
		),
		array(
			'tablename'=>'radacct',
			'fields'=>array(
				'radacctid','acctsessionid','acctuniqueid','username','groupname','nasipaddress','nasportid',
				'nasporttype','acctstarttime','acctstoptime','acctsessiontime','acctinputoctets','acctoutputoctets',
				'calledstationid','callingstationid','framedipaddress'
			),
		),
	);

	//таблицы для резервного копирования
	private $backup_table = array(
		array(
			'tablename'=>'usergroup',
			'fields'=>array(
				'id','code','username','groupname','id_tariff','deposit','freebyte','mindeposit','dateofcheck','wwwpassword',
				'email','name','surname','detail','mac','access','freemblimit','check_mb','bonus','address',
				'password','out_ip','in_ip','id_sluice','session_timeout','idle_timeout','check_calling'
			),
		),
		array(
			'tablename'=>'sluice',
			'fields'=>array(
				'id','sluicename','sluiceval'
			)
		),
		array(
			'tablename'=>'tariffs',
			'fields'=>array(
				'id','tariffname','monthlyfee','freebyte','bonus','in_pipe','out_pipe','dateofcheck','check_mb',
				'id_sluice','mindeposit','freemblimit'
			)
		),
		array(
			'tablename'=>'radcheck',
			'fields'=>array(
				'username','attribute','op','value'
			)
		),
		array(
			'tablename'=>'radreply',
			'fields'=>array(
				'username','attribute','op','value'
			)
		),
		array(
			'tablename'=>'payments',
			'fields'=>array(
				'iduser','datepayment','amount','amountdeposit','amountfreebyte','lastdeposit','lastfreebyte',
				'description','status','amountbonus','lastbonus'
			)
		),
		array(
			'tablename'=>'tasks',
			'fields'=>array(
				'id','username','attribute','value','opdate','execdate','execresult','id_period'
			)
		),
		array(
			'tablename'=>'radacct',
			'fields'=>array(
				'radacctid','acctsessionid','acctuniqueid','username','groupname','nasipaddress','nasportid',
				'nasporttype','acctstarttime','acctstoptime','acctsessiontime','acctinputoctets','acctoutputoctets',
				'calledstationid','callingstationid','framedipaddress'
			),
		),
	);

	public function __construct(){
		AppLog::output("Starting IO script");
		$this->Db = Zend_Registry::get('db');
	}

	public function __destruct(){
		AppLog::output("IO script stopped.");
	}
	
	public function export(){
		AppLog::output("Starting export");
		foreach ($this->etable as $table){
			AppLog::output("\t{$table['tablename']}");
			if (count($table['fields'])!=0){
				$sql = "SELECT `".implode("`,`",$table['fields'])."`
					FROM `{$table['tablename']}`". 
					(array_key_exists('where', $table)?" WHERE {$table['where']}":"").
					" INTO OUTFILE '{$this->path}/{$table['tablename']}.exp'";
				$this->Db->query($sql);
				AppLog::output("\t{$table['tablename']} export success!");
			}else{
				AppLog::output("\tno fields for export!");
			}
		}
	}

	public function import(){
		AppLog::output("Starting import");
		foreach ($this->itable as $table){
			AppLog::output("\t{$table['tablename']}");
			AppLog::output("\tclean");
			$this->Db->delete($table['tablename']);
			if (count($table['fields'])!=0){
				$sql = "LOAD DATA INFILE '{$this->path}/{$table['tablename']}.exp'
					INTO TABLE `{$table['tablename']}`(`".implode("`,`",$table['fields'])."`)";
				$this->Db->query($sql);
				AppLog::output("\t{$table['tablename']} import success!");
			}else{
				AppLog::output("\tno fields for export!");
			}
		}
		AppLog::output("\tApply tariffs settings for users");
		$oTariffs = new Tariffs();
		$oTariffs->ApplyAll();
		AppLog::output("\tApply defaults settings");
		$oSettings = new Settings();
		$oSettings->SetDefault();
	}

	public function defsettings(){
		AppLog::output("Apply defaults settings");
		$oSettings = new Settings();
		$oSettings->SetDefault();
	}

	public function backup(){
		$date = date('Ymd-H:i:s');
		//$path = Settings::Billing('backup_path');
		$oSettings = new Settings();
		$aParams = $oSettings->GetAppParams();
		$path = $aParams[SETTINGS_BILLING]['backup_path'];
		AppLog::output($path);
		if (mkdir("$path/$date")) {
			$path = "$path/$date";	
			chmod($path, 0777);
			AppLog::output("Starting backup");
			foreach ($this->backup_table as $table){
				AppLog::output("\t{$table['tablename']}");
				if (count($table['fields'])!=0){
					$sql = "SELECT `".implode("`,`",$table['fields'])."`
						FROM `{$table['tablename']}`". 
						(array_key_exists('where', $table)?" WHERE {$table['where']}":"").
						" INTO OUTFILE '$path/{$table['tablename']}.exp'";
					$this->Db->query($sql);
					AppLog::output("\t{$table['tablename']} backup success!");
				}else{
					AppLog::output("\tno fields for backup!");
				}
			}
			if (system("cd $path && tar -cvzf $path.tar.gz *")!==false) {
			    foreach ($this->backup_table as $table){
					unlink("$path/{$table['tablename']}.exp");
			    }
			    rmdir($path);
			}
		} else {
			AppLog::output("\tbackup failed! Dir not created!");
		}
	}

    public function update(){
		AppLog::output("Update start");
		AppLog::output("Saving current settings...");
        $sql = $this->Db->select()
                    ->from('settings',array('param','value'));
        $aCurrent = $this->Db->fetchPairs($sql);
		$oManager = new Manager();
		$aModules = $oManager->GetAllModules();
		AppLog::output("Updating...");
		$oSettings = new Settings();
		$oSettings->SetDefault();
		AppLog::output("Restoring settings...");
        foreach ($aCurrent as $param=>$value){
            $n=$this->Db->update('settings',array('value'=>$value),"param='$param'");
            if ($n>0){
        		AppLog::output("$param => $value");
            } else {
        		AppLog::output("$param missing");
            };
        }
		AppLog::output("Installing modules...");
		foreach ($aModules as $k=>$v){
			$aResult = array();
			$module = ucfirst((string)$k);
			if (class_exists($module)){
				$oModule = new $module();
				$result = $oModule->Install();
				if ($result===true){
					AppLog::output("$module success");
				} else {
					AppLog::output("$module failed");
				}
			} else {
    			AppLog::output("$module failed");
			}
		}
		AppLog::output("Update stop");
    }
}
