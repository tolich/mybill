Ext.namespace('Ext.app.Nas');

Ext.app.Nas.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('nas', 'view'),
		handler: function(){
			App.getModule('nas').onRefresh();
		}
	}, config));
}

Ext.app.Nas.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить',
	    iconCls: 'nas-add',
		disabled: App.isDeny('nas', 'add'),
		handler: function(){
			App.getModule('nas').onAdd();
		}
	},config));
}

Ext.app.Nas.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить',
	    iconCls: 'nas-delete',
		disabled: App.isDeny('nas', 'delete'),
		handler: function(){
			App.getModule('nas').onDelete();
		}
	},config));
}

Ext.app.Nas.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить',
	    iconCls: 'nas-edit',
		disabled: App.isDeny('nas', 'edit'),
		handler: function(){
			App.getModule('nas').onEdit();
		}
	},config));
}

Ext.app.Nas.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Сервера доступа'
	    ,iconCls: 'nas'
		,disabled: App.isDeny('nas', 'view')
		,handler: function(){
			App.getModule('nas').onList();
		}
	},config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'nas'
	,onAdd:function(){
		this.setContext({
			mode 		: 0 // Добавление
			,nasname 	: ''
			,shortname	: ''
			,description: 'RADIUS Client'
            ,ipaddress  : ''
			,ports		: '5006'
			,username	: ''
			,password	: ''
		});
		this.winNas();
	}
	,onList: function(){
		this.winList();
	}
	,onRefresh:function(){
		Ext.getCmp('nas-grid').getStore().reload();
	}
	,onEdit:function(){
		this.applyContext({mode : 1});
		this.winNas();
	}
	,onDelete:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить NAS  <b>' + this.getContext().nasname + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/nas/delete'
						,success: function(r, o){
							Ext.getCmp('nas-grid').getStore().reload();
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
		var win = Ext.getCmp('win_naslist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Справочник NAS',
				id: 'win_naslist',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true	
				,modal: true
				,items: [{
					//title: 'Подробно'
					xtype: 'nasgrid',
					id: 'nas-grid'
				}]
			});
		}
		win.show();
	}//end winList
	,winNas: function(){
		var z = this.getContext();
		var win = Ext.getCmp('win_nas');
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
					id: 'nasname'
					,fieldLabel: 'Наименование'
					,value : z.nasname
				},{
					id: 'shortname'
					,fieldLabel: 'Алиас'
					,value : z.shortname
				},{
					id: 'ipaddress'
					,fieldLabel: 'IP адрес'
					,value : z.ipaddress
                    ,vtype: 'ip'
				},{
					id: 'ports'
					,fieldLabel: 'Порт'
					,value : z.ports
				},{
					id: 'username'
					,fieldLabel: 'Логин'
					,value : z.username
				},{
					id: 'password'
					,fieldLabel: 'Пароль'
					,inputType: 'password'
					,value : z.password
				},{
					id: 'description'
					,fieldLabel: 'Описание'
					,value : z.description
				}]
			});
			var form = formPanel.getForm();
			var win = new Ext.Window({
				id: 'win-nas',
				layout: 'fit',
				width: 400,
				height: 280,
				minWidth: 400,
				minHeight: 280,
				modal: true,
				items: formPanel,
				title: z.mode==0?'Новый NAS':'Свойства NAS - ' + z.nasname,
				buttons: [{
					text: 'Ok',
					handler: function(){
						if (form.isValid()) {
							var post = {
								nasname: ''
								,shortname	: ''
								,description: ''
                                ,ipaddress  : ''
								,ports		: ''
								,username	: ''
								,password	: ''
							};
							for (o in post) 
								if (Ext.getCmp(o)) 
									post[o] = Ext.getCmp(o).getValue();
							if (z.mode==1)
								post.id = z.id;
							App.request({
								url: z.mode==0?'/ajax/nas/add':'ajax/nas/edit',
								success: function(r, o){
									win.hide();
									win.destroy();
									Ext.getCmp('nas-grid').getStore().reload();
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

Ext.app.Nas.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/nas/grid')
			,fields:['id','nasname','shortname','description','ipaddress','ports','username','password']
			,remoteSort: true
			,sortInfo:{field:'nasname', direction:'asc'}
		});

		var arrower = new Ext.ux.grid.RowArrower();

		var cm = new Ext.grid.ColumnModel([arrower
		,{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			id: 'nasname'
			,header: "Наименование"
			,dataIndex: 'nasname'
			,width: 150
		}, {
			id: 'shortname'
			,header: "Алиас"
			,dataIndex: 'shortname'
			,width: 150
		}, {
			id: 'ipaddress'
			,header: "IP адрес"
			,dataIndex: 'ipaddress'
			,width: 150
		}, {
			id: 'ports'
			,header: "Порт"
			,dataIndex: 'ports'
			,width: 150
		}, {
			id: 'description'
			,header: "Описание"
			,dataIndex: 'description'
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
						App.setContext('nas',{
							id: row.get('id')
							,nasname: row.get('nasname')
							,shortname	: row.get('shortname')
							,description: row.get('description')
							,ipaddress	: row.get('ipaddress')
							,ports		: row.get('ports')
							,username	: row.get('username')
							,password	: row.get('password')
						});
					}
				}
			})
			,plugins:[arrower]
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,tbar: [
				Ext.app.Nas.Add()
			]
			,autoExpandColumn: 'description'
			,viewConfig:{
				enableRowBody: true
			}
		});
        Ext.app.Nas.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();

        Ext.app.Nas.Grid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Nas.Refresh(),
				'-', 
				Ext.app.Nas.Add(),
				Ext.app.Nas.Edit(), 
				'-', 
				Ext.app.Nas.Delete()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Nas.Refresh(),
				'-', 
				Ext.app.Nas.Add()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('nasgrid', Ext.app.Nas.Grid);
