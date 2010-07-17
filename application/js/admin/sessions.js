Ext.namespace('Ext.app.Sessions');

Ext.app.Sessions.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('sessions', 'view'),
		handler: function(){
			App.getModule('sessions').onRefresh();
		}
	}, config));
}

Ext.app.Sessions.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить зависшую сессию',
	    iconCls: 'session-delete',
		disabled: App.isDeny('sessions', 'delete'),
		handler: function(){
			App.getModule('sessions').onDelete();
		}
	},config));
}

Ext.app.Sessions.Close = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Отключить пользователя',
	    iconCls: 'session-close',
		disabled: App.isDeny('sessions', 'submit'),
		handler: function(){
			App.getModule('sessions').onClose();
		}
	},config));
}

Ext.app.Sessions.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Активные сессии'
	    ,iconCls: 'session'
		,disabled: App.isDeny('sessions', 'view')
		,handler: function(){
			App.getModule('sessions').onList();
		}
	},config));
}

Ext.app.Sessions.Tab = function(){
	Ext.getCmp('info-tabpanel').add({
		id:'session-grid-tab'
		,title: 'Активные сессии'
		,closable:true
		,iconCls:'tab-link'
		,xtype: 'sessionsgrid'
	});
	Ext.getCmp('info-tabpanel').setActiveTab('session-grid-tab');
};

Ext.app.Sessions.BaseTab = function(){
	Ext.getCmp('base-panel').add({
		id:'session-grid-basetab'
		,title: 'Активные сессии'
		,closable:true
		,iconCls:'tab-link'
		,xtype: 'sessionsgrid'
	});
	Ext.getCmp('base-panel').setActiveTab('session-grid-basetab');
};

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'sessions'
	,onList: function(){
		this.winList();
	}
	,onRefresh:function(){
		if (Ext.getCmp('session-grid'))
			Ext.getCmp('session-grid').getStore().reload();
		if (Ext.getCmp('session-grid-tab'))
			Ext.getCmp('session-grid-tab').getStore().reload();
	}
	,onClose:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите отключить пользователя <b>' + this.getContext().username + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/sessions/close'
						,success: function(r, o){
							this.onRefresh();
						}
						,params: {id: this.getContext().id}
						,scope: this
					});
				}
			}
		})
	}
	,onDelete:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить информацию о сессии  <b>' + this.getContext().acctsessionid + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/sessions/delete'
						,success: function(r, o){
							if (Ext.getCmp('session-grid'))
								Ext.getCmp('session-grid').getStore().reload();
							if (Ext.getCmp('session-grid-tab'))
								Ext.getCmp('session-grid-tab').getStore().reload();
						}
						,params: {id: this.getContext().id}
						,scope: this
					});
				};
			}
		})
	}
	,winList : function(){ //winList
		var win = Ext.getCmp('win_sessionlist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Активные сессии',
				id: 'win_sessionlist',
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
						Ext.app.Sessions.Tab();
					}
				},{
					id:'up'
					,handler:function(){
						win.close();
						Ext.app.Sessions.BaseTab();
					}
				}]
				,items: [{
					//title: 'Подробно'
					xtype: 'sessionsgrid'
					,id: 'session-grid'
				}]
			});
		}
		win.show();
	}//end winList
}));

Ext.app.Sessions.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		function username(v, p, r){
	        p.attr = 'ext:qtip="'+
				r.get('surname')+' '+r.get('name')+'<br>'+r.get('address')+'"';
            return v;
        }
		
		// create the Data Store
		var pageLimit = 50;
		var store = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy({
				url: App.proxy('/ajax/sessions/grid')
			}),
			reader: new Ext.data.JsonReader({
				root: 'data',
				totalProperty: 'totalCount',
				fields:
				[
					  'acctsessionid','acctuniqueid','username','callingstationid',
					  'nasipaddress','iface','framedipaddress',{name:'acctstarttime',type:'date',dateFormat:'Y-m-d H:i:s'},
					  'acctinputoctets','acctoutputoctets','acctsessiontime','rateinput','rateoutput',
                      'name','surname','address','sluicename'
				]
				,id: 'acctsessionid'
			})
			,remoteSort: true
			,groupField: 'nasipaddress'
			,sortInfo:{field:'username', direction:'asc'}
			,baseParams: {limit:pageLimit}
		});

		var arrower = new Ext.ux.grid.RowArrower();

		var filters = new Ext.ux.grid.GridFilters({
		  filters:[
		    {type: 'string',  	dataIndex: 'acctsessionid'},
		    {type: 'string',  	dataIndex: 'acctuniqueid'},
		    {type: 'string',  	dataIndex: 'username'},
		    {type: 'string', 	dataIndex: 'callingstationid'},
		    {type: 'string', 	dataIndex: 'nasipaddress'},
		    {type: 'string', 	dataIndex: 'iface'},
		    {type: 'string', 	dataIndex: 'framedipaddress'},
		    {type: 'date',  	dataIndex: 'acctstarttime'},
		    {
		      type: 'list',  
		      dataIndex: 'sluicename', 
		      //options: [],
			  store: new Ext.data.JsonStore({
			  	url: App.proxy('/ajax/sluices/filter')
			  	,fields: ['id', 'text']
				,id:'id'
			  }),
		      phpMode: true
		    }
		]});
	
		this.on('filterupdate', function(){
			var filtered = false;
			this.filters.filters.each(function(filter) {
				if(filter.active) {
					filtered = true;
					return false;
				};
			});
			Ext.getCmp('sessions-clear-filter').setDisabled(!filtered);
		});

		var cm = new Ext.grid.ColumnModel([arrower
		,{
			id: 'username'
			,header: "Пользователь"
			,dataIndex: 'username'
			,width: 150
            ,renderer: username
		}, {
			id: 'callingstationid'
			,header: "Клиентская станция"
			,dataIndex: 'callingstationid'
			,width: 250
			,align: 'center'
		}, {
			id: 'framedipaddress'
			,header: "IP"
			,dataIndex: 'framedipaddress'
			,align: 'center'
		}, {
			id: 'sluicename'
			,header: "Шлюз"
			,dataIndex: 'sluicename'
		}, {
			id: 'acctstarttime'
			,header: "Начало сессии"
			,dataIndex: 'acctstarttime'
			,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
			,width: 150
			,align: 'center'
		}, {
			id: 'acctsessiontime'
			,header: "Длительность"
			,dataIndex: 'acctsessiontime'
			,renderer: function(v){
				var d = Math.floor(v/86400);
				var h = Math.floor((v-d*86400)/3600);
				var m = Math.floor((v-d*86400-h*3600)/60);
				var s = v-d*86400-h*3600-m*60;
				return (d!=0?d+" дн ":"")+(h!=0?h+" ч ":"")+(m!=0?m+" мин ":"")+s+" сек"
			}
			,width: 170
			,align: 'center'
		}, {
			id: 'acctoutputoctets'
			,header: "Принято"
			,dataIndex: 'acctoutputoctets'
			,renderer: function(v){
				return Ext.util.Format.fileSize(v)
			}
			,width: 100
			,align: 'center'
		}, {
			id: 'acctinputoctets'
			,header: "Отправлено"
			,dataIndex: 'acctinputoctets'
			,renderer: function(v){
				return Ext.util.Format.fileSize(v)
			}
			,width: 100
			,align: 'center'
		}, {
			id: 'rateinput'
			,header: "Средняя вх. скорость"
			,dataIndex: 'rateinput'
			,renderer: function(v,p,r){
				return Ext.util.Format.rateSpeed(v)
			}
			,width: 200
			,align: 'center'
		}, {
			id: 'rateoutput'
			,header: "Средняя исх. скорость"
			,dataIndex: 'rateoutput'
			,renderer: function(v,p,r){
				return Ext.util.Format.rateSpeed(v)
			}
			,width: 200
			,align: 'center'
		}, {
			id: 'nasipaddress'
			,header: "NAS"
			,dataIndex: 'nasipaddress'
			,align: 'center'
		}, {
			id: 'iface'
			,header: "Интерфейс"
			,dataIndex: 'iface'
			,align: 'center'
		}, {
			id: 'acctuniqueid'
			,header: "ID сессии"
			,dataIndex: 'acctuniqueid'
			,width: 150
		}, {
			id: 'acctsessionid'
			,header: "Код сессии"
			,dataIndex: 'acctsessionid'
			,width: 150
		}]);
		
		cm.defaultSortable = true;

        Ext.apply(this, {
			margins: '0 5 5 0'
			,store: store
			,cm:cm
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
				,listeners: {
					'rowselect': function(m,i,row){
						App.setContext('sessions',{
							id: row.get('acctuniqueid')
							,acctsessionid: row.get('acctsessionid')
							,username: row.get('username')
						});
					}
				}
			})
			,view: new Ext.grid.GroupingView({
				groupByText: 'Группировать по этому полю',
				showGroupsText: 'Отображать по группам',
				//forceFit: true,
				groupTextTpl: '{text} ({[values.rs.length]} {["сессий"]})',
 				onLoad: Ext.emptyFn
			})
			,plugins:[arrower,filters]
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,tbar:[{
				text: 'Очистить фильтр'
				,id: 'sessions-clear-filter'
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
        Ext.app.Sessions.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Ext.app.Sessions.Grid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Sessions.Refresh(),
				'-', 
				Ext.app.Sessions.Close(),
				'-', 
				Ext.app.Sessions.Delete()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Sessions.Refresh()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('sessionsgrid', Ext.app.Sessions.Grid);
