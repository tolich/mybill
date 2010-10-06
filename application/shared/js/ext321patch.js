// По-умолчнию включаем сортировку в гриде
Ext.grid.ColumnModel.prototype.defaultSortable=true;
// Подравниваем
Ext.override(Ext.ux.grid.RowEditor, {
    initFields: function(){
        var cm = this.grid.getColumnModel(), pm = Ext.layout.ContainerLayout.prototype.parseMargins;
        this.removeAll(false);
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            var c = cm.getColumnAt(i),
                ed = c.getEditor();
            if(!ed){
                ed = c.displayEditor || new Ext.form.DisplayField({
                    style:['padding-left:5px',
                           'padding-right:5px',
                           'margin-top:3px',
                           'text-align:'+(cm.config[i].align||'left')
                          ].join(';')
                });
            }
            if(i == 0){
                ed.margins = pm('0 1 2 1');
            } else if(i == len - 1){
                ed.margins = pm('0 0 2 1');
            } else{
                if (Ext.isIE) {
                    ed.margins = pm('0 0 2 0');
                }
                else {
                    ed.margins = pm('0 1 2 0');
                }
            }
            ed.setWidth(cm.getColumnWidth(i));
            ed.column = c;
            if(ed.ownerCt !== this){
                ed.on('focus', this.ensureVisible, this);
                ed.on('specialkey', this.onKey, this);
            }
            this.insert(i, ed);
        }
        this.initialized = true;
    }
});

//Ext.override(Ext.grid.ColumnModel, {
//    destroy : function(){
//        for(var i = 0, len = this.config.length; i < len; i++){
//            Ext.destroy(this.config[i]);
//        }
//        this.purgeListeners();
//    }
//});

/**
 * qtip
 * @param {Object} action
 * @param {Object} record
 */
	Ext.override(Ext.form.Field, 
	{	afterRender : Ext.form.Field.prototype.afterRender.createSequence(function()
		{
			var qt = this.qtip;
		    if (qt)
		    {	Ext.QuickTips.register({
		        target:  this,
		        title: '',
		        text: qt,
		        enabled: true,
		        showDelay: 20
		    	});
		    }
            this.on('keydown',function(f,v){
    		    if (this.qtip)
    		    {	Ext.QuickTips.register({
    		        target:  this,
    		        title: '',
    		        text: this.getValue(),
    		        enabled: true,
    		        showDelay: 20
    		    	});
    		    }
            });
		})
	});
/**
 * Позволяет использовать в качестве url функцию
 */
Ext.override(Ext.data.DataProxy,{
    buildUrl : function(action, record) {
        if (Ext.isFunction(this.url)) {
			return this.url;
		}
		record = record || null;
		var url = (this.conn && this.conn.url) ? this.conn.url : (this.api[action]) ? this.api[action].url : this.url;
		if (!url) {
			throw new Ext.data.Api.Error('invalid-url', action);
		}
		var provides = null;
		var m = url.match(/(.*)(\.json|\.xml|\.html)$/);
		if (m) {
			provides = m[2]; // eg ".json"
			url = m[1]; // eg: "/users"
		}
		if ((this.restful === true || this.prettyUrls === true) && record instanceof Ext.data.Record && !record.phantom) {
			url += '/' + record.id;
		}
		return (provides === null) ? url : url + provides;
    }
});

/**
 * Дополнительные форматы
 * @param {Object} size
 */
if (Ext.util.Format) {
	Ext.util.Format.fileSize = function(size){
		if (size < 1024) {
			return size + " байт";
		}
		else if (size < 1048576) {
			return (Math.round(((size * 10) / 1024)) / 10) + " KБ";
		}
		else if (size < 1073741824){
			return (Math.round(((size * 10) / 1048576)) / 10) + " MБ";
		}
		else {
			return (Math.round(((size * 10) / 1073741824)) / 10) + " ГБ";
		}
	};
	Ext.util.Format.rateSpeed = function(size){
		if (size < 1024) {
			var r = size + " байт/сек";
		}
		else if (size < 1048576) {
			var r = (Math.round(((size * 10) / 1024)) / 10) + " KБайт/сек";
		}
		else if (size < 1073741824) {
			var r = (Math.round(((size * 10) / 1048576)) / 10) + " МБайт/сек";
		}
		else {
			var r = (Math.round(((size * 10) / 1073741824)) / 10) + " ГБайт/сек";
		}
		size = size*8;
		if (size < 1024) {
			return size + " бит/сек " + "(" + r + ")";
		}
		else if (size < 1048576) {
			return (Math.round(((size * 10) / 1024)) / 10) + " Kбит/сек " + "(" + r + ")";
		}
		else if (size < 1073741824) {
			return (Math.round(((size * 10) / 1048576)) / 10) + " Mбит/сек " + "(" + r + ")";
		}
		else {
			return (Math.round(((size * 10) / 1073741824)) / 10) + " Гбит/сек " + "(" + r + ")";
		}
	};
    Ext.util.Format.dateRenderer= function(format){
        return function(v){
            console.info(v)
            console.info(Date.parse(v))
			if (Date.parse(v)>0) {
                return Ext.util.Format.date(v, format);
            }
            else {
                return "-";
            }
        };
    }
}

/**
 * Печать из ExtJs
 * @version 0.4
 * @author nerdydude81
 */
Ext.override(Ext.Element, {
    /**
     * @cfg {string} printCSS The file path of a CSS file for printout.
     */
    printCSS: null
    /**
     * @cfg {Boolean} printStyle Copy the style attribute of this element to the print iframe.
     */
    , printStyle: false
    /**
     * @property {string} printTitle Page Title for printout. 
     */
    , printTitle: document.title
    /**
     * Prints this element.
     * 
     * @param config {object} (optional)
     */
    , print: function(config) {
        Ext.apply(this, config);
        
        var el = Ext.get(this.id).dom;
        var c = document.getElementById('printcontainer');
        var iFrame = document.getElementById('printframe');
        var strTemplate = '<HTML><HEAD>{0}<TITLE>{1}</TITLE></HEAD><BODY onload="{2}"><DIV {3}>{4}</DIV></BODY></HTML>';
        var strLinkTpl = '<link rel="stylesheet" type="text/css" href="{0}"/>'
        var strAttr = '';
        var strFormat;
        var strHTML;
        if (iFrame != null) c.removeChild(iFrame);
        if (c != null) el.removeChild(c);
        for (var i = 0; i < el.attributes.length; i++) {
            if (Ext.isEmpty(el.attributes[i].value) || el.attributes[i].value.toLowerCase() != 'null') {
                strFormat = Ext.isEmpty(el.attributes[i].value)? '{0}="true" ': '{0}="{1}" ';
                if (this.printStyle? this.printStyle: el.attributes[i].name.toLowerCase() != 'style')
                    strAttr += String.format(strFormat, el.attributes[i].name, el.attributes[i].value);
            }
        }
        var strLink ='';
        if(this.printCSS){
            if(!Ext.isArray(this.printCSS))
                this.printCSS = [this.printCSS];
            
            for(var i=0; i<this.printCSS.length; i++) {
                strLink += String.format(strLinkTpl, this.printCSS[i]);
            }
        }
        strHTML = String.format(
                strTemplate
                , strLink
                , this.printTitle
                , Ext.isIE? 'document.execCommand(\'print\');': 'window.print();'
                , strAttr
                , el.innerHTML
        );
        c = document.createElement('div');
        c.setAttribute('style','width:0px;height:0px;' + (Ext.isSafari? 'display:none;': 'visibility:hidden;'));
        c.setAttribute('id', 'printcontainer');
        el.appendChild(c);
        if (Ext.isIE)
            c.style.display = 'none';
        iFrame = document.createElement('iframe');
        iFrame.setAttribute('id', 'printframe');
        iFrame.setAttribute('name', 'printframe');
        c.appendChild(iFrame);
        iFrame.contentWindow.document.open();        
        iFrame.contentWindow.document.write(strHTML);
        iFrame.contentWindow.document.close();
    }
});

Ext.override(Ext.Component, {
    printEl: function(config) {
        this.el.print(Ext.isEmpty(config)? this.initialConfig: config);
    }
    , printBody: function(config) {
        this.body.print(Ext.isEmpty(config)? this.initialConfig: config);
    }
}); 

//Ext.override(Ext.ux.grid.LockingColumnModel, {
//    setLocked : function(colIndex, value, suppressEvent){
//        if(this.isLocked(colIndex) == value){
//            return;
//        }
//        this.fireEvent('beforecolumnlockchange', this, colIndex, value);
//        this.config[colIndex].locked = value;
//        if(!suppressEvent){
//            this.fireEvent('columnlockchange', this, colIndex, value);
//        }
//    }
// });


Ext.override(Ext.ux.grid.LockingGridView, {
	holdIndex: false
    ,handleHdMenuClick : function(item){
        var index = this.hdCtxIndex,
            cm = this.cm,
            id = item.getItemId(),
            llen = cm.getLockedCount();
        switch(id){
            case 'lock':
                if(cm.getColumnCount(true) <= llen + 1){
                    this.onDenyColumnLock();
                    return;
                }
				if (this.holdIndex) {
					for (var j = 0; j < index; j++) {
						cm.setLocked(j, true);
					}
		            llen = cm.getLockedCount();
				}
				if (llen != index) {
					cm.setLocked(index, true, true);
					cm.moveColumn(index, llen);
					this.grid.fireEvent('columnmove', index, llen);
				}
				else {
					cm.setLocked(index, true);
				}
            break;
            case 'unlock':
				if (this.holdIndex) {
					if (llen-1 != index){
						for (var j = llen-1; j > index; j--) {
							cm.setLocked(j, false);
						}
					}else{
						for (var j = index; j > 0; j--) {
							cm.setLocked(j, false);
						}
						index = 0;
					}
		            llen = cm.getLockedCount();
				}
				if (llen - 1 != index) {
					cm.setLocked(index, false, true);
					cm.moveColumn(index, llen - 1);
					this.grid.fireEvent('columnmove', index, llen - 1);
				}
				else {
					cm.setLocked(index, false);
				}
            break;
            default:
                return Ext.ux.grid.LockingGridView.superclass.handleHdMenuClick.call(this, item);
        }
        return true;
    }
});