Ext.namespace('Ext.app.Payments');

Ext.app.Payments.Refresh = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('payments', 'view'),
		handler: function(){
			App.getModule('payments').onRefresh();
		}
	}, config));
}

Ext.app.Payments.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить',
		iconCls: 'payment-delete',
		disabled: App.isDeny('payments', 'delete'),
		handler: function(){
			App.getModule('payments').onDelete();
		}
	}, config));
}

Ext.app.Payments.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить',
		iconCls: 'payment-edit',
		disabled: App.isDeny('payments', 'edit'),
		handler: function(){
			App.getModule('payments').onEdit();
		}
	}, config));
}

Ext.app.Payments.Apply = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Провести платеж',
		iconCls: 'payment-apply',
		disabled: App.isDeny('payments', 'submit'),
		handler: function(){
			App.getModule('payments').onApply();
		}
	}, config));
}

Ext.app.Payments.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Платежи',
		iconCls: 'payment',
		disabled: App.isDeny('payments', 'view'),
		handler: function(){
			App.getModule('payments').onList();
		}
	}, config));
}

Ext.app.Payments.GroupList = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Типы платежей',
		iconCls: 'payment',
		disabled: App.isDeny('payments', 'settings'),
		handler: function(){
			App.getModule('payments').onGroupList();
		}
	}, config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'payments'
    ,onGroupList: function(){
        this.winGroupList();
    }
	,onList: function(){
		this.winList();	
	}
	,onRefresh: function(){
		Ext.getCmp('payment-grid').getStore().reload();
	}
	,onEdit: function(){
		this.app.getContext('payments').mode = 1; //Изменение
		this.winPayment();
	}
	,onDelete: function(){
		var p = App.getContext('payments');
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить платеж для  <b>' + p.username + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/payments/delete'
						,success: function(r, o){
							Ext.getCmp('payment-grid').getStore().reload();
						},
						failure: function(){
						},
						params: {id: p.id}
					});
				};
			}
		})
	}
	,onApply: function(){
		var p = App.getContext('payments');
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Провести выбранный платеж для  <b>' + p.username + '?</b>' +
				'<div class="div-msg">' +
			'<ul>' +
			'<li><div>Сумма платежа:</div>' + p.amount + '</li>' +
			'<li><div>На депозит:</div>' + p.amountdeposit + '</li>' +
			'<li><div>На основной счет:</div>' + p.amountfreebyte + '</li>' +
			'<li><div>На бонусный счет:</div>' + p.amountbonus + '</li>' +
			'</ul></div>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '350',
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/payments/apply'
						,success: function(r, o){
							Ext.getCmp('payment-grid').getStore().reload();
						},
						failure: function(){
						},
						params: {id: p.id}
					});
				};
			}
		})
	}
	,winPayment: function(is){ // winPayment
		var datePay = new Date();
		var p = this.getContext();
		datePay.setDate(datePay.getDate()+20);
			
	    var formPanel = new Ext.FormPanel({
	        labelWidth: 170,
			labelAlign: 'right',
			labelAlign: 'right',
			frame: false,
	        bodyStyle:'padding:10px;',
	        defaultType: 'textfield',
	        items: [{
	            fieldLabel: 'Тип платежа',
	            id: 'id_paymentgroup',
                xtype: 'combo',
				store: new Ext.data.JsonStore({
                    url: App.proxy('/ajax/payments/getgroup'),
                    autoDestroy: true,
					fields: ['id', 'name'],
                    data: p.lastpaygroup?[p.lastpaygroup]:[]  
				}),
				valueField: 'id',
				displayField: 'name',
				typeAhead: true,
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				width: 127,
                value: p.id_paymentgroup || p.lastpaygroup?p.lastpaygroup.id:undefined,
				listeners: {
					'select':function(cmb,record,index){
                        App.getModule('payments').applyContext({
                            'lastpaygroup': {
                                id: record.id,
                                name: record.get('name')
                            }
                        });
					}
				}
	        },{
	            fieldLabel: 'Сумма платежа',
	            id: 'amount',
				vtype: 'money',
				value: p.amount || '0.00',
				allowBlank: false
	        },{
	            fieldLabel: 'На депозит',
	            id: 'amountdeposit',
				vtype: 'nmoney',
				value: p.amountdeposit || '0.00',
				allowBlank: false
	        }, {
	            fieldLabel: 'На основной счет (Мб)',
	            id: 'amountfreebyte',
				vtype: 'mbyte',
				value: p.amountfreebyte || '0.000',
				allowBlank: false
	        },{
	            fieldLabel: 'На бонусный счет (Мб)',
	            id: 'amountbonus',
				vtype: 'mbyte',
				value: p.amountbonus || '0.000',
				allowBlank: false
	        },{
	            fieldLabel: 'Основание платежа',
	            id: 'description',
				value: p.description || Ext.util.Format.date(datePay, 'F Y'),
				xtype: 'textarea',
				width: '119'
	        },{
	            fieldLabel: 'Не проводить'
	            ,id: 'apply'
				,xtype: 'checkbox'
				,checked: true
				,disabled: App.isDeny('payments', 'submit')
	        }]
	    });
		var form = formPanel.getForm();
		
		var win = Ext.getCmp('win-payment');
		if (win==undefined){
		    var win = new Ext.Window({
		        title: ' ',
				id: 'win-payment',
		        width: 380,
		        height:310,
		        minWidth: 380,
		        minHeight: 310,
		        layout: 'fit',
		        plain:true,
				modal: true,
		        items: formPanel,
		        buttons: [{
		            text: 'Ок',
					handler: function(){
						var post = p.mode==1?p:{
							iduser: p.iduser,
							amount: '0.00',
							amountdeposit: '0.00',
							amountfreebyte: '0.000',
							amountpaybyte: '0.000',
							amountbonus: '0.000',
							description: '',
							apply: false
						};
						var url = p.mode==1?'/ajax/payments/edit':'/ajax/payments/add';
						for (o in post) 
							if (Ext.getCmp(o)) 
								post[o] = Ext.getCmp(o).getValue();
						if (form.isValid()) {
							Ext.Msg.show({
								title:'Подтверждение',
								msg: 'Продолжить '+(p.mode==1?'изменение':'создание')+' платежа для пользователя <b>' + p.username + '?</b>' +
									'<div class="div-msg">' +
								'<ul>' +
								'<li><div>Сумма платежа:</div>' + post.amount + '</li>' +
								'<li><div>На депозит:</div>' + post.amountdeposit + '</li>' +
								'<li><div>На основной счет:</div>' + post.amountfreebyte + '</li>' +
								'<li><div>На бонусный счет:</div>' + post.amountbonus + '</li>' +
								'</ul></div>',
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								width: '350',
								fn: function(btn){
									if (btn == 'yes') {
                                        win.el.mask('Подождите, пожалуйста...');
										App.request({
											url: url,
											success: function(r, o){
												var isReload = !Ext.getCmp('apply').getValue();
												win.close();
												if (p.mode==1) Ext.getCmp('payment-grid').getStore().reload();
												if (isReload) Ext.getCmp('user-grid').getStore().reload();
											},
											failure: function(){
                                                win.el.unmask();
											},
											params: post
										});
									};
								}
							})
						}
					}
		        },{
		            text: 'Отмена',
					handler: function(){
						win.close();
					}
		        }]
		    });
			win.setTitle((p.mode==1 ? 'Изменение платежа - ':'Пополнение счета - ') + p.username);
			if (is){
				Ext.getCmp('amount').on('change',function(f,newv,oldv){
					if (App.getContext('users').price!=0)
						Ext.getCmp('amountfreebyte').setValue(newv/App.getContext('users').price);
				});
			}
		};
		win.show();
	} // End winPayment
	,winList : function(){ //winList
		var win = Ext.getCmp('win-list');
		if (win == undefined) {
			var win = new Ext.Window({
				id: 'win-list',
				title: 'Платежи',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true,		
				modal: true,
				items: [{
					region: 'center',
					xtype: 'tabpanel',
					activeTab: 0,
					items: [{
						title: 'Подробно',
						xtype: 'paymentsgrid',
						id: 'payment-grid'
					}, {
						title: 'По дням',
						xtype: 'datepaymentsgrid',
						id: 'date-payment-grid'
					}, {
						title: 'По месяцам',
						xtype: 'monthpaymentsgrid',
						id: 'month-payment-grid'
					}]
				}]
			});
		}
		win.show();
	}//end winList
	,winGroupList : function(){ //winGroupList
		var win = Ext.getCmp('win-list');
		if (win == undefined) {
			var win = new Ext.Window({
				id: 'win-list',
				title: 'Типы платежей',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'border',
				plain: true,		
				modal: true,
				items: [{
					region: 'center',
                    id: 'pay-group-grid',
					xtype: 'paygroupgrid'
                },{
					region: 'east',
                    id: 'pay-user-grid',
                    xtype:'payusergrid',
                    split:true,
                    width: 300
				}]
			});
		}
		win.show();
	}//end winGroupList
}));

Ext.app.Payments.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var pageLimit = 50;
		var status = '1';

		function renderFullName(value, p, r){
			return String.format('<div>{0} {1}</div>', 
					r.data.surname, r.data.name);
		}

		function renderDate(value, p, r){
			return Ext.util.Format.date(r.data.datepayment);
		}
		
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/payments/grid')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields:['id', {name:'datepayment',type:'date',dateFormat:'Y-m-d H:i:s'}, 'username', 'name', 'surname',
				'amount', 'amountdeposit', 'amountbonus', 'amountfreebyte',
				'lastdeposit', 'lastbonus', 'lastfreebyte', 'description','status','paymentname','id_paymentgroup']
			,id: 'id'
			,remoteSort: true
			,sortInfo:{field:'datepayment', direction:'desc'}
			,baseParams: {limit:pageLimit, query:'', status:status}
		});

		var cm = new Ext.grid.ColumnModel([
		{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			header: "Логин"
			,dataIndex: 'username'
            ,sortable: true
		}, {
			header: "Ф.И.О."
			,dataIndex: 'surname'
			,renderer: renderFullName
			,width:200
            ,sortable: true
		}, {
			header: "Дата"
			,dataIndex: 'datepayment'
			,width:80
			,renderer: Ext.util.Format.dateRenderer('d.m.Y')
			,align: 'center'
            ,sortable: true
		}, {
			header: "Сумма"
			,dataIndex: 'amount'
			,align: 'right'
            ,sortable: true
		}, {
			header: "На депозит"
			,dataIndex: 'amountdeposit'
			,align: 'right'
            ,sortable: true
		}, {
			header: "На пр.МБ"
			,dataIndex: 'amountfreebyte'
			,align: 'right'
            ,sortable: true
		}, {
			header: "На бн.МБ"
			,dataIndex: 'amountbonus'
			,align: 'right'
            ,sortable: true
		}, {
			header: "Деп-т до опл."
			,dataIndex: 'lastdeposit'
			,align: 'right'
            ,sortable: true
		}, {
			header: "Пр. МБ до опл."
			,dataIndex: 'lastfreebyte'
			,align: 'right'
            ,sortable: true
		}, {
			header: "Бн. МБ до опл."
			,dataIndex: 'lastbonus'
			,align: 'right'
            ,sortable: true
		}, {
			header: "Основание"
			,dataIndex: 'description'
            ,sortable: true
		}, {
			header: "Тип платежа"
			,dataIndex: 'paymentname'
            ,sortable: true
		}]);
		
        Ext.apply(this, {
			margins: '0 5 5 0'
			//title: 'Пользователи',
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
				,getRowClass: function(record, rowIndex, p, store){
					if (record.data.status==0) {
						return 'new-payment-rows-class';
					}
					return 'payment-rows-class';
				}
			}
			,tbar: ['Поиск: ', 
			new Ext.ux.form.SearchField({
				store: store,
				width: 220
			}),
			'->',
			' Отображать платежи: ',
			new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
						fields: ['id', 'viewmode'],
						data: [['%', 'Все'],['0','Новые'],['1','Проведенные']] 
						}),
				valueField: 'id',
				displayField: 'viewmode',
				id: 'view_payment',
				typeAhead: true,
				mode: 'local',
				value: status,
				triggerAction: 'all',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127,
				listeners:{
					'select':function(c){
						status = c.getValue();
						store.baseParams.status = status;
						store.load();
					}
				}
			})]
			,bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
			
		});
        Ext.app.Payments.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Ext.app.Payments.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
		'rowcontextmenu':function(g, rowIndex, e){
			var sm = g.getSelectionModel();
			sm.selectRow(rowIndex);
			var row = g.getStore().getAt(rowIndex);
			if (row.get('status')==0){
				var p = App.getContext('payments');
				Ext.apply(p, {
					username 		: g.getStore().getAt(rowIndex).get('username')
					,id 			: g.getStore().getAt(rowIndex).get('id')
					,amount 		: g.getStore().getAt(rowIndex).get('amount')
					,amountdeposit 	: g.getStore().getAt(rowIndex).get('amountdeposit')
					,amountfreebyte : g.getStore().getAt(rowIndex).get('amountfreebyte')
					,amountbonus 	: g.getStore().getAt(rowIndex).get('amountbonus')
					,description 	: g.getStore().getAt(rowIndex).get('description')
					,apply 			: false
                    ,id_paymentgroup: g.getStore().getAt(rowIndex).get('id_paymentgroup')
				});
				var rowcmenu = new Ext.menu.Menu([
					Ext.app.Payments.Refresh(),
					'-',
					Ext.app.Payments.Apply(),
					'-', 
					Ext.app.Payments.Edit(),
					Ext.app.Payments.Delete()
				]);
			}
			else {
				var rowcmenu = new Ext.menu.Menu([Ext.app.Payments.Refresh()]);
			}
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([Ext.app.Payments.Refresh()]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('paymentsgrid', Ext.app.Payments.Grid);

// Date grid
Ext.app.Payments.DateGrid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var pageLimit = 50;
        var summary = new Ext.ux.grid.GroupSummary();
		
		// create the Data Store
		var store = new Ext.data.GroupingStore({
			url: App.proxy('/ajax/payments/dategrid')
            ,reader: new Ext.data.JsonReader({
    			root: 'data'
    			,totalProperty: 'totalCount'
    			,fields:[
                    {name:'rdate', type:'date', dateFormat:'Y-m-d'}, 
    				{name: 'sumamount', type: 'float'}, 
                    {name: 'count',  type: 'float'}, 
                    {name: 'paymentname',  type: 'string'} 
                ]
            })
			,remoteSort: true
			,sortInfo:{field:'rdate', direction:'desc'}
            ,groupField: 'rdate'
			,baseParams: {limit:pageLimit}
		});

		var cm = new Ext.grid.ColumnModel([
		{
			header: "Дата"
			,dataIndex: 'rdate'
			,renderer: new Ext.util.Format.dateRenderer('d.m.Y, l')
            ,sortable: true
            ,summaryRenderer: function(v, params, data){
                return 'Итого:';
            }
		}, {
			header: "Сумма"
			,dataIndex: 'sumamount'
            ,sortable: true
            ,summaryType: 'sum'
            ,align: 'right'
            ,summaryRenderer: function(v, params, data){
                return Ext.util.Format.number(v,'0.00');
            }
            ,renderer: function(v, params, data){
                return Ext.util.Format.number(v,'0.00');
            }
		}, {
			header: "Кол-во платежей"
			,dataIndex: 'count'
            ,summaryType: 'sum'
            ,align: 'center'
            ,sortable: true
		}, {
			header: "Средняя сумма"
            ,align: 'right'
            ,summaryRenderer: function(v, params, data){
                return Ext.util.Format.number(data.data.sumamount/data.data.count,'0.00');
            }
            ,renderer: function(v, params, data){
                return Ext.util.Format.number(data.data.sumamount/data.data.count,'0.00');
            }
            ,sortable: true
		}, {
			header: "Тип платежа"
			,dataIndex: 'paymentname'
            ,sortable: true
		}]);
		
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
            ,plugins: summary
			,view: new Ext.grid.GroupingView({
				groupByText: 'Группировать по этому полю',
				showGroupsText: 'Отображать по группам',
				forceFit: true,
				groupTextTpl: '{text}',
			})
			,viewConfig:{
				forceFit:true
			}
			,bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
			
		});
        Ext.app.Payments.DateGrid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Ext.app.Payments.DateGrid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([Ext.app.Payments.Refresh]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('datepaymentsgrid', Ext.app.Payments.DateGrid);

// Month grid
Ext.app.Payments.MonthGrid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var pageLimit = 50;
        var summary = new Ext.ux.grid.GroupSummary();
		
		// create the Data Store
		var store = new Ext.data.GroupingStore({
			url: App.proxy('/ajax/payments/monthgrid')
            ,reader: new Ext.data.JsonReader({
    			root: 'data'
    			,totalProperty: 'totalCount'
    			,fields:[
                    {name:'rdate', type:'date', dateFormat:'Y-m-d'}, 
    				{name: 'sumamount', type: 'float'}, 
                    {name: 'count',  type: 'float'}, 
                    {name: 'paymentname',  type: 'string'} 
                ]
            })
			,remoteSort: true
			,sortInfo:{field:'rdate', direction:'desc'}
            ,groupField: 'rdate'
			,baseParams: {limit:pageLimit}
		});

		var cm = new Ext.grid.ColumnModel([
		{
			header: "Месяц, год"
			,dataIndex: 'rdate'
			,renderer: new Ext.util.Format.dateRenderer('F Y')
            ,sortable: true
            ,summaryRenderer: function(v, params, data){
                return 'Итого:';
            }
		}, {
			header: "Сумма"
			,dataIndex: 'sumamount'
            ,sortable: true
            ,summaryType: 'sum'
            ,align: 'right'
            ,summaryRenderer: function(v, params, data){
                return Ext.util.Format.number(v,'0.00');
            }
            ,renderer: function(v, params, data){
                return Ext.util.Format.number(v,'0.00');
            }
		}, {
			header: "Кол-во платежей"
			,dataIndex: 'count'
            ,sortable: true
            ,summaryType: 'sum'
            ,align: 'center'
		}, {
			header: "Средняя сумма"
            ,align: 'right'
            ,summaryRenderer: function(v, params, data){
                return Ext.util.Format.number(data.data.sumamount/data.data.count,'0.00');
            }
            ,renderer: function(v, params, data){
                return Ext.util.Format.number(data.data.sumamount/data.data.count,'0.00');
            }
            ,sortable: true
		}, {
			header: "Тип платежа"
			,dataIndex: 'paymentname'
            ,sortable: true
		}]);
		
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
            ,plugins: summary
			,view: new Ext.grid.GroupingView({
				groupByText: 'Группировать по этому полю',
				showGroupsText: 'Отображать по группам',
				forceFit: true,
				groupTextTpl: '{text}',
			})
			,viewConfig:{
				forceFit:true
			}
			,bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
			
		});
        Ext.app.Payments.MonthGrid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Ext.app.Payments.MonthGrid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([Ext.app.Payments.Refresh]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('monthpaymentsgrid', Ext.app.Payments.MonthGrid);

// Грид групп платежей
Ext.app.Payments.GroupGrid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent: function(){
        var Setting = Ext.data.Record.create([{
            name: 'id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string',
            allowBlank: false
        }, {
            name: 'description',
            type: 'string',
        },{
            name: 'users',
            type: 'string',
        }]);
		var cm = new Ext.grid.ColumnModel([
        {
			header: "id"
			,dataIndex: 'id'
            ,hidden: true
        },{
			header: "Наименование"
			,dataIndex: 'name'
            ,editor: {
                xtype: 'textfield'
                ,allowBlank: false
            }
        }, {
			header: "Описание"
			,dataIndex: 'description'
            ,editor: {
                xtype: 'textfield'
            }
        }]);		
        
		// create the Data Store
    	var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/payments/settings')
            ,autoDestroy: true  
            ,root: 'data'
			,fields: Setting //['id','name','ifacename','ip','secret','invert','disabled']
			,id: 'id'
            ,writer: new Ext.data.JsonWriter({
                encode: true
                //,writeAllFields: true // write all fields, not just those that changed
            })
		});
        var editor = new Ext.ux.grid.RowEditor({
            clicksToEdit: 2,
            saveText: 'Сохранить',
            cancelText: 'Отмена',
            commitChangesText: 'Вы должны сохранить или отменить Ваши изменения',
            errorText: 'Ошибка'
        });
        
        Ext.apply(this, {
			margins: '0 5 5 0',
			store: store,
			cm: cm,
			trackMouseOver: true,
			autoScroll :true,
            plugins: [editor],
			loadMask: true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
                ,listeners:{
                    'rowselect': function(sm,i,cr){
                        App.getModule('payments').setContext({id_group:cr.id});   
                        var u = Ext.decode(cr.get('users'));
                        var ug =Ext.getCmp('pay-user-grid');
                        var sr = [];
                        ug.store.each(function(r){
                            if (u.indexOf(r.get('id')) != -1) {
                                sr.push(r);
                            }
                        })                 
                        ug.getSelectionModel().selectRecords(sr);
                    }
                    ,'rowdeselect': function(){
                        App.getModule('payments').clearContext();   
                        Ext.getCmp('pay-user-grid').getSelectionModel().clearSelections();
                    }
                    ,scope: this
                }
			}),
			viewConfig:{
				enableRowBody: true
				,forceFit: true
            },
            tbar: [{
                text: 'Добавить'
                ,iconCls: 'user-payment'
                ,handler: function(){
                    var e = new Setting({
                        name: '',
                        description: ''
                    });
                    editor.stopEditing();
                    this.store.insert(0, e);
                    editor.startEditing(0,1);
                    editor.on('afteredit', function(){
                        this.store.reload();
                    },this,{single: true});
                    editor.on('canceledit', function(){
                        this.store.remove(e);
                    },this,{single: true});
                }
                ,scope: this
            },'-',{
                text: 'Удалить'
                ,iconCls: 'user-fee'
                ,handler: function(){
                    var r;
                    if (r = this.getSelectionModel().getSelected()){
                		Ext.Msg.show({
                			title:'Подтверждение',
                			msg: 'Вы действительно хотите удалить <b>' + r.get('name') + '?</b>',
                			buttons: Ext.MessageBox.YESNO,
                			icon: Ext.MessageBox.QUESTION,
                			width: '300',
                			scope: this,
                			fn: function(btn){
                				if (btn == 'yes') {
                                    editor.stopEditing();
                                    this.store.remove(r);
                				};
                			}
                		})
                    }
                }
                ,scope: this
            },'-',{
                text: 'Перенести свободные'
                ,iconCls: 'user-fee'
                ,handler: function(){
                    var r;
                    if (r = this.getSelectionModel().getSelected()){
                		Ext.Msg.show({
                			title:'Подтверждение',
                			msg: 'Вы действительно хотите перенести свободные платежи в <b>' + r.get('name') + '?</b>',
                			buttons: Ext.MessageBox.YESNO,
                			icon: Ext.MessageBox.QUESTION,
                			width: '300',
                			scope: this,
                			fn: function(btn){
                				if (btn == 'yes') {
                                    editor.stopEditing();
                					App.request({
                						url : '/ajax/payments/togroup',
                						params: {id: r.id}
                					});
                				};
                			}
                		})
                    }
                }
                ,scope: this
            },'->',{
                iconCls: 'refresh'
                ,handler:function(){
                    this.store.reload();    
                }
                ,scope: this
            }]
        });

        Ext.app.Payments.GroupGrid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();
        Ext.app.Payments.GroupGrid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('paygroupgrid', Ext.app.Payments.GroupGrid);

// Грид пользователей в группах платежей
Ext.app.Payments.UserGrid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent: function(){
        var sm =new Ext.grid.CheckboxSelectionModel({
			checkOnly: true
		});
		var cm = new Ext.grid.ColumnModel([sm,
        {
			header: "id"
			,dataIndex: 'id'
            ,hidden: true
        },{
			header: "Администратор"
			,dataIndex: 'username'
        },{
			header: "Роль"
			,dataIndex: 'rolename'
        }]);		
        
		// create the Data Store
    	var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/payments/getuser')
            ,autoDestroy: true  
			,fields: ['id','username','role','rolename']
			,id: 'id'
		});
        
        Ext.apply(this, {
			margins: '0 5 5 0',
			store: store,
			cm: cm,
			trackMouseOver: true,
			autoScroll :true,
			loadMask: true,
			sm: sm,
			viewConfig:{
				enableRowBody: true
				,forceFit: true
            },
            tbar: ['->',{
                text: 'Сохранить'
                ,iconCls: 'save'
                ,handler: function(){
                    var r = this.getSelectionModel().getSelections();
                    var users = [];
                    Ext.each(r, function(item){
                        users.push(item.id);
                    })
                    var id = App.getModule('payments').getContext().id_group;
                    if (id) {
                        Ext.getCmp('pay-group-grid').store.getById(id).set('users', Ext.encode(users));
                    } else {
                		Ext.Msg.show({
                			title:'Информация',
                			msg: 'Необходимо выбрать тип платежа!',
                			buttons: Ext.MessageBox.OK,
                			icon: Ext.MessageBox.INFO
                		})
                    }
                }
                ,scope: this
            }]
        });

        Ext.app.Payments.UserGrid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();
        Ext.app.Payments.UserGrid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('payusergrid', Ext.app.Payments.UserGrid);
