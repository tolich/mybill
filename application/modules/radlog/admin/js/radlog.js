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
		id:'radlog-charts-tab'
		,title: 'Лог подключений'
		,closable:true
		,iconCls:'radlog'
		,xtype: 'panel'
        ,tabPosition: 'bottom'
	});
	Ext.getCmp('info-tabpanel').setActiveTab('radlog-charts-tab');
};

Ext.app.Radlog.BaseTab = function(){
	Ext.getCmp('base-panel').add({
		id:'radlog-charts-basetab'
		,title: 'Лог подключений'
		,closable:true
		,iconCls:'radlog'
		,xtype: 'panel'
        ,tabPosition: 'bottom'
	});
	Ext.getCmp('base-panel').setActiveTab('radlog-charts-basetab');
};


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
    }
	,onShow: function(){
		this.winLog();
	}
	,winLog : function(){ //winLog
        if (App.isDeny('radlog', 'view')) return;
        var record = Ext.data.Record.create([{
            name: 'text',
            type: 'sring'
        }]);

        var store = new Ext.data.JsonStore({
//            url: App.proxy('/ajax/modules/radlog/act/settings'),
			root: 'data',
			totalProperty: 'totalCount',
            fields: ['text']
        });
//        store.load();
        
		var cm = new Ext.grid.ColumnModel([{
			header: "text"
			,dataIndex: 'text'
        }]);
        
        var pageBar = new Ext.PagingToolbar({
			pageSize: 5,
			store: store,
			displayInfo: true
		});
        
        var log = new Ext.grid.GridPanel({
            store: store,
            cm: cm,
			trackMouseOver: true,
			view: new Ext.grid.GridView({
				forceFit: true
            })
//			bbar: pageBar
        });
        
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
				,items: log
			});
		}
        var realplexor = new Dklab_Realplexor(
            "http://rlp.stat.svs-tv.lan/"
            //"demo_" // namespace
        );
        win.on('close', function(){
            realplexor.unsubscribe("admin", null);
            realplexor.execute();
        })
		win.show(null,function(){
            realplexor.subscribe("admin", function (result, id) {
                var r = new record({
                    text: result
                });
                store.insert(0,r);
                var count = store.getCount();
                if (count > 50) {
                    store.remove(store.getRange(50));
                }
            });
            realplexor.execute();
        });
	}//end winLog
}));
