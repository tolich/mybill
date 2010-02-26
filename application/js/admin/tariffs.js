/**
 * @author tolich
 */
Ext.namespace('Ext.app.Tariffs');

Ext.app.Tariffs.Tree = Ext.extend(Ext.tree.TreePanel, {
	initComponent: function(){
		var cfg = {
			title: 'Тарифы'
			//,nodeId:0
			,border: false
			,collapsible: true
			,cmargins: '0 0 0 0'
			,margins: '0 0 0 0'
			,layoutConfig: {
				animate: false
			}
		    ,defaults: {
		        bodyStyle: 'height:100%'
		    }
			,loader: new Ext.tree.TreeLoader({
				dataUrl: App.proxy('/ajax/tariffs/tree')
			})
			,rootVisible: false
			,lines: true
			,autoScroll: true
			//,enableDD: true
			//,ddGroup: 'TreeDD'
			//,dropConfig: {
			//	appendOnly:true
			//}
			//,containerScroll: true
			,root: new Ext.tree.AsyncTreeNode({
				id: '0'
				,text: 'Все тарифы'
				,iconCls: 'tariff'
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
		
        Ext.app.Tariffs.Tree.superclass.initComponent.apply(this, arguments);
	}
	,listeners: {
	}
});
Ext.reg('tarifftree', Ext.app.Tariffs.Tree);

Ext.app.Tariffs.InTariffGrid = Ext.extend(Ext.grid.GridPanel, {
		border:false
     	,initComponent:function() {
		
		// create the Data Store
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/tariffs/intariff')
			,fields:['id', 'idtariff', 'idzone', 'zonename', 'days', 'timestart', 'timestop', 
				'pricein', 'priceout','flag' ,'flagname', 'in_pipe', 'out_pipe', 'weightmb','price',
				'allow','deny',
				'cb_0', 'cb_1', 'cb_2', 'cb_3', 'cb_4', 'cb_5', 'cb_6']
			,remoteSort: true
			,sortInfo:{field:'zonename', direction:'asc'}
		});

        var actions = new Ext.ux.grid.RowActions({
            keepSelection:true,
		   	hideMode:'display',
            actions:[{
               	iconCls:'zone-allow',
               	tooltip:'Разрешенная зона.<br>Нажмите на иконку для блокировки.',
			   	hideIndex:'deny',
               	callback: function(grid, record, action, rowIndex, colIndex, e){
					Ext.Msg.show({
						title:'Подтверждение',
						msg: "Вы действительно хотите запретить <b>"+record.get('zonename')+"</b>",
						icon:Ext.Msg.QUESTION,
						buttons:Ext.Msg.YESNO,
						scope:this,
						fn:function(response) {
							if('yes' == response) {
								App.request({
									url: '/ajax/tariffs/deny',
									params: {
										id:record.id
									},
									success: function(){
										grid.store.reload();
									}
									,scope: this
								})
							}
						}
					});
				}.createDelegate(this)
			},{
               	iconCls:'zone-deny',
               	tooltip:'Запрещенная зона.<br>Нажмите на иконку для разблокировки.',
			   	hideIndex:'allow',
               	callback: function(grid, record, action, rowIndex, colIndex, e){
					Ext.Msg.show({
						title:'Подтверждение',
						msg: "Вы действительно хотите разрешить <b>"+record.get('zonename')+"</b>",
						icon:Ext.Msg.QUESTION,
						buttons:Ext.Msg.YESNO,
						scope:this,
						fn:function(response) {
							if('yes' == response) {
								App.request({
									url: '/ajax/tariffs/allow',
									params: {
										id:record.id
									},
									success: function(){
										grid.store.reload();
									}
								})
							}
						}
					});
				}.createDelegate(this)
			}]
        });

		var cm = new Ext.grid.ColumnModel([
		{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
		}, {
			header: "Зона"
			,width: 100
			,dataIndex: 'zonename'
//		}, {
//			header: "По дням"
//			,width: 150
//			,dataIndex: 'days'
//		}, {
//			header: "С"
//			,dataIndex: 'timestart'
//		}, {
//			header: "По"
//			,dataIndex: 'timestop'
		}, {
			header: "Вх.цена"
			,dataIndex: 'priceout'
			,align: 'right'
		}, {
			header: "Исх.цена"
			,dataIndex: 'pricein'
			,align: 'right'
		}, {
			header: "Вес Мб"
			,dataIndex: 'weightmb'
			,align: 'right'
		}, {
			header: "Вх.скорость"
			,dataIndex: 'in_pipe'
			,align: 'right'
		}, {
			header: "Исх.скорость"
			,dataIndex: 'out_pipe'
			,align: 'right'
		}, {
			header: "Метод расчета"
			,width: 150
			,dataIndex: 'flagname'
		},actions]);
		
		cm.defaultSortable = true;

        Ext.apply(this, {
			margins: '0 5 5 0'
			,title: 'Свойства выбранного тарифа по зонам'
			,store: store
			,cm:cm
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
				,listeners: {
					'rowselect': function(m,i,row){
						App.applyContext('tariffs',{
							zone: {
								id			: row.get('id'),
								idzone		: row.get('idzone'),
								zonename	: row.get('zonename'),
								timestart	: row.get('timestart'),
								timestop	: row.get('timestop'),
								pricein		: row.get('pricein'),
								priceout	: row.get('priceout'),
								weightmb	: row.get('weightmb'),
								flag		: row.get('flag'),
								in_pipe		: row.get('in_pipe'),
								out_pipe	: row.get('out_pipe')
//								cb_0		: parseInt(row.get('cb_0')),
//								cb_1		: parseInt(row.get('cb_1')),
//								cb_2		: parseInt(row.get('cb_2')),
//								cb_3		: parseInt(row.get('cb_3')),
//								cb_4		: parseInt(row.get('cb_4')),
//								cb_5		: parseInt(row.get('cb_5')),
//								cb_6		: parseInt(row.get('cb_6'))
							}
						});
					}
				}
			})
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			,stripeRows: true
			,plugins:[actions]
			,tbar: [
//				Ext.app.Tariffs.Add
//				,'-'
//				,Ext.app.Tariffs.Edit
			]
			,viewConfig:{
				enableRowBody: true
				//,forceFit: true
			}
		});
        Ext.app.Tariffs.InTariffGrid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		//this.store.load();

        Ext.app.Tariffs.InTariffGrid.superclass.onRender.apply(this, arguments);
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
				Ext.app.Tariffs.RefreshZone(),
				'-', 
				Ext.app.Tariffs.AddZone(),
				Ext.app.Tariffs.EditZone(), 
				'-', 
				Ext.app.Tariffs.DeleteZone()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			if (Ext.getCmp('tariff-grid').getSelectionModel().hasSelection()) {
				var cmenu = new Ext.menu.Menu([
					Ext.app.Tariffs.RefreshZone(), 
					'-', 
					Ext.app.Tariffs.AddZone()
				]);
				e.stopEvent();
				cmenu.render();
				var xy = e.getXY();
				cmenu.showAt(xy);
			}
		},
		scope:this
	}
});
Ext.reg('intariffsgrid', Ext.app.Tariffs.InTariffGrid);

Ext.app.Tariffs.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		function renderTariffName(value, p, r){
			return String.format('{0} ({1})', 
					r.data.tariffname, r.data.count);
		}

		function renderCheckMb(value, p, r){
			return ['Нет','Да'][value];
		}

		function renderDateOfCheck(value, p, r){
			return ['Нет', '1 день', '2 дня', '3 дня', '4 дня', '5 дней', '6 дней', '7 дней', '8 дней', '9 дней', '10 дней'][value];
		}

		// create the Data Store
		function renderIsSelected(value, p, r){
			return String.format('<div class="row-arrow-class">&nbsp</div>');
		}
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/tariffs/grid')
			,fields:['id', 'tariffname', 'dailyfee' ,'monthlyfee', 'freebyte', 'bonus', 'in_pipe', 'out_pipe', 'pricein','priceout', 'price',
					'dateofcheck', 'check_mb', 'id_sluice', 'sluicename', 'mindeposit', 'freemblimit', 'count','weightmb']
			,remoteSort: true
			,sortInfo:{field:'tariffname', direction:'asc'}
		});

		var arrower = new Ext.ux.grid.RowArrower({
//		    locked: true
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
		    renderer : function(v, p, record){
		        p.css += ' x-grid3-check-col-td'; 
		        return '<div class="x-grid3-check-col'+(v==1?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
		    }
		};
	
		var checkMb = new Ext.grid.CheckColumn({
			header: 'Контроль Мб>min',
			dataIndex: 'check_mb',
			align: 'center',
			width: 100
		});
		
//		var cm = new Ext.grid.ColumnModel([arrower,
		var cm = new Ext.ux.grid.LockingColumnModel([arrower,
		{
			header: "id"
			,dataIndex: 'id'
			,hidden:true
//			,locked: true
		}, {
			id: 'tariffname'
			,header: "Наименование"
			,width: 200
			,dataIndex: 'tariffname'
//			,locked: true
			//,renderer: renderTariffName
		}, {
			header: "Аб.пл. за день"
			,dataIndex: 'dailyfee'
			,width: 120
			,align: 'right'
		}, {
			header: "Аб.пл. за месяц"
			,dataIndex: 'monthlyfee'
			,width: 120
			,align: 'right'
		}, {
			header: "Предопл. Мб"
			,dataIndex: 'freebyte'
			,align: 'right'
		}, {
			header: "Бонус. Мб"
			,dataIndex: 'bonus'
			,align: 'right'
		}, {
			header: "Вес мб"
			,dataIndex: 'weightmb'
			,align: 'right'
		}, {
			header: "Вх.цена"
			,dataIndex: 'priceout'
			,align: 'right'
		}, {
			header: "Исх.цена"
			,dataIndex: 'pricein'
			,align: 'right'
		}, {
			header: "Цена п/р"
			,dataIndex: 'price'
			,align: 'right'
		}, {
			header: "Вх.скорость"
			,dataIndex: 'in_pipe'
			,align: 'right'
		}, {
			header: "Исх.скорость"
			,dataIndex: 'out_pipe'
			,align: 'right'
		}, {
			header: "Отсрочка",
			dataIndex: 'dateofcheck',
			align: 'center',
			renderer: renderDateOfCheck
//		}, {
//			header: "Контроль Мб>min"
//			,dataIndex: 'check_mb'
//			,renderer: renderCheckMb
//			,align: 'center'
		}, {
			header: "Шлюз"
			,dataIndex: 'sluicename'
			,align: 'center'
		}, {
			header: "Мин.депозит"
			,dataIndex: 'mindeposit'
			,align: 'right'
		}, {
			header: "Мин.остат.Мб"
			,dataIndex: 'freemblimit'
			,align: 'right'
		}
		,checkMb
		, {
			header: "Клиентов",
			dataIndex: 'count',
			align: 'right'
		}]);
		
		cm.defaultSortable = true;
		
        Ext.apply(this, {
			margins: '0 5 5 0'
			,store: store
			,cm:cm
			,plugins: [arrower]
	        ,view: new Ext.ux.grid.LockingGridView({
				holdIndex: true
			})
			,sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
				,listeners: {
					'rowselect': function(m,i,row){
						if (!App.isContext('tariffs') || App.getContext('tariffs').id!=row.get('id'))
							Ext.getCmp('intariff-grid').getStore().load({params:{id:row.get('id')}});
						App.setContext('tariffs',{
							id			: row.get('id')
							,tariffname	: row.get('tariffname')
							,dailyfee	: row.get('dailyfee')
							,monthlyfee	: row.get('monthlyfee')
							,freebyte	: row.get('freebyte')
							,bonus		: row.get('bonus')
							,mindeposit	: row.get('mindeposit')
							,freemblimit: row.get('freemblimit')
							,weightmb	: row.get('weightmb')
							,pricein	: row.get('pricein')
							,priceout	: row.get('priceout')
							,price		: row.get('price')
							,in_pipe	: row.get('in_pipe')
							,out_pipe	: row.get('out_pipe')
							,dateofcheck: row.get('dateofcheck')
							,id_sluice	: row.get('id_sluice')
							,check_mb	: row.get('check_mb')
						});
					},
					'rowdeselect': function(m, i, row){
						Ext.getCmp('intariff-grid').getStore().removeAll();						
					}										
				}
			})
			,trackMouseOver: true
			,autoScroll :true
			,loadMask: true
			//,autoExpandColumn: 'tariffname'
			,tbar: [
				Ext.app.Tariffs.Add()
//				,'-'
//				,Ext.app.Tariffs.Edit
			]
			,viewConfig:{
				enableRowBody: true
	            ,getRowClass: function(record, rowIndex, p, ds){
					//if (Ext.getCmp('tariff-grid').getSelectionModel().isSelected(rowIndex))
					//	return 'row-bold-class';
				}
				//,forceFit: true
			}
		});
//		this.loadInTariff = function(rowIndex){
//			var row = this.getStore().getAt(rowIndex);
//			alert(row.get('id'));
//		}
        Ext.app.Tariffs.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();
        Ext.app.Tariffs.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
//		'rowclick': function(g, rowIndex, e){
//			//g.loadInTariff(rowIndex);	
//		},
		'rowcontextmenu':function(g, rowIndex, e){
			var sm = g.getSelectionModel();
			sm.selectRow(rowIndex);
			if (sm.hasSelection()) {
				var row = sm.getSelected();
				sm.fireEvent('rowselect', sm,rowIndex,row);
			}
			var rowcmenu = new Ext.menu.Menu([
				Ext.app.Tariffs.Refresh(),
				'-', 
				Ext.app.Tariffs.Add(), 
				Ext.app.Tariffs.Edit(), 
				'-', 
				Ext.app.Tariffs.Delete(), 
				'-', 
				Ext.app.Tariffs.AddZone(), 
				'-', 
				Ext.app.Tariffs.Apply()
			]);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([
				Ext.app.Tariffs.Refresh(),
				'-', 
				Ext.app.Tariffs.Add()]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		},
		scope:this
	}
});
Ext.reg('tariffsgrid', Ext.app.Tariffs.Grid);


Ext.app.Tariffs.Refresh =function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
	    iconCls: 'refresh',
		disabled: App.isDeny('tariffs', 'view'),
		handler: function(){
			App.getModule('tariffs').onRefresh();
		}
	},config));
}
Ext.app.Tariffs.RefreshZone = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Обновить',
		iconCls: 'refresh',
		disabled: App.isDeny('tariffs', 'view'),
		handler: function(){
			App.getModule('tariffs').onRefreshZone();
		}
	}, config));
}

Ext.app.Tariffs.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить',
		iconCls: 'tariff-add',
		disabled: App.isDeny('tariffs', 'add'),
		handler: function(){
			App.getModule('tariffs').onAdd();
		}
	}, config));
}

Ext.app.Tariffs.Delete = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить',
		iconCls: 'tariff-delete',
		disabled: App.isDeny('tariffs', 'delete'),
		handler: function(){
			App.getModule('tariffs').onDelete();
		}
	}, config));
}

Ext.app.Tariffs.Edit = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить',
		iconCls: 'tariff-edit',
		disabled: App.isDeny('tariffs', 'edit'),
		handler: function(){
			App.getModule('tariffs').onEdit();
		}
	}, config));
}

Ext.app.Tariffs.Apply = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Применить...',
	    iconCls: 'tariff-apply',
		disabled: App.isDeny('tariffs', 'submit'),
		menu: 
		[{
			text: 'Зоны и шейпер'
			,activeClass: 'item-bullet-active'
			,handler: function(){
				App.getModule('tariffs').onApply('zone');
			}
		},{
			text: 'Мин. депозит и остаток Мб'
			,activeClass: 'item-bullet-active'
			,handler: function(){
				App.getModule('tariffs').onApply('min');
			}
		},{
			text: 'Шлюз'
			,activeClass: 'item-bullet-active'
			,handler: function(){
				App.getModule('tariffs').onApply('sluice');
			}
		},'-',{
			text: 'Все изменения'
			,activeClass: 'item-bullet-active'
			,handler: function(){
				App.getModule('tariffs').onApply('all');
			}
		}]
	},config));
}

Ext.app.Tariffs.List = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Тарифы',
		iconCls: 'tariff',
		disabled: App.isDeny('tariffs', 'view'),
		handler: function(){
			App.getModule('tariffs').onList();
		}
	}, config));
}

Ext.app.Tariffs.AddZone = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить зону',
		iconCls: 'tariff-addzone',
		disabled: App.isDeny('tariffs', 'edit'),
		handler: function(){
			App.getModule('tariffs').onAddZone();
		}
	}, config));
}

Ext.app.Tariffs.EditZone = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить зону',
		iconCls: 'tariff-editzone',
		disabled: App.isDeny('tariffs', 'edit'),
		handler: function(){
			App.getModule('tariffs').onEditZone();
		}
	}, config));
}

Ext.app.Tariffs.DeleteZone = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Удалить зону',
	    iconCls: 'tariff-delzone',
		disabled: App.isDeny('tariffs', 'edit'),
		handler: function(){
			App.getModule('tariffs').onDeleteZone();
		}
	},config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'tariffs'
	,cookie:{}
	,setSettings: function(){
		Ext.apply(App.settings.tasks, this.cookie);
	}
	,onRefreshZone:function(){
		Ext.getCmp('intariff-grid').getStore().reload();
	}
	,onAdd:function(){
		this.setContext({
			mode 		: 0 // Добавление
			,tariffname : 'Новый тариф'
			,dailyfee	: 0
			,monthlyfee	: 0
			,freebyte	: 0
			,bonus		: 0
			,mindeposit	: 0
			,freemblimit: 0
			,weightmb	: 1
			,pricein	: '0.00'
			,priceout	: '0.00'
			,price		: '0.00'
			,in_pipe	: 0
			,out_pipe	: 0
			,dateofcheck: 0
			,id_sluice	: 0
			,check_mb	: 1
			,zone		: {}
		});
		this.winTariff();
	}
	,onAddZone:function(){
		this.applyContext({
			zone: {
				mode		: 0
				,idzone		: 0
				,pricein	: '0.00'
				,priceout	: '0.00'
				,price		: '0.00'
				,flag		: 0
//				,cb_1		: 1
//				,cb_2		: 1
//				,cb_3		: 1
//				,cb_4		: 1
//				,cb_5		: 1
//				,cb_6		: 1
//				,cb_0		: 1
//				,timestart	: '00:00:00'
//				,timestop	: '23:59:59'
				,in_pipe	: 0
				,out_pipe	: 0
				,weightmb	: 1
			}
		});
		this.winInTariff();
	}
	,onRefresh:function(){
		Ext.getCmp('tariff-grid').getStore().reload();
		Ext.getCmp('intariff-grid').getStore().removeAll();
	}
	,onEdit:function(){
		this.applyContext({mode : 1});
		this.winTariff();
	}
	,onApply:function(path){
		var p = '';
		switch (path){
			case 'zone':
				p='изменения <b>зон и шейпера</b>';
			break;
			case 'sluice':
				p='изменения <b>шлюза</b>';
			break;
			case 'min':
				p='изменения <b>мин. депозита и остатка Мбайт</b>';
			break;
			case 'all':
				p='<b>все</b> изменения';
			break;
		}
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите применить '+ p + ' в тарифе  <b>' + this.getContext().tariffname + '</b> ко всем пользователям?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/tariffs/apply'
						,success: function(r, o){
						},
						failure: function(){
						},
						params: {
							id: this.getContext().id
							,path: path
						}
						,scope: this
					});
				};
			}
		})
	}
	,onEditZone:function(){
		var zone = this.getContext().zone;
		Ext.apply(zone, {mode : 1});
		this.applyContext({
			zone: zone
		});
		this.winInTariff();
	}
	,onList: function(){
		this.clearContext();
		this.winList();
	}
	,onDelete:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить тариф  <b>' + this.getContext().tariffname + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					Ext.Ajax.request({
						url : '/ajax/tariffs/delete'
						,success: function(r, o){
							Ext.getCmp('tariff-grid').getStore().reload();
							Ext.getCmp('intariff-grid').getStore().removeAll();
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
	,onDeleteZone:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите удалить зону  <b>' + this.getContext().zone.zonename + '</b> из тарифа <b>'+ this.getContext().tariffname +'?<b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			scope: this,
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/tariffs/deletezone'
						,success: function(r, o){
							Ext.getCmp('intariff-grid').getStore().reload();
						},
						failure: function(){
						},
						params: {id: this.getContext().zone.id}
						,scope: this
					});
				};
			}
		})
	}
	,winList: function(){
		var win = Ext.getCmp('win_tarifflist');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Справочник тарифов',
				id: 'win_tarifflist',
				width: 800,
				height: 550,
				minWidth: 380,
				minHeight: 280,
				layout: 'border',
				plain: true	
				,modal: true
				,items: 
				[{
					region: 'north',
					xtype: 'panel',
					bodyStyle: 'background-color: transparent; border: 0',
					html: '<b>Внимание!</b><br> Для того, чтобы изменения в тарифе вступили в силу необходимо в контекстном меню тарифа выбрать <b>"Применить..."</b>.',
					cls: 'info-panel',
					anchor: '100%'
				},{
					region: 'center'
					,xtype: 'tariffsgrid'
					,id: 'tariff-grid'
				},{
					region: 'south'
					,xtype: 'intariffsgrid'
					,id: 'intariff-grid'
					,height: 250
					,collapsible: true
					,collapsed: App.settings.tasks['intariff-grid-collapsed']
					,split: true
				}]
				,listeners:{
					'beforeclose': function(){
						this.cookie['intariff-grid-collapsed']=Ext.getCmp('intariff-grid').collapsed;
					}
					,scope: this
				}
			});
		}
		win.show();
	}
	,winTariff : function(){ //winTariff
		var t = this.getContext();
		var win = Ext.getCmp('win_tariff');
		if (win == undefined) {
			App.request({
				url: '/ajax/tariffs/wintariff'
				,success: function(r, o){
					var res = Ext.decode(r.responseText);
					var dateofcheck = new Ext.form.ComboBox({
						store: new Ext.data.SimpleStore({
							fields: ['id', 'day'],
							data: [[0, 'Нет'], [1, '1 день'], [2, '2 дня'], [3, '3 дня'], [4, '4 дня'], [5, '5 дней'], [6, '6 дней'], [7, '7 дней'], [8, '8 дней'], [9, '9 дней'], [10, '10 дней']]
						}),
						valueField: 'id',
						displayField: 'day',
						id: 'dateofcheck',
						fieldLabel: 'Отстрочка платежа',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						valueNotFoundText: '',
						selectOnFocus: true,
						allowBlank: false,
						editable: false,
						value: t.dateofcheck
					});
					var id_sluice = new Ext.form.ComboBox({
						store: new Ext.data.JsonStore({
							//url: '/ajax/sluices/list'
							fields: ['id', 'sluicename']
							,data: res.sluice
//								,autoLoad: true
//								,listeners: {
//									'load': function(){
//										id_sluice.setValue(t.id_sluice);
//									}
//								}
						}),
						loadMask: true,
						valueField: 'id',
						displayField: 'sluicename',
						id: 'id_sluice',
						fieldLabel: 'Шлюз',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						valueNotFoundText: 'Не установлен!',
						selectOnFocus: true,
						allowBlank: false,
						editable: false,
						value: t.id_sluice
					});
					var check_mb = new Ext.form.ComboBox({
						store: new Ext.data.SimpleStore({
							fields: ['id', 'check'],
							data: [[0, 'Нет'], [1, 'Да']]
						}),
						valueField: 'id',
						displayField: 'check',
						id: 'check_mb',
						fieldLabel: 'Отключать если нет Мб',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						valueNotFoundText: '',
						selectOnFocus: true,
						allowBlank: false,
						editable: false,
						value: t.check_mb
					});
		
					var formPanel = new Ext.FormPanel({
						frame: true
						,border: false
						,bodyStyle: 'padding:0 10px 10px 0'
				        ,defaultType: 'textfield'
						,labelWidth: 170
						,labelAlign: 'right'
				        ,defaults: {
							anchor: '95%',
				            allowBlank: false,
				            msgTarget: 'side'
				        }
						,items:
						[{
							id: 'tariffname'
							,fieldLabel: 'Наименование'
							,value: t.tariffname
		
						},{
							id: 'dailyfee'
							,fieldLabel: 'Абонплата за день'
							,allowNegative: false
							,xtype:'numberfield'
							,value: t.dailyfee
						},{
							id: 'monthlyfee'
							,fieldLabel: 'Абонплата за месяц'
							,allowNegative: false
							,xtype:'numberfield'
							,value: t.monthlyfee
						},{
							id: 'freebyte'
							,fieldLabel: 'Предоплаченных Мб'
							,allowNegative: false
							,xtype:'numberfield'
							,decimalPrecision: 3
							,value: t.freebyte
						},{
							id: 'bonus'
							,fieldLabel: 'Бонусных Мб'
							,allowNegative: false
							,xtype:'numberfield'
							,decimalPrecision: 3
							,value: t.bonus
						},{
							id: 'mindeposit'
							,fieldLabel: 'Минимальный депозит'
							,allowNegative: true
							,xtype:'numberfield'
							,value: t.mindeposit
						},{
							id: 'freemblimit',
							fieldLabel: 'Минимальный остаток Мб',
							allowNegative: false,
							xtype: 'numberfield',
							decimalPrecision: 3,
							value: t.freemblimit
						},{
							id: 'weightmb'
							,fieldLabel: 'Вес Мб'
							,xtype:'numberfield'
							,decimalPrecision: 3
							,value: t.weightmb
						},{
							id: 'priceout'
							,fieldLabel: 'Цена вх. трафика за Мб'
							,value: t.priceout
							,xtype:'numberfield'
							,decimalPrecision: 3
						},{
							id: 'pricein'
							,fieldLabel: 'Цена исх. трафика за Мб'
							,value: t.pricein
							,xtype:'numberfield'
							,decimalPrecision: 3
						},{
							id: 'price'
							,fieldLabel: 'Цена дополнительных Мб'
							,value: t.price
							,xtype:'numberfield'
							,decimalPrecision: 3
						},{
							id: 'in_pipe'
							,fieldLabel: 'Входящая скорость(Кбит/с)'
							,allowNegative: false
							,xtype:'numberfield'
							,allowDecimals: false
							,value: t.in_pipe
						},{
							id: 'out_pipe'
							,fieldLabel: 'Исходящая скорость(Кбит/с)'
							,allowNegative: false
							,xtype:'numberfield'
							,allowDecimals: false
							,value: t.out_pipe
						}, dateofcheck, id_sluice, check_mb]					
					});
					var form = formPanel.getForm();
		
					var win = new Ext.Window({
						title: t.mode==0?'Новый тариф':'Свойства тарифа - ' + t.tariffname
						,id: 'win_tariff'
						,width: 400
						,height: 500
						,minWidth: 400
						,minHeight: 500
						,layout: 'fit'
						,modal: true
						,items: formPanel
						,buttons: [{
							text: 'Ok',
							handler: function(){
								if (form.isValid()) {
									var post = {
										tariffname  : ''
										,dailyfee	: ''
										,monthlyfee	: ''
										,freebyte	: ''
										,bonus		: ''
										,mindeposit	: ''
										,freemblimit: ''
										,weightmb	: ''
										,pricein	: ''
										,priceout	: ''
										,price		: ''
										,in_pipe	: ''
										,out_pipe	: ''
										,dateofcheck: ''
										,id_sluice	: ''
										,check_mb	: ''
									};
									for (o in post) 
										if (Ext.getCmp(o)) 
											post[o] = Ext.getCmp(o).getValue();
									if (t.mode==1)
										post.id = t.id;
									App.request({
										url: t.mode==0?'/ajax/tariffs/add':'ajax/tariffs/edit',
										success: function(r, o){
											win.hide();
											win.destroy();
											Ext.getCmp('tariff-grid').getStore().reload();
											Ext.getCmp('intariff-grid').getStore().removeAll();
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
				,scope: this
			});
		}
	}//end winTariff
	,winInTariff : function(){ //winInTariff
		var t = this.getContext();
		var win = Ext.getCmp('win_intariff');
		if (win == undefined) {
			App.request({
				url: '/ajax/tariffs/winintariff'
				,success: function(r, o){
					var res = Ext.decode(r.responseText);
					var id_zone = new Ext.form.ComboBox({
						store: new Ext.data.JsonStore({
							fields: ['id', 'zonename']
							,data: res.zone
						}),
						loadMask: true,
						valueField: 'id',
						displayField: 'zonename',
						id: 'idzone',
						fieldLabel: 'Зона',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						valueNotFoundText: 'Не установлена!',
						selectOnFocus: true,
						allowBlank: false,
						editable: false,
						forceSelection: true,
						value: t.zone.idzone
					});

					var id_flags = new Ext.form.ComboBox({
						store: new Ext.data.JsonStore({
							fields: ['id', 'flagname']
							,data: res.flag
						}),
						loadMask: true,
						valueField: 'id',
						displayField: 'flagname',
						id: 'flag',
						fieldLabel: 'Метод расчета',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						valueNotFoundText: 'Не установлен!',
						selectOnFocus: true,
						allowBlank: false,
						editable: false,
						forceSelection: true,
						value: t.zone.flag
					});

					var formPanel = new Ext.FormPanel({
						frame: true
						,border: false
						,bodyStyle: 'padding:0 10px 10px 20px'
				        ,defaultType: 'textfield'
						,labelWidth: 150
						,labelAlign: 'right'
				        ,defaults: {
							anchor: '95%',
				            allowBlank: false,
				            msgTarget: 'side'
				        }
						,items:[
							id_zone
						,{
							id: 'priceout'
							,fieldLabel: 'Цена вх. трафика за Мб'
							,value: t.zone.priceout
							,vtype:'money'
						},{
							id: 'pricein',
							fieldLabel: 'Цена исх. трафика за Мб',
							value: t.zone.pricein,
							vtype: 'money'
						},{
							id: 'weightmb',
							allowNegative: false,
							xtype: 'numberfield',
							allowDecimals: true,
							fieldLabel: 'Вес Мб',
							value: t.zone.weightmb
						}
						,	id_flags
						,{
							id: 'in_pipe'
							,fieldLabel: 'Вх. скорость(Кбит/с)'
							,allowNegative: false
							,xtype:'numberfield'
							,allowDecimals: false
							,value: t.zone.in_pipe
						},{
							id: 'out_pipe',
							fieldLabel: 'Исх. скорость(Кбит/с)',
							allowNegative: false,
							xtype: 'numberfield',
							allowDecimals: false,
							value: t.zone.out_pipe
//							},{
//								xtype:'fieldset',
//						        title: 'Актуально по дням',
//						        autoHeight: true,
//						        layout: 'form',
//								defaultType: 'textfield',
//						        items: 
//								[{
//					                xtype: 'checkboxgroup',
//					                hideLabel: true,
//					                columns: 2,
//									style: 'padding:0 0 0 30px',
//									vertical: true,
//					                items: [
//					                    {boxLabel: 'Понедельник', 	name: 'cb_1', id: 'cb_1', checked: t.zone.cb_1, itemCls: 'week'},
//					                    {boxLabel: 'Вторник',		name: 'cb_2', id: 'cb_2', checked: t.zone.cb_2, itemCls: 'week'},
//					                    {boxLabel: 'Среда', 		name: 'cb_3', id: 'cb_3', checked: t.zone.cb_3, itemCls: 'week'},
//					                    {boxLabel: 'Четверг', 		name: 'cb_4', id: 'cb_4', checked: t.zone.cb_4, itemCls: 'week'},
//					                    {boxLabel: 'Пятница', 		name: 'cb_5', id: 'cb_5', checked: t.zone.cb_5, itemCls: 'week'},
//					                    {boxLabel: 'Суббота', 		name: 'cb_6', id: 'cb_6', checked: t.zone.cb_6, itemCls: 'weekend'},
//					                    {boxLabel: 'Воскресенье', 	name: 'cb_0', id: 'cb_0', checked: t.zone.cb_0, itemCls: 'weekend'}
//					                ]
//								},{
//									xtype:'panel'
//									,layout:'column'
//									,items:
//									[{
//										layout: 'form'
//										,columnWidth: .5
//										,labelWidth: 25
//										,items:
//										[{
//											id: 'timestart'
//											,xtype:'timefield'
//											,fieldLabel: 'С'
//											,width: 80
//											,format: 'H:i:s'
//											,value: t.zone.timestart
//										}]
//									},{
//										layout: 'form'
//										,columnWidth: .5
//										,labelWidth: 25
//										,items:
//										[{
//											id: 'timestop'
//											,xtype:'timefield'
//											,fieldLabel: 'по'
//											,width: 80
//											,format: 'H:i:s'
//											,value: t.zone.timestop
//										}]
//									}]
//								}]
						}]
					});
					var form = formPanel.getForm();
					var win = new Ext.Window({
						title: t.zone.mode==0?'Добавить зону в тариф - '+ t.tariffname:'Свойства зоны - '+t.zone.zonename+' ('+t.tariffname+')'
						,id: 'win_intariff'
						,width: 400
						,height: 270
						,minWidth: 400
						,minHeight: 270
						,layout: 'fit'
						,modal: true
						,items: formPanel
						,buttons: [{
							text: 'Ok',
							handler: function(){
								if (form.isValid()) {
									var post = {
										idzone		: ''
										,pricein	: ''
										,priceout	: ''
										,flag		: ''
//											,cb_1		: ''
//											,cb_2		: ''
//											,cb_3		: ''
//											,cb_4		: ''
//											,cb_5		: ''
//											,cb_6		: ''
//											,cb_0		: ''
//											,timestart	: ''
//											,timestop	: ''
										,in_pipe	: ''
										,out_pipe	: ''
										,weightmb	: ''		
									};
									for (o in post) 
										if (Ext.getCmp(o)) 
											post[o] = Ext.getCmp(o).getValue();
									if (t.zone.mode==1)
										post.id = t.zone.id;
									post.idtariff = t.id;
									App.request({
										url: t.zone.mode==0?'/ajax/tariffs/addzone':'ajax/tariffs/editzone',
										success: function(r, o){
											win.hide();
											win.destroy();
											Ext.getCmp('intariff-grid').getStore().reload();
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
				,scope: this
			});
		}
	}//end winInTariff
	
}));