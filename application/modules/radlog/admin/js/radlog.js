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

// Грид настроек
//Ext.app.Radlog.Grid = Ext.extend(Ext.grid.GridPanel, {
//     border:false
//    ,initComponent: function(){
//        var Setting = Ext.data.Record.create([{
//            name: 'id',
//            type: 'int'
//        }, {
//            name: 'name',
//            type: 'string',
//            allowBlank: false
//        }, {
//            name: 'ifacename',
//            type: 'string',
//            allowBlank: false
//        },{
//            name: 'ip',
//            type: 'string',
//            allowBlank: false
//        },{
//            name: 'secret',
//            type: 'string',
//            allowBlank: false
//        },{
//            name: 'invert',
//            type: 'bool'
//        },{
//            name: 'disabled',
//            type: 'bool'
//        }]);
//        var invert = new Ext.grid.CheckColumn({
//           header: 'Инверт',
//           dataIndex: 'invert',
//           width: 55,
//           editor: {
//               xtype: 'checkbox'
//           }
//        });
//        var disabled = new Ext.grid.CheckColumn({
//           header: 'Откл',
//           dataIndex: 'disabled',
//           width: 55,
//           editor: {
//               xtype: 'checkbox'
//           }
//        });
//		var cm = new Ext.grid.ColumnModel([
//        {
//			header: "id"
//			,dataIndex: 'id'
//            ,hidden: true
//        },{
//			header: "Наименование"
//			,dataIndex: 'name'
//            ,editor: {
//                xtype: 'textfield'
//                ,allowBlank: false
//            }
//        }, {
//			header: "Интерфейс"
//			,dataIndex: 'ifacename'
//            ,editor: {
//                xtype: 'textfield'
//                ,allowBlank: false
//            }
//        },{
//			header: "IP",
//			dataIndex: 'ip',
//			align: 'center',
//            editor: {
//                xtype: 'textfield',
//                vtype: 'ip',
//                allowBlank: false
//            }
//        }, {
//			header: "Секрет"
//			,dataIndex: 'secret'
//            ,editor: {
//                xtype: 'textfield'
//                ,allowBlank: false
//            }
//        },invert,disabled]);		
//        
//		// create the Data Store
//    	var store = new Ext.data.JsonStore({
//			url: App.proxy('/ajax/modules/radlog/act/settings')
//            ,autoDestroy: true  
//            ,root: 'data'
//			,fields: Setting //['id','name','ifacename','ip','secret','invert','disabled']
//			,id: 'id'
//            ,writer: new Ext.data.JsonWriter({
//                encode: true,
//                writeAllFields: true // write all fields, not just those that changed
//            })
//		});
//        var editor = new Ext.ux.grid.RowEditor({
//            clicksToEdit: 2,
//            saveText: 'Сохранить',
//            cancelText: 'Отмена',
//            commitChangesText: 'Вы должны сохранить или отменить Ваши изменения',
//            errorText: 'Ошибка'
//        });
//        
//        Ext.apply(this, {
//			margins: '0 5 5 0',
//			store: store,
//			cm: cm,
//			trackMouseOver: true,
//			autoScroll :true,
//            plugins: [editor],
//			loadMask: true,
//			sm: new Ext.grid.RowSelectionModel({
//				singleSelect: true
//			}),
//			viewConfig:{
//				enableRowBody: true
//				,forceFit: true
//            },
//            tbar: [{
//                text: 'Добавить'
//                ,iconCls: 'radlog_add'
//                ,handler: function(){
//                    var e = new Setting({
//                        name: '',
//                        ifacename: '',
//                        ip: '',
//                        secret: 'public',
//                        invert: 0
//                    });
//                    editor.stopEditing();
//                    this.store.insert(0, e);
////                    this.getView().refresh();
////                    this.getSelectionModel().selectRow(0);
//                    editor.startEditing(0,1);
//                    editor.on('afteredit', function(){
//                        this.store.reload();
//                    },this,{single: true});
//                    editor.on('canceledit', function(){
//                        this.store.remove(e);
//                    },this,{single: true});
//                }
//                ,scope: this
//            },'-',{
//                text: 'Удалить'
//                ,iconCls: 'radlog_delete'
//                ,handler: function(){
//                    var r;
//                    if (r = this.getSelectionModel().getSelected()){
//                		Ext.Msg.show({
//                			title:'Подтверждение',
//                			msg: 'Вы действительно хотите удалить <b>' + r.get('name') + '?</b>',
//                			buttons: Ext.MessageBox.YESNO,
//                			icon: Ext.MessageBox.QUESTION,
//                			width: '300',
//                			scope: this,
//                			fn: function(btn){
//                				if (btn == 'yes') {
//                                    editor.stopEditing();
//                                    this.store.remove(r);
//                				};
//                			}
//                		})
//                    }
//                }
//                ,scope: this
//            },'->',{
//                iconCls: 'refresh'
//                ,handler:function(){
//                    this.store.reload();    
//                }
//                ,scope: this
//            }]
//        });
//
//        Ext.app.Radlog.Grid.superclass.initComponent.apply(this, arguments);
//    } // eo function initComponent
//
//    ,onRender:function() {
//		this.store.load();
//        Ext.app.Radlog.Grid.superclass.onRender.apply(this, arguments);
//    } // eo function onRender
//});
//Ext.reg('radloggrid', Ext.app.Radlog.Grid);

//Ext.app.Radlog.Chart = Ext.extend(Ext.TabPanel,{
//    border: false
//    ,initComponent: function(){
//        App.getModule('radlog').loadDepends(function(){
//            var items = [];
//    	    App.request({
//                url: '/ajax/modules/radlog/act/charts'
//                ,success: function(r,o,res){
//                    for (var i=0,l=res.length; i<l;i++){
//                        var cfg = res[i];
//                	    items.push(new Ext.ux.HighchartPanel({
//                            title: cfg.name || 'График',
//                            layout:'fit',
//                            border: false,
//                            params:{
//                                iface: cfg.id    
//                            },
//                            chartConfig: {
//                				chart: {
//                					defaultSeriesType: 'spline'
//                				},
//                				title: {
//                					text: 'Загрузка канала ' + cfg.name
//                				},
//                				subtitle: {
//                					text: String.format('Хост: {1}, интерфейс: {0}',cfg.ifacename,cfg.ip)
//                				},
//                				xAxis: {
//                                    type: 'datetime',
//                                    gridLineWidth: 1,
//                					title: {
//                						text: 'Время'
//                					}
//                				},
//                				yAxis: {
//                                    min: 0,
//                                    gridLineWidth: 1,
//                					title: {
//                						text: 'МБит за секунду'
//                					}
//                				},
//                				legend: {
//                					enabled: true
//                				},
//                				tooltip: {
//                					formatter: function() {
//                		                return String.format('<b>{0}</b><br>Скорость: {2}<br>Дата: {1}', this.series.name, Highcharts.dateFormat('%d.%m.%Y %H:%M', this.x), Ext.util.Format.rateSpeed(this.y*1024*1024/8));
//                					}
//                				},
//                				plotOptions: {
//                					areaspline: {
//                                        fillColor: {
//                                            linearGradient: [0, 0, 0, 350],
//                                            stops: [[0, '#4572A7'], [1, 'rgba(0,0,0,0)']]
//                                        },
//                                        lineWidth: 1,
//                                        marker: {
//                                            enabled: false,
//                                            symbol: 'triangle-down',
//                                            radius: 2,
//                                            states: {
//                                               hover: {
//                                                  enabled: true
//                                               }
//                                            }
//                                        },
//                                        shadow: false
//                                    }
//                					,spline: {
//                                        marker: {
//                                            enabled: false,
//                                            symbol: 'triangle',
//                                            radius: 2,
//                                            states: {
//                                               hover: {
//                                                  enabled: true
//                                               }
//                                            }
//                                        }
//                					}
//                				},
//                				series: [{
//                                    type:'areaspline',
//                					name: 'Входящий трафик',
//                                    data: []
//                				},{
//                					name: 'Исходящий трафик',
//                                    data: []
//                                }]
//                            }
//                            ,bbar: ['->',{
//                                iconCls: 'refresh'
//                                ,handler: function(item){
//                                      return function(){
//                                         this.redraw(items[item])
//                                     };
//                                }(i)
//                                ,scope: this
//                            }]
//                            ,listeners: {
//                                'render': function(c){
//                                    c.renderChart();
//                                }
//                                ,'activate': function(c){
//                                    this.redraw(c)    
//                                }
//                                ,scope: this
//                            }
//                        }));
//                    }
//                    this.add(items);
//                    this.setActiveTab(0);
//                }
//                ,scope: this
//            });
//        }, this);
//        Ext.app.Radlog.Chart.superclass.initComponent.apply(this, arguments);
//    }
//    ,redraw: function(c){
//        App.request({
//            url: '/ajax/modules/radlog/act/getdata'
//            ,params: c.params
//            ,success: function(r,o,res){
//                var series = c.chart.series;
//                series[0].setData(res.indata, true);
//                series[1].setData(res.outdata, true);
//                c.chart.updatePosition();
//            }
//        })
//    }
//});
//Ext.reg('radlogchart', Ext.app.Radlog.Chart);

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
//    ,winSettings: function(){
//        if (App.isAllow('radlog', 'edit')){
//    		var win = Ext.getCmp('win_radlog_settings');
//    		if (win == undefined) {
//    			var win = new Ext.Window({
//    				title: 'Настройки',
//    				id: 'win_radlog_settings',
//    				width: 500,
//    				height: 250,
//    				minWidth: 400,
//    				minHeight: 250,
//    				layout: 'fit',
//    				plain: true	
//    				,modal: true
//                    ,items: [{
//                        xtype: 'radloggrid'
//                     }]
//    			});
//    		}
//    		win.show();
//        }
//    }
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
                    xtype: 'panel'
	    			,id: 'win_radlog_console'
                }]
			});
		}
		win.show(null,function(){
            var realplexor = new Dklab_Realplexor(
                "http://rlp.demo.mybill.net.ua/"
                //"demo_" // namespace
            );
            
            realplexor.subscribe("admin", function (result, id) {
                Ext.getCmp('win_radlog_console').update(result.data);
            });
            
            realplexor.execute();
        });
	}//end winChart
}));
