Ext.namespace('Ext.app.Paycard');

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'paycard'
	,tpl: new Ext.Template(
		'<div id="{id}>"',
			'<div class="{cls1}" style="{style}">',
				'<b><span id="{id_link1}">{msg1}</span></b><br>',
				'{desc1}',
			'</div>',
			'<div class="{cls2}" style="{style}">',
				'<b><span id="{id_link2}">{msg2}</span></b><br>',
				'{desc2}',
			'</div>',
			'<div class="{cls3}" style="{style}">',
				'<b><span id="{id_link3}">{msg3}</span></b><br>',
				'{desc3}',
			'</div>',
		'</div>'
	)
	,tplAppend:{
		id: 'paycard', 
		style: 'margin:10px 0 0 20px;',
		cls1: 'paycard-activated', 
		id_link1: 'paycard-activated',
		msg1: 'Активация карты пополнения счета', 
		desc1: 'Пополнение депозита с помощью карты пополнения.',
		cls2: 'paycard-fee', 
		id_link2: 'paycard-fee',
		msg2: 'Включение доступа в интернет', 
		desc2: 'Вы можете самостоятельно включить доступ в интернет, если депозит не меньше абонплаты выбранного Вами тарифа.',
		cls3: 'paycard-deposit-to-mb', 
		id_link3: 'paycard-deposit-to-mb',
		msg3: 'Перевод средств с депозита на МБ', 
		desc3: 'Для пакетов с предоплаченным трафиком производится перевод средств с депозита в МБ для дальнейшего использования.'
	}
	,onClickLink1: function(){
		this.winCardActivated();
	}
	,onClickLink2: function(){
		this.accessOn();
	}
	,onClickLink3: function(){
		this.winDepositToMb();
	}
	,onRender: function(){
		Ext.EventManager.on("paycard-activated", 'click', this.onClickLink1,this);
		Ext.EventManager.on("paycard-fee", 'click', this.onClickLink2,this);
		Ext.EventManager.on("paycard-deposit-to-mb", 'click', this.onClickLink3,this);
	}
	,accessOn: function(){
		App.request({
			url: '/ajax/modules/paycard/act/checkforaccess',
			mask: 'Проверяем состояние счета ...',
			success: function(r, o, res){
				Ext.Msg.show({
					title:'Подтверждение',
					msg: 'C депозита будет списано <b>'+(res.monthlyfee+res.dailyfee)+' '+App.billsettings.currency+'</b><br> согласно Вашего тарифа <b>'+res.tariffname+'</b><br>Продолжить?',
					buttons: Ext.MessageBox.YESNO,
					icon: Ext.MessageBox.QUESTION,
					width: '320',
					fn: function(btn){
						if (btn == 'yes') {
							App.request({
								url: '/ajax/modules/paycard/act/accesson',
								success: function(r, o){
									if (Ext.getCmp('account'))
										Ext.getCmp('account').load('/info/account');
									if (Ext.getCmp('wellcome'))
										Ext.getCmp('wellcome').load('/info/wellcome');
								}
							});
						};
					}
				})
			}
		});
	}
	,winDepositToMb: function(){//winDepositToMb
		var uid = Ext.id();
	    var formPanel = new Ext.FormPanel({
	        labelWidth: 200,
			labelAlign: 'left',
			frame: false,
	        bodyStyle:'padding:10px;',
	        defaultType: 'textfield',
	        items: 
			[{
	            fieldLabel: 'Введите сумму для перевода',
	            id: uid+'-amount',
				xtype: 'textfield',
				allowBlank: false,
				vtype:'money',
				anchor: '-20px'
	        }]
	    });
		var form = formPanel.getForm();
		
	    var win = new Ext.Window({
	        title: 'Перевод средств с депозита в МБ',
	        width: 320,
	        height:130,
	        minWidth: 320,
	        minHeight: 130,
	        layout: 'fit',
	        plain:true,
	        items: formPanel,
			modal: true,
	        buttons: [{
	            text: 'Ок',
				handler: function(){
					if (form.isValid()) {
						App.request({
							url: '/ajax/modules/paycard/act/checkformb',
							mask: 'Проверяем состояние счета ...',
							success: function(r, o, res){
								Ext.Msg.show({
									title:'Подтверждение',
									msg: 'С депозита будет списано <b>'+ Ext.getCmp(uid+'-amount').getValue()+' '+App.billsettings.currency+'</b><br>и добавлено к пакетным <b>'+res.mb+' Мб</b><br>Продолжить?',
									buttons: Ext.MessageBox.YESNO,
									icon: Ext.MessageBox.QUESTION,
									width: '320',
									fn: function(btn){
										if (btn == 'yes') {
											App.request({
												url: '/ajax/modules/paycard/act/tomb',
												success: function(r, o){
													win.close();
													if (Ext.getCmp('account'))
														Ext.getCmp('account').load('/info/account');
													if (Ext.getCmp('wellcome'))
														Ext.getCmp('wellcome').load('/info/wellcome');
												},
												params:o.params
											});
										};
									}
								})
							},
							params:{
								'amount': Ext.getCmp(uid+'-amount').getValue()
							}
						});
					}
				}
				,scope: this
	        },{
	            text: 'Отмена',
				handler: function(){
					win.hide();
					win.destroy();
				}
	        }]
	    });
		win.show();
	}//end winDepositToMb
	,winCardActivated: function(){//winCardActivated
		var uid = Ext.id();
	    var formPanel = new Ext.FormPanel({
	        labelWidth: 170,
			labelAlign: 'top',
			frame: false,
	        bodyStyle:'padding:10px;',
	        defaultType: 'textfield',
	        items: 
			[{
	            fieldLabel: 'Введите 16 цифр указанные на карте',
	            id: uid+'-pin',
				xtype: 'textfield',
				allowBlank: false,
				vtype:'pin',
				anchor: '-20px'
	        }]
	    });
		var form = formPanel.getForm();
		
	    var win = new Ext.Window({
	        title: 'Активация карты пополнения счета',
	        width: 320,
	        height:150,
	        minWidth: 320,
	        minHeight: 150,
	        layout: 'fit',
	        plain:true,
	        items: formPanel,
			modal: true,
	        buttons: [{
	            text: 'Ок',
				handler: function(){
					if (form.isValid()) {
						win.el.mask();
						App.request({
							url: '/ajax/modules/paycard/act/checkcard',
							mask: 'Проверяем код карты ...',
							success: function(r, o, res){
								Ext.Msg.show({
									title:'Подтверждение',
									msg: 'Ваш депозит будет пополнен на <b>'+res.nominal+' '+App.billsettings.currency+'</b> <br>Продолжить?',
									buttons: Ext.MessageBox.YESNO,
									icon: Ext.MessageBox.QUESTION,
									width: '320',
									fn: function(btn){
										if (btn == 'yes') {
											App.request({
												url: '/ajax/modules/paycard/act/activate',
												success: function(r, o){
													win.close();
													if (Ext.getCmp('account'))
														Ext.getCmp('account').load('/info/account');
													if (Ext.getCmp('wellcome'))
														Ext.getCmp('wellcome').load('/info/wellcome');
												},
												params:o.params
											});
										};
									}
								})
							},
							failure: function(){
								win.el.unmask();
							},
							params:{
								'hash': Ext.util.MD5(Ext.getCmp(uid+'-pin').getValue())
							}
						});
					}
				}
				,scope: this
	        },{
	            text: 'Отмена',
				handler: function(){
					win.hide();
					win.destroy();
				}
	        }]
	    });
		win.show();
	}//end winCardActivated
}));
