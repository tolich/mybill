Ext.namespace('Ext.app.Print');

Ext.app.Print.Order = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Печать...',
		iconCls: 'print',
		disabled: App.isDeny('reports', 'submit'),
		menu: [{
			text: "Ордер на подключение",
			iconCls: 'print-order',
			handler: function(){
				App.getModule('print').onOrder();
			}
		}]
	}, config));
}

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'print'
	,onOrder: function(){
		var order = new Ext.Panel({
			id: 'order'
			,border: false
			,autoLoad: {
				url: '/info/order',
				params: {
					id: App.getModule('users').getContext().id
				}
			}
		});
		var win = Ext.getCmp('win_order');
		if (win == undefined) {
			var win = new Ext.Window({
				title:'Ордер на подключение'
				,id: 'win_order'
				,width: 600
				,height: 400
				,minWidth: 600
				,minHeight: 400
				,layout: 'fit'
				,modal: true
				,items:
				[{
					items:order
					,autoScroll:true
					,border: false
				}]
				,buttons: [{
					text: 'Печать...',
					handler: function(){
  						order.getEl().print({
							printCSS:'/css/admin/print.css',
							printTitle:''
//							printWidth:11,
//							printHeight:8.5
						}); 
					}
					,scope: this
				}]
			});
			win.show();
		}
	}
}));