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
            ,width: 45
            ,align: 'center'
        },{
			header: "Сообщение"
			,dataIndex: 'msg'
        }]);
        
        var statusBar = new Ext.ux.StatusBar({
            text: 'Работает'
            ,iconCls: 'radlog-run-active'
        });
        
        Ext.apply(this, {
            store: store,
            cm: cm,
			trackMouseOver: true,
			view: new Ext.grid.GridView({
				forceFit: true
            }),
            tbar: [{
                iconCls: 'radlog-run-active'
                ,id: 'radlog-btn-run'
                ,handler: function(btn_run){
                    btn_run.setIconClass('radlog-run-active');
                    Ext.getCmp('radlog-btn-stop').setIconClass('radlog-stop');
                    statusBar.setText('Работает');
                    statusBar.setIcon('radlog-run-active');
                    this.subscribe('admin');
                }
                ,scope: this
            },{
                iconCls: 'radlog-stop'
                ,id: 'radlog-btn-stop'
                ,handler: function(btn_stop){
                    Ext.getCmp('radlog-btn-run').setIconClass('radlog-run');
                    btn_stop.setIconClass('radlog-stop-active');
                    statusBar.setText('Остановлено');
                    statusBar.setIcon('radlog-stop-active');
                    this.unsubscribe('admin');
                }
                ,scope: this
            },'->',{
                iconCls: 'radlog-clean'
                ,id: 'radlog-btn-clean'
            }],
			bbar: statusBar
        });
        Ext.app.Radlog.RealTimeGrid.superclass.initComponent.apply(this, arguments);
    }
    ,subscribe: function(channel){
        var mod = App.getModule('radlog');
        var _this = this;
        mod.realplexor.subscribe(channel, function (result, id) {
            var r = new Ext.app.Radlog.RealTimeGridRecord(result);
            _this.store.insert(0,r);
            var count = _this.store.getCount();
            if (count > 200) {
                _this.store.remove(_this.store.getRange(200));
            }
        });
        mod.realplexor.execute();
    }
    ,unsubscribe: function(channel){
        var mod = App.getModule('radlog');
        mod.realplexor.unsubscribe(channel, null);
        mod.realplexor.execute();
    }
    ,onRender: function(){
        App.getModule('radlog').loadDepends(function(){
            this.subscribe('admin');
            this.on('destroy', function(){
                this.unsubscribe('admin');
            },this);
        },this);
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
            window.location.protocol+"//rlp."+window.location.hostname
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
    width: 20,
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
