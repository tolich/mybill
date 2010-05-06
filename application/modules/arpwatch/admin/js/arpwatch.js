Ext.namespace('Ext.app.Arpwatch');

Ext.app.Arpwatch.Show = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Мониторинг IP/MAC на основе arpwatch',
		iconCls: 'arpwatch',
		disabled: App.isDeny('arpwatch', 'view'),
		handler: function(){
			App.getModule('arpwatch').onShow();
		}
	}, config));
}

Ext.app.Arpwatch.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('arpwatch', 'view'),
		handler: function(){
			App.getModule('arpwatch').onRefresh();
		}
	}, config));
}

//Ext.app.Arpwatch.Delete = function(config){
//	return new Ext.Action(Ext.apply({
//		text: 'Удалить зависшую сессию',
//	    iconCls: 'session-delete',
//		disabled: App.isDeny('arpwatch', 'delete'),
//		handler: function(){
//			App.getModule('arpwatch').onDelete();
//		}
//	},config));
//}
//
//Ext.app.Arpwatch.Close = function(config){
//	return new Ext.Action(Ext.apply({
//		text: 'Отключить пользователя',
//	    iconCls: 'session-close',
//		disabled: App.isDeny('arpwatch', 'submit'),
//		handler: function(){
//			App.getModule('arpwatch').onClose();
//		}
//	},config));
//}

Ext.app.Arpwatch.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Мониторинг IP/MAC'
	    ,iconCls: 'arpwatch'
		,disabled: App.isDeny('arpwatch', 'view')
		,handler: function(){
			App.getModule('arpwatch').onList();
		}
	},config));
}

Ext.app.Arpwatch.Tab = function(){
	Ext.getCmp('info-tabpanel').add({
		id:'arpwatch-grid-tab'
		,title: 'Мониторинг IP/MAC'
		,closable:true
		,iconCls:'arpwatch'
		,xtype: 'arpwatchgrid'
	});
	Ext.getCmp('info-tabpanel').setActiveTab('arpwatch-grid-tab');
};

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'arpwatch'
    ,onInit: function(){
		this.uid = Ext.id();
		App.addModuleMenuItem(this.moduleId, Ext.app.Arpwatch.Show);
	}
	,onShow: function(){
		this.winList();
	}
	,onList: function(){
		this.winList();
	}
	,onRefresh:function(){
		if (Ext.getCmp('arpwatch-grid'))
			Ext.getCmp('arpwatch-grid').getStore().reload();
		if (Ext.getCmp('arpwatch-grid-tab'))
			Ext.getCmp('arpwatch-grid-tab').getStore().reload();
	}
//	,onClose:function(){
//		Ext.Msg.show({
//			title:'Подтверждение',
//			msg: 'Вы действительно хотите отключить пользователя <b>' + this.getContext().username + '?</b>',
//			buttons: Ext.MessageBox.YESNO,
//			icon: Ext.MessageBox.QUESTION,
//			width: '300',
//			scope: this,
//			fn: function(btn){
//				if (btn == 'yes') {
//					App.request({
//						url : '/ajax/arpwatch/close'
//						,success: function(r, o){
//							this.onRefresh();
//						}
//						,params: {id: this.getContext().id}
//						,scope: this
//					});
//				}
//			}
//		})
//	}
//	,onDelete:function(){
//		Ext.Msg.show({
//			title:'Подтверждение',
//			msg: 'Вы действительно хотите удалить информацию о сессии  <b>' + this.getContext().acctsessionid + '?</b>',
//			buttons: Ext.MessageBox.YESNO,
//			icon: Ext.MessageBox.QUESTION,
//			width: '300',
//			scope: this,
//			fn: function(btn){
//				if (btn == 'yes') {
//					App.request({
//						url : '/ajax/arpwatch/delete'
//						,success: function(r, o){
//							if (Ext.getCmp('arpwatch-grid'))
//								Ext.getCmp('arpwatch-grid').getStore().reload();
//							if (Ext.getCmp('arpwatch-grid-tab'))
//								Ext.getCmp('arpwatch-grid-tab').getStore().reload();
//						}
//						,params: {id: this.getContext().id}
//						,scope: this
//					});
//				};
//			}
//		})
//	}
	,winList : function(){ //winList
		var win = Ext.getCmp('win_arpwatchlist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Мониторинг IP/MAC',
				id: 'win_arpwatchlist',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true	
				,modal: true
				,tools:[{
					id:'down'
					,handler:function(){
						win.close();
						Ext.app.Arpwatch.Tab();
					}
				}]
				,items: [{
					//title: 'Подробно'
					xtype: 'arpwatchgrid'
					,id: 'arpwatch-grid'
				}]
			});
		}
		win.show();
	}//end winList
}));

Ext.app.Arpwatch.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
        this.uid = Ext.id();
//		function username(v, p, r){
//	        p.attr = 'ext:qtip="'+
//				r.get('surname')+' '+r.get('name')+'<br>'+r.get('address')+'"';
//            return v;
//        }
		
		// create the Data Store
		var pageLimit = 50;
		var store = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy({
				url: App.proxy('/ajax/modules/arpwatch/act/getlist')
			}),
			reader: new Ext.data.JsonReader({
				root: 'data',
				totalProperty: 'totalCount',
				fields:
				[
                    'id',{name:'datecreate', type:'date', dateFormat:'Y-m-d H:i:s'},'datelog','source','event','ip','newmac','oldmac'
				]
				,id: 'id'
			})
			,remoteSort: true
			,groupField: 'source'
			,sortInfo:{field:'id', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});

		var arrower = new Ext.ux.grid.RowArrower();

		var filters = new Ext.ux.grid.GridFilters({
		  filters:[
		    {type: 'string',  	dataIndex: 'id'},
		    {type: 'string',  	dataIndex: 'datelog'},
		    {type: 'string',  	dataIndex: 'source'},
		    {
		      type: 'list',  
              dataIndex: 'event',
		      //options: [],
			  store: new Ext.data.JsonStore({
			  	url: App.proxy('/ajax/modules/arpwatch/act/getevents')
			  	,fields: ['id', 'text']
				,id:'id'
			  }),
		      phpMode: true
            },
		    {type: 'string', 	dataIndex: 'ip'},
		    {type: 'string', 	dataIndex: 'newmac'},
		    {type: 'string', 	dataIndex: 'oldmac'},
		    {type: 'date',  	dataIndex: 'datecreate'}
		]});
	
		this.on('filterupdate', function(){
			var filtered = false;
			this.filters.filters.each(function(filter) {
				if(filter.active) {
					filtered = true;
					return false;
				};
			});
			Ext.getCmp(this.uid+'arpwatch-clear-filter').setDisabled(!filtered);
		});

        var cellTips = new Ext.ux.plugins.grid.CellToolTips({
            ajaxTips:[{
                field: 'ip',
                tpl: ['<table>', 
                      '<tr valign="top"><td align="right">IP:</td><td><b>{ip}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Логин:</td><td><b>{username}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Имя, фамилия:</td><td><b>{name}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Адрес:</td><td><b>{address}</b></td></tr>', 
                      '<tr valign="top"><td align="right">MAC:</td><td><b>{mac}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Последнее подключение:</td><td><b>{inet}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Подключался с:</td><td><b>{station}</b></td></tr>', 
                      '</table>'],
                url: '/ajax/modules/arpwatch/act/getiptips'
            },{
                field: 'newmac',
                tpl: ['<table>', 
                      '<tr valign="top"><td align="right">MAC:</td><td><b>{newmac}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Закреплен за пользователями:</td><td><b>{username}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Подключались пользователи:</td><td><b>{inet}</b></td></tr>', 
                      '</table>'],
                url: '/ajax/modules/arpwatch/act/getnewmactips'
            },{
                field: 'oldmac',
                tpl: ['<table>', 
                      '<tr valign="top"><td align="right">MAC:</td><td><b>{oldmac}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Закреплен за пользователями:</td><td><b>{username}</b></td></tr>', 
                      '<tr valign="top"><td align="right">Подключались пользователи:</td><td><b>{inet}</b></td></tr>', 
                      '</table>'],
                url: '/ajax/modules/arpwatch/act/getoldmactips'
            }]
            ,tipConfig: {
                title: 'Дополнительная информация',
                anchor: 'left',
                autoHide: false,
                closable: true,
                width: 400
            }
        });

		var cm = new Ext.grid.ColumnModel([arrower
		,{
			id: 'id'
			,header: "id"
			,dataIndex: 'id'
			,hidden: true
		}, {
			id: 'datecreate'
			,header: "Дата обработки"
			,dataIndex: 'datecreate'
			,align: 'center'
            ,width: 150
			,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
		}, {
			id: 'datelog'
			,header: "Дата обнаружения"
			,dataIndex: 'datelog'
            ,width: 150
		}, {
			id: 'source'
			,header: "Сервер"
			,dataIndex: 'source'
		}, {
			id: 'event'
			,header: "Событие"
			,dataIndex: 'event'
            ,width: 250
		}, {
			id: 'ip'
			,header: "IP Адрес"
			,dataIndex: 'ip'
		}, {
			id: 'newmac'
			,header: "Новый MAC"
			,dataIndex: 'newmac'
		}, {
			id: 'oldmac'
			,header: "Старый MAC"
			,dataIndex: 'oldmac'
		}]);
		
		cm.defaultSortable = true;

        Ext.apply(this, {
			margins: '0 5 5 0'
			,store: store
			,cm:cm
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
//				,listeners: {
//					'rowselect': function(m,i,row){
//						App.setContext('arpwatch',{
//							id: row.get('acctuniqueid')
//							,acctsessionid: row.get('acctsessionid')
//							,username: row.get('username')
//						});
//					}
//				}
			})
			,view: new Ext.grid.GroupingView({
				groupByText: 'Группировать по этому полю',
				showGroupsText: 'Отображать по группам',
				//forceFit: true,
				groupTextTpl: '{text} ({[values.rs.length]} {["сессий"]})',
 				onLoad: Ext.emptyFn
			})
			,plugins:[arrower,filters,cellTips]
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,tbar:[{
				text: 'Очистить фильтр'
				,id: this.uid+'arpwatch-clear-filter'
				,handler: function(){
					filters.clearFilters();
				}
				,disabled: true
				,scope:this
			}]
			,bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				plugins: filters,
				displayInfo: true
			})
		});
        Ext.app.Arpwatch.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Ext.app.Arpwatch.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
		'rowcontextmenu':function(g, rowIndex, e){
			var sm = g.getSelectionModel();
			sm.selectRow(rowIndex);
			if (sm.hasSelection()) {
				var row = sm.getSelected();
				sm.fireEvent('rowselect', sm,rowIndex,row);
			}
			var rowcmenu = new Ext.menu.Menu([
				Ext.app.Arpwatch.Refresh()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Arpwatch.Refresh()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('arpwatchgrid', Ext.app.Arpwatch.Grid);
