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
                        new Ext.ux.HighchartPanel({
                            title: 'Chart',
                            layout:'fit',
                            redrawOnResize: true, // Option (If using large datasets set this to false)
                            chartConfig: {
                                chart: {
                                    defaultSeriesType: 'area'
                                },
                                title: {
                                    text: 'US and USSR nuclear stockpiles'
                                },
                                subtitle: {
                                    text: 'Source: http://thebulletin.metapress.com/content/c4120650912x74k7/fulltext.pdf'
                                },
                                xAxis: {
                                },
                                yAxis: {
                                    title: {
                                        text: 'Nuclear weapon states'
                                    },
                                    labels: {
                                        formatter: function() {
                                            return this.value / 1000 +'k';
                                        }
                                    }
                                },
                                tooltip: {
                                    formatter: function() {
                                        return this.series.name +' produced <b>'+
                                            Highcharts.numberFormat(this.y, 0, null, ' ') +'</b><br/>warheads in '+ this.x;
                                    }
                                },
                                plotOptions: {
                                    area: {
                                        pointStart: 1940,
                                        marker: {
                                            enabled: false,
                                            symbol: 'circle',
                                            radius: 2
                                        }
                                    }
                                },
                                series: [{
                                        name: 'USA',
                                        data: [null, null, null, null, null, 6 , 11, 32, 110, 235, 369, 640,
                                            1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                                            27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                                            26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                                            24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                                            22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                                            10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104 ]
                                    }, {
                                        name: 'USSR/Russia',
                                        data: [null, null, null, null, null, null, null , null , null ,null,
                                            5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                                            4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                                            15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                                            33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                                            35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                                            21000, 20000, 19000, 18000, 18000, 17000, 16000]
                                    }]
                            }
                    })
                ]})
			});
		}
		win.show();
	}//end winList
}));
