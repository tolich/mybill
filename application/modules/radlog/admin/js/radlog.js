Ext.namespace('Ext.app.Radlog');

Ext.app.Radlog.Show = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Просмотр лога подключений',
		iconCls: 'radlog',
		disabled: App.isDeny('radlog', 'view'),
		handler: function(){
			App.getModule('radlog').onShow();
		}
	}, config));
}

Ext.app.Radlog.Tab = function(){
	Ext.getCmp('info-tabpanel').add({
		id:'radlog-tab'
		,title: 'Лог подключений'
		,closable:true
		,iconCls:'radlog'
		,xtype: 'radlogrtgrid'
        ,tabPosition: 'bottom'
	});
	Ext.getCmp('info-tabpanel').setActiveTab('radlog-tab');
};

Ext.app.Radlog.BaseTab = function(){
	Ext.getCmp('base-panel').add({
		id:'radlog-basetab'
		,title: 'Лог подключений'
		,closable:true
		,iconCls:'radlog'
		,xtype: 'radlogrtgrid'
        ,tabPosition: 'bottom'
	});
	Ext.getCmp('base-panel').setActiveTab('radlog-basetab');
};

Ext.app.Radlog.RealTimeGridRecord = Ext.data.Record.create(
    [{
        name: 'level',
        type: 'sring'
    },{    
        name: 'logdate',
        type: 'string'
    },{    
        name: 'username',
        type: 'sring'
    },{    
        name: 'msg',
        type: 'sring'
    }]
);

Ext.app.Radlog.RealTimeGrid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
        var store = new Ext.data.JsonStore({
//            url: App.proxy('/ajax/modules/radlog/act/settings'),
			root: 'data',
			totalProperty: 'totalCount',
            fields: Ext.app.Radlog.RealTimeGridRecord
        });
//        store.load();
        var level = new Ext.app.Radlog.LevelIcon();
		var cm = new Ext.grid.ColumnModel([level,{
			header: "Дата"
			,dataIndex: 'logdate'
            ,width: 45
        },{
			header: "Логин"
			,dataIndex: 'username'
            ,width: 25
            ,align: 'center'
        },{
			header: "Сообщение"
			,dataIndex: 'msg'
        }]);
        
        var pageBar = new Ext.PagingToolbar({
			pageSize: 5,
			store: store,
			displayInfo: true
		});
        
        Ext.apply(this, {
            store: store,
            cm: cm,
			trackMouseOver: true,
			view: new Ext.grid.GridView({
				forceFit: true
            }),
            listeners: {
            }
//			bbar: pageBar
        });
        Ext.app.Radlog.RealTimeGrid.superclass.initComponent.apply(this, arguments);
    }
    ,onRender: function(){
        var g = this;
        App.getModule('radlog').loadDepends(function(){
            this.realplexor.subscribe("admin", function (result, id) {
                var r = new Ext.app.Radlog.RealTimeGridRecord(result);
                g.store.insert(0,r);
                var count = g.store.getCount();
                if (count > 50) {
                    g.store.remove(g.store.getRange(50));
                }
            });
            this.realplexor.execute();
            g.on('destroy', function(){
                this.realplexor.unsubscribe("admin", null);
                this.realplexor.execute();
            },this);
        });
        Ext.app.Radlog.RealTimeGrid.superclass.onRender.apply(this, arguments);
    }
});
Ext.reg('radlogrtgrid', Ext.app.Radlog.RealTimeGrid);

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'radlog'
    ,depends: [
        'realplexor/dklab_realplexor.js'
    ]
    
	,onInit: function(){
		this.uid = Ext.id();
		App.addModuleMenuItem(this.moduleId, Ext.app.Radlog.Show);
	}
    ,onLoadDepends: function(){
        this.realplexor = new Dklab_Realplexor(
            "http://rlp.stat.svs-tv.lan/"
            //"demo_" // namespace
        );
    }
	,onShow: function(){
		this.winLog();
	}
	,winLog : function(){ //winLog
        if (App.isDeny('radlog', 'view')) return;

        
		var win = Ext.getCmp('win_radlog');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Лог подключений',
				id: 'win_radlog',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				layout: 'fit',
				plain: true	
				,modal: true
				,tools:[{
					id:'down'
					,handler:function(){
						win.close();
						Ext.app.Radlog.Tab();
					}
				},{
					id:'up'
					,handler:function(){
						win.close();
						Ext.app.Radlog.BaseTab();
					}
//				},{
//					id:'gear'
//            		,hidden: App.isDeny('radlog', 'edit')
//					,handler:function(){
//						this.winSettings();
//					}
//                    ,scope: this
                }]
				,items: [{
                    xtype:'radlogrtgrid'
                }]
			});
		}
		win.show();
	}//end winLog
}));

Ext.app.Radlog.LevelIcon = function(config){
    Ext.apply(this, config);

    this.addEvents({
        beforeexpand : true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });

    Ext.app.Radlog.LevelIcon.superclass.constructor.call(this);
};

Ext.extend(Ext.app.Radlog.LevelIcon, Ext.util.Observable, {
    header: "",
    width: 25,
    sortable: false,
    fixed:true,
    dataIndex: '',
//    id: 'arrower',
    lazyRender : true,
	menuDisabled : true,
    init : function(grid){
        this.grid = grid;
        var view = grid.getView();
    },
    renderer : function(v, p, record){
        //p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-level'+record.get('level')+'">&#160;</div>';
    }
});
