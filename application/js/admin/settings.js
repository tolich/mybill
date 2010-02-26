Ext.namespace('Ext.app.Settings');

Ext.app.Settings.PropertyGrid = Ext.extend(Ext.grid.PropertyGrid, {
	properties : new Ext.util.MixedCollection
	,values	: new Ext.util.MixedCollection
	,f_name: 'name'
	,f_rvalue: 'rvalue'
	,f_type: 'type'
	,f_answers: 'answers'
	,a_name: 'name'
	,a_rvalue: 'rvalue'
	,defname: 'Properties'
	,defrvalue: ''
	,deftype: '2'
	,defanswers : {}
	,lazyInit: true
	,defSource: {}
	,loadMask: false
	,id: Ext.id()
	,loaded: false
	,decode : function (r){
		return Ext.decode(r.responseText);
	}
	,load: function(config,keep){
		if (this.loadMask) {
			var mask = new Ext.LoadMask(Ext.get(this.id));
			mask.show();
		};
		config = config || {};
		var source 			= {};
		var customEditors 	= {};
		Ext.apply(this.params||{}, config.params||{});
		App.request({
			url: config.url || this.url,
			params: this.params,
			callback: function(){
				if (mask) mask.hide();
			},
			success: config.success || function(r, o){
				var res = this.decode(r);
				for (pr in res) {
					var name = res[pr][this.f_name] || this.defname;
					var rvalue = res[pr][this.f_rvalue] || this.defrvalue;
					var type = res[pr][this.f_type] || this.deftype;
					var answers = res[pr][this.f_answers] || this.defanswers;
					var rval = keep?this.getProperty()[pr]||rvalue:rvalue;
					this.properties.add(name, pr);
					switch (type.toString()){
						case '2': //combobox
							var data = [];
							var val = {};
							for (var i = 0; i < answers.length; i++) {
								data.push(answers[i][this.a_name]);
								val[answers[i][this.a_name]] = answers[i][this.a_rvalue];
								if (answers[i][this.a_rvalue] == rvalue) {
									rval = answers[i][this.a_name];
								}
							}
							this.values.add(name, val);
							customEditors[name] = new Ext.grid.GridEditor(new Ext.form.ComboBox({
								store: data,
								editable: false,
								mode: 'local',
								triggerAction: 'all',
								listClass: 'combo-list-class',
								listeners: {
									'select': function(cmb,record,index){
										  if (cmb.getValue() == '&nbsp;') {
										    cmb.setValue('');
										  }
									}
								}
							}));
						break;
					}
					source[name] = rval;
				}
				this.defSource = Ext.apply({},source);
				this.setSource(source);
				this.loaded = true;
			},
			scope: this
		});
		Ext.apply(this,{
			customEditors: customEditors
		});
	}
	,initComponent: function(config){
		Ext.apply(this, config);
		Ext.app.Settings.PropertyGrid.superclass.initComponent.apply(this, arguments);
	}
	,onRender: function(){
		var cm = this.colModel;
		if (this.sortable==false)
			this.getStore().sortInfo = null;
		this.getColumnModel().setConfig([
			{
				header: this.nameText || cm.getColumnHeader(0)
				,width:cm.getColumnWidth(0)
				,sortable: this.sortable==false?false:true
				,dataIndex: cm.getDataIndex(0)
				,id:'name',allowBlank:true
			},{
				header: this.valueText || cm.getColumnHeader(1)
				,width:cm.getColumnWidth(1)
				,sortable: false
				,dataIndex: cm.getDataIndex(1)
				,id:'value'
				,allowBlank:true
			}
		])
		if (this.lazyInit) this.load();
        Ext.app.Settings.PropertyGrid.superclass.onRender.apply(this, arguments);
	}
	,getProperty: function(){
		var pr = {};
		this.getStore().each(function(r){
			if (typeof(this.values.get(r.get('name')))=='object')
				pr[this.properties.get(r.get('name'))] = this.values.get(r.get('name'))[r.get('value')];
			else
				pr[this.properties.get(r.get('name'))] = r.get('value');
		},this);
		return pr;
	}
	,getPropertyEnc: function(){
		return Ext.encode(this.getProperty());
	}
	,isChange: function(){
		return Ext.encode(this.defSource)!=Ext.encode(this.getSource())
	}
	,isLoaded: function(){
		return this.loaded
	}
	,apply: function(){
		this.defSource = Ext.apply({},this.getSource());
	}
	,reset: function(){
		var source = Ext.apply({},this.defSource);
		this.setSource(source);
	}
});
Ext.app.Settings.PropertyWinMain = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Персональные настройки',
		iconCls: 'settings-main',
		disabled: App.isDeny('settings', 'view'),
		handler: function(){
			App.getModule('settings').onWinMain();
		}
	}, config));
};
Ext.app.Settings.PropertyWinBill = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Настройки биллинга',
		iconCls: 'settings-billing',
		disabled: App.isDeny('settings', 'submit'),
		handler: function(){
			App.getModule('settings').onWinBill();
		}
	}, config));
};
Ext.app.Settings.PropertyWinFirm = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Настройки предприятия',
		iconCls: 'settings-company',
		disabled: App.isDeny('settings', 'edit'),
		handler: function(){
			App.getModule('settings').onWinFirm();
		}
	}, config));
};

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'settings'
	,onWinBill:function(){
		this.applyContext({type : 0});
		this.winProperty();
	}
	,onWinFirm:function(){
		this.applyContext({type : 1});
		this.winProperty();
	}
	,onWinMain:function(){
		this.applyContext({type : 2});
		this.winProperty();
	}
	,winProperty: function(){
		var win = Ext.getCmp('win_property');
		if (win == undefined) {
			var title=['биллинга','предприятия','персональные']
			var type=['billing','company','main']
			var pgrid = new Ext.app.Settings.PropertyGrid({
				url: '/ajax/settings/get'
				,params:{
					type:this.getContext().type
				}
			});
			var win = new Ext.Window({
				title: "Настройки "+title[this.getContext().type],
				id: 'win_property',
				width: 800,
				height: 500,
				minWidth: 380,
				minHeight: 280,
				plain: true,
				modal: true,
				layout: 'fit',
				items:pgrid,
				buttons: 
				[{
					text: 'Ok'
					,handler: function(){
						App.request({
							url: '/ajax/settings/set'+type[this.getContext().type],
							params: {
								prop: pgrid.getPropertyEnc()
							},
							success: function(r, o){
								win.close();
								Ext.Msg.show({
									title:'Подтверждение',
									msg: 'Чтобы некоторые настройки вступили в силу необходимо обновить страницу!',
									buttons: Ext.MessageBox.YESNO,
									icon: Ext.MessageBox.INFO,
									width: '330',
									fn: function(btn){
										if (btn == 'yes') {
											location.reload();
										};
									}
									,scope:this
								})
							},
							scope:this
						})
					}
					,scope:this
				},{	
					text: 'Отмена'
					,handler: function(){
						win.close();
					}
				}]
			});
		}
		win.show();
	}
}));
