Ext.namespace('Ext.app.Zones');

Ext.app.Zones.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('zones', 'view'),
		handler: function(){
			App.getModule('zones').onRefresh();
		}
	}, config));
}

Ext.app.Zones.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить',
		iconCls: 'zone-add',
		disabled: App.isDeny('zones', 'add'),
		handler: function(){
			App.getModule('zones').onAdd();
		}
	}, config));
}

Ext.app.Zones.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить',
		iconCls: 'zone-delete',
		disabled: App.isDeny('zones', 'delete'),
		handler: function(){
			App.getModule('zones').onDelete();
		}
	}, config));
}

Ext.app.Zones.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить',
		iconCls: 'zone-edit',
		disabled: App.isDeny('zones', 'edit'),
		handler: function(){
			App.getModule('zones').onEdit();
		}
	}, config));
}

Ext.app.Zones.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Зоны',
		iconCls: 'zone',
		disabled: App.isDeny('zones', 'view'),
		handler: function(){
			App.getModule('zones').onList();
		}
	}, config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'zones'
	,onAdd:function(){
		this.setContext({
			mode 	: 0 // Добавление
			,zonename 	: 'Новая зона'
			,prio	: 0
		});
		this.winZone();
	}
	,onList: function(){
		this.winList();
	}
	,onRefresh:function(){
		Ext.getCmp('zone-grid').getStore().reload();
	}
	,onEdit:function(){
		this.applyContext({mode : 1});
		this.winZone();
	}
	,onDelete:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить зону  <b>' + this.getContext().zonename + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					Ext.Ajax.request({
						url : '/ajax/zones/delete'
						,success: function(r, o){
							var res = Ext.decode(r.responseText);
							if (res.success) {
								Ext.getCmp('zone-grid').getStore().reload();
							}
							else
							{
								switch(res.errors[0]['id']) {
									case 5:
										Ext.Msg.alert('Ошибка!', res.errors[0]['msg']);
										break;
								}
							}
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
		var win = Ext.getCmp('win_zonelist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Справочник зон',
				id: 'win_zonelist',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true	
				,modal: true
				,items: [{
					//title: 'Подробно'
					xtype: 'zonesgrid',
					id: 'zone-grid'
				}]
			});
		}
		win.show();
	}//end winList
	,winZone: function(){
		var z = this.getContext();
		var win = Ext.getCmp('win_zone');
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
					id: 'zonename'
					,fieldLabel: 'Наименование'
					,xtype:'textfield'
					,value : z.zonename
				},{
					id: 'prio'
					,fieldLabel: 'Приоритет'
					,xtype:'numberfield'
					,value : z.prio
				},{
					id: 'src',
					fieldLabel: 'Маска',
					xtype: 'textarea',
					value: z.src,
					vtype:'src',
					anchor: '95% -60'
				}]
			});
			var form = formPanel.getForm();
			var win = new Ext.Window({
				id: 'win-zone',
				layout: 'fit',
				width: 550,
				height: 400,
				minWidth: 550,
				minHeight: 400,
				modal: true,
				items: formPanel,
				title: z.mode==0?'Новая зона':'Свойства зоны - ' + z.zonename,
				buttons: [{
					text: 'Ok',
					handler: function(){
						if (form.isValid()) {
							var post = {
								zonename: ''
								,src: ''
								,prio: ''
							};
							if (z.mode==1)
								post.id = z.id;
							for (o in post) 
								if (Ext.getCmp(o)) 
									post[o] = Ext.getCmp(o).getValue();
							Ext.Ajax.request({
								url: z.mode==0?'/ajax/zones/add':'ajax/zones/edit',
								success: function(r, o){
									var res = Ext.decode(r.responseText);
									if (res.success) {
										win.hide();
										win.destroy();
										Ext.getCmp('zone-grid').getStore().reload();
									}
									else {
										Ext.Msg.alert('Ошибка!', res.errors[0]['msg']);
									}
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

Ext.app.Zones.Grid = Ext.extend(Ext.grid.GridPanel, {
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
		function renderSrc(value, p, r){
			return Ext.util.Format.ellipsis(value, 100);
		};
			
		
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: '/ajax/zones/grid'
			,fields:['id', 'zonename', 'src', 'del', 'prio']
			,remoteSort: true
			,sortInfo:{field:'zonename', direction:'asc'}
		});

		var arrower = new Ext.ux.grid.RowArrower();

		var cm = new Ext.grid.ColumnModel([arrower
		,{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			id:'zonename'
			,header: "Наименование"
			,dataIndex: 'zonename'
			,width: 150
		}, {
			id:'src'
			,header: "Маска"
			,dataIndex: 'src'
			,renderer: renderSrc
		}, {
			header: "Приоритет"
			,dataIndex: 'prio'
			,width: 100
		}]);
		
		cm.defaultSortable = true;

        Ext.apply(this, {
			margins: '0 5 5 0'
			//title: 'Пользователи',
			,store: store
			,cm:cm
			,plugins:[arrower]
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
				,listeners: {
					'rowselect': function(m,i,row){
						App.setContext('zones',{
							id: row.get('id')
							,zonename: row.get('zonename')
							,src: row.get('src')
							,prio: row.get('prio')
						});
					}
				}
			})
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,tbar: [
				Ext.app.Zones.Add()
//				,'-'
//				,Ext.app.Zones.Edit
			]
			,autoExpandColumn: 'src'
			,viewConfig:{
				enableRowBody: true
				//,forceFit: true
//				,getRowClass: function(record, rowIndex, p, store){
//					if (record.data.del==1) {
//						return 'del-zone-rows-class';
//					}
//					return 'zone-rows-class';
//				}
			}
		});
        Ext.app.Zones.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();

        Ext.app.Zones.Grid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Zones.Refresh(),
				'-', 
				Ext.app.Zones.Add(), 
				Ext.app.Zones.Edit(), 
				'-', 
				Ext.app.Zones.Delete()
			]);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Zones.Refresh(),
				'-', 
				Ext.app.Zones.Add()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('zonesgrid', Ext.app.Zones.Grid);
