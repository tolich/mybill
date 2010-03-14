Ext.ns('Ext.app','Ext.app.LoginWin');

Ext.app.LoginWin = Ext.extend(Ext.Window,{	
    lock: false,
    setCookies: false,
    fn: Ext.emptyFn,
    initComponent: function(){
        var formPanel = new Ext.FormPanel({
            labelWidth: 130, // label settings here cascade unless overridden
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            defaults: {},
            defaultType: 'textfield',
            items: [{
                fieldLabel: 'Имя пользователя',
                name: 'username',
                width: 120,
                value: this.setCookies||this.lock?get_cookie('username'):undefined,
                allowBlank: false
            }, {
                fieldLabel: 'Пароль',
                inputType: 'password',
                width: 120,
                name: 'password'
                //},{
                //hideLabel:true,
                //boxLabel: 'Запомнить',
                //xtype: 'checkbox',
                //name: 'remember',
                //style: Ext.isIE?"margin-left:134px":"margin-left:135px"
            }]
        });
        function onSubmit(){
        	var form = formPanel.getForm();
        		form.submit({
                url:this.url,
        		waitMsg:'Выполняется проверка пароля...',
        		waitTitle:'Подождите, пожалуйста!',
        		reset:true,
        		success: function(f, a){
        			if (a && a.result) {
        				this.close();
        				
        				// get the path
        				var path = window.location.pathname, path = path.substring(0, path.lastIndexOf('/') + 1);

        				// set the cookie
                        if (a.result.username == get_cookie('username')) {
                            set_cookie('username', a.result.username, 30, path, '', '');
                        } else {
                            set_cookie('username', a.result.username, 30, path, '', '');
            				window.location = path;
                        }
        				
        				// redirect the window
                        if (!this.fn(a)){
            				window.location = path;
                        }
        			}
        		}
                ,scope: this
        	});
        };
        Ext.apply(this, {
            layout:'fit',
            width:320,
            height:150,
            //closeAction:'hide',
            closable: false,
            draggable: false,
            plain: true,
            items: formPanel,
            //region: 'center',
            keys: {
            	key: [13], // enter key
    	        fn: onSubmit,
    	        scope:this
            },
    		buttons: [{
    			text: 'Ok',
    	        handler: onSubmit,
    	     	scope: this
    	     	
    	    }]
        });
        Ext.app.LoginWin.superclass.initComponent.apply(this, arguments);
    }
});
