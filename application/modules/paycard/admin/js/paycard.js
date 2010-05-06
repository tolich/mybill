Ext.namespace('Ext.app.Paycard');
Ext.app.Paycard.Status = {
	'new':		0
	,'sold':	1
	,'activate':2
	,'hold':	3
};

Ext.app.Paycard.ContextMenuItem = function(config){
	return new Ext.Action(Ext.apply({
		disabled: App.isDeny('paycard', 'view')
	}, config));
}

Ext.app.Paycard.Print = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Печать выбранных карт',
		iconCls: 'paycard-print',
		disabled: App.isDeny('paycard', 'view'),
		handler: function(){
			App.getModule('paycard').onPrint(this.records);
		}
	}, config));
}

Ext.app.Paycard.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Платежные карты',
		iconCls: 'paycard',
		disabled: App.isDeny('paycard', 'view'),
		handler: function(){
			App.getModule('paycard').onList();
		}
	}, config));
}
App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'paycard'
	,onInit: function(){
		this.uid = Ext.id();
		App.addModuleMenuItem(this.moduleId, Ext.app.Paycard.List);
	}
//	,onRefresh: function(){
//		Ext.getCmp('ayment-grid').getStore().reload();
//	}
	,onList: function(){
		this.winList();	
	}
	,onAddCard: function(){
		this.winAddCard();		
	}
	,onPrint: function(records){
		App.request({
			url: '/ajax/modules/paycard/act/getprintdata',
			success: function(r, o, res){
				var cards = new Ext.Panel({
					border: false
				});
				var win = Ext.getCmp(this.uid+'win_cards_print');
				if (win == undefined) {
					var win = new Ext.Window({
						title:'Печать выбранных карт'
						,id: this.uid+'win_cards_print'
						,width: 800
						,height: 400
						,minWidth: 800
						,minHeight: 400
						,layout: 'fit'
						,modal: true
						,items:
						[{
							items:cards
							,autoScroll:true
							,border: false
						}]
						,buttons: [{
							text: 'Печать...',
							handler: function(){
								cards.getEl().print({
									printCSS:'/css/admin/print.css',
									printTitle:''
								}); 
							}
							,scope: this
						}]
					});
					win.on('show',function(){
						var data = [];
						for (var i=0;i<records.length;i++){
							data.push({
								id: records[i].id
								,code: String.format("{0} {1} {2} {3}",String(records[i].get('code')).substr(0,4),String(records[i].get('code')).substr(4,4),String(records[i].get('code')).substr(8,4),String(records[i].get('code')).substr(12,4))
								,nominal: records[i].get('nominal')
							});
						}
						var tpl = new Ext.XTemplate(
						    '<tpl for=".">',
								'<p>',
								'<div style="padding:10px;width:'+res.width+'cm;height:'+res.height+'cm;border:1px dotted;float:left">',
							        '<span style="font-size:14px;">Номер карты {id}</span><br>',
							        '<span style="font-size:14px;">Сумма карты {nominal}</span><br><br>',
							        '<span style="font-size:10px;">Для активации карты необходимо:</span><br>',
									'<ol style="list-style:decimal outside none">',
								        '<li style="list-style:decimal outside none"><span style="font-size:10px;">Зайти на страницу проверки счета</span> <span style="white-space:nowrap">'+res.url+'</span></li>',
								        '<li style="list-style:decimal outside none"><span style="font-size:10px;">Нажать ссылку "Активация карты пополнения счета"</span></li>',
								        '<li style="list-style:decimal outside none"><span style="font-size:10px;">В появившемся окне ввести 16 цифр указанные на карте</span></li>',
									'</ol><br>',
									'<span style="font-size:14px;">{code}</span>',
								'</div>',
								'<div style="padding:10px;width:'+res.width_alt+'cm;height:'+res.height+'cm;border:1px dotted;margin-left:10cm">',
							        '<span style="font-size:12px;">Номер карты <b>{id}</b></span><br>',
							        '<span style="font-size:12px;">Сумма карты <b>{nominal}</b></span>',
								'</div>',
								'</p>',
								'<br style="page-break-after:{[xindex % '+res.countOnPage+' === 0 ? "always" : "auto"]}">',
						    '</tpl>'
						);
						tpl.overwrite(cards.body, data);  						
					},this);
					win.show();
				}
			}
		});
	}
	,onHold: function(id){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите анулировать карту № <b>'+id+'</b>?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '320',
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url: '/ajax/modules/paycard/act/hold',
						success: function(r, o){
							if (Ext.getCmp('new-paycard-grid'))
								Ext.getCmp('new-paycard-grid').getStore().reload();
							if (Ext.getCmp('sold-paycard-grid'))
								Ext.getCmp('sold-paycard-grid').getStore().reload();
							if (Ext.getCmp('hold-paycard-grid'))
								Ext.getCmp('hold-paycard-grid').getStore().reload();
						},
						params: {
							id:id
						}
					});
				};
			}
		})
	}
	,onSale: function(ids){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Отправить в продажу выбранные карты ?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '320',
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url: '/ajax/modules/paycard/act/sale',
						success: function(r, o){
							if (Ext.getCmp('new-paycard-grid'))
								Ext.getCmp('new-paycard-grid').getStore().reload();
							if (Ext.getCmp('sold-paycard-grid'))
								Ext.getCmp('sold-paycard-grid').getStore().reload();
						},
						params: {
							id:Ext.encode(ids)
						}
					});
				};
			}
		})
	}
	,onRestore: function(id){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите востановить карту № <b>'+id+'</b>?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '320',
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url: '/ajax/modules/paycard/act/restore',
						success: function(r, o){
							if (Ext.getCmp('new-paycard-grid'))
								Ext.getCmp('new-paycard-grid').getStore().reload();
							if (Ext.getCmp('hold-paycard-grid'))
								Ext.getCmp('hold-paycard-grid').getStore().reload();
						},
						params: {
							id:id
						}
					});
				};
			}
		})
	}
	,winAddCard : function(){ //winAddCard
		var uid = Ext.id();
	    var formPanel = new Ext.FormPanel({
	        labelWidth: 170,
			labelAlign: 'right',
			labelAlign: 'right',
			frame: false,
	        bodyStyle:'padding:10px;',
	        defaultType: 'textfield',
	
	        items: 
			[{
	            fieldLabel: 'Количество',
	            id: uid+'-count',
				xtype: 'numberfield',
				decimal: false,
				negative: false,
				allowBlank: false
	        },{
	            fieldLabel: 'Сумма пополнения',
	            id: uid+'-nominal',
				vtype: 'money',
				allowBlank: false
	        }]
	    });
		var form = formPanel.getForm();
		
	    var win = new Ext.Window({
	        title: 'Создание карт пополнения счета',
	        width: 360,
	        height:150,
	        minWidth: 360,
	        minHeight: 150,
	        layout: 'fit',
	        plain:true,
	        items: formPanel,
			modal: true,
	        buttons: [{
	            text: 'Ок',
				handler: function(){
					var post = {
						'nominal': '0.00',
						'count': '0'
					};
					for (o in post) 
						if (Ext.getCmp(uid+'-'+o)) 
							post[o] = Ext.getCmp(uid+'-'+o).getValue();
					if (form.isValid()) {
						Ext.Msg.show({
							title:'Подтверждение',
							msg: 'Создать <b>'+post.count+'</b> карт(ы) пополнения счета номиналом <b>'+post.nominal+'?</b>',
							buttons: Ext.MessageBox.YESNO,
							icon: Ext.MessageBox.QUESTION,
							width: '320',
							fn: function(btn){
								if (btn == 'yes') {
									App.request({
										url: '/ajax/modules/paycard/act/addcard',
										success: function(r, o){
											win.hide();
											win.destroy();
											if (Ext.getCmp('new-paycard-grid'))
												Ext.getCmp('new-paycard-grid').getStore().reload();
										},
										params: post
									});
								};
							}
						})
					}
				}
				,scope: this
	        },{
	            text: 'Отмена',
				handler: function(){
					win.hide();
					win.destroy();
				}
	        }]
	    });
		win.show();
	}//end winAddCard
	,winList : function(){ //winList
		var win = Ext.getCmp(this.uid+'win-list');
		if (win == undefined) {
			var win = new Ext.Window({
				id: this.uid+'win-list'
				,title: 'Карты пополнения счета'
				,width: 800
				,height: 500
				,minWidth: 380
				,minHeight: 280
				,layout: 'fit'
				,plain: true		
				,modal: true
				,items: [{
					region: 'center'
					,xtype: 'tabpanel'
					,activeTab: 0
					,items: [{
						title: 'Новые'
						,xtype: 'paycardgrid'
						,status: Ext.app.Paycard.Status['new']
						,id: 'new-paycard-grid'
					}, {
						title: 'В продаже'
						,xtype: 'paycardgrid'
						,status: Ext.app.Paycard.Status['sold']
						,id: 'sold-paycard-grid'
					}, {
						title: 'Активированные'
						,xtype: 'paycardgrid'
						,status: Ext.app.Paycard.Status['activate']
						,id: 'active-paycard-grid'
					}, {
						title: 'Анулированные'
						,xtype: 'paycardgrid'
						,status: Ext.app.Paycard.Status['hold']
						,id: 'hold-paycard-grid'
					}]
				}]
			});
		}
		win.show();
	}//end winList
}));

// Paycard grid
Ext.app.Paycard.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var pageLimit = 50;
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/modules/paycard/act/list')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields:[{name:'datecreate', type:'date', dateFormat:'Y-m-d H:i:s'},
				'id', 'nominal', 'code'].concat(this.status==Ext.app.Paycard.Status['activate']
				?[{name:'dateactivate', type:'date', dateFormat:'Y-m-d H:i:s'},'username','name','surname','address']
				:[])
			,remoteSort: true
			,sortInfo:{field:'dateactivate', direction:'desc'}
			,id: 'id'
			,baseParams: {
				limit:pageLimit
				,status:this.status
			}
		});
		
		var filters = new Ext.ux.grid.GridFilters({
		  filters:[
		    {type: 'numeric',  	dataIndex: 'id'},
		    {type: 'date',  	dataIndex: 'datecreate'},
		    {type: 'string',  	dataIndex: 'code'},
		    {type: 'numeric',  	dataIndex: 'nominal'}
		].concat(this.status==Ext.app.Paycard.Status['activate']
		?[
			{type: 'date',		dataIndex: 'dateactivate'},
			{type: 'string',	dataIndex: 'username'}
		]:[])});

		if (this.status == Ext.app.Paycard.Status['new']||
			this.status == Ext.app.Paycard.Status['sold']) {
			var actions = new Ext.ux.grid.RowActions({
				header: '',
				keepSelection: true,
				actions: [{
					iconCls: 'paycard-delete-card',
					tooltip: 'Анулировать карту',
					callback: function(grid, record, action, rowIndex, colIndex){
						this.onHold(record.id);
					}.createDelegate(App.getModule('paycard'))
				}]
			});
		} else if (this.status == Ext.app.Paycard.Status['hold']){
			var actions = new Ext.ux.grid.RowActions({
				header: '',
				keepSelection: true,
				actions: [{
					iconCls: 'paycard-restore-card',
					tooltip: 'Восстановить карту',
					callback: function(grid, record, action, rowIndex, colIndex){
						this.onRestore(record.id);
					}.createDelegate(App.getModule('paycard'))
				}]
			});
		}

		var sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect:false
		});
		
		var cm = new Ext.grid.ColumnModel([sm,
		{
			header: "Номер"
			,dataIndex: 'id'
			,align: 'center'
			,width:20
		}, {
			header: "Дата создания"
			,dataIndex: 'datecreate'
			,align: 'center'
			,width:40
			,renderer: new Ext.util.Format.dateRenderer('d.m.Y H:i:s')
		}, {
			header: "Код"
			,dataIndex: 'code'
			,align: 'center'
			,renderer: function(v, d, r){
				return String.format("{0} {1} {2} {3}", v.substr(0,4),v.substr(4,4),v.substr(8,4),v.substr(12,4));
			}
		}, {
			header: "На сумму"
			,align: 'right'
			,dataIndex: 'nominal'
			,width:30
		}].concat(this.status==Ext.app.Paycard.Status['activate']?[
		{
			header: "Дата активации"
			,dataIndex: 'dateactivate'
			,align: 'center'
			,width:40
			,renderer: new Ext.util.Format.dateRenderer('d.m.Y H:i:s')
		},{
			header: "Пользователь"
			,dataIndex: 'username'
			,width:30
			,renderer: function(v, p, r) {
		        p.attr = 'ext:qtip="'+
					r.get('surname')+' '+r.get('name')+'<br>'+r.get('address')+'"';
		        return v;
			}
		}]:[]).concat(actions?[
			actions
		]:[]));
		
		cm.defaultSortable = true;

        Ext.apply(this, {
			margins: '0 5 5 0'
			,store: store
			,cm:cm
			,sm: sm
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,viewConfig:{
				forceFit:true
			}
			,plugins: [filters].concat(actions?[actions]:[])
			,tbar: ['Поиск: ', 
				new Ext.ux.form.SearchField({
					store: store,
					width: 220
				})
			].concat(this.status==Ext.app.Paycard.Status['new']
			?['-',{
				text: 'Создать новые карты...'
				,iconCls: 'paycard-add-card'
				,handler: function(){
					App.getModule('paycard').onAddCard();
				}
			}]:[])
			,bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
			
		});
        Ext.app.Paycard.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.getBottomToolbar().doLoad(0);
        Ext.app.Paycard.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
		'rowcontextmenu': function(g, rowIndex, e){
			var records = g.getSelectionModel().getSelections();
			var ids = [];
			for (var i=0;i<records.length;i++){
				ids.push(records[i].id);
			}
			var menu = [];
			switch (g.getId()){
				case 'new-paycard-grid':
					menu.push(
						Ext.app.Paycard.ContextMenuItem({
							disabled: ids.length==0,
							text: 'В продажу',
							iconCls: 'paycard-sale',
							handler: function(){
								App.getModule('paycard').onSale(ids);
							}
						})
					);
				break;
			}
			menu.push(Ext.app.Paycard.Print({
				records:records
				,disabled:records.length==0
			}));
			var cmenu = new Ext.menu.Menu(menu);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		}
		,'contextmenu':function(e){
		}
	}
});
Ext.reg('paycardgrid', Ext.app.Paycard.Grid);

