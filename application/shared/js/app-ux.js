Ext.ns('Ext.ux.util','Ext.ux.grid');
Ext.ux.util.translit = function(s,str_case){
    if (Ext.type(s)!='string'){
        return s;
    }
    var ru = ["А","а","Б","б","В","в","Г","г","Д","д","Е","е","Є","є","Ё","ё","Ж","ж","З","з","И","и","І","і","Й","й","К","к","Л","л","М","м","Н","н", "О","о","П","п","Р","р","С","с","Т","т","У","у","Ф","ф","Х","х","Ц","ц","Ч","ч","Ш","ш","Щ","щ","Ъ","ъ","Ы","ы","Ь", "ь","Э","э","Ю","ю","Я","я"],
        en = ["A","a","B","b","V","v","G","g","D","d","E","e","E","e","E","e","Zh","zh","Z","z","I","i","I","i","Y","y","K","k","L","l","M","m","N","n", "O","o","P","p","R","r","S","s","T","t","U","u","Ph","f","H","h","C","c","Ch","ch","Sh","sh","Sh","sh","","","I","i","","","E", "e","Yu","yu","Ya","ya"],
        str = '';     
    if (str_case) s = Ext.util.Format.lowercase(s);
    for (var j = 0; j<s.length; j++){
        var i = ru.indexOf(s[j]);
        str = str + (i!=-1?en[i]:s[j]);
    }
    return str;
}
/**
 * Ext.ux.util.clone
 */
Ext.ux.util.clone = function(o) {
    if(!o || 'object' !== typeof o) {
        return o;
    }
    var c = '[object Array]' === Object.prototype.toString.call(o) ? [] : {};
    var p, v;
    for(p in o) {
        if(o.hasOwnProperty(p)) {
            v = o[p];
            if(v && 'object' === typeof v) {
                c[p] = Ext.ux.util.clone(v);
            }
            else {
                c[p] = v;
            }
        }
    }
    return c;
}; // eo function clone 

/**
 * Ext.ux.grid.RowActions
 */
if('function' !== typeof RegExp.escape) {
	RegExp.escape = function(s) {
		if('string' !== typeof s) {
			return s;
		}
		// Note: if pasting from forum, precede ]/\ with backslash manually
		return s.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1');
	}; // eo function escape
}

Ext.ux.grid.RowActions = function(config) {
	Ext.apply(this, config);
	this.addEvents(
		 'beforeaction'
		,'action'
		,'beforegroupaction'
		,'groupaction'
	);
	Ext.ux.grid.RowActions.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.grid.RowActions, Ext.util.Observable, {
	 actionEvent:'click'
	,autoWidth:true
	,dataIndex:''
	,editable:false
	,header:''
	,isColumn:true
	,keepSelection:false
	,menuDisabled:true
	,sortable:false
	,tplGroup:
		 '<tpl for="actions">'
		+'<div class="ux-grow-action-item<tpl if="\'right\'===align"> ux-action-right</tpl> '
		+'{cls}" style="{style}" qtip="{qtip}">{text}</div>'
		+'</tpl>'
	,tplRow:
		 '<div class="ux-row-action">'
		+'<tpl for="actions">'
		+'<div class="ux-row-action-item {cls} <tpl if="text">'
		+'ux-row-action-text</tpl>" style="{hide}{style}" qtip="{qtip}">'
		+'<tpl if="text"><span qtip="{qtip}">{text}</span></tpl></div>'
		+'</tpl>'
		+'</div>'
	,hideMode:'visibility'
	,widthIntercept:4
	,widthSlope:21
	,init:function(grid) {
		this.grid = grid;
		this.id = this.id || Ext.id();
		var lookup = grid.getColumnModel().lookup;
		delete(lookup[undefined]);
		lookup[this.id] = this;
		if(!this.tpl) {
			this.tpl = this.processActions(this.actions);

		} // eo template setup
		if(this.autoWidth) {
			this.width =  this.widthSlope * this.actions.length + this.widthIntercept;
			this.fixed = true;
		}

		// body click handler
		var view = grid.getView();
		var cfg = {scope:this};
		cfg[this.actionEvent] = this.onClick;
		grid.afterRender = grid.afterRender.createSequence(function() {
			view.mainBody.on(cfg);
			grid.on('destroy', this.purgeListeners, this);
		}, this);

		// setup renderer
		if(!this.renderer) {
			this.renderer = function(value, cell, record, row, col, store) {
				cell.css += (cell.css ? ' ' : '') + 'ux-row-action-cell';
				return this.tpl.apply(this.getData(value, cell, record, row, col, store));
			}.createDelegate(this);
		}

		// actions in grouping grids support
		if(view.groupTextTpl && this.groupActions) {
			view.interceptMouse = view.interceptMouse.createInterceptor(function(e) {
				if(e.getTarget('.ux-grow-action-item')) {
					return false;
				}
			});
			view.groupTextTpl = 
				 '<div class="ux-grow-action-text">' + view.groupTextTpl +'</div>' 
				+this.processActions(this.groupActions, this.tplGroup).apply()
			;
		}

		// cancel click
		if(true === this.keepSelection) {
			grid.processEvent = grid.processEvent.createInterceptor(function(name, e) {
				if('mousedown' === name) {
					return !this.getAction(e);
				}
			}, this);
		}
		
	} // eo function init
	,getData:function(value, cell, record, row, col, store) {
		return record.data || {};
	} // eo function getData
	,processActions:function(actions, template) {
		var acts = [];

		// actions loop
		Ext.each(actions, function(a, i) {
			// save callback
			if(a.iconCls && 'function' === typeof (a.callback || a.cb)) {
				this.callbacks = this.callbacks || {};
				this.callbacks[a.iconCls] = a.callback || a.cb;
			}

			// data for intermediate template
			var o = {
				 cls:a.iconIndex ? '{' + a.iconIndex + '}' : (a.iconCls ? a.iconCls : '')
				,qtip:a.qtipIndex ? '{' + a.qtipIndex + '}' : (a.tooltip || a.qtip ? a.tooltip || a.qtip : '')
				,text:a.textIndex ? '{' + a.textIndex + '}' : (a.text ? a.text : '')
				,hide:a.hideIndex 
					? '<tpl if="' + a.hideIndex + '">' 
						+ ('display' === this.hideMode ? 'display:none' :'visibility:hidden') + ';</tpl>' 
					: (a.hide ? ('display' === this.hideMode ? 'display:none' :'visibility:hidden;') : '')
				,align:a.align || 'right'
				,style:a.style ? a.style : ''
			};
			acts.push(o);

		}, this); // eo actions loop

		var xt = new Ext.XTemplate(template || this.tplRow);
		return new Ext.XTemplate(xt.apply({actions:acts}));

	} // eo function processActions
	// }}}
	,getAction:function(e) {
		var action = false;
		var t = e.getTarget('.ux-row-action-item');
		if(t) {
			action = t.className.replace(/ux-row-action-item /, '');
			if(action) {
				action = action.replace(/ ux-row-action-text/, '');
				action = action.trim();
			}
		}
		return action;
	} // eo function getAction
	,onClick:function(e, target) {

		var view = this.grid.getView();

		// handle row action click
		var row = e.getTarget('.x-grid3-row');
		var col = view.findCellIndex(target.parentNode.parentNode);
		var action = this.getAction(e);

		if(false !== row && false !== col && false !== action) {
			var record = this.grid.store.getAt(row.rowIndex);

			// call callback if any
			if(this.callbacks && 'function' === typeof this.callbacks[action]) {
				this.callbacks[action](this.grid, record, action, row.rowIndex, col);
			}

			// fire events
			if(true !== this.eventsSuspended && false === this.fireEvent('beforeaction', this.grid, record, action, row.rowIndex, col)) {
				return;
			}
			else if(true !== this.eventsSuspended) {
				this.fireEvent('action', this.grid, record, action, row.rowIndex, col);
			}

		}

		// handle group action click
		t = e.getTarget('.ux-grow-action-item');
		if(t) {
			// get groupId
			var group = view.findGroup(target);
			var groupId = group ? group.id.replace(/ext-gen[0-9]+-gp-/, '') : null;

			// get matching records
			var records;
			if(groupId) {
				var re = new RegExp(RegExp.escape(groupId));
				records = this.grid.store.queryBy(function(r) {
					return r._groupId.match(re);
				});
				records = records ? records.items : [];
			}
			action = t.className.replace(/ux-grow-action-item (ux-action-right )*/, '');

			// call callback if any
			if('function' === typeof this.callbacks[action]) {
				this.callbacks[action](this.grid, records, action, groupId);
			}

			// fire events
			if(true !== this.eventsSuspended && false === this.fireEvent('beforegroupaction', this.grid, records, action, groupId)) {
				return false;
			}
			this.fireEvent('groupaction', this.grid, records, action, groupId);
		}
	} // eo function onClick
	// }}}

});
Ext.reg('rowactions', Ext.ux.grid.RowActions);

/**
 * Ext.ux.grid.RowArrower
 */
Ext.ux.grid.RowArrower = function(config){
    Ext.apply(this, config);

    this.addEvents({
        beforeexpand : true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });

    Ext.ux.grid.RowArrower.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.grid.RowArrower, Ext.util.Observable, {
    header: "",
    width: 25,
    sortable: false,
    fixed:true,
    dataIndex: '',
    id: 'arrower',
    lazyRender : true,
	menuDisabled : true,
    init : function(grid){
        this.grid = grid;
        var view = grid.getView();
    },
    renderer : function(v, p, record){
        p.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-arrower">&#160;</div>';
    }
});
// Create the namespace
Ext.ns('Ext.ux.plugins.grid');

/**
 * Ext.ux.plugins.grid.CellToolTips plugin for Ext.grid.GridPanel
 *
 * A GridPanel plugin that enables the creation of record based,
 * per-column tooltips that can also be dynamically loaded via Ajax
 * calls.
 *
 * Requires Animal's triggerElement override when using ExtJS 2.x
 * (from <a href="http://extjs.com/forum/showthread.php?p=265259#post265259">http://extjs.com/forum/showthread.php?p=265259#post265259</a>)
 * In ExtJS 3.0 this feature is arealy in the standard.
 *
 * @author  BitPoet
 * @date    July 03, 2009
 * @version 1.1
 *
 * @class Ext.ux.plugins.grid.CellToolTips
 * @extends Ext.util.Observable
 */
 
/**
 * Constructor for the Plugin
 *
 * @param {ConfigObject} config
 * @constructor
 */
Ext.ux.plugins.grid.CellToolTips = function(config) {
    var cfgTips;
    if( Ext.isArray(config) ) {
        cfgTips = config;
        config = {};
    } else {
    	cfgTips = config.ajaxTips;
    }
    Ext.ux.plugins.grid.CellToolTips.superclass.constructor.call(this, config);
    if( config.tipConfig ) {
    	this.tipConfig = config.tipConfig;
    }
    this.ajaxTips = cfgTips;
} // End of constructor

// plugin code
Ext.extend( Ext.ux.plugins.grid.CellToolTips, Ext.util.Observable, {
    version: 1.1,
    /**
     * Temp storage from the config object
     *
     * @private
     */
    ajaxTips: false,
    
    /**
     * Tooltip Templates indexed by column id
     *
     * @private
     */
    tipTpls: false,

    /**
     * Tooltip data filter function for setting base parameters
     *
     * @private
     */
    tipFns: false,
    
    /**
     * URLs for ajax backend
     *
     * @private
     */
    tipUrls: '',
    
    /**
     * Tooltip configuration items
     *
     * @private
     */
    tipConfig: {},

    /**
     * Loading action
     *
     * @private
     */
    request: false,

    /**
     * Plugin initialization routine
     *
     * @param {Ext.grid.GridPanel} grid
     */
    init: function(grid) {
        if( ! this.ajaxTips ) {
            return;
        }
        this.tipTpls = {};
        this.tipFns  = {};
        this.tipUrls = {};
        // Generate tooltip templates
        Ext.each( this.ajaxTips, function(tip) {
        	this.tipTpls[tip.field] = new Ext.XTemplate( tip.tpl );
        	if( tip.url ) {
        		this.tipUrls[tip.field] = tip.url;
        		if( tip.fn )
        			this.tipFns[tip.field] = tip.fn;
        	}
        }, this);
        // delete now superfluous config entry for ajaxTips
        delete( this.ajaxTips );
        grid.on( 'render', this.onGridRender.createDelegate(this) );
    } // End of function init

    /**
     * Set/Add a template for a column
     *
     * @param {String} fld
     * @param {String | Ext.XTemplate} tpl
     */
    ,setFieldTpl: function(fld, tpl) {
        this.tipTpls[fld] = Ext.isObject(tpl) ? tpl : new Ext.XTemplate(tpl);
    } // End of function setFieldTpl

    /**
     * Set up the tooltip when the grid is rendered
     *
     * @private
     * @param {Ext.grid.GridPanel} grid
     */
    ,onGridRender: function(grid) 
    {
        if( ! this.tipTpls ) {
            return;
        }
        // Create one new tooltip for the whole grid
        Ext.apply(this.tipConfig, {
            target:      grid.getView().mainBody,
            delegate:    '.x-grid3-cell-inner',
            trackMouse:  true,
            renderTo:    document.body,
            finished:	 false
        });
        this.tip = new Ext.ToolTip( this.tipConfig );
        this.tip.ctt = this;
        // Hook onto the beforeshow event to update the tooltip content
        this.tip.on('beforeshow', this.beforeTipShow.createDelegate(this.tip, [this, grid], true));
        this.tip.on('hide', this.hideTip);
    } // End of function onGridRender

    /**
     * Replace the tooltip body by applying current row data to the template
     *
     * @private
     * @param {Ext.ToolTip} tip
     * @param {Ext.ux.plugins.grid.CellToolTips} ctt
     * @param {Ext.grid.GridPanel} grid
     */
    ,beforeTipShow: function(tip, ctt, grid) {
	// Get column id and check if a tip is defined for it
	var colIdx = grid.getView().findCellIndex( tip.triggerElement );
	var tipId = grid.getColumnModel().getDataIndex( colIdx );
       	if( ! ctt.tipTpls[tipId] )
       	    return false;
    	if( ! tip.finished ) {
	       	var isAjaxTip = (typeof ctt.tipUrls[tipId] == 'string');
        	// Fetch the row's record from the store and apply the template
        	var cellRec = grid.getStore().getAt( grid.getView().findRowIndex( tip.triggerElement ) );
        	// create a copy of the record and use its data, otherwise we might
        	// accidentially modify the original record's values
        	var data = cellRec.copy().data;
        	if( isAjaxTip ) {
        		ctt.loadDetails((ctt.tipFns[tipId]) ? ctt.tipFns[tipId](data) : data, tip, grid, ctt, tipId);
        		return false;
        	} else {
			tip.body.dom.innerHTML = ctt.tipTpls[tipId].apply( cellRec.data );
		}       		
        } else {
        	tip.body.dom.innerHTML = tip.ctt.tipTpls[tipId].apply( tip.tipdata );
        }
    } // End of function beforeTipShow
    
    /**
     * Fired when the tooltip is hidden, resets the finished handler.
     *
     * @private
     * @param {Ext.ToolTip} tip
     */
    ,hideTip: function(tip) {
    	tip.finished = false;
    }
    
    /**
     * Loads the data to apply to the tip template via Ajax
     *
     * @private
     * @param {object} data Parameters for the Ajax request
     * @param {Ext.ToolTip} tip The tooltip object
     * @param {Ext.grid.GridPanel} grid The grid
     * @param {Ext.ux.plugins.grid.CellToolTips} ctt The CellToolTips object
     * @param {String} tipid Id of the tooltip (= field name)
     */
    ,loadDetails: function(data, tip, grid, ctt, tipid) {
    	Ext.Ajax.request({
    		url:	ctt.tipUrls[tipid],
    		params:	data,
    		method: 'POST',
    		success:	function(resp, opt) {
    			tip.finished = true;
    			tip.tipdata  = Ext.decode(resp.responseText);
    			tip.show();
    		}
    	});
    }

}); // End of extend