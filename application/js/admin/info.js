Ext.SSL_SECURE_URL="/shared/icons/s.gif"; 
Ext.BLANK_IMAGE_URL="/shared/icons/s.gif";

Ext.namespace('Info');
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

Info.SysInfo = new Ext.Action({
	text: 'Системная информация',
    iconCls: 'sys-info',
	handler: SysInfo
});

Info.MpdInfo = new Ext.Action({
	text: 'Сервер доступа',
    iconCls: 'mpd-info',
	handler: MpdInfo
});

function SysInfo(){
	var url = window.location.protocol+'//'+window.location.host+'/sysinfo/index.php?template=phpsysinfo&lang=ru'
	window.open(url);	
}

function MpdInfo(){
	var url = window.location.protocol+'//'+window.location.host+':5006'
	window.open(url);	
}
        