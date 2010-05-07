Ext.namespace('Ext.app.Bandwidth');

Ext.app.Bandwidth.Show = function(config){
	return new Ext.Action(Ext.apply({
		text: 'График загрузки внешнего канала',
		iconCls: 'bandwidth',
		disabled: App.isDeny('bandwidth', 'view'),
		handler: function(){
			App.getModule('bandwidth').onShow();
		}
	}, config));
}

// Грид настроек
Ext.app.Bandwidth.Grid = Ext.extend(Ext.grid.GridPanel, {
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
            name: 'ifacename',
            type: 'string',
            allowBlank: false
        },{
            name: 'ip',
            type: 'string',
            allowBlank: false
        },{
            name: 'secret',
            type: 'string',
            allowBlank: false
        },{
            name: 'invert',
            type: 'bool'
        }]);
        var invert = new Ext.grid.CheckColumn({
           header: 'Инверт',
           dataIndex: 'invert',
           width: 55,
           editor: {
               xtype: 'checkbox'
           }
        });
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
			header: "Интерфейс"
			,dataIndex: 'ifacename'
            ,editor: {
                xtype: 'textfield'
                ,allowBlank: false
            }
        },{
			header: "IP",
			dataIndex: 'ip',
			align: 'center',
            editor: {
                xtype: 'textfield',
                vtype: 'ip',
                allowBlank: false
            }
        }, {
			header: "Секрет"
			,dataIndex: 'secret'
            ,editor: {
                xtype: 'textfield'
                ,allowBlank: false
            }
        },invert]);		
        
		// create the Data Store
    	var store = new Ext.data.JsonStore({
			url: App.proxy('/ajax/modules/bandwidth/act/settings')
            ,autoDestroy: true  
            ,root: 'data'
			,fields: Setting //['id','name','ifacename','ip','secret','invert']
			,id: 'id'
            ,writer: new Ext.data.JsonWriter({
                encode: true,
                writeAllFields: true // write all fields, not just those that changed
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
			}),
			viewConfig:{
				enableRowBody: true
				,forceFit: true
            },
            tbar: [{
                text: 'Добавить'
                ,handler: function(){
                    var e = new Setting({
                        name: '',
                        ifacename: '',
                        ip: '',
                        secret: 'public',
                        invert: 0
                    });
                    editor.stopEditing();
                    this.store.insert(0, e);
//                    this.getView().refresh();
//                    this.getSelectionModel().selectRow(0);
                    editor.startEditing(0,1);
                    editor.on('afteredit', function(){
                        this.store.reload();
                    },this,{single: true});
                    editor.on('canceledit', function(){
                        this.store.remove(e);
                    },this,{single: true});
                }
                ,scope: this
            },{
                text: 'Удалить'
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
            },'->',{
                iconCls: 'refresh'
                ,handler:function(){
                    this.store.reload();    
                }
                ,scope: this
            }]
        });

        Ext.app.Users.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load();
        Ext.app.Users.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
});
Ext.reg('bandwidthgrid', Ext.app.Bandwidth.Grid);

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'bandwidth'
    ,depends: [
        'highchart/extjs-adapter.js',
        'highchart/highcharts.src.js',
        'highchart/Ext.ux.HighchartPanel.js'
    ]
	,onInit: function(){
		this.uid = Ext.id();
		App.addModuleMenuItem(this.moduleId, Ext.app.Bandwidth.Show);
	}
    ,onLoadDepends: function(){
        Highcharts.setOptions({
           global: {
              useUTC: false
           }
        });
    }
	,onShow: function(){
		this.winChart();
	}
    ,redraw: function(c){
        App.request({
            url: '/ajax/modules/bandwidth/act/getdata'
            ,success: function(r,o,res){
                var series = c.chart.series;
                series[0].setData(res.indata, true);
                series[1].setData(res.outdata, true);
                c.chart.updatePosition();
            }
        })
    }
    ,winSettings: function(){
        if (App.isAllow('bandwidth', 'edit')){
    		var win = Ext.getCmp('win_bandwidth_settings');
    		if (win == undefined) {
    			var win = new Ext.Window({
    				title: 'Настройки',
    				id: 'win_bandwidth_settings',
    				width: 400,
    				height: 250,
    				minWidth: 400,
    				minHeight: 250,
    				layout: 'fit',
    				plain: true	
    				,modal: true
                    ,items: [{
                        xtype: 'bandwidthgrid'
                     }]
    			});
    		}
    		win.show();
        }
    }
	,winChart : function(){ //winChart
	    var chart = new Ext.ux.HighchartPanel({
            title: 'График',
            layout:'fit',
            border: false,
            chartConfig: {
				chart: {
					defaultSeriesType: 'spline',
				},
				title: {
					text: 'Загрузка канала'
				},
				subtitle: {
					text: 'Период 6 часов'
				},
				xAxis: {
                    type: 'datetime',
                    gridLineWidth: 1,
					title: {
						text: 'Время'
					}
				},
				yAxis: {
                    min: 0,
                    gridLineWidth: 1,
					title: {
						text: 'МБит за секунду'
					}
				},
				legend: {
					enabled: true
				},
				tooltip: {
					formatter: function() {
		                return String.format('<b>{0}</b><br>Скорость: {2} МБит<br>Дата: {1}', this.series.name, Highcharts.dateFormat('%d.%m.%Y %H:%M', this.x), this.y);
					}
				},
				plotOptions: {
					areaspline: {
                        fillColor: {
                            linearGradient: [0, 0, 0, 350],
                            stops: [[0, '#4572A7'], [1, 'rgba(0,0,0,0)']]
                        },
                        lineWidth: 1,
                        marker: {
                            enabled: false,
                            symbol: 'triangle-down',
                            radius: 2,
                            states: {
                               hover: {
                                  enabled: true
                               }
                            }
                        },
                        shadow: false
                    }
					,spline: {
                        marker: {
                            enabled: false,
                            symbol: 'triangle',
                            radius: 2,
                            states: {
                               hover: {
                                  enabled: true
                               }
                            }
                        },
					}
				},
				series: [{
                    type:'areaspline',
					name: 'Входящий трафик',
                    data: []
				},{
					name: 'Исходящий трафик',
                    data: []
                }]
            }
            ,bbar: [{
                text: 'Обновить'
                ,handler: function(){
                    this.redraw(chart);
                }
                ,scope: this
            }]
        });

		var win = Ext.getCmp('win_bandwidth');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'График загрузки внешнего канала',
				id: 'win_bandwidth',
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
						Ext.app.Bandwidth.Tab();
					}
				},{
					id:'gear'
            		,disabled: App.isDeny('bandwidth', 'edit')
					,handler:function(){
						this.winSettings();
					}
                    ,scope: this
                }]
				,items: new Ext.TabPanel({
                    activeTab: 0,
                    border: false,
                    items: [
                        chart
                    ]
                })
			});
		}
		win.show(this.redraw(chart));
	}//end winChart
}));
