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
////        'highchart/Ext.ux.HighChart.js'
    ]
	,onInit: function(){
		this.uid = Ext.id();
		App.addModuleMenuItem(this.moduleId, Ext.app.Bandwidth.Show);
	}
	,onShow: function(){
		this.winList();
	}
	,onList: function(){
		this.winList();
	}
//	,onRefresh:function(){
//		if (Ext.getCmp('bandwidth-grid'))
//			Ext.getCmp('bandwidth-grid').getStore().reload();
//		if (Ext.getCmp('bandwidth-grid-tab'))
//			Ext.getCmp('bandwidth-grid-tab').getStore().reload();
//	}
	,winList : function(){ //winList
	    var chart = new Ext.ux.HighchartPanel({
                            title: 'График',
        titleCollapse: true,
        layout:'fit',
        border: true,
        chartConfig: {
				chart: {
					defaultSeriesType: 'spline'
				},
				title: {
					text: 'Загрузка канала'
				},
				subtitle: {
					text: 'Период 6 часов'
				},
				xAxis: {
//					categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
//						'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
					title: {
						text: 'Время'
					}
				},
				yAxis: {
					title: {
						text: 'Бит за секунду'
					}
				},
				legend: {
					enabled: true
				},
				tooltip: {
					formatter: function() {
			                return '<b>'+ this.series.name +'</b><br/>'+
							this.x +': '+ this.y +'ТАC';
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
                            states: {
                                hover: {
                                    enabled: true,
                                    radius: 10
                                }
                            }
                        },
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        }
                    }
					,spline: {
						cursor: 'pointer',
						point: {
							events: {
								click: function() {
									alert ('this.x: '+ this.x +'\nthis.y: '+ this.y);
								}
							}
						}
					}
				},
				series: [{
                    type:'areaspline',
					name: 'Входящий трафик',
					dataURL: '/ajax/modules/bandwidth/act/getdata'
				},{
					name: 'Исходящий трафик',
					dataURL: '/ajax/modules/bandwidth/act/getdata'
                }]

        }
                ,bbar: [{
                    text: 'Обновить'
                    ,handler: function(){
                        App.request({
                            url: '/ajax/modules/bandwidth/act/getdata'
                            ,success: function(r,o,res){
                                var series = chart.chart.series;
                                series[0].setData(res, true);
                            }
                        })
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
				}]
				,items: new Ext.TabPanel({
                    activeTab: 0,
                    items: [
                        chart
                    ]
                })
			});
		}
		win.show();
	}//end winList
}));
