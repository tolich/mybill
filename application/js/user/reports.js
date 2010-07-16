Ext.SSL_SECURE_URL="/shared/icons/s.gif"; 
Ext.BLANK_IMAGE_URL="/shared/icons/s.gif";
Ext.namespace('Reports');
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';
//Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

Reports.context = {};
Reports.showStat = function(){
	var sg = Ext.getCmp('tab-stat');
	if (!sg){
		var sg = new Ext.TabPanel({
            title: 'Статистика подключений'
			,id:'tab-stat'
			,closable:true
			,iconCls:'tab-link'
            ,activeTab: 0
            ,tabPosition:'bottom'
            ,items: [{
                xtype: 'statgrid'    
            },{   
                xtype: 'daystatgrid'    
            },{   
                xtype: 'monthstatgrid'    
            }]
        })
		Ext.getCmp('center-panel').add(sg);
	}
	Ext.getCmp('center-panel').activate('tab-stat')
};

Reports.showPayments = function(){
	var sg = Ext.getCmp('tab-pay');
	if (!sg){
		var sg = new Reports.gridPay({
			id:'tab-pay'
			,closable:true
			,iconCls:'tab-payment'
		});
		Ext.getCmp('center-panel').add(sg);
	}
	Ext.getCmp('center-panel').activate('tab-pay')
};

Reports.showTariffs = function(){
	var sg = Ext.getCmp('tab-tariff');
	if (!sg){
		var sg = new Reports.gridTariff({
			id:'tab-tariff'
			,closable:true
			,iconCls:'tab-tariff'
		});
		Ext.getCmp('center-panel').add(sg);
	}
	Ext.getCmp('center-panel').activate('tab-tariff')
};

Reports.showInTariff = function(){
	var sg = Ext.getCmp('tab-intariff');
	if (!sg){
		var sg = new Reports.gridInTariff({
			id:'tab-intariff'
			,closable:true
			,iconCls:'tab-intariff'
		});
		Ext.getCmp('center-panel').add(sg);
	} else {
		sg.store.reload();
	}
	Ext.getCmp('center-panel').activate('tab-intariff');

};

Reports.gridPay = Ext.extend(Ext.grid.GridPanel,{
    initComponent:function() {
    	var pageLimit = 50;
    
		var store = new Ext.data.JsonStore({
			url: ('/ajax/reports/payments')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields: ['id',{name:'datepayment',type:'date',dateFormat:'Y-m-d H:i:s'}, 'amount', 'amountdeposit','amountfreebyte', 'amountbonus','lastdeposit', 'lastfreebyte', 'lastbonus', 'description', 'status']
			,id: 'id'
			,remoteSort: true
			,sortInfo:{field:'id', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});
        Ext.apply(this, {
			margins: '0 5 5 0',
			title: 'История платежей',
			store: store,
			columns: [
				{
					header: 'id'
					,dataIndex:'id'
					,hidden: true
				},{
					header: 'Дата платежа'
					,dataIndex: 'datepayment'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
				},{
					header: 'Сумма'
					,dataIndex: 'amount'
					,align: 'right'
				},{
					header: 'На депозит'
					,dataIndex: 'amountdeposit'
					,align: 'right'
				},{
					header: 'На предопл. Мб'
					,dataIndex: 'amountfreebyte'
					,align: 'right'
				},{ 
					header: 'На бонус. Мб'
					,dataIndex: 'amountbonus'
					,align: 'right'
				},{
					header: 'Основание'
					,dataIndex: 'description'
					,align: 'right'
				}
			],
			trackMouseOver: true,
			autoScroll :true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
			loadMask: true,
			viewConfig: {
				forceFit: true
			},
			bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
        });

        Reports.gridPay.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Reports.gridPay.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('paygrid', Reports.gridPay);

Reports.gridTariff = Ext.extend(Ext.grid.GridPanel,{
    initComponent:function() {
    	var pageLimit = 50;
    
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/reports/tariff')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields: ['tariffname', {name:'rdate',type:'date',dateFormat:'Y-m-d H:i:s'}]
			,id: 'id'
			,remoteSort: true
			,sortInfo:{field:'rdate', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});

        Ext.apply(this, {
			//region: 'center',
			margins: '0 5 5 0',
			title: 'История тарифов',
			store: store,
			columns: [
				{
					header:'Тариф'
					,dataIndex:'tariffname'
					,sortable:true
				},{
					header:'Дата активации'
					,dataIndex:'rdate'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
					,sortable:true
				}],
			trackMouseOver: true,
			autoScroll :true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
			loadMask: true,
			viewConfig: {
				forceFit: true
			},
			bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
        });

        Reports.gridTariff.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Reports.gridTariff.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('tariffgrid', Reports.gridTariff);


Reports.gridStat = Ext.extend(Ext.grid.GridPanel,{
    initComponent:function() {
    	var pageLimit = 50;
    
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/reports/stat')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields: [{name:'acctstarttime',type:'date',dateFormat:'Y-m-d H:i:s'}, 
                        {name:'acctstoptime',type:'date',dateFormat:'Y-m-d H:i:s'}, 
                        'acctsessiontime', 'acctinputoctets', 'acctoutputoctets','callingstationid']
			,id: 'id'
			,remoteSort: true
			,sortInfo:{field:'acctstarttime', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});
        Ext.apply(this, {
			//region: 'center',
			margins: '0 5 5 0',
			title: 'По сессиям',
			store: store,
			columns: [
				{
					header: 'Начало сессии',
					dataIndex:'acctstarttime'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
				},{ 
					header: 'Конец сессии',
					dataIndex:'acctstoptime'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
				},{
					header: 'Длительность',
					dataIndex:'acctsessiontime',
					align:'right'
					,renderer: function(v){
						var d = Math.floor(v/86400);
						var h = Math.floor((v-d*86400)/3600);
						var m = Math.floor((v-d*86400-h*3600)/60);
						var s = v-d*86400-h*3600-m*60;
						return (d!=0?d+" дн ":"")+(h!=0?h+" ч ":"")+(m!=0?m+" мин ":"")+s+" сек"
					}
				},{
					header: 'Исх. траф. (байт)',
					dataIndex:'acctinputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: 'Вх. траф. (байт)',
					dataIndex:'acctoutputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: 'Информация',
					dataIndex:'callingstationid',
					width: 170,
					align: 'center'
				}
			],
			trackMouseOver: true,
			stripeRows:true,
			autoScroll :true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
			loadMask: true,
			viewConfig: {
				forceFit: true
			},
			bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
        });

        Reports.gridStat.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Reports.gridStat.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('statgrid', Reports.gridStat);

Reports.gridStatDay = Ext.extend(Ext.grid.GridPanel,{
    initComponent:function() {
    	var pageLimit = 50;
    
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/reports/statday')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields: [{name:'rdate',type:'date',dateFormat:'Y-m-d'}, 
                        'sumsessiontime', 'suminputoctets', 'sumoutputoctets','countsessions']
			,id: 'id'
			,remoteSort: true
			,sortInfo:{field:'rdate', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});
        Ext.apply(this, {
			//region: 'center',
			margins: '0 5 5 0',
			title: 'По дням',
			store: store,
			columns: [
				{
					header: 'Дата подключения',
					dataIndex:'rdate'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y, l')
				},{
					header: 'Длительность',
					dataIndex:'sumsessiontime',
					align:'right'
					,renderer: function(v){
						var d = Math.floor(v/86400);
						var h = Math.floor((v-d*86400)/3600);
						var m = Math.floor((v-d*86400-h*3600)/60);
						var s = v-d*86400-h*3600-m*60;
						return (d!=0?d+" дн ":"")+(h!=0?h+" ч ":"")+(m!=0?m+" мин ":"")+s+" сек"
					}
				},{
					header: 'Исх. траф. (байт)',
					dataIndex:'suminputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: 'Вх. траф. (байт)',
					dataIndex:'sumoutputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: 'Количество подключений',
					dataIndex:'countsessions',
					align:'right'
				}
			],
			trackMouseOver: true,
			stripeRows:true,
			autoScroll :true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
			loadMask: true,
			viewConfig: {
				forceFit: true
			},
			bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
        });

        Reports.gridStatDay.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Reports.gridStatDay.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('daystatgrid', Reports.gridStatDay);

Reports.gridStatMonth = Ext.extend(Ext.grid.GridPanel,{
    initComponent:function() {
    	var pageLimit = 50;
    
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/reports/statmonth')
			,root: 'data'
			,totalProperty: 'totalCount'
			,fields: [{name:'datestart',type:'date',dateFormat:'Y-m-d H:i:s'}, 
                      {name:'datefinish',type:'date',dateFormat:'Y-m-d H:i:s'},
                        'sumsessiontime', 'suminputoctets', 'sumoutputoctets','countsessions']
			,id: 'id'
			,remoteSort: true
			,sortInfo:{field:'datestart', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});
        Ext.apply(this, {
			//region: 'center',
			margins: '0 5 5 0',
			title: 'По месяцам',
			store: store,
			columns: [
				{
					header: 'С',
					dataIndex:'datestart'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y, l')
				},{
					header: 'По',
					dataIndex:'datefinish'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y, l')
				},{
					header: 'Длительность',
					dataIndex:'sumsessiontime',
					align:'right'
					,renderer: function(v){
						var d = Math.floor(v/86400);
						var h = Math.floor((v-d*86400)/3600);
						var m = Math.floor((v-d*86400-h*3600)/60);
						var s = v-d*86400-h*3600-m*60;
						return (d!=0?d+" дн ":"")+(h!=0?h+" ч ":"")+(m!=0?m+" мин ":"")+s+" сек"
					}
				},{
					header: 'Исх. траф. (байт)',
					dataIndex:'suminputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: 'Вх. траф. (байт)',
					dataIndex:'sumoutputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: 'Количество подключений',
					dataIndex:'countsessions',
					align:'right'
				}
			],
			trackMouseOver: true,
			stripeRows:true,
			autoScroll :true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
			loadMask: true,
			viewConfig: {
				forceFit: true
			},
			bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				displayInfo: true
			})
        });

        Reports.gridStatMonth.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0}});

        Reports.gridStatMonth.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('monthstatgrid', Reports.gridStatMonth);

Reports.gridInTariff = Ext.extend(Ext.grid.GridPanel,{
    initComponent:function() {
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/reports/intariff')
			,fields: ['zonename', 'weightmb', 'pricein', 'priceout', 'in_pipe', 'out_pipe', 'flagname']
		});

        Ext.apply(this, {
			//region: 'center',
			margins: '0 5 5 0',
			title: 'Информация по зонам',
			store: store,
			columns: [
				{
					header:'Зона'
					,dataIndex:'zonename'
				},{
					header:'Вес МБ'
					,dataIndex:'weightmb'
					,align: 'right'
				},{
					header:'Стоимость вх.трафика'
					,dataIndex:'pricein'
					,align: 'right'
				},{
					header:'Стоимость исх.трафика'
					,dataIndex:'priceout'
					,align: 'right'
				},{
					header:'Исх.скорость'
					,dataIndex:'in_pipe'
					,renderer: function(v,p,r){
						return Ext.util.Format.rateSpeed(v)
					}
				},{
					header:'Вх.скорость'
					,dataIndex:'out_pipe'
					,renderer: function(v,p,r){
						return Ext.util.Format.rateSpeed(v)
					}
				},{
					header:'Как считать'
					,dataIndex:'flagname'
				}
			],
			trackMouseOver: true,
			autoScroll :true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
			}),
			loadMask: true,
			viewConfig: {
				forceFit: true
			}
        });

        Reports.gridInTariff.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();

        Reports.gridInTariff.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('intariffgrid', Reports.gridInTariff);
