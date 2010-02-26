Ext.namespace('Ext.app.Tasks');

Ext.app.Tasks.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Запланированные задачи',
		iconCls: 'task-link',
		disabled: App.isDeny('tasks', 'view'),
		handler: function(){
			App.getModule('tasks').onList();
		}
	}, config));
};

Ext.app.Tasks.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('tasks', 'view'),
		handler: function(){
			App.getModule('tasks').onRefresh();
		}
	}, config));
};

Ext.app.Tasks.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить'
	    ,iconCls: 'task-edit'
		,disabled: App.isDeny('tasks', 'edit')
		,handler: function(){
			App.getModule('tasks').onEdit();
		}
	},config));
};

Ext.app.Tasks.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить'
	    ,iconCls: 'task-delete'
		,disabled: App.isDeny('tasks', 'delete')
		,handler: function(){
			App.getModule('tasks').onDelete();
		}
	},config));
}

Ext.app.Tasks.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Запланировать...',
		iconCls: 'task-add',
		disabled: App.isDeny('tasks', 'add'),
		menu: [{
			text: "Отключить",
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('tasks').onAdd('Deactivate');
			}
		}, {
			text: "Включить",
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('tasks').onAdd('Activate');
			}
		}, {
			text: "Смена тарифа",
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('tasks').onAdd('Change-tariff');
			}
		}, {
			text: "Абонплата за день",
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('tasks').onAdd('Daily-fee');
			}
		}, {
			text: "Абонплата за месяц",
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('tasks').onAdd('Monthly-fee');
			}
		}, {
			text: "E-mail рассылка",
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('tasks').onAdd('Subscribe');
			}
		}]
	}, config));
}

//Грид выполненных задач
Ext.app.Tasks.DateGrid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var pageLimit = 50;
		
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/tasks/oldgrid')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields:['id', 'username', 'attribute', 'value', 'execresult',
			{
				name: 'opdate'
				,type: 'date'
				,dateFormat: 'Y-m-d H:i:s' //Date.patterns.ISO8601Long
			},{
				name: 'execdate'
				,type: 'date'
				,dateFormat: 'Y-m-d H:i:s' //Date.patterns.ISO8601Long
			}]
			,remoteSort: true
			,sortInfo:{field:'opdate', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});

		var cm = new Ext.grid.ColumnModel(
		[{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			id: 'opdate'
			,header: "Дата"
			,dataIndex: 'opdate'
			,width: 70
			,renderer: Ext.util.Format.dateRenderer()
		}, {
			id: 'attribute'
			,header: "Задача"
			,dataIndex: 'attribute'
		}, {
			id: 'username'
			,header: "Пользователь"
			,dataIndex: 'username'
		}, {
			id: 'value'
			,header: "Значение"
			,dataIndex: 'value'
			//,renderer: renderTariffName
		}, {
			id: 'opdate'
			,header: "Запланировано"
			,dataIndex: 'opdate'
			,width: 70
			,renderer: Ext.util.Format.dateRenderer()
		}, {
			id: 'execdate'
			,header: "Выполнено"
			,dataIndex: 'execdate'
			,width: 70
			,renderer: Ext.util.Format.dateRenderer()
		}, {
			id: 'execresult'
			,header: "Результат"
			,dataIndex: 'execresult'
		}]);
		
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
				enableRowBody: true
				,forceFit:true
				,getRowClass: function(record, rowIndex, p, store){
					if (record.data.status==0) {
						return 'new-payment-rows-class';
					}
					return 'payment-rows-class';
				}
			}
			,tbar: [
				'Пользователь:'
				,new Ext.ux.form.SearchField({
					store: store
					,value: this.query
				})
			]
			,bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
			
		});
        Ext.app.Tasks.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});
        Ext.app.Tasks.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
//	,listeners:{
//		'contextmenu':function(e){
//			var cmenu = new Ext.menu.Menu([Ext.app.Tasks.Refresh]);
//			e.stopEvent();
//			cmenu.render();
//			var xy = e.getXY();
//			cmenu.showAt(xy);
//		},
//		scope:this
//	}
});
Ext.reg('oldtaskgrid', Ext.app.Tasks.DateGrid);


//Грид новых задач
Ext.app.Tasks.Grid = Ext.extend(Ext.grid.GridPanel, {
    initComponent:function() {
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/tasks/grid')
//			,root: 'data'
//			,totalProperty: 'totalCount'
			,fields:['id', 'username', 'attribute', 'value', 'text','userid', 'valueid', 'period', 'periodid',
			{
				name: 'opdate'
				,type: 'date'
				,dateFormat: 'Y-m-d H:i:s' //Date.patterns.ISO8601Long
			}]
			,remoteSort: true
			,sortInfo:{field:'opdate', direction:'asc'}
			,baseParams: {query:''}
		});
		
		var cm = this.getCM();
		cm.defaultSortable = true;

        Ext.apply(this, {
			title: 'Задача не выбрана'
			,margins: '0 5 5 0'
			,store: store
			,cm:cm
			//,enableDragDrop: true
			//,enableDrop: true
			,ddGroup : 'GridDD'
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
				,listeners: {
					'rowselect': function(m,i,row){
						App.applyContext('tasks',{
							id			: row.get('id')
							,opdate		: row.get('opdate')
							,attribute	: row.get('attribute')
							,id_period		: row.get('periodid')
							,value		: row.get('valueid')
							//,username	: '' //row.get('username')
							,text		: row.get('text')
						});
					},
					'rowdeselect': function(m, i, row){
						//Ext.getCmp('intariff-grid').getStore().removeAll();						
					}										
				}
			})
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			//,autoExpandColumn: 'tariffname'
			,stripeRows: true
			,tbar: [
				new Ext.app.Tasks.Add()
				,'-', ' Пользователь:'
				,new Ext.ux.form.SearchField({
					store: store
					,value: this.query
					,params: function(){
						var context = App.getContext('tasks');
						var from = Ext.getCmp('from').getValue();
						var tail = Ext.getCmp('tail').getValue();
						return {
							attrname: context.task.attrname,
							from: Ext.util.Format.date(from, 'Y-m-d'),
							tail: Ext.util.Format.date(tail, 'Y-m-d')
						}
					}
				})
//				,Ext.app.Tariffs.Edit
			]
			,viewConfig:{
				enableRowBody: true
	            ,getRowClass: function(record, rowIndex, p, ds){
					//if (Ext.getCmp('tariff-grid').getSelectionModel().isSelected(rowIndex))
					//	return 'row-bold-class';
				}
				,forceFit: true
			}
		});
//		this.loadInTariff = function(rowIndex){
//			var row = this.getStore().getAt(rowIndex);
//			alert(row.get('id'));
//		}
        Ext.app.Tasks.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent
	
	,getCM : function(){
		switch (App.getContext('tasks').task.attrname){
			case 'Change-tariff':
				return new Ext.grid.ColumnModel(
				[{
					header: "id"
					,dataIndex: 'id'
					,hidden:true
				}, {
					id: 'opdate'
					,header: "Дата"
					,dataIndex: 'opdate'
					,renderer: Ext.util.Format.dateRenderer()
				}, {
					id: 'period'
					,header: "Период"
					,dataIndex: 'period'
		//		}, {
		//			id: 'attribute'
		//			,header: "Атрибут"
		//			,dataIndex: 'attribute'
				}, {
					id: 'username'
					,header: "Пользователь"
					,dataIndex: 'username'
				}, {
					id: 'value'
					,header: "Значение"
					,dataIndex: 'value'
					//,renderer: renderTariffName
				}]);
			break;
			case '%':
				return new Ext.grid.ColumnModel(
				[{
					header: "id"
					,dataIndex: 'id'
					,hidden:true
				}, {
					id: 'opdate'
					,header: "Дата"
					,dataIndex: 'opdate'
					,renderer: Ext.util.Format.dateRenderer()
				}, {
					id: 'period'
					,header: "Период"
					,dataIndex: 'period'
				}, {
					id: 'text'
					,header: "Задача"
					,dataIndex: 'text'
				}, {
					id: 'username'
					,header: "Пользователь"
					,dataIndex: 'username'
				}, {
					id: 'value'
					,header: "Значение"
					,dataIndex: 'value'
					//,renderer: renderTariffName
				}]);
			break;
//			case 'Subscribe':
//			case 'Monthly-fee':
			default:
				return new Ext.grid.ColumnModel(
				[{
					header: "id"
					,dataIndex: 'id'
					,hidden:true
				}, {
					id: 'opdate'
					,header: "Дата"
					,dataIndex: 'opdate'
					,renderer: Ext.util.Format.dateRenderer()
				}, {
					id: 'period'
					,header: "Период"
					,dataIndex: 'period'
				}, {
					id: 'username'
					,header: "Пользователь"
					,dataIndex: 'username'
				}]);
				return new Ext.grid.ColumnModel([]);
			break;
		}
	}
    ,onRender:function() {
		//this.store.load();
		var drop = new Ext.dd.DropTarget(this.container, {
            ddGroup : 'GridDD',
            notifyDrop : function(dd, e, data){
				for (o in e.target)
					//console.info(o + " " + e.target[o]);
					
            	//console.info(typeof(data) + " Droped on Grid")
				//debugger;
                if (typeof(data.node)!="undefined") {
                	//console.info('Someone dropped on me!\n' + data.node.id + " -> " + data.node.text);
                	return true; 
                	} else {
	                //console.info("Something else was droped - maybe a grid-row ?");
                }

            }
        });

		var context = App.getContext('tasks');
		var from = Ext.getCmp('from').getValue();
		var tail = Ext.getCmp('tail').getValue();
		this.store.reload({
			params: {
				attrname	: context.task.attrname
				,from		: Ext.util.Format.date(from, 'Y-m-d')
				,tail		: Ext.util.Format.date(tail, 'Y-m-d')
				//,query		: this.query
			}
			,callback: function(){
				if (context.task)
					this.setTitle(String.format('{0} c {1} по {2}', context.task.text, Ext.util.Format.date(from), Ext.util.Format.date(tail)));
				this.reconfigure(this.store, this.getCM());
			}
			,scope:this
		});

        Ext.app.Tasks.Grid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Tasks.Refresh(),
				'-', 
				Ext.app.Tasks.Add(),
				Ext.app.Tasks.Edit(),
				'-',
				Ext.app.Tasks.Delete()
			]);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Tasks.Refresh(),
				'-',
				Ext.app.Tasks.Add()
			]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
	,query: ''
});
Ext.reg('taskgrid', Ext.app.Tasks.Grid);


Ext.app.Tasks.Tree = Ext.extend(Ext.tree.TreePanel, {
	initComponent: function(){
		var cfg = {
			title: 'Доступные задачи'
			//,nodeId:0
			,border: false
			//,collapsible: true
			,cmargins: '0 0 0 0'
			,margins: '0 0 0 0'
			,layoutConfig: {
				animate: false
			}
//		    ,defaults: {
//		        bodyStyle: 'height:100%'
//		    }
			,loader: new Ext.tree.TreeLoader({
				dataUrl: App.proxy('/ajax/tasks/tree')
			})
			,rootVisible: true
			,lines: true
			,autoScroll: true
			,enableDD: true
			,ddGroup: 'GridDD'
			,dropConfig: {
				appendOnly:true
			}
			,containerScroll: true
			,root: new Ext.tree.AsyncTreeNode({
				id: '%'
				,text: 'Все задачи'
				,iconCls: 'task-tree-root'
			})
			,tools:[{
				id:'refresh'
				,handler: function(){
					var root = this.getRootNode();
					root.reload();
				}
				,scope: this
			}]
		};
		Ext.apply(this, cfg);
		Ext.apply(this.initialConfig, cfg);
		
        Ext.app.Tasks.Tree.superclass.initComponent.apply(this, arguments);
	}
	,reloadTasks: function(){
		var g = Ext.getCmp('task-grid');
		var context = App.getContext('tasks');
		var from = Ext.getCmp('from').getValue();
		var tail = Ext.getCmp('tail').getValue();
		g.store.reload({
			params: {
				attrname	: context.task.attrname
				,from		: Ext.util.Format.date(from, 'Y-m-d')
				,tail		: Ext.util.Format.date(tail, 'Y-m-d')
				//,query		: context.username
			}
			,callback: function(){
				if (context.task)
					g.setTitle(String.format('{0} c {1} по {2}', context.task.text, Ext.util.Format.date(from), Ext.util.Format.date(tail)));
				g.reconfigure(g.store, g.getCM());
			}
		});
	}
	,listeners: {
		'click': function(node,e){
			App.applyContext('tasks', {
				task: {
					attrname: node.id,
					text: node.text
				}
 			});
			this.reloadTasks();
		}
		,'afterrender':function(t){
			t.getNodeById('%').select();
		}
	}
});
Ext.reg('tasktree', Ext.app.Tasks.Tree);


App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'tasks'
	,onList: function(){
		App.applyContext('tasks', {
			username : ''
			,task: {
				attrname: '%',
				text: 'Все задачи'
			}
		});
		this.winList();
	}
	,onRefresh: function(){
		Ext.getCmp('task-grid').getStore().reload();
	}
	,onDelete:function(){
		var t = this.getContext();
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить задачу  <b>' + t.text + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/tasks/delete'
						,success: function(r, o){
							Ext.getCmp('task-grid').getStore().reload();
						},
						failure: function(){
						},
						params: {id: t.id}
						,scope: this
					});
				};
			}
		})
	}
	,onAdd:function(attr){
		switch (attr){
			case 'Monthly-fee':
				var period=3;
			break;
			case 'Subscribe':
				var period=2;
			break;
			default	:
				var period=1;
		}
		var opdate = Ext.getCmp('from').getValue();
		var t = this.getContext().task || {};
		this.setContext({
			mode 		: 0 // Добавление
			,username 	: ''
			,attribute	: attr
			,id_period	: period
			,value		: ''
			,opdate		: opdate
			,task		: t
		});
		this.winTask();
	}
	,onEdit:function(){
		this.applyContext({mode : 1});
		this.winTask();
	}
	,winTask : function(){ //winTask
		var t = this.getContext();
		var win = Ext.getCmp('win_task');
		if (win == undefined) {
			App.request({
				url: '/ajax/tasks/wintask'
				,params:{
					attr: t.attribute
				}
				,success: function(r, o){
					var res = Ext.decode(r.responseText);
					if (res.success) {
//						var attribute = new Ext.form.ComboBox({
//							store: new Ext.data.JsonStore({
//								fields: ['attrname', 'description']
//								,data: res.tasks
//							}),
//							loadMask: true,
//							valueField: 'attrname',
//							displayField: 'description',
//							id: 'attribute',
//							fieldLabel: 'Задача',
//							typeAhead: true,
//							mode: 'local',
//							triggerAction: 'all',
//							//valueNotFoundText: 'Не установлена!',
//							selectOnFocus: true,
//							allowBlank: false,
//							editable: false,
//							value: t.attribute
//							,listeners:{
//								select: function(c, r, i){
//									switch (r.get('attrname')){
//										case 'Change-tariff':
//											Ext.getCmp('value').setDisabled(false);
//										break;
//										default:
//											Ext.getCmp('value').setDisabled(true);
//										break;
//									}
//								}
//							}
//						});
			
						var username = new Ext.form.ComboBox({
							store: new Ext.data.JsonStore({
								url: App.proxy('/ajax/users/list')
								,fields: ['id', 'username']
								,root: 'data'
								,totalProperty: 'totalCount'
							}),
							loadMask: true,
							valueField: 'id',
							displayField: 'username',
							id: 'username',
							fieldLabel: 'Пользователь',
							typeAhead: false,
							triggerAction: 'all',
							//valueNotFoundText: 'Не установлена!',
							selectOnFocus: true,
							allowBlank: false,
							editable: true,
							value: t.username
							,pageSize: 20
							,minChars: 1
							,forceSelection: true
						});

						var formConfig = {
							frame: true
							,border: false
							//,bodyStyle: 'padding:0 0 10px 0'
					        ,defaultType: 'textfield'
							,labelWidth: 120
							,labelAlign: 'right'
					        ,defaults: {
								anchor: '95%',
					            allowBlank: false,
					            msgTarget: 'side'
					        }
						};

						var period = new Ext.form.ComboBox({
							store: new Ext.data.JsonStore({
								fields: ['id', 'periodname']
								,data: res.period
							})
							,loadMask: true
							,valueField: 'id'
							,displayField: 'periodname'
							,id: 'id_period'
							,fieldLabel: 'Период'
							,typeAhead: false
							,mode: 'local'
							,triggerAction: 'all'
							,selectOnFocus: true
							,allowBlank: false
							,value: t.id_period
							,forceSelection: true
						});
						
						switch (t.attribute){
							case 'Change-tariff':
								var value = new Ext.form.ComboBox({
									store: new Ext.data.JsonStore({
										fields: ['id', 'tariffname']
										,data: res.tariff
									})
									,loadMask: true
									,valueField: 'id'
									,displayField: 'tariffname'
									,id: 'value'
									,fieldLabel: 'Новое значение'
									,typeAhead: false
									,mode: 'local'
									,triggerAction: 'all'
									,selectOnFocus: true
									,allowBlank: false
									,value: t.value
									,forceSelection: true
								});

								Ext.apply(formConfig,
								{
									items: [{
										xtype: 'panel',
										html: '<b>Смена тарифа.</b> При смене тарифа вступают в силу настройки, заданные в справочнике тарифов.',
										cls: 'info-panel',
										anchor: '100%'
									}, {
										id: 'opdate',
										fieldLabel: 'Дата выполнения',
										xtype: 'datefield',
										value: t.opdate,
										format: 'd.m.Y'
									}, period, username, value]
								});
							break;
							case 'Monthly-fee':
								Ext.apply(formConfig,
								{
									items: [{
										xtype: 'panel',
										html: '<b>Абонплата.</b> С депозита клиента снимается сумма согласно тарифу и производится начисление бесплатных Мбайт.',
										cls: 'info-panel',
										anchor: '100%'
									}, {
										id: 'opdate',
										fieldLabel: 'Дата выполнения',
										xtype: 'datefield',
										value: t.opdate,
										format: 'd.m.Y'
									}, period, username]
								});
							break;
							case 'Daily-fee':
								Ext.apply(formConfig,
								{
									items: [{
										xtype: 'panel',
										html: '<b>Абонплата.</b> С депозита клиента снимается сумма согласно тарифу. Начисление бесплатных Мбайт не производится.',
										cls: 'info-panel',
										anchor: '100%'
									}, {
										id: 'opdate',
										fieldLabel: 'Дата выполнения',
										xtype: 'datefield',
										value: t.opdate,
										format: 'd.m.Y'
									}, period, username]
								});
							break;
							case 'Subscribe':
								Ext.apply(formConfig,
								{
									items: [{
										xtype: 'panel',
										html: '<b>E-mail рассылка.</b> Отправка состояния счета клиентам, у которых задан e-mail.',
										cls: 'info-panel',
										anchor: '100%'
									}, {
										id: 'opdate',
										fieldLabel: 'Дата выполнения',
										xtype: 'datefield',
										value: t.opdate,
										format: 'd.m.Y'
									}, period, username]
								});
							break;
							case 'Activate':
								Ext.apply(formConfig,
								{
									items: [{
										xtype: 'panel',
										html: '<b>Активация.</b> Разрешает доступ в Интернет.',
										cls: 'info-panel',
										anchor: '100%'
									}, {
										id: 'opdate',
										fieldLabel: 'Дата выполнения',
										xtype: 'datefield',
										value: t.opdate,
										format: 'd.m.Y'
									}, period, username]
								});
							break;
							case 'Deactivate':
								Ext.apply(formConfig,
								{
									items: [{
										xtype: 'panel',
										html: '<b>Деактивация.</b> Запрещает доступ в Интернет.',
										cls: 'info-panel',
										anchor: '100%'
									}, {
										id: 'opdate',
										fieldLabel: 'Дата выполнения',
										xtype: 'datefield',
										value: t.opdate,
										format: 'd.m.Y'
									}, period, username]
								});
							break;
						}	
			
						var formPanel = new Ext.FormPanel(formConfig);
						var form = formPanel.getForm();
			
						var win = new Ext.Window({
							title: t.mode==0?'Новая задача':'Свойства задачи - ' + t.text
							,id: 'win_task'
							,width: 415
							,height: 250
							,minWidth: 415
							,minHeight: 250
							,layout: 'fit'
							,modal: true
							,items:formPanel
							,buttons: [{
								text: 'Ok',
								handler: function(){
									if (form.isValid()) {
										var post = {
											username 	: ''
											,attribute	: t.attribute
											,id_period	: ''
											,value		: ''
											,opdate		: Ext.util.Format.date(Ext.getCmp('opdate').getValue(), 'Y-m-d')
										};
										for (o in post) 
											if (Ext.getCmp(o) && post[o]=='') 
												post[o] = Ext.getCmp(o).getValue();
										if (t.mode==1)
											post.id = t.id;
										App.request({
											url: t.mode==0?'/ajax/tasks/add':'ajax/tasks/edit',
											success: function(r, o){
												win.hide();
												win.destroy();
												if (t.attribute==t.task.attrname || t.task.attrname=='%')
													Ext.getCmp('task-grid').getStore().reload();
											},
											failure: function(){
											},
											params: post
										});
									}
									else{
										Ext.Msg.show({
										   title:'Ошибка',
										   msg: 'Заполнены не все поля!',
										   buttons: Ext.Msg.OK,
										   icon: Ext.MessageBox.INFO
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
				,scope: this
			});
		}
	}//end winTask
	,winUserList: function(){
		var win = Ext.getCmp('win_utasklist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Планировщик',
				id: 'win_utasklist',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				plain: true,
				modal: true,
				layout: 'fit',
				tbar:[
				'C',{
					xtype: 'datefield'
					,id: 'from'
					,value: new Date()
					,format: 'd.m.Y'
				}, ' по',{
					xtype: 'datefield'
					,id: 'tail'
					,value: new Date().add(Date.MONTH, 1)
					,format: 'd.m.Y'
				}],
				items: [{
					xtype: 'taskgrid',
					id: 'task-ugrid'
				}]
			});
		}
		win.show();
	}
	,winList: function(){
		var win = Ext.getCmp('win-task-list');
		var westWidth = Ext.isIE?359:358
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Планировщик',
				id: 'win-task-list',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				plain: true	
				,modal: true
				,layout: 'fit'
				,items:
				[{
					xtype: 'tabpanel'
					,border: false
					,activeTab: 0
					,items:
					[{
						layout: 'border'
						,title: 'Новые задачи'
						,items: 
						[{
							region: 'west'
							,title: 'Период просмотра'
							//,autoWidth: true
							,width: westWidth
							,split: true
							,collapsible: true
							,layout: 'fit'
							,items:
							[{
								layout: 'table'
								//,autoWidth: true
								,autoHeight: true
								,border: false
								//,title: 'Период просмотра'
								,layoutConfig:{
									columns: 2
								}
								,items:
								[{
									xtype: 'datepicker'
									,cellCls: 'cell-date-from'
									,id:'from'
									,listeners: {
										'select': function(){
											Ext.getCmp('task-tree').reloadTasks();
										}
									}
								}, {
									xtype: 'datepicker'
									,cellCls: 'cell-date-tail'
									,id:'tail'
									,listeners: {
										'select': function(){
											Ext.getCmp('task-tree').reloadTasks();
										}
									}
								}]
							},{
								xtype: 'tasktree'
								,id: 'task-tree'
							}]
						},{
							region: 'center'
							,xtype: 'taskgrid'
							,id: 'task-grid'
							,query: this.getContext().username
						}]
					},{	
						title: 'Выполненные'
						,xtype: 'oldtaskgrid'
						,query: this.getContext().username
					}]
				}]
			});
		}
		Ext.getCmp('tail').setValue(new Date().add(Date.MONTH, 1));
		//Ext.getCmp('task-tree').getNodeById('%').select();
		//Ext.getCmp('task-tree').fireEvent('click', Ext.getCmp('task-tree').getRootNode());
		win.show();
	}
}));
