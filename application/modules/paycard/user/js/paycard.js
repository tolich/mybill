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
		msg1: '��������� ����� ���������� �����', 
		desc1: '���������� �������� � ������� ����� ����������.',
		cls2: 'paycard-fee', 
		id_link2: 'paycard-fee',
		msg2: '��������� ������� � ��������', 
		desc2: '�� ������ �������������� �������� ������ � ��������, ���� ������� �� ������ ��������� ���������� ���� ������.',
		cls3: 'paycard-deposit-to-mb', 
		id_link3: 'paycard-deposit-to-mb',
		msg3: '������� ������� � �������� �� ��', 
		desc3: '��� ������� � �������������� �������� ������������ ������� ������� � �������� � �� ��� ����������� �������������.'
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
			mask: '��������� ��������� ����� ...',
			success: function(r, o, res){
				Ext.Msg.show({
					title:'�������������',
					msg: 'C �������� ����� ������� <b>'+(res.monthlyfee+res.dailyfee)+'</b><br> �������� ������ ������ <b>'+res.tariffname+'</b><br>����������?',
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
	            fieldLabel: '������� ����� ��� ��������',
	            id: uid+'-amount',
				xtype: 'textfield',
				allowBlank: false,
				vtype:'money',
				anchor: '-20px'
	        }]
	    });
		var form = formPanel.getForm();
		
	    var win = new Ext.Window({
	        title: '������� ������� � �������� � ��',
	        width: 320,
	        height:130,
	        minWidth: 320,
	        minHeight: 130,
	        layout: 'fit',
	        plain:true,
	        items: formPanel,
			modal: true,
	        buttons: [{
	            text: '��',
				handler: function(){
					if (form.isValid()) {
						App.request({
							url: '/ajax/modules/paycard/act/checkformb',
							mask: '��������� ��������� ����� ...',
							success: function(r, o, res){
								Ext.Msg.show({
									title:'�������������',
									msg: '� �������� ����� ������� <b>'+ Ext.getCmp(uid+'-amount').getValue()+'</b><br>� ��������� � �������� ��  <b>'+res.mb+'</b><br>����������?',
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
	            text: '������',
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
	            fieldLabel: '������� 16 ���� ��������� �� �����',
	            id: uid+'-pin',
				xtype: 'textfield',
				allowBlank: false,
				vtype:'pin',
				anchor: '-20px'
	        }]
	    });
		var form = formPanel.getForm();
		
	    var win = new Ext.Window({
	        title: '��������� ����� ���������� �����',
	        width: 320,
	        height:150,
	        minWidth: 320,
	        minHeight: 150,
	        layout: 'fit',
	        plain:true,
	        items: formPanel,
			modal: true,
	        buttons: [{
	            text: '��',
				handler: function(){
					if (form.isValid()) {
						win.el.mask();
						App.request({
							url: '/ajax/modules/paycard/act/checkcard',
							mask: '��������� ��� ����� ...',
							success: function(r, o, res){
								Ext.Msg.show({
									title:'�������������',
									msg: '��� ������� ����� �������� �� <b>'+res.nominal+'</b> <br>����������?',
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
	            text: '������',
				handler: function(){
					win.hide();
					win.destroy();
				}
	        }]
	    });
		win.show();
	}//end winCardActivated
}));
