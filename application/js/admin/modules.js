Ext.namespace('Ext.app.Modules');

Ext.app.Modules.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Управление модулями',
		iconCls: 'add-plugin',
		disabled: App.isDeny('modules', 'view'),
		handler: function(){
			App.getModule('modules').onList();
		}
	}, config));
}
Ext.app.Modules.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('modules', 'view'),
		handler: function(){
			App.getModule('modules').onRefresh();
		}
	}, config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'modules'
	,init: function(){
	}
	,onRefresh: function(){
		Ext.getCmp('modules-grid').getStore().reload();
	}
	,onList: function(){
		this.winList();	
	}
	,onDelete: function(id){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить модуль <b>'+id+'</b>?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '320',
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url: '/ajax/modules/deinstall',
						mask: 'Удаляем модуль...',
						success: function(r, o){
							Ext.Msg.show({
								title:'Подтверждение',
								msg: 'Чтобы изменения вступили в силу необходимо обновить страницу!',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.INFO,
								width: '330',
								fn: function(btn){
									if (btn == 'ok') {
										location.reload();
									};
								}
								,scope:this
							});
						},
						params: {
							name: id
						}
					});
				};
			}
		})
	}
	,onAdd: function(){
		this.winAdd();	
	}
	,winAdd: function(){
	    var formPanel = new Ext.FormPanel({
	        labelWidth: 170,
			labelAlign: 'top',
			frame: false,
	        bodyStyle:'padding:10px;',
	        defaultType: 'combo',
	        items: 
			[{
	            fieldLabel: 'Выберите модуль из списка доступных',
				store: new Ext.data.JsonStore({
					url: App.proxy('/ajax/modules/allow'),
					fields: ['name']
				}),
				id: 'cb-module',
				valueField:'name',
				displayField:'name',
				typeAhead: true,
				triggerAction: 'all',
				emptyText: 'Выберите модуль',
				selectOnFocus: true,
				allowBlank: true,
				editable: false,
				anchor: '-20px'
	        }]
	    });
		var form = formPanel.getForm();
		
	    var win = new Ext.Window({
	        title: 'Добавление модуля в систему',
	        width: 320,
	        height:150,
	        minWidth: 320,
	        minHeight: 150,
	        layout: 'fit',
	        plain:true,
	        items: formPanel,
			modal: true,
	        buttons: [{
	            text: 'Ок',
				handler: function(){
					if (form.isValid()) {
						Ext.Msg.show({
							title:'Подтверждение',
							msg: 'Модуль <b>'+Ext.getCmp('cb-module').getValue()+'</b> будет установлен в систему.<br>Продолжить?',
							buttons: Ext.MessageBox.YESNO,
							icon: Ext.MessageBox.QUESTION,
							width: '320',
							fn: function(btn){
								if (btn == 'yes') {
									win.hide();
									App.request({
										url: '/ajax/modules/install',
										mask: 'Устанавливаем модуль...',
										success: function(r, o){
											win.close();
											Ext.Msg.show({
												title:'Подтверждение',
												msg: 'Чтобы изменения вступили в силу необходимо обновить страницу!',
												buttons: Ext.MessageBox.OK,
												icon: Ext.MessageBox.INFO,
												width: '330',
												fn: function(btn){
													if (btn == 'ok') {
														location.reload();
													};
												}
												,scope:this
											});
										},
										failure: function(){
											win.show();
										},
										params: {
											name: Ext.getCmp('cb-module').getValue()												
										}
									});
								};
							}
						});
					}
				}
				,scope: this
	        },{
	            text: 'Отмена',
				handler: function(){
					win.close();
				}
	        }]
	    });
		win.show();
	}
	,winList : function(){ //winList
		var win = Ext.getCmp('modules-win-list');
		if (win == undefined) {
			var win = new Ext.Window({
				id: 'modules-win-list'
				,title: 'Управление дополнительными модулями'
				,width: 800
				,height: 500
				,minWidth: 380
				,minHeight: 280
				,layout: 'fit'
				,plain: true		
				,modal: true
				,items: [{
					xtype: 'modulesgrid'
					,id: 'modules-grid'
				}]
			});
		}
		win.show();
	}//end winList
}));

// Modules grid
Ext.app.Modules.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var pageLimit = 50;
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/modules/list')
			,fields:['name','status','author','description']
			,remoteSort: true
			,sortInfo:{field:'name', direction:'asc'}
			,id: 'name'
		});
		
//		var filters = new Ext.grid.GridFilters({
//		  filters:[
//		    {type: 'numeric',  	dataIndex: 'id'},
//		    {type: 'date',  	dataIndex: 'datecreate'},
//		    {type: 'string',  	dataIndex: 'code'},
//		    {type: 'numeric',  	dataIndex: 'nominal'}
//		].concat(this.status==Ext.app.Paycard.Status['activate']
//		?[
//			{type: 'date',		dataIndex: 'dateactivate'},
//			{type: 'string',	dataIndex: 'username'}
//		]:[])});

		var actions = new Ext.ux.grid.RowActions({
			header: '',
			keepSelection: true,
			actions: [{
				iconCls: 'delete-plugin',
				tooltip: 'Удалить модуль',
				callback: function(grid, record, action, rowIndex, colIndex){
					this.onDelete(record.id);
				}.createDelegate(App.getModule('modules'))
			}]
		});
		
		var cm = new Ext.grid.ColumnModel([
		{
			header: "Наименование"
			,dataIndex: 'name'
		},{
			header: "Автор"
			,dataIndex: 'author'
		},{
			header: "Описание"
			,dataIndex: 'description'
		},actions]);
		
		cm.defaultSortable = true;

        Ext.apply(this, {
			margins: '0 5 5 0'
			,store: store
			,cm:cm
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
			})
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,viewConfig:{
				forceFit:true
				,emptyText: 'Нет установленных модулей'
			}
			,plugins: [actions]
			,tbar: [
//			'Поиск: ', 
//				new Ext.app.SearchField({
//					store: store,
//					width: 220
//				}),
			{
				text: 'Добавить модуль',
				iconCls: 'add-plugin',
				handler: function(){
					App.getModule('modules').onAdd();
				}
			}]
//			,bbar: new Ext.PagingToolbar({
//				pageSize: pageLimit,
//				store: store,
//				displayInfo: true
//			})
			
		});
        Ext.app.Modules.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();
        Ext.app.Modules.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
		'rowcontextmenu':function(g, rowIndex, e){
			var sm = g.getSelectionModel();
			var rowcmenu = new Ext.menu.Menu([Ext.app.Modules.Refresh()]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([Ext.app.Modules.Refresh()]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('modulesgrid', Ext.app.Modules.Grid);

