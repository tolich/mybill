Ext.namespace('Ext.app.Pools');

Ext.app.Pools.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('pools', 'view'),
		handler: function(){
			App.getModule('pools').onRefresh();
		}
	}, config));
}

Ext.app.Pools.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить',
		iconCls: 'pool-add',
		disabled: App.isDeny('pools', 'add'),
		handler: function(){
			App.getModule('pools').onAdd();
		}
	}, config));
}

Ext.app.Pools.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить',
		iconCls: 'pool-delete',
		disabled: App.isDeny('pools', 'delete'),
		handler: function(){
			App.getModule('pools').onDelete();
		}
	}, config));
}

Ext.app.Pools.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить',
		iconCls: 'pool-edit',
		disabled: App.isDeny('pools', 'edit'),
		handler: function(){
			App.getModule('pools').onEdit();
		}
	}, config));
}

Ext.app.Pools.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Пулы IP адресов',
		iconCls: 'pool',
		disabled: App.isDeny('pools', 'view'),
		handler: function(){
			App.getModule('pools').onList();
		}
	}, config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'pools'
	,onAdd:function(){
		this.setContext({
			mode 		: 0 // Добавление
			,poolname : 'Новый пул'
			,poolval	: ''
		});
		this.winSluice();
	}
	,onList: function(){
		this.winList();
	}
	,onRefresh:function(){
		Ext.getCmp('pool-grid').getStore().reload();
	}
	,onEdit:function(){
		this.applyContext({mode : 1});
		this.winSluice();
	}
	,onDelete:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить пул  <b>' + this.getContext().poolname + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/pools/delete'
						,success: function(r, o){
							Ext.getCmp('pool-grid').getStore().reload();
						},
						failure: function(){
						},
						params: {id: this.getContext().id}
						,scope: this
					});
				};
			}
		})
	}
	,winList : function(){ //winList
		var win = Ext.getCmp('win_poollist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Справочник пулов',
				id: 'win_poollist',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true	
				,modal: true
				,items: [{
					//title: 'Подробно'
					xtype: 'poolsgrid',
					id: 'pool-grid'
				}]
			});
		}
		win.show();
	}//end winList
	,winSluice: function(){
		var z = this.getContext();
		var win = Ext.getCmp('win_pool');
		if (win == undefined) {
			var formPanel = new Ext.FormPanel({
				frame: true
				,bodyStyle: 'padding:10px'
		        ,defaultType: 'textfield'
				,labelAlign: 'right'
				,defaults: {
		            anchor: '95%',
		            allowBlank: false,
		            msgTarget: 'side'
		        }
				,items:
				[{
					id: 'poolname'
					,fieldLabel: 'Наименование'
					,value : z.poolname
				},{
					id: 'poolval'
					,fieldLabel: 'Алиас'
					,value : z.poolval
				}]
			});
			var form = formPanel.getForm();
			var win = new Ext.Window({
				id: 'win-pool',
				layout: 'fit',
				width: 400,
				height: 150,
				minWidth: 400,
				minHeight: 150,
				modal: true,
				items: formPanel,
				title: z.mode==0?'Новый пул':'Свойства пула - ' + z.poolname,
				buttons: [{
					text: 'Ok',
					handler: function(){
						if (form.isValid()) {
							var post = {
								poolname: ''
								,poolval: ''
							};
							for (o in post) 
								if (Ext.getCmp(o)) 
									post[o] = Ext.getCmp(o).getValue();
							if (z.mode==1)
								post.id = z.id;
							App.request({
								url: z.mode==0?'/ajax/pools/add':'ajax/pools/edit',
								success: function(r, o){
									win.hide();
									win.destroy();
									Ext.getCmp('pool-grid').getStore().reload();
								},
								failure: function(){
								},
								params: post
							});
						}
					}
				}, {
					text: 'Отмена',
					handler: function(){
						win.hide();
						win.destroy();
					}
				}]
			});
			win.show();
		}
	}
}));

Ext.app.Pools.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
//		function renderFullName(value, p, r){
//			return String.format('<div>{0} {1}</div>', 
//					r.data.surname, r.data.name);
//		}
//
//		function renderDate(value, p, r){
//			return Ext.util.Format.date(r.data.datepayment);
//		}
		
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/pools/grid')
			,fields:['id', 'poolname', 'poolval']
			,remoteSort: true
			,sortInfo:{field:'poolname', direction:'asc'}
		});

		var arrower = new Ext.ux.grid.RowArrower();

		var cm = new Ext.grid.ColumnModel([arrower
		,{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			id: 'poolname'
			,header: "Наименование"
			,dataIndex: 'poolname'
		}, {
			header: "Алиас"
			,dataIndex: 'poolval'
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
						App.setContext('pools',{
							id: row.get('id')
							,poolname: row.get('poolname')
							,poolval: row.get('poolval')
						});
					}
				}
			})
			,plugins:[arrower]
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,tbar: [
				Ext.app.Pools.Add()
//				,'-'
//				,Ext.app.Pools.Edit
			]
			,autoExpandColumn: 'poolname'
			,viewConfig:{
				enableRowBody: true
				//,forceFit: true
//				,getRowClass: function(record, rowIndex, p, store){
//					if (record.data.del==1) {
//						return 'del-pool-rows-class';
//					}
//					return 'pool-rows-class';
//				}
			}
		});
        Ext.app.Pools.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();

        Ext.app.Pools.Grid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Pools.Refresh(),
				'-', 
				Ext.app.Pools.Add(), 
				Ext.app.Pools.Edit(), 
				'-', 
				Ext.app.Pools.Delete()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Pools.Refresh(),
				'-', 
				Ext.app.Pools.Add()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('poolsgrid', Ext.app.Pools.Grid);
