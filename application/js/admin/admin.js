Ext.namespace('Ext.app.Admin');

Ext.app.Admin.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('admin', 'view'),
		handler: function(){
			App.getModule('admin').onRefresh();
		}
	}, config));
}

Ext.app.Admin.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить',
	    iconCls: 'admin-add',
		disabled: App.isDeny('admin', 'add'),
		handler: function(){
			App.getModule('admin').onAdd();
		}
	},config));
}

Ext.app.Admin.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить',
	    iconCls: 'admin-delete',
		disabled: App.isDeny('admin', 'delete'),
		handler: function(){
			App.getModule('admin').onDelete();
		}
	},config));
}

Ext.app.Admin.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить',
	    iconCls: 'admin-edit',
		disabled: App.isDeny('admin', 'edit'),
		handler: function(){
			App.getModule('admin').onEdit();
		}
	},config));
}

Ext.app.Admin.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Администраторы'
	    ,iconCls: 'admin'
		,disabled: App.isDeny('admin', 'view')
		,handler: function(){
			App.getModule('admin').onList();
		}
	},config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'admin'
	,onAdd:function(){
		this.setContext({
			mode 		: 0 // Добавление
			,username 	: ''
			,wwwpassword	: ''
			,role		: 'guest'
		});
		this.winAdmin();
	}
	,onList: function(){
		this.winList();
	}
	,onRefresh:function(){
		Ext.getCmp('admin-grid').getStore().reload();
	}
	,onEdit:function(){
		this.applyContext({mode : 1});
		this.winAdmin();
	}
	,onDelete:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить администратора  <b>' + this.getContext().username + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/admin/delete'
						,success: function(r, o){
							Ext.getCmp('admin-grid').getStore().reload();
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
		var win = Ext.getCmp('win_adminlist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Справочник администраторов',
				id: 'win_adminlist',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true	
				,modal: true
				,items: [{
					//title: 'Подробно'
					xtype: 'admingrid',
					id: 'admin-grid'
				}]
			});
		}
		win.show();
	}//end winList
	,winAdmin: function(){
		var z = this.getContext();
		var win = Ext.getCmp('win_admin');
		if (win == undefined) {
			var formPanel = new Ext.FormPanel({
				frame: true
				,bodyStyle: 'padding:10px'
		        ,defaultType: 'textfield'
				,labelAlign: 'right'
				,defaults: {
		            anchor: '95%',
		            msgTarget: 'side'
		        }
				,items:
				[{
					id: 'username'
					,fieldLabel: 'Логин'
					,value : z.username
					,vtype:'alphanumdot'
				},{
					id: 'wwwpassword'
					,fieldLabel: 'Пароль'
					,inputType: 'password'
					,vtype:'alphanumdot'
				},{
					id: 'role'
					,fieldLabel: 'Роль'
					,xtype:'combo'
					,value : z.role
					,store: new Ext.data.JsonStore({
						url: '/ajax/admin/role'
						,fields: ['role', 'rolename']
						,data: z.mode==0?[]:[{role:z.role,rolename:z.rolename}]
					})
					,valueField: 'role'
					,displayField: 'rolename'
					,typeAhead: true
					,triggerAction: 'all'
					,valueNotFoundText: ''
					,selectOnFocus: true
					,allowBlank: true
					,editable: false
					,width: 127
				}]
			});
			var form = formPanel.getForm();
			var win = new Ext.Window({
				id: 'win-admin',
				layout: 'fit',
				width: 400,
				height: 180,
				minWidth: 400,
				minHeight: 180,
				modal: true,
				items: formPanel,
				title: z.mode==0?'Новый администратор':'Свойства администратора - ' + z.username,
				buttons: [{
					text: 'Ok',
					handler: function(){
						if (form.isValid()) {
							var post = {
								username	: ''
								,wwwpassword	: ''
								,role		: ''
							};
							for (o in post) 
								if (Ext.getCmp(o)) 
									post[o] = Ext.getCmp(o).getValue();
							if (z.mode==1)
								post.id = z.id;
							App.request({
								url: z.mode==0?'/ajax/admin/add':'ajax/admin/edit',
								success: function(r, o){
									win.close();
									Ext.getCmp('admin-grid').store.reload();
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

Ext.app.Admin.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/admin/grid')
			,fields:['id','username','wwwpassword',
				{
					name: 'lastlogin',
					type: 'date',
					dateFormat: 'Y-m-d H:i:s'
				}
				,'role','rolename']
			,remoteSort: true
			,sortInfo:{field:'username', direction:'asc'}
		});

		var arrower = new Ext.ux.grid.RowArrower();

		var cm = new Ext.grid.ColumnModel([arrower
		,{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			id: 'username'
			,header: "Администратор"
			,dataIndex: 'username'
		}, {
			id: 'role'
			,header: "Роль"
			,dataIndex: 'rolename'
		}, {
			id: 'lastlogin'
			,header: "Последний вход"
			,dataIndex: 'lastlogin'
			,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
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
						App.setContext('admin',{
							id: row.get('id')
							,username	: row.get('username')
							,role		: row.get('role')
							,rolename	: row.get('rolename')
						});
					}
				}
			})
			,plugins:[arrower]
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,tbar: [
				Ext.app.Admin.Add()
//				,'-'
//				,Ext.app.Admin.Edit
			]
//			,autoExpandColumn: 'description'
			,viewConfig:{
				enableRowBody: true
				,forceFit: true
//				,getRowClass: function(record, rowIndex, p, store){
//					if (record.data.del==1) {
//						return 'del-admin-rows-class';
//					}
//					return 'admin-rows-class';
//				}
			}
		});
        Ext.app.Admin.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();

        Ext.app.Admin.Grid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Admin.Refresh(),
				'-', 
				Ext.app.Admin.Add(),
				Ext.app.Admin.Edit(), 
				'-', 
				Ext.app.Admin.Delete()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Admin.Refresh(),
				'-', 
				Ext.app.Admin.Add()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('admingrid', Ext.app.Admin.Grid);
