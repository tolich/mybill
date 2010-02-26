/**
 * Персональный кабинет пользователя	
 */
Ext.SSL_SECURE_URL="/shared/icons/s.gif"; 
Ext.BLANK_IMAGE_URL="/shared/icons/s.gif";
Ext.ns('Ext.app.Layer');
Ext.app.Layer=function(){
	 return new Ext.Viewport({
			layout: 'border'
			,items: 
			[{
		        region: 'north'
		        //,xtype: 'toolbar'
				,border: false
				,margins: '0 0 5 0'
		        ,tbar:['->',{
		        	text: 'Выход'
		        	,iconCls: 'exit'
		        	,handler: function(){
		        		Ext.Ajax.request({
				        	url:'/ajax/auth/unlogin'
				        	,success: function(r, o){
				        		window.location = '/';
				        	}
		        		});
		        	}
		        }]
		    },{
				region: 'west'
				,id: 'west-panel'
				,title: 'Информация'
				,iconCls: 'information'
				,split: true
				,width: 320
				,minSize: 300
				,maxSize: 500
				,collapsible: true
				,margins: '0 0 5 5'
				,cmargins: '0 5 5 5'
				,bodyStyle: 'padding:5px'
				,defaults:{
					bodyStyle: 'background-color:#F8F8F8; padding:5px; font:11px verdana,tahoma,arial,sans-serif'
					,style: 'margin:0 0 5px 0'
				}
				,layoutConfig: {
					animate: true
				}
//				layout: 'fit',
				//split: true,
				,items:[{
					id: 'account'
					,title: 'Состояние счета'
					,collapsible: true
					,autoScroll: true
					,border: true
					,autoLoad:'/info/account'
					,iconCls: 'account'
					,tools:[
						{
						    id:'refresh',
						    qtip: 'Обновить',
						    handler: function(event, toolEl, panel){
						        panel.load('/info/account');
						    }
						}						
					]
				}, {
					id: 'personal'
					,title: 'Персональная'
					,collapsible: true
					,autoScroll: true
					,border: true
					,autoLoad:'/info/personal'
					,iconCls: 'personal'
					,tools:[
						{
						    id:'refresh',
						    qtip: 'Обновить',
						    handler: function(event, toolEl, panel){
						        panel.load('/info/personal');
						    }
						}						
					]
				},{
					id: 'tariff'
					,title: 'Информация о тарифе'
					,collapsible: true
					,autoScroll: true
					,border: true
					,autoLoad:'/info/tariff'
					,iconCls: 'tariff'
					,tools:[
						{
						    id:'refresh',
						    qtip: 'Обновить',
						    handler: function(event, toolEl, panel){
						        panel.load('/info/tariff');
						    }
						}						
					]
				},{
					id: 'message'
					,title: 'Сообщения'
					,collapsible: true
					,autoScroll: true
					,border: true
					,autoLoad:'/info/message'
					,iconCls: 'message'
					,tools:[
						{
						    id:'refresh',
						    qtip: 'Обновить',
						    handler: function(event, toolEl, panel){
						        panel.load('/info/message');
						    }
						}						
					]
				}]
		    },{
				region: 'center'
				,id: 'center-panel'
				,xtype: 'tabpanel'
				,activeTab: 0
				,margins: '0 5 5 0'
				,layoutConfig: {
					animate: true
				}
				,plugins: new Ext.ux.TabCloseMenu()
				,items:[{
					layout: 'column'
					,bodyStyle: 'padding:10px'
					,iconCls:'tab-general'
					,defaults:{
						bodyStyle: 'padding:0 0 0 5px;font:11px verdana,tahoma,arial,sans-serif'
					}
					,title: 'Общее'
					,autoScroll: true
					,items:[{
						columnWidth: 1
						,border: false
						,items:[{
							id: 'wellcome'
							,border: false
							,autoLoad: '/info/wellcome'
						},{
							id: 'modules'
							,border: false
							,autoLoad: {
								url: '/info/modules'
								,scripts: true
							}
						}]
					},{
						width: 220
						,border: false
						,autoLoad: '/info'
					}]
				}]
			} 	
		]
	})
};

