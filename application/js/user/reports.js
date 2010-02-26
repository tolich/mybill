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
		var sg = new Reports.gridStat({
			id:'tab-stat'
			,closable:true
			,iconCls:'tab-link'
		});
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
			//region: 'center',
			margins: '0 5 5 0',
			title: '������� ��������',
			store: store,
			columns: [
				{
					header: 'id'
					,dataIndex:'id'
					,hidden: true
				},{
					header: '���� �������'
					,dataIndex: 'datepayment'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
				},{
					header: '�����'
					,dataIndex: 'amount'
					,align: 'right'
				},{
					header: '�� �������'
					,dataIndex: 'amountdeposit'
					,align: 'right'
				},{
					header: '�� �������. ��'
					,dataIndex: 'amountfreebyte'
					,align: 'right'
				},{ 
					header: '�� �����. ��'
					,dataIndex: 'amountbonus'
					,align: 'right'
				},{
					header: '���������'
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
			title: '������� �������',
			store: store,
			columns: [
				{
					header:'�����'
					,dataIndex:'tariffname'
					,sortable:true
				},{
					header:'���� ���������'
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
			,fields: [{name:'acctstarttime',type:'date',dateFormat:'Y-m-d H:i:s'}, {name:'acctstoptime',type:'date',dateFormat:'Y-m-d H:i:s'}, 'acctsessiontime', 'acctinputoctets', 'acctoutputoctets','callingstationid']
			,id: 'id'
			,remoteSort: true
			,sortInfo:{field:'acctstarttime', direction:'desc'}
			,baseParams: {limit:pageLimit}
		});
        Ext.apply(this, {
			//region: 'center',
			margins: '0 5 5 0',
			title: '���������� �����������',
			store: store,
			columns: [
				{
					header: '������ ������',
					dataIndex:'acctstarttime'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
				},{ 
					header: '����� ������',
					dataIndex:'acctstoptime'
					,renderer: Ext.util.Format.dateRenderer('d.m.Y H:i:s')
				},{
					header: '������������ (���.)',
					dataIndex:'acctsessiontime',
					align:'right'
					,renderer: function(v){
						var d = Math.floor(v/86400);
						var h = Math.floor((v-d*86400)/3600);
						var m = Math.floor((v-d*86400-h*3600)/60);
						var s = v-d*86400-h*3600-m*60;
						return (d!=0?d+" �� ":"")+(h!=0?h+" � ":"")+(m!=0?m+" ��� ":"")+s+" ���"
					}
				},{
					header: '���. ����. (����)',
					dataIndex:'acctinputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: '��. ����. (����)',
					dataIndex:'acctoutputoctets',
					align:'right',
					renderer: function(v){
						return Ext.util.Format.fileSize(v)
					}
				},{
					header: '����������',
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

Reports.gridInTariff = Ext.extend(Ext.grid.GridPanel,{
    initComponent:function() {
		var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/reports/intariff')
			,fields: ['zonename', 'weightmb', 'pricein', 'priceout', 'in_pipe', 'out_pipe', 'flagname']
		});

        Ext.apply(this, {
			//region: 'center',
			margins: '0 5 5 0',
			title: '���������� �� �����',
			store: store,
			columns: [
				{
					header:'����'
					,dataIndex:'zonename'
				},{
					header:'��� ��'
					,dataIndex:'weightmb'
					,align: 'right'
				},{
					header:'��������� ��.�������'
					,dataIndex:'pricein'
					,align: 'right'
				},{
					header:'��������� ���.�������'
					,dataIndex:'priceout'
					,align: 'right'
				},{
					header:'���.��������'
					,dataIndex:'in_pipe'
					,renderer: function(v,p,r){
						return Ext.util.Format.rateSpeed(v)
					}
				},{
					header:'��.��������'
					,dataIndex:'out_pipe'
					,renderer: function(v,p,r){
						return Ext.util.Format.rateSpeed(v)
					}
				},{
					header:'��� �������'
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
