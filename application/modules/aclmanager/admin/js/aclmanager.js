Ext.namespace('Ext.app.Aclmanager');
Ext.app.Aclmanager.Show = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Права доступа',
		iconCls: 'aclmanager',
		disabled: App.isDeny('aclmanager', 'view'),
		handler: function(){
			App.getModule('aclmanager').onShow();
		}
	}, config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'aclmanager'
	,rightNewValues: new Ext.util.MixedCollection()
	,rightDefValues: []
	,onInit: function(){
		this.uid = Ext.id();
		App.addModuleMenuItem(Ext.app.Aclmanager.Show);
	}
	,onShow: function(){
		this.winList();
	}
	,winList : function(){ //winList
		var win = Ext.getCmp(this.uid+'win-list');
		if (win == undefined) {
			var win = new Ext.Window({
				id: this.uid+'win-list'
				,title: 'Управление правами доступа'
				,width: 800
				,height: 500
				,minWidth: 380
				,minHeight: 280
				,layout: 'border'
				,plain: true		
				,modal: true
				,tbar:[{
					text: 'Создать роль'
					,iconCls:'aclmanager-create-roles'
					,handler: function(){
					}
				},'-',{
					text: 'Сохранить...'
					,iconCls:'aclmanager-save-roles'
					,menu:[{
						id: 'save-role-acl-btn'
						,hidden: true
						,handler: function(){
							var context = this.getContext();
							var role = this.rightNewValues.map[context.role.id];
							if (role) {
								App.request({
									url: '/ajax/modules/aclmanager/act/saverole',
									success: function(r, o){
										this.rightNewValues.removeKey(context.role.id)
										Ext.getCmp('role-acl-tree').getNodeById(context.role.id).getUI().removeClass('aclmanager-role-changed');
										Ext.getCmp('right-acl-grid').store.reload();
									},
									params: {
										role:context.role.name
										,rights:Ext.encode(role)
									}
									,scope: this
								});
							}
						}
						,scope: this
					},{
						text: 'Сохранить все роли'
						,handler: function(){
							var roles = this.rightNewValues.map;
							if (roles) {
								App.request({
									url: '/ajax/modules/aclmanager/act/saveroles',
									success: function(r, o){
										this.rightNewValues.eachKey(function(k){
											Ext.getCmp('role-acl-tree').getNodeById(k).getUI().removeClass('aclmanager-role-changed');
										});
										this.rightNewValues.clear();
										Ext.getCmp('right-acl-grid').store.reload();
									},
									params: {
										roles:Ext.encode(roles)
									}
									,scope: this
								});
							}
						}
						,scope: this
					}]
				},{
					text: 'Отменить...'
					,iconCls:'aclmanager-reset-roles'
					,menu:[{
						id: 'reset-role-acl-btn'
						,hidden: true
						,handler: function(){
							var context = this.getContext();
							this.rightNewValues.removeKey(context.role.id)
							Ext.getCmp('role-acl-tree').getNodeById(context.role.id).getUI().removeClass('aclmanager-role-changed');
							Ext.getCmp('right-acl-grid').store.reload();
						}
						,scope: this
					},{
						text: 'Отменить изменения всех ролей'
						,handler: function(){
							this.rightNewValues.eachKey(function(k){
								Ext.getCmp('role-acl-tree').getNodeById(k).getUI().removeClass('aclmanager-role-changed');
							});
							this.rightNewValues.clear();
							Ext.getCmp('right-acl-grid').store.reload();
						}
						,scope: this
					},'-',{
						text: 'Сбросить стандартные роли по-умолчанию'
						,handler: function(){
							App.request({
								url: '/ajax/modules/aclmanager/act/revertdefault'
								,success: function(r, o){
									this.rightNewValues.eachKey(function(k){
										var n = Ext.getCmp('role-acl-tree').getNodeById(k);
										if (n.attributes.type == 0) {
											n.getUI().removeClass('aclmanager-role-changed');
											this.rightNewValues.removeKey(k);
										}
									},this);
									Ext.getCmp('right-acl-grid').store.reload();
								}
								,scope: this
							});
						}
						,scope: this
					}]
				}]
				,items: [{
					region: 'center'
					,xtype: 'aclmanagergrid'
					,id: 'right-acl-grid'
				},{
					region: 'west'
					,xtype: 'aclmanagertree'
					,id: 'role-acl-tree'
					,split: true
					,width:'250px'
				}]
				,listeners:{
					'beforeclose': function(){
						var count = this.rightNewValues.getCount();
						if (count){
							Ext.Msg.show({
								title:'Подтверждение',
								msg: 'Одна или несколько ролей изменены!<br> Вы действительно хотите закрыть окно?',
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								width: '320',
								fn: function(btn){
									if (btn == 'yes') {
										this.rightNewValues.clear();
										win.destroy();
									};
								}
								,scope: this
							})
							return false;
						}
					}
					,scope: this
				}
			});
		}
		win.show();
	}//end winList
}));

// Acl grid
Ext.app.Aclmanager.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var store = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy({
				url: App.proxy('/ajax/modules/aclmanager/act/getrights')
			}),
			reader: new Ext.data.JsonReader({
				fields:
				[
					  'module','modulename','right','rightname','value','allow','deny'
				]
			})
			,groupField: 'module'
			,sortInfo:{field:'rightname', direction:'asc'}
			,listeners: {
				'load': function(s,records){
					var module = App.getModule('aclmanager');
					var context = App.getContext('aclmanager');
					Ext.each(records,function(r){
						module.rightDefValues.push({
							'module': r.data.module
							,'right': r.data.right
							,'value': r.data.value
						});	
					})
					var o = module.rightNewValues.get(context.role.id);
					s.each(function(r){
						if (module.rightNewValues.containsKey(context.role.id)){
							Ext.each(o, function(i){
								if (r.data.module == i.module && r.data.right == i.right) {
									if (i.allow != undefined) r.set('allow', i.allow);
									if (i.deny != undefined) r.set('deny', i.deny);
									switch (true){
										case r.data['allow']:
											r.set('value', true);
										break;
										case r.data['deny']:
											r.set('value', false);
										break;
									}
									return false;
								}
							})
						}
					});
				}
			}
		});

		Ext.grid.CheckColumn = function(config){
		    Ext.apply(this, config);
		    if(!this.id){
		        this.id = Ext.id();
		    }
		    this.renderer = this.renderer.createDelegate(this);
		};
		
		Ext.grid.CheckColumn.prototype ={
		    init : function(grid){
		        this.grid = grid;
		        this.grid.on('render', function(){
		            var view = this.grid.getView();
		            view.mainBody.on('mousedown', this.onMouseDown, this);
		        }, this);
		    },
		
		    onMouseDown : function(e, t){
		        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
		            e.stopEvent();
		            var index = this.grid.getView().findRowIndex(t);
		            var record = this.grid.store.getAt(index);
		            record.set(this.dataIndex, !record.data[this.dataIndex]);

					var module = App.getModule('aclmanager');
					var context = App.getContext('aclmanager');
					switch (this.dataIndex){
						case 'allow':
							if (record.data[this.dataIndex] && record.data.deny)
					            record.set('deny', !record.data[this.dataIndex]);
						break;
						case 'deny':
							if (record.data[this.dataIndex] && record.data.allow)
					            record.set('allow', !record.data[this.dataIndex]);
						break;
					}

					switch (true){
						case record.data.allow:
							record.set('value', true);
						break;
						case record.data.deny:
							record.set('value', false);
						break;
						default:
							Ext.each(module.rightDefValues, function(i){
								if (record.data.module == i.module && record.data.right == i.right){
									record.set('value', i.value);
									return false;
								}
							})						
					}

					var item = {
						'module':record.data.module
						,'right':record.data.right
						,'allow':record.data.allow
						,'deny':record.data.deny
					};
					if (module.rightNewValues.containsKey(context.role.id)){
						var o = module.rightNewValues.get(context.role.id);
						var empty = true;
						Ext.each(o, function(i){
							if (record.data.module == i.module && record.data.right == i.right) {
								if (record.data.allow != i.allow || record.data.deny != i.deny){
									module.rightNewValues.replace(context.role.id,[item]);
								}
								return empty = false;
							}
						},this);
						if (empty){
							module.rightNewValues.get(context.role.id).push(item);
						}
					} else {
						module.rightNewValues.add(context.role.id,[item]);
					}
					Ext.getCmp('role-acl-tree').getNodeById(context.role.id).getUI().addClass('aclmanager-role-changed');
		        }
		    },
		
		    renderer : function(v, p, record){
		        p.css += ' x-grid3-check-col-td'; 
		        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
		    }
		};
	
		var value = new Ext.grid.CheckColumn({
			header: 'Доступ',
			dataIndex: 'value',
			align: 'center',
			width: 25,
			renderer: function(v,p,r){
		        p.css += ' x-grid3-check-col-td'; 
				switch (true){
					case r.data.allow:
				        return '<div class="x-grid3-check-col-on x-grid3-cc-'+this.id+'">&#160;</div>';
					break;
					case r.data.deny:
				        return '<div class="x-grid3-check-col x-grid3-cc-'+this.id+'">&#160;</div>';
					break;
					default:
				        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
				}
			}
		});
		var allow = new Ext.grid.CheckColumn({
			header: 'Разрешено',
			dataIndex: 'allow',
			align: 'center',
			width: 25
		});

		var deny = new Ext.grid.CheckColumn({
			header: 'Запрещено',
			dataIndex: 'deny',
			align: 'center',
			width: 25
		});

		var cm = new Ext.grid.ColumnModel([
		{
			header: "Модуль"
			,hidden: true
			,dataIndex: 'module'
			,width: 60
			,renderer: function(v,p,r){
				return r.data.modulename
			}
//		},{
//			header: "Модуль"
//			,hidden: true
//			,dataIndex: 'modulename'
//			,width: 60
		},{
			header: "Права доступа"
//			,hidden: true
			,dataIndex: 'right'
			,renderer: function(v,p,r){
				return r.data.rightname
			}
//		},{
//			header: "Название права доступа"
//			,dataIndex: 'rightname'
		},allow,deny,value]);
		
		cm.defaultSortable = true;

        Ext.apply(this, {
			margins: '0 5 5 0'
			,store: store
			,cm:cm
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
			})
			,view: new Ext.grid.GroupingView({
				enableGroupingMenu: false,
				groupByText: 'Группировать по этому полю',
				showGroupsText: 'Отображать по группам',
				forceFit: true,
				groupTextTpl: '{text}',
 				onLoad: Ext.emptyFn
			})
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,plugins: [allow,deny]
			,viewConfig:{
				forceFit:true
			}
		});
        Ext.app.Aclmanager.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
        Ext.app.Aclmanager.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('aclmanagergrid', Ext.app.Aclmanager.Grid);

// Role tree
Ext.app.Aclmanager.Tree = Ext.extend(Ext.tree.TreePanel, {
	initComponent: function(){
		var cfg = {
			title: 'Роли'
			//,nodeId:0
			,border: false
			//,collapsible: true
			,cmargins: '0 0 0 0'
			,margins: '0 0 0 0'
			,layoutConfig: {
				animate: false
			}
		    ,defaults: {
		        bodyStyle: 'height:100%'
		    }
			,loader: new Ext.tree.TreeLoader({
				dataUrl: App.proxy('/ajax/modules/aclmanager/act/getrole')
			})
			,root: new Ext.tree.AsyncTreeNode({
				id: '%'
				,text: 'Все роли'
				,iconCls: 'acl-tree-root'
			})
			,rootVisible: false
			,lines: true
			,autoScroll: true
			//,enableDD: true
			//,ddGroup: 'GridDD'
//			,dropConfig: {
//				appendOnly:true
//			}
			,containerScroll: true
			,tools:[{
				id:'refresh'
				,handler: function(){
					var root = this.getRootNode();
					root.reload();
				}
				,scope: this
			}]
//			,bbar:[]
		};
		Ext.apply(this, cfg);
		Ext.apply(this.initialConfig, cfg);
		
        Ext.app.Aclmanager.Tree.superclass.initComponent.apply(this, arguments);
	}
	,reloadRights: function(){
		var g = Ext.getCmp('right-acl-grid');
		var context = App.getContext('aclmanager');
		g.store.reload({
			params: {
				role: context.role.name
			}
		});
	}
	,listeners: {
		'click': function(node,e){
			var btn = Ext.getCmp('reset-role-acl-btn')
			btn.setVisible(true);
			btn.setText('Отменить изменения роли '+node.text);
			var btn = Ext.getCmp('save-role-acl-btn')
			btn.setVisible(true);
			btn.setText('Созранить роль '+node.text);
			App.applyContext('aclmanager', {
				role: {
					id: node.id,
					name: node.attributes.role,
					text: node.text,
					type: node.attributes.type
				}
 			});
			this.reloadRights();
		}
	}
});
Ext.reg('aclmanagertree', Ext.app.Aclmanager.Tree);

