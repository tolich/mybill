Ext.namespace('Ext.app.Sluices');

Ext.app.Sluices.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('sluices', 'view'),
		handler: function(){
			App.getModule('sluices').onRefresh();
		}
	}, config));
}

Ext.app.Sluices.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить',
	    iconCls: 'sluice-add',
		disabled: App.isDeny('sluices', 'add'),
		handler: function(){
			App.getModule('sluices').onAdd();
		}
	},config));
}

Ext.app.Sluices.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить',
	    iconCls: 'sluice-delete',
		disabled: App.isDeny('sluices', 'delete'),
		handler: function(){
			App.getModule('sluices').onDelete();
		}
	},config));
}

Ext.app.Sluices.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить',
	    iconCls: 'sluice-edit',
		disabled: App.isDeny('sluices', 'edit'),
		handler: function(){
			App.getModule('sluices').onEdit();
		}
	},config));
}

Ext.app.Sluices.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Шлюзы'
	    ,iconCls: 'sluice'
		,disabled: App.isDeny('sluices', 'view')
		,handler: function(){
			App.getModule('sluices').onList();
		}
	},config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'sluices'
	,onAdd:function(){
		this.setContext({
			mode 		: 0 // Добавление
			,sluicename : 'Новый шлюз'
			,sluiceval	: ''
		});
		this.winSluice();
	}
	,onList: function(){
		this.winList();
	}
	,onRefresh:function(){
		Ext.getCmp('sluice-grid').getStore().reload();
	}
	,onEdit:function(){
		this.applyContext({mode : 1});
		this.winSluice();
	}
	,onDelete:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить шлюз  <b>' + this.getContext().sluicename + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/sluices/delete'
						,success: function(r, o){
							Ext.getCmp('sluice-grid').getStore().reload();
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
		var win = Ext.getCmp('win_sluicelist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Справочник шлюзов',
				id: 'win_sluicelist',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true	
				,modal: true
				,items: [{
					//title: 'Подробно'
					xtype: 'sluicesgrid',
					id: 'sluice-grid'
				}]
			});
		}
		win.show();
	}//end winList
	,winSluice: function(){
		var z = this.getContext();
		var win = Ext.getCmp('win_sluice');
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
					id: 'sluicename'
					,fieldLabel: 'Наименование'
					,value : z.sluicename
				},{
					id: 'sluiceval'
					,fieldLabel: 'Алиас'
					,value : z.sluiceval
				}]
			});
			var form = formPanel.getForm();
			var win = new Ext.Window({
				id: 'win-sluice',
				layout: 'fit',
				width: 400,
				height: 150,
				minWidth: 400,
				minHeight: 150,
				modal: true,
				items: formPanel,
				title: z.mode==0?'Новый шлюз':'Свойства шлюза - ' + z.sluicename,
				buttons: [{
					text: 'Ok',
					handler: function(){
						if (form.isValid()) {
							var post = {
								sluicename: ''
								,sluiceval: ''
							};
							for (o in post) 
								if (Ext.getCmp(o)) 
									post[o] = Ext.getCmp(o).getValue();
							if (z.mode==1)
								post.id = z.id;
							App.request({
								url: z.mode==0?'/ajax/sluices/add':'ajax/sluices/edit',
								success: function(r, o){
									win.hide();
									win.destroy();
									Ext.getCmp('sluice-grid').getStore().reload();
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

Ext.app.Sluices.Grid = Ext.extend(Ext.grid.GridPanel, {
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
			url: App.proxy('/ajax/sluices/grid')
			,fields:['id', 'sluicename', 'sluiceval']
			,remoteSort: true
			,sortInfo:{field:'sluicename', direction:'asc'}
		});

		var arrower = new Ext.ux.grid.RowArrower();

		var cm = new Ext.grid.ColumnModel([arrower
		,{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			id: 'sluicename'
			,header: "Наименование"
			,dataIndex: 'sluicename'
		}, {
			header: "Алиас"
			,dataIndex: 'sluiceval'
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
						App.setContext('sluices',{
							id: row.get('id')
							,sluicename: row.get('sluicename')
							,sluiceval: row.get('sluiceval')
						});
					}
				}
			})
			,plugins:[arrower]
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,tbar: [
				Ext.app.Sluices.Add()
//				,'-'
//				,Ext.app.Sluices.Edit
			]
			,autoExpandColumn: 'sluicename'
			,viewConfig:{
				enableRowBody: true
				//,forceFit: true
//				,getRowClass: function(record, rowIndex, p, store){
//					if (record.data.del==1) {
//						return 'del-sluice-rows-class';
//					}
//					return 'sluice-rows-class';
//				}
			}
		});
        Ext.app.Sluices.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();

        Ext.app.Sluices.Grid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Sluices.Refresh(),
				'-', 
				Ext.app.Sluices.Add(),
				Ext.app.Sluices.Edit(), 
				'-', 
				Ext.app.Sluices.Delete()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Sluices.Refresh(),
				'-', 
				Ext.app.Sluices.Add()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('sluicesgrid', Ext.app.Sluices.Grid);
