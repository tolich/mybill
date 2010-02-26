/**
 * @author ToL
 */
Ext.SSL_SECURE_URL="/shared/icons/s.gif"; 
Ext.BLANK_IMAGE_URL="/shared/icons/s.gif";
Ext.ns('Ext.app.Layer');
Ext.app.Layer=function(){
	if (App.settings.users['info-panel']) {
		var height = App.settings.users['info-panel'].height || 200;
		var width = App.settings.users['info-panel'].width || 600;
		var info_collapsed = App.settings.users['info-panel'].info_collapsed || false;
		var log_collapsed = App.settings.users['info-panel'].log_collapsed || false;
	} else {
		var height = 200;
		var width = 600;
		var info_collapsed = false;
		var log_collapsed = false;
	}
	var info_tab_items = [{
		layout: 'column'
//		,bodyStyle: 'padding:10px'
		,iconCls:'tab-note'
//		,defaults:{
//			bodyStyle: 'padding:5px;font:10px verdana,tahoma,arial,sans-serif'
//		}
		,title: 'Заметки'
		,autoScroll: true
		,items:[App.emptyMod]
	}];
	if (App.settings.users['info-panel-items']) {
		for (var i = 0; i < App.settings.users['info-panel-items'].length; i++) {
			var p = App.settings.users['info-panel-items'][i];
			info_tab_items.push(p);
		}
	}
	return new Ext.Viewport({
		layout: 'border',
		items: [{
			region: 'north',
			//xtype: 'toolbar',
			//layout: 'fit',
			border:false,
			height: 0,
			margins: '0 0 0 0',
			tbar: [Ext.app.Users.Add(), 
			{
				text: 'Справочники',
				iconCls: 'table',
				menu: new Ext.menu.Menu({
					items: [
						Ext.app.Sluices.List(),
						'-',
						Ext.app.Nas.List(),
						'-',
						Ext.app.Pools.List(),
						'-',
						Ext.app.Zones.List(),
						Ext.app.Tariffs.List(),
						Ext.app.Tasks.List(),
						'-',
						Ext.app.Admin.List()
					]
				})
			},{
				text: 'Анализ',
				iconCls: 'report',
				menu: new Ext.menu.Menu({
					items: [
						Ext.app.Payments.List(),
						'-',
						Ext.app.Sessions.List()
					]
				})
//			}, {
//				text: '?',
//				menu: new Ext.menu.Menu({					
//					items: [Info.SysInfo]
//				})
			},{
				text: 'Модули',
				iconCls: 'plugin',
				menu: new Ext.menu.Menu({
					items: App.getModuleMenu()
				})
			},{
				text: 'Настройки',
				iconCls: 'settings',
				menu: new Ext.menu.Menu({
					items: 
					[
					Ext.app.Settings.PropertyWinMain()
					,'-'
					,Ext.app.Settings.PropertyWinBill()
					,'-'
					,Ext.app.Settings.PropertyWinFirm()
					,'-'
					,{
						text: 'Сохранить параметры списка пользователей',
						iconCls: 'savesettings',
						disabled: App.isDeny('auth', 'edit'),
						handler: function(){
							var mask = new Ext.LoadMask(Ext.getBody());
							mask.show();
							Ext.Ajax.request({
								url: '/ajax/auth/setsettings',
								callback: function(){
									mask.hide();
								},
								scope: this,
								params: {
									settings: App.setSettings()
								}
							});
						}
					},{
						text: 'Очистить параметры списка пользователей',
						iconCls: 'delsettings',
						disabled: App.isDeny('auth', 'delete'),
						handler: function(){
							var mask = new Ext.LoadMask(Ext.getBody());
							mask.show();
							Ext.Ajax.request({
								url: '/ajax/auth/delsettings',
								callback: function(){
									mask.hide();
								},
								scope: this
							});
						}
					}]
				})
			}, '->',  {
				text: 'Выход',
				iconCls: 'exit',
				handler: function(){
					if (App.mainsettings.save_settings==1){
						var mask = new Ext.LoadMask(Ext.getBody());
						mask.show();
						Ext.Ajax.request({
							url: '/ajax/auth/setsettings',
							callback: function(){
								mask.hide();
								Ext.Ajax.request({
									url: '/ajax/auth/unlogin',
									success: function(r, o){
										window.location = '/admin';
									}
								});
							},
							scope: this,
							params: {
								settings: App.setSettings()
							}
						});
					} else {					
						Ext.Ajax.request({
							url: '/ajax/auth/unlogin',
							success: function(r, o){
								window.location = '/admin';
							}
						});
					}
				}
			}]
		}, {
			id: 'user-grid',
			xtype: 'usergrid',
			region: 'center'
		}, {
			id: 'info-panel',
			title:'Инфо',
			region: 'south',
			split: true,
			collapsible: true,
			collapsed: info_collapsed,
			height: height,
			//margins: '0 5 5 0',
			layout: 'border',
			items:
			[{
				id: 'log-panel',
				title: 'События',
				region: 'east',
				split: true,
				width: width,
				collapsible: true,
				border:false,
				collapsed: log_collapsed,
        		items:[App.emptyMod]
			},{
				id: 'info-tabpanel',
				region: 'center',
				xtype: 'tabpanel',
				activeTab: App.settings.users['info-panel-active-tab']||0,
				layoutConfig: {
					animate: true
				},
				plugins: new Ext.ux.TabCloseMenu(),
				border:false,
				items: info_tab_items
			}]
		}]
	})
};
