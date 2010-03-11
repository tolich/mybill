function AppProxy(url){
	return {
		url: function(req){
			if (req) {
				var callback = req.callback;
				var success = req.success;
				var failure = req.failure;
			    
				req.callback = function(o, s, r){
					if (callback) {
						callback.call(this, o, s, r);
					}
				}
				req.failure = function(r, o){
					var res = Ext.decode(r.responseText);
					if (res) {
						res.errors = res.errors ||
						{
							msg: 'Error'
						};
						Ext.Msg.show({
							title: 'Ошибка!',
							msg: res.errors.msg,
							buttons: Ext.MessageBox.OK,
							icon: Ext.MessageBox.ERROR,
							width: '300',
							fn: function(){
								if (failure) 
									failure.call(this, r, o);
							},
							scope: this
						});
					}
				}
				
				req.success = function(r, o){
					var res = Ext.decode(r.responseText);
					if (res&&res.success===false) {
						res.errors = res.errors || {};
						if (res.id) {
                            switch (res.id) {
                                case '0':
                                    Ext.Msg.show({
                                        title: 'Ошибка!',
                                        msg: res.errors.msg,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR,
                                        width: '300',
                                        fn: function(){
                                            if (failure) 
                                                failure.call(this, r, o);
                                        },
                                        scope: this
                                    });
                                    break;                                
                                case '-1':
                                    var win = new Ext.app.LoginWin({
                                        title: 'Разблокировать',
                                        modal: true,
                                        lock: true,
                                        url: '/ajax/auth/unlock',
                                        fn: function(){
                                            //Ext.Ajax.request(req);
                                            return true;
                                        }
                                    });
                                    win.show();
                                    break;
                            }
                        }
                        else {
                            Ext.Msg.show({
                                title: 'Ошибка!',
                                msg: res.errors.msg,
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR,
                                width: '300',
                                fn: function(){
                                    if (failure) 
                                        failure.call(this, r, o);
                                },
                                scope: this
                            });
                        }
					}
					else
					{
						if (success)
							success.call(this,r,o);
					}
				}
			}
			return url;
		}
	}
}
