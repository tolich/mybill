<?php
/**
 * Управление правами доступа
 */
class Aclmanager extends Modules {
	public $author = 'tolich (tolich@svs.pl.ua)';
	public $description = 'Управление правами доступа';
	public $moduleId = 'aclmanager';
	public $rights	= array(
		'aclmanager' => array()
	);
	public $installData = array(
		'resource' => array(
			'resource'		=> 'aclmanager',
			'resourcename'	=> 'Управление правами доступа',
		),
		'rightaction'=>array(
			'view'=>array(
				'aclmanager'=>array(
					'getrole',
					'getrights'
				),
			),
			'add'=>array(
				'aclmanager'=>array(
				),
			),
			'edit'=>array(
				'aclmanager'=>array(
				),
			),
			'delete'=>array(
				'aclmanager'=>array(
				),
			),
			'submit'=>array(
				'aclmanager'=>array(
				),
			)
		),
	);

	public $rn = array(
		'view'=>array(
			'aclmanager'=>'Просмотр прав доступа',
		),
		'add'=>array(
		),
		'edit'=>array(
		),
		'delete'=>array(
		),
		'submit'=>array(
		)
	);
	
	public $actions = array(
	);
	

	public function Init(){
		//$aSettings = Context::GetSettings(SETTINGS_BILLING);
	}

	public function GetRole(){
		$sql = $this->Db->select()
					->from('role',array('role','id','text'=>'rolename','type','leaf'=>new Zend_Db_Expr('true'),'iconCls'=>new Zend_Db_Expr("CONCAT ('aclmanager-role-',type)")))
					->joinLeft('roleparent','id=id_role',array('id_parent'))
					->order('id_parent DESC');
		$aRoles = $this->Db->fetchAll($sql);
		Utils::encode($aRoles);
		if (count($aRoles))
			while (true){
				if ($aRoles[0]['id_parent']===null) break;
				$aChild = array_shift($aRoles);
				foreach ($aRoles as &$aRole){
					if ($aChild['id_parent']==$aRole['id']){
						$aRole['leaf'] = false;
						$aRole['expanded'] = true;
						$aRole['children'][] = $aChild;
						break;
					}
				}
			};
		return $aRoles;
	}
	
	public function GetRights(){
		$aRights = array();
		$this->acl->reInit();
		$aRole = Context::getAcl('right');
		$parentRole = $this->acl->getParentRole($this->_getParam('role'));
		$aParentRoles = $this->acl->getAllRights($parentRole);
		$aResource = $this->acl->getResourcesName();
		foreach (array('allow','deny') as $v){
			if ($aParentRoles[$v]===null) $aParentRoles[$v]=array_combine(array_keys(Context::GetAcl('resource')),array_fill(0,count(Context::GetAcl('resource')),null));
			foreach ($aParentRoles[$v] as $key=>$aVal){
				$aRightsName = $this->acl->getRightsName($key);
				if ($aVal===null) $aVal = $this->acl->getRightsList($key); 
				foreach ($aVal as $val){
					if ($aRole[$this->_getParam('role')]['allow']===null){
						$allow = true;
					}
					else if (array_key_exists($key,$aRole[$this->_getParam('role')]['allow'])){
						$allow = $aRole[$this->_getParam('role')]['allow'][$key]===null?true:in_array($val,$aRole[$this->_getParam('role')]['allow'][$key]);
					} else {
						$allow = false;
					};
					if ($aRole[$this->_getParam('role')]['deny']===null){
						$deny = true;
					}
					else if (array_key_exists($key,$aRole[$this->_getParam('role')]['deny'])){
						$deny = $aRole[$this->_getParam('role')]['deny'][$key]===null?true:in_array($val,$aRole[$this->_getParam('role')]['deny'][$key]);
					} else {
						$deny = false;
					};
					$aRights[] = array(
						'module'	=> $key,
						'modulename'=> $aResource[$key],
						'right'		=> $val,
						'rightname'	=> isset($aRightsName[$val])?$aRightsName[$val]:$val,
						'allow'		=> $allow,
						'deny'		=> $deny,
						'value'		=> $v=='allow',
					);
				}
			};			
		}
		return $aRights;
	}
	
	public function SaveRole($role=null,$rights=null){
		$aResult = array(
			'allow'=>array(),
			'deny'=>array()
		);
		if ($role===null) $role = $this->_getParam('role');
		if ($rights===null) $rights = $this->_getParam('rights');
		$aRights = Zend_Json::decode($rights);
		$aRoles = Context::getAcl('right');
		foreach ($aRights as $aData){
			foreach (array('allow','deny') as $v){
				if (!array_key_exists($aData['module'],$aRoles[$role][$v])){
					$aRoles[$role][$v][$aData['module']] = array();//$this->acl->getRightsList($aData['module']);
				};
				$r = &$aRoles[$role][$v][$aData['module']];
				if ($r===null) $r = $this->acl->getRightsList($aData['module']); 
				if ($aData[$v]){
					if (!in_array($aData['right'], $r))	$r[] = $aData['right'];
				} else {
					if (in_array($aData['right'], $r)) $r = array_diff($r,array($aData['right']));
				}
				sort($r);
				if (count($r)==0) unset($aRoles[$role][$v][$aData['module']]);
				if ($r==$this->acl->getRightsList($aData['module'])){
					$r=null;
				}
				unset($r);
			}
		}
		$where = $this->Db->quoteInto('role = ?',$role);
		$this->Db->update('role',array('rights'=>Zend_Json::encode($aRoles[$role])),$where);
		Context::setAcl($aRoles,'right');		
		return array('success'=>true);;
	}
	
	public function RevertDefault(){
		$where = 'type = 0';
		$this->Db->update('role',array('rights'=>''),$where);
		$this->acl->reInit();
		return array('success'=>true);;
	}
}