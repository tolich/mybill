/*
 * Ext JS Library 2.0
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.SSL_SECURE_URL="/shared/icons/s.gif"; 
Ext.BLANK_IMAGE_URL="/shared/icons/s.gif";

Ext.onReady(function(){

    Ext.QuickTips.init();

    // turn on validation errors beside the field globally
    Ext.form.Field.prototype.msgTarget = 'side';
	
	function onSubmit(){
		var form = formPanel.getForm();
   		form.submit({
			waitMsg:'Выполняется проверка пароля...',
			waitTitle:'Подождите, пожалуйста!',
			reset:true,
			success: function(f, a){
				if (a && a.result) {
					win.destroy(true);
					
					// get the path
					var path = window.location.pathname, path = path.substring(0, path.lastIndexOf('/') + 1);
					// set the cookie
					// set_cookie('key', a.result.key, '', path, '', '' );
//					set_cookie('username', a.result.username, 30, path, '', '' );
					// set_cookie('memberType', a.result.type, '', path, '', '' );
					
					// redirect the window
					window.location = path;
				}
			}
		});
	};
	
	var formPanel = new Ext.FormPanel({
        labelWidth: 130, // label settings here cascade unless overridden
        url:AppProxy('/ajax/auth/admin').url,
        frame:true,
        bodyStyle:'padding:5px 5px 0',
        defaults: {},
        defaultType: 'textfield',
        items: [{
           	fieldLabel: 'Имя пользователя',
           	name: 'username',
           	width: 120,
//           	value: get_cookie('username'),
           	allowBlank:false
          },{
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
	
    var win = new Ext.Window({
        el:'login-win',
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
	     	
	    //},{
		//	text: 'Отмена',
		//   handler: function(){
		//    	win.hide();
		//	}
		}]
     });

    win.show();

});