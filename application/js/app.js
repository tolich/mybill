/**
 * @author ToL
 */
Ext.SSL_SECURE_URL="/shared/icons/s.gif"; 
Ext.BLANK_IMAGE_URL="/shared/icons/s.gif";
Ext.QuickTips.init();
Ext.form.Field.prototype.msgTarget = 'side';

Ext.ns('Ext.app');

Ext.app.Module = function(cfg){
    Ext.apply(this, cfg);
    Ext.app.Module.superclass.constructor.call(this);
    this.depends = this.depends || [];
    if (false === Ext.isArray(this.depends)){
        this.depends = [this.depends];
    }
    this.init();
}

Ext.extend(Ext.app.Module, Ext.util.Observable, {
    init : function(){
		this.setContext({});
		this.onInit();
	}
	,onInit: Ext.emptyFn
	,onRender: Ext.emptyFn
    ,onLoadDepends: Ext.emptyFn
	,tpl: new Ext.Template()
	,tplAppend: {}
	,render: function(){
		this.tpl.append('modulePanel', this.tplAppend);		
		this.onRender();
	}
	,setContext: function(o){
		this.app.setContext(this.moduleId, o);
	}
	,getContext: function(){
		return this.app.getContext(this.moduleId);
	}
	,applyContext: function(o){
		this.app.applyContext(this.moduleId, o);
	}
	,clearContext: function(){
		this.app.clearContext(this.moduleId);
	}
	,isContext: function(){
		this.context.containsKey(this.moduleId);
	}
	,setSettings: Ext.emptyFn
    ,loadDepends: function(callback,scope){
        var callback = (typeof callback == 'function' ? callback : Ext.emptyFn);
        var scope = scope || this;
        var js = [];
        Ext.each(this.depends, function(i){
            if (this.app.depends.indexOf(i) === -1) {
                js.push(i);
            }
        },this);
        if (js.length) {
            this.app.request({
                url: 'ajax/modules/load',
                mask: 'Загрузка зависимостей...',
                params: {
                    js: Ext.encode(js)
                },
                success: function(r, o, res){
                    if (res.length == js.length) {
                        Ext.each(res, function(i){
                            this.app.addScript(i['content']);
                            this.app.depends.push(i['filename']);
                        },this);
                        this.onLoadDepends();
                        callback.call(scope);
                    }
                },
                scope: this
            })
        }
        else {
            callback.call(scope);
        }
    }
});

Ext.app.App = function(cfg){
    Ext.apply(this, cfg);
    Ext.onReady(this.initApp, this);
};

Ext.extend(Ext.app.App, Ext.util.Observable , {
	modules: new Ext.util.MixedCollection
	,moduleItems: new Ext.util.MixedCollection
	,context: new Ext.util.MixedCollection
	,settings: {}
    ,billsettings: {}
	,mainsettings: {}
	,rights: {allow:[],deny:null}
    ,locked: false
    ,depends: []
    ,emptyMod:{
        html: 'Модуль не установлен'
        ,style: 'color:gray;padding:5px;font:10px verdana,tahoma,arial,sans-serif'
        ,border: false
	}
	,register: function(o){
		var m = new o({app:this});
		this.modules.add(m.moduleId, m);		
	}
	,getModule: function(id){
		return this.modules.get(id);
	}
	,getContext: function(id){
		return this.context.get(id);
	}
	,setContext: function(id, o){
		this.context.add(id, o);
	}
	,applyContext: function(id, o){
		var c = this.context.get(id);
		Ext.apply(c, o);
		this.context.add(id, c);
	}
	,clearContext: function(id){
		//this.context.removeKey(id);
        this.context.add(id, {});
	}
	,isContext: function(id){
		this.context.containsKey(id);
	}
	,setSettings: function(){
        var s = Ext.ux.util.clone(this.settings);
        try {
            this.modules.each(function(i){
                i.setSettings();
            }, this);
            s = Ext.encode(this.settings);
        } catch (e) {
            this.settings = s;
            s = Ext.encode(this.settings);
        }
		return s;
	}
	,setRights: function(rights){
		this.rights=rights;
	}
	,addModuleMenuItem: function(id, item){
		this.moduleItems.add(id, item);
	}
	,getModuleMenu: function(){
		var items = [Ext.app.Modules.List()];
		if (this.moduleItems.getCount()){
			items.unshift('-');
			this.moduleItems.eachKey(function(id, item){
                var action = item();
                var handler = action.initialConfig.handler;
                action.setHandler(function(){
                    var module = this.getModule(id);
                    module.loadDepends(handler);
                }.createDelegate(this));
				items.unshift(action);
			},this);
		}
		return items;
	}
	,isAllow: function(role,resource){
		var allow = false;
		var deny = false;

		if (this.rights.deny === null) 
			deny = true;
		else 
			if (this.rights.deny[role]!==undefined) {
				if (this.rights.deny[role] === null) 
					deny = true;
				else 
					Ext.each(this.rights.deny[role], function(i){
						if (i === null || i === resource) {
							deny = true;
							return false;
						}
					});
			}

		if (deny === false) {
			if (this.rights.allow === null) 
				allow = true;
			else 
				if (this.rights.allow[role]!==undefined) {
					if (this.rights.allow[role] === null)
						allow = true;
					else 
						Ext.each(this.rights.allow[role], function(i){
							if (i === null || i === resource) {
								allow = true;
								return false;
							}
						});
				}
		}
		return allow;		
	}
	,isDeny: function(role,resource){
		return !this.isAllow(role,resource);		
	}
	,proxy: function(url){
		return AppProxy(url).url;
	}
	,request: function(config){
		if (config.mask){
			var mask = new Ext.LoadMask(Ext.getBody(),{
				msg:config.mask===true?'Подождите, пожалуйста...':config.mask
			});
			mask.show();
		}
		Ext.applyIf(config,{
			url:undefined
			,callback: Ext.emptyFn
			,success: Ext.emptyFn
			,failure: Ext.emptyFn
			,params: {}
			,scope:this
		});
		Ext.Ajax.request({
			url : App.proxy(config.url)
			,callback: function(o,s,r){
				if (mask) mask.hide();
				config.callback.call(this,o,s,r);
			}
			,success: function(r, o){
				var res = Ext.decode(r.responseText);
				config.success.call(this,r,o,res);
			}
			,failure: function(r,o){
				var res = Ext.decode(r.responseText);
				config.failure.call(this,r,o,res);
			}
			,params: config.params
			,scope: config.scope
		});
	}
    ,addScript: function(data) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (Ext.isIE) {
            script.text = data;
        }
        else {
            script.appendChild(document.createTextNode(data));
        }

        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        head.appendChild(script);
    }
	,initApp: function(){
		var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Настройка окружения пользователя...", removeMask: true});
		mask.show();
		Ext.apply(Ext.form.VTypes, {
			pinMask: /[0-9]/,
			pinRe: /^\d{16}$/,
			pinText: 'Код пополнения должен содержать 16 цифр',
			pin: function(v){
				return this.pinRe.test(v);
			}
		});
		Ext.apply(Ext.form.VTypes, {
			moneyMask: /[0-9.]/,
			moneyRe: /^\d+(\.\d{1,2})?$/,
			moneyText: 'Сумма должна быть введена в формате 0.00',
			money: function(v){
				return this.moneyRe.test(v);
			}
		});
		Ext.apply(Ext.form.VTypes, {
			nmoneyMask: /[0-9.-]/,
			nmoneyRe: /^-?\d+(\.\d{1,2})?$/,
			nmoneyText: 'Сумма должна быть введена в формате 0.00',
			nmoney: function(v){
				return this.nmoneyRe.test(v);
			}
		});
		Ext.apply(Ext.form.VTypes, {
			Mask: /[0-9.-]/,
			mbyteRe: /^-?\d+(\.\d{1,3})?$/,
			mbyteText: 'Мб долны быть в формате 0.000',
			mbyte: function(v){
				return this.mbyteRe.test(v);
			}
		});
		Ext.apply(Ext.form.VTypes, {
			srcMask: /[\!0-9.\/\s]/,
			srcRe: /^(!?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}\s*)+$/,
			srcText: 'Введите маски подсетей в формате 0.0.0.0/0 или !0.0.0.0/0 через пробел.',
			src: function(v){
				return this.srcRe.test(v);
			}
		});
		Ext.apply(Ext.form.VTypes, {
			ipMask: /[0-9.]/,
			ipRe: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,
			ipText: 'Неверный формат IP адреса',
			ip: function(v){
				return this.ipRe.test(v);
			}
		});
		Ext.apply(Ext.form.VTypes, {
			alphanumdot: /[a-z0-9_@.-]/i,
			alphanumdotRe: /^[a-zA-Z0-9_@.-]+$/,
			alphanumdotText: 'В этом поле допустимы цифры, латинские буквы и символы  - _ . @  ',
			alphanumdot: function(v){
				return this.alphanumdotRe.test(v);
			}
		});
		this.modules.eachKey(function(k,i){
			this.settings[k]={};	
		},this);
		Ext.Ajax.request({
			url: '/ajax/auth/getsettings'
			,callback: function(){
			}
			,success: function(r, o){
				var s = Ext.decode(r.responseText);
				mask.hide();
				if (s.success) {
                    try {
                        Ext.apply(this.settings, Ext.decode(s.settings || "{}"));
                        Ext.apply(this.mainsettings, s.mainsettings || "{}");
                        Ext.apply(this.billsettings, s.billsettings || "{}");
                        Ext.apply(this.rights, s.rights);
                    } catch (e) {
                        Ext.apply(this.settings, {});
                        Ext.apply(this.mainsettings, {});
                        Ext.apply(this.billsettings, {});
                        Ext.apply(this.rights, s.rights);
                    }
                }
				this.render();
			}
			,scope: this
		});
	}
	,render: function(){
		Ext.app.Layer();
	}
});

App = new Ext.app.App();
