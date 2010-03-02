Ext.SSL_SECURE_URL="/shared/icons/s.gif"; 
Ext.BLANK_IMAGE_URL="/shared/icons/s.gif";
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

Ext.onReady(function(){
    var win = new Ext.app.LoginWin({
        el:'login-win',
        url: '/ajax/auth',
        setCookies: true
    });
    win.show();
});