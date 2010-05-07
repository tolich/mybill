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
    				title: 'График загрузки внешнего канала',
    				id: 'win_bandwidth_settings',
    				width: 400,
    				height: 250,
    				minWidth: 400,
    				minHeight: 250,
    				layout: 'fit',
    				plain: true	
    				,modal: true
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
