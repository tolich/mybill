/**
 * @author Tolich
 */
Ext.namespace('Ext.app.Users');

Ext.app.Users.Add = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Добавить пользователя',
		iconCls: 'user-add',
		disabled: App.isDeny('users', 'add'),
		handler: function(){
			App.getModule('users').onAdd();
		}
	},config));
};
Ext.app.Users.Edit= function(config){
	return new Ext.Action(Ext.apply({
		text: 'Изменить данные пользователя',
	    iconCls: 'user-edit',
		disabled: App.isDeny('users', 'edit'),
		handler: function(){
			App.getModule('users').onEdit();
		}
	},config));
};
Ext.app.Users.Payment = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Пополнить счет...',
		iconCls: 'user-payment',
		disabled: App.isDeny('payments', 'add'),
		menu: 
		[{
			text: 'Абонплата за следующий месяц',
			iconCls: 'monthly-pay',
			handler: function(){
				App.getModule('users').onPayFee('monthly');
			}
		}, {
			text: 'Абонплата за следующий день',
			iconCls: 'daily-pay',
			handler: function(){
				App.getModule('users').onPayFee('daily');
			}
		},'-',{
			text: 'Доплата за текущий месяц',
			iconCls: 'pay-fee',
			handler: function(){
				App.getModule('users').onPay();
			}
		},'-',{
			text: 'Абонплата за текущий месяц',
			iconCls: 'monthly-fee',
			handler: function(){
				App.getModule('users').onPayFee('monthlyfee');
			}
		}, {
			text: 'Абонплата за текущий день',
			iconCls: 'daily-fee',
			handler: function(){
				App.getModule('users').onPayFee('dailyfee');
			}
		},'-',{
			text: 'Пополнить счет',
			iconCls: 'pay-fee',
			handler: function(){
				App.getModule('users').onPayment();
			}
		}]
	}, config));
};
Ext.app.Users.ChTariff = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Сменить тариф',
		iconCls: 'user-chtariff',
		disabled: App.isDeny('users', 'submit'),
		handler: function(){
			App.getModule('users').onChangeTariffNow();
		}
	}, config));
};
Ext.app.Users.Fee = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Снять абонплату...',
		iconCls: 'user-fee',
		disabled: App.isDeny('users', 'submit'),
		menu: [{
			text: 'Снять абонплату за месяц',
			iconCls: 'monthly-fee',
			handler: function(){
				App.getModule('users').onFee('monthly');
			}
		}, {
			text: 'Снять абонплату за день',
			iconCls: 'daily-fee',
			handler: function(){
				App.getModule('users').onFee('daily');
			}
		}]
	}, config));
};
Ext.app.Users.TaskShow=function(config){
	return new Ext.Action(Ext.apply({
		text: 'Показать запланированные задачи'
	    ,iconCls: 'task-link'
		,disabled: App.isDeny('tasks', 'view')
		,handler: function(){
			App.setContext('tasks', {
				username : App.getContext('users').username
				,task: {
					attrname: '%',
					text: 'Все задачи'
				}
 			});
			App.getModule('tasks').winList();
		}
	},config));
};
Ext.app.Users.Stat = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Статистика',
		iconCls: 'user-stat',
		disabled: App.isDeny('reports', 'view'),
		handler: function(){
			App.getModule('users').winStat();
		}
	}, config));
};

Ext.app.Users.TaskAdd = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Запланировать...',
		iconCls: 'task-add',
		disabled: App.isDeny('tasks', 'add'),
		menu: [{
			text: 'Смена тарифа',
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('users').onChangeTariff();
			}
		}, {
			text: 'Включение',
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('users').onActivate();
			}
		}, {
			text: 'Отключение',
			iconCls: 'task-tree-add',
			handler: function(){
				App.getModule('users').onDeactivate();
			}
		}]
	}, config));
}
Ext.app.Users.On = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Включить',
		iconCls: 'user-on',
		disabled: App.isDeny('users', 'submit'),
		handler: function(){
			App.getModule('users').onOn();
		}
	}, config));
}
Ext.app.Users.Off = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Отключить',
		iconCls: 'user-off',
		disabled: App.isDeny('users', 'submit'),
		handler: function(){
			App.getModule('users').onOff();
		}
	}, config));
}
Ext.app.Users.DebtsOff = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Списать задолженность',
		iconCls: 'user-debtsoff',
		disabled: App.isDeny('users', 'submit'),
		handler: function(){
			App.getModule('users').onDebtsOff();
		}
	}, config));
}
Ext.app.Users.AdminList = function(config){
	return new Ext.Action(Ext.apply({
		text: 'Администраторы',
		iconCls: 'user-admin',
		disabled: App.isDeny('admin', 'view'),
		handler: function(){
			App.getModule('users').onAdminList();
		}
	}, config));
}

// Грид пользователей
Ext.app.Users.Grid = Ext.extend(Ext.grid.GridPanel, {
     border:false
    ,initComponent:function() {
		var pageLimit = 50;
		var access = App.settings.users['view_user'] || '1';
		var tariffs = [];
		
		// pluggable renders
		function renderFullName(value, p, r){
            var tasksCls = r.data.taskscount?'user-list-note':'user-list-note-empty';
            var qtip = r.data.taskscount
                ?"ext:qtip='Есть запланированные задачи ("+r.data.taskscount+" шт.)' onclick='Ext.app.Users.TaskShow().execute()'"
                :"";
			return String.format('<table><tr>'+
                    '<td class="{3}" {4}>&nbsp</td>'+
                    '<td class="{2}">&nbsp</td>'+
                    '<td>{0}<br><span class="code-num">&nbsp {1}</span></td>' +
                    '</tr></table>', 
					r.data.fullname, r.data.address, r.data.iconcls, tasksCls, qtip);
		}
		
		function renderLast(value, p, r){
			return String.format('{0}', r.data.laststatsupdate);
		}
		
		function renderDay(value, p, r){
			return String.format('{0} дн.', r.data.dateofcheck);
		}
	
		function renderAccess(value, p, r){
			return String.format('{0}', (r.data.access ==1 ? "Вкл." : "Откл."));
		}

		var expander = new Ext.ux.grid.RowExpander({
			tpl: new Ext.Template('<table class="table-wrap"><tr><td class="td-wrap">',
				'<ul>',
				'<li><div>Договор №:</div>&nbsp {code}</li>',
				'<li><div>Дата регистрации:</div>&nbsp {activatedate}</li>',
				'<li><div>Адрес:</div>&nbsp {address}</li>',
				'<li><div>Депозит:</div>&nbsp {deposit}</li>',
				'<li><div>Минимальный депозит:</div>&nbsp {mindeposit}</li>',
				'<li><div>Остаток предоплаченных МБ:</div>&nbsp {freebyte}</li>',
				'<li><div>Остаток бонусных МБ:</div>&nbsp {bonus}</li>',
				'<li><div>Неснимаемый остаток Мб:</div>&nbsp {freemblimit}</li>',
				'<li><div>Дополнительная информация:</div>&nbsp {detail}</li>',
				'</ul></td>',
				'<td class="td-wrap">',
				'<ul>',
				'<li><div>Тарифный план:</div>&nbsp {tariffname}</li>',
				'<li><div>Внутренний IP адрес:</div>&nbsp {in_ip}</li>',
				'<li><div>Внешний IP адрес:</div>&nbsp {out_ip}</li>',
				'<li><div>Пул IP адресов:</div>&nbsp {id_pool}</li>',
				'<li><div>Одновременных подключений:</div>&nbsp {maxlogin}</li>',
				'<li><div>MAC адрес:</div>&nbsp {mac}</li>',
				'<li><div>Шлюз:</div>&nbsp {sluicename}</li>',
				'<li><div>Входящая скорость (Кбит/с):</div>&nbsp {in_pipe} ({t_in_pipe})</li>',
				'<li><div>Исходящая скорость (Кбит/с):</div>&nbsp {out_pipe} ({t_out_pipe})</li>',
				'<li><div>Последнее обновление:</div>&nbsp {laststatsupdate}</li>',
				'</ul></td></tr></table>')
			,enableCaching: false
			,lazyRender: false
            ,expandOnDblClick: false
		});
	
		Ext.grid.CheckColumn = function(config){
		    Ext.apply(this, config);
		    if(!this.id){
		        this.id = Ext.id();
		    }
		    this.renderer = this.renderer.createDelegate(this);
		};
		
		Ext.grid.CheckColumn.prototype ={
		    init : function(grid){
		        this.grid = grid;
		        this.grid.on('render', function(){
		            var view = this.grid.getView();
		            view.mainBody.on('mousedown', this.onMouseDown, this);
		        }, this);
		    },
		
		    onMouseDown : function(e, t){
		        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
		            e.stopEvent();
		            var index = this.grid.getView().findRowIndex(t);
		            var record = this.grid.store.getAt(index);
					Ext.Msg.show({
						title:'Подтверждение',
						msg: (record.get(this.id)?'Отключить ':'Включить ')+ this.params.msg+'<b>' + record.get('username') + '?</b>',
						buttons: Ext.MessageBox.YESNO,
						icon: Ext.MessageBox.QUESTION,
						width: '330',
						fn: function(btn){
							if (btn == 'yes') {
                                if (App.isAllow('users', 'edit')) {
                                    App.request({
                                        url: '/ajax/users/' + (record.get(this.id) ? this.id + '_off' : this.id + '_on'),
                                        success: function(r, o){
                                            record.set(this.dataIndex, !record.data[this.dataIndex]);
                                            Ext.getCmp('user-grid').getStore().reload();
                                        },
                                        failure: function(){
                                        },
                                        params: {
                                            id: record.id
                                        }
                                    });
                                } else {
                                    record.set(this.dataIndex, !record.data[this.dataIndex]);
                                }
							};
						}
						,scope:this
					})
		        }
		    },
		
		    renderer : function(v, p, record){
		        p.css += ' x-grid3-check-col-td'; 
		        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
		    }
		};
	
		var checkMb = new Ext.grid.CheckColumn({
			header: 'Мб>min',
			dataIndex: 'check_mb',
			align: 'center',
			params: {
				msg: 'контроль за остатком Мб  для пользователя '
			},
            editor: App.isAllow('users','edit')?{
                xtype: 'checkbox'
            }:undefined,
			width: 90
		});

		var newUser = new Ext.grid.CheckColumn({
			header: 'Новый',
			dataIndex: 'newuser',
			align: 'center',
			params: {
				msg: ' перенаправление на страницу приветствия пользователя '
			},
            editor: App.isAllow('users','submit')?{
                xtype: 'checkbox'
            }:undefined,
			width: 90
		});

		var filters = new Ext.ux.grid.GridFilters({
		  filters:[
		    {type: 'numeric',  	dataIndex: 'id'},
		    {type: 'string',  	dataIndex: 'code'},
		    {type: 'string',  	dataIndex: 'surname'},
		    {type: 'string',  	dataIndex: 'username'},
		    //{type: 'string',  	dataIndex: 'tariffname'},
		    {type: 'numeric', 	dataIndex: 'deposit'},
		    {type: 'numeric', 	dataIndex: 'mindeposit'},
		    {type: 'numeric', 	dataIndex: 'freebyte'},
		    {type: 'numeric', 	dataIndex: 'freemblimit'},
		    {type: 'numeric', 	dataIndex: 'bonus'},
		    {type: 'string',  	dataIndex: 'dateofcheck'},
		    {type: 'string',  	dataIndex: 'in_ip'},
		    {type: 'numeric', 	dataIndex: 'maxlogin'},
		    {type: 'string',  	dataIndex: 'mac'},
		    //{type: 'string',  	dataIndex: 'sluicename'},
		    {type: 'date',  	dataIndex: 'laststatsupdate'},
		    {type: 'boolean', 	dataIndex: 'access'},
		    {
		      type: 'list',  
		      dataIndex: 'tariffname', 
		      //options: [],
			  store: new Ext.data.JsonStore({
			  	url: App.proxy('/ajax/tariffs/filter')
			  	,fields: ['id', 'text']
				,id:'id'
			  }),
		      phpMode: true
		    },
		    {
		      type: 'list',  
		      dataIndex: 'sluicename', 
		      //options: [],
			  store: new Ext.data.JsonStore({
			  	url: App.proxy('/ajax/sluices/filter')
			  	,fields: ['id', 'text']
				,id:'id'
			  }),
		      phpMode: true
		    },
		    {type: 'boolean', 	dataIndex: 'check_mb'},
		    {type: 'boolean', 	dataIndex: 'newuser'}
		]});
	
		this.on('filterupdate', function(){
			var filtered = false;
			this.filters.filters.each(function(filter) {
				if(filter.active) {
					filtered = true;
					return false;
				};
			});
			Ext.getCmp('users-clear-filter').setDisabled(!filtered);
		});

		this.settings= {
			cm:[
				{id: 'id', width: 40, hidden: true}
				,{id: 'code', width: 80, hidden: false}
				,{id: 'surname', width: 270, hidden: false}
				,{id: 'username', width: 100, hidden: false}
				,{id: 'tariffname', width: 100, hidden: false}
				,{id: 'deposit',width: 120, hidden: false}
				,{id: 'mindeposit',width: 120,hidden: false}
				,{id: 'freebyte',width: 120, hidden: false}
				,{id: 'freemblimit',width: 120, hidden: false}
				,{id: 'bonus', hidden: false}
				,{id: 'dateofcheck', width: 60, hidden: false}
				,{id: 'in_ip', hidden: false}			
				,{id: 'maxlogin', hidden: true}			
				,{id: 'mac', hidden: true}			
				,{id: 'sluicename', hidden: false}
				,{id: 'access', width: 50, hidden: true}
				,{id: 'check_mb', hidden: false}			
				,{id: 'newuser', hidden: false}			
				,{id: 'laststatupdate', width: 170,  hidden: true}			
			]
			,sortInfo: {field:'surname', directions:'asc'}
			,groupField: ''
		};
		Ext.apply(this.settings, App.settings.users['user-grid']);
		var columns = {
			id: {
				header: "id",
				dataIndex: 'id'
			},
			code: {
				header: "Код",
				dataIndex: 'code',
                editor: {
                    xtype: 'textfield',
                    vtype:'alphanumdot'
                }
			},
			surname: {
				header: "Ф.И.О.",
				dataIndex: 'fullname',
                editor: {
                    xtype: 'textfield'
                },
				renderer: renderFullName
			},
			username: {
				header: "Логин",
				dataIndex: 'username'
			},
			tariffname: {
				header: "Тариф",
				dataIndex: 'tariffname'
			},
			deposit: {
				header: "Депозит",
				dataIndex: 'deposit',
				align: 'right'
			},
			mindeposit: {
				header: "Мин.депозит",
				dataIndex: 'mindeposit',
				align: 'right',
                editor: {
                    xtype: 'numberfield'
                }
			},
			freebyte: {
				header: "Предопл.Мб",
				dataIndex: 'freebyte',
				align: 'right'
			},
			freemblimit: {
				header: "Мин.остаток Мб",
				dataIndex: 'freemblimit',
				align: 'right',
                editor: {
                    xtype: 'numberfield'
                }
			},
			bonus: {
				header: "Бонус.Мб",
				dataIndex: 'bonus',
				align: 'right'
			},
			dateofcheck: {
				header: "Отстр.",
				dataIndex: 'dateofcheck',
				align: 'center',
				renderer: renderDay,
                editor: {
                    xtype: 'textfield'
                }
			},
			in_ip: {
				header: "IP",
				dataIndex: 'in_ip',
				align: 'center',
                editor: {
                    xtype: 'textfield',
                    vtype: 'ip'
                }
			},
			maxlogin: {
				header: "Maкс.поключений",
				dataIndex: 'maxlogin',
				align: 'center',
                editor: {
                    xtype: 'textfield'
                }
			},
			mac: {
				header: "MAC",
				dataIndex: 'mac'
			},
			sluicename: {
				header: "Шлюз",
				dataIndex: 'sluicename',
				align: 'center'
			},
			access: {
				header: "Статус",
				dataIndex: 'access',
				align: 'center',
                editor: App.isAllow('users','edit')?{
                    xtype: 'checkbox'
                    ,listeners:{
                        'change': function(){
                            this.store.on('write',function(s){
                                s.reload();
                            },this,{single: true});
                        }
                        ,scope: this
                    }
                }:undefined,
				renderer: renderAccess
			},
			check_mb: checkMb,
			newuser: newUser,
			laststatupdate: {
				header: "Обновлено",
				dataIndex: 'laststatsupdate',
				align: 'center'
			}
		};
        var editor = new Ext.ux.grid.RowEditor({
            clicksToEdit: 2,
            saveText: 'Сохранить',
            cancelText: 'Отмена',
            commitChangesText: 'Вы должны сохранить или отменить Ваши изменения',
            errorText: 'Ошибка'
        });
        
		var plugins = [expander,filters];
		if(App.isAllow('users','edit')) plugins.push(editor);
		if(App.isAllow('users','edit')) plugins.push(checkMb);
		if(App.isAllow('users','submit')) plugins.push(newUser);
		var model = [expander];
		for (var i=0; i<this.settings.cm.length; i++){
			Ext.apply(columns[this.settings.cm[i]['id']], this.settings.cm[i]);
			model.push(columns[this.settings.cm[i]['id']]);	
		}
		var cm = new Ext.grid.ColumnModel(model);		
		cm.defaultSortable = true;

		// create the Data Store
		var store = new Ext.data.GroupingStore({
			proxy: new Ext.data.HttpProxy({
				url: App.proxy('/ajax/users/grid')
			}),
			reader: new Ext.data.JsonReader({
				root: 'data',
				totalProperty: 'totalCount',
				fields: ['id', 'code', 'username', 'deposit', 'freebyte', 'mindeposit', 'taskscount',
						 'dateofcheck', 'wwwpassword', 'email', 'name', 'surname', 'fullname','detail', 
						 'in_ip', 'out_ip', 'in_pipe', 'out_pipe','t_in_pipe', 't_out_pipe','maxlogin', 'mac', 'access', 
						 'freemblimit', 'bonus', 'laststatsupdate', 'address', 'sluicename', 
						 'tariffname', 'iconcls','id_pool', {name:'check_mb',type:'bool'}, 
						 {name:'newuser',type:'bool'},'activatedate','monthlyfee','dailyfee','price'],
				id: 'id'
			}),
            autoSave: true,
            writer: new Ext.data.JsonWriter({
                encode: true,
                writeAllFields: false // write all fields, not just those that changed
            }),
			remoteSort: true,
			sortInfo:this.settings.sortInfo, //{field:'surname', directions:'asc'},
			groupField:this.settings.groupField,
			baseParams: {limit:pageLimit,access:access},
			listeners:{
				'load': function(s){
					if (this.getSelectionModel().getCount()==0)
						this.getSelectionModel().fireEvent('rowdeselect');
				}
				,scope:this
			}
		});

        Ext.apply(this, {
			region: 'center',
			margins: '0 5 5 0',
			title: 'Пользователи',
			store: store,
			cm: cm,
			trackMouseOver: true,
			autoScroll :true,
			plugins:plugins,
			loadMask: true,
			collapsible: true,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect: true
				,listeners: {
					'rowselect': function(m,i,row){
						Ext.getCmp('tb-user-payment').setDisabled(App.isDeny('payments', 'add'));
						Ext.getCmp('tb-user-stat').setDisabled(App.isDeny('reports', 'view'));
						App.applyContext('users',{
							id			: row.get('id')
							,username	: row.get('username')
							,monthlyfee	: row.get('monthlyfee')
							,dailyfee	: row.get('dailyfee')
							,price		: row.get('price')
						});
					},
					'rowdeselect': function(m, i, row){
						Ext.getCmp('tb-user-payment').disable();
						Ext.getCmp('tb-user-stat').disable();
						//Ext.getCmp('intariff-grid').getStore().removeAll();						
					}										
				}
			}),
			view: new Ext.grid.GroupingView({
				groupByText: 'Группировать по этому полю',
				showGroupsText: 'Отображать по группам',
				forceFit: true,
				groupTextTpl: '{text} ({[values.rs.length]} {["стр."]})',
 				onLoad: Ext.emptyFn,
 	            listeners: {
	                'beforerefresh': function(v) {
	                    v.scrollTop = v.scroller.dom.scrollTop;
	                },
	                'refresh': function(v) {
	                    v.scroller.dom.scrollTop = v.scrollTop;
	                }
	            }
			}),
			tbar: ['Поиск: ', 
			new Ext.ux.form.SearchField({
				store: store,
				width: 220
			}),
			'-',
			{
				text: 'Очистить фильтр'
				,id: 'users-clear-filter'
				,handler: function(){
					//this.filters.getFilter('tariffname').setValue();
					filters.clearFilters();
				}
				,disabled: true
				,scope:this
			},'-',
			Ext.app.Users.Payment({id:'tb-user-payment',disabled:true}), 
			'-',
			Ext.app.Users.Stat({id:'tb-user-stat',disabled:true}),
			'->',
			' Отображать пользователей: ',
			new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
						fields: ['id', 'viewmode'],
						data: [['%', 'Всех'],['1','Активированных'],['0','Неактивированных']] 
						}),
				valueField: 'id',
				displayField: 'viewmode',
				id: 'view_user',
				typeAhead: true,
				mode: 'local',
				value: access,
				triggerAction: 'all',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127,
				listeners:{
					'select':function(c){
						access = c.getValue();
						store.baseParams.access = access;
						store.load();
					}
				}
			})],
			bbar: new Ext.PagingToolbar({
				pageSize: pageLimit,
				store: store,
				plugins: filters,
				displayInfo: true
			})
        });

        Ext.app.Users.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent

    ,onRender:function() {
		this.store.load({params: {start: 0, query:''}});

        Ext.app.Users.Grid.superclass.onRender.apply(this, arguments);
    } // eo function onRender
	,listeners:{
		'rowcontextmenu':function(g, rowIndex, e){
			var sm = g.getSelectionModel();
			var rowcmenu = new Ext.menu.Menu([
				Ext.app.Users.Add(), 
				Ext.app.Users.Edit(),
				'-', 
				Ext.app.Users.Payment(), 
				Ext.app.Users.Fee(), 
				Ext.app.Users.ChTariff(),
				Ext.app.Users.DebtsOff({
					disabled: App.isAllow('users', 'submit')?g.getStore().getAt(rowIndex).get('deposit')>=0:true
				}),
				'-', 
				Ext.app.Users.TaskAdd(), 
				Ext.app.Users.TaskShow(), 
				'-', 
				g.getStore().getAt(rowIndex).get('access')==1?Ext.app.Users.Off():Ext.app.Users.On(),
				'-', 
				Ext.app.Print.Order(),
				'-',
				Ext.app.Users.Stat()
			]);
			sm.selectRow(rowIndex);
			e.stopEvent();
			rowcmenu.render();
			var xy = e.getXY();
			rowcmenu.showAt(xy);
		},
		'contextmenu':function(e){
			var cmenu = new Ext.menu.Menu([Ext.app.Users.Add()]);
			e.stopEvent();
			cmenu.render();
			var xy = e.getXY();
			cmenu.showAt(xy);
		}
		,scope:this
	}
});
Ext.reg('usergrid', Ext.app.Users.Grid);

App.register(Ext.extend(Ext.app.Module, {
	moduleId: 'users'
	,setSettings: function(){
		var g = Ext.getCmp('user-grid');
		var cm = g.getColumnModel();
		var newcm = [];
		for (var i = 0; i < cm.getColumnCount(); i++) {
			if (cm.getColumnId(i)!='expander')
				newcm.push({
					id: cm.getColumnId(i),
					width: cm.getColumnWidth(i),
					hidden: cm.isHidden(i)
				});
		}
		var items = [];
		Ext.getCmp('info-tabpanel').items.each(
			function(i){
				if (i.xtype) {
                    //Bug ExtJS 3.1
                    delete i.initialConfig.ownerCt;
                    items.push(i.initialConfig);
                }               
			}
		);
		Ext.apply(App.settings.users, {
			'user-grid': {
				cm: newcm,
				sortInfo: g.store.getSortState(),
				groupField: g.store.getGroupState()
			}
			,'view_user': Ext.getCmp('view_user').getValue()
			,'info-panel': {
				width: Ext.getCmp('log-panel').getInnerWidth()
				,height: Ext.getCmp('info-panel').getInnerHeight()
				,info_collapsed : Ext.getCmp('info-panel').collapsed
				,log_collapsed : Ext.getCmp('log-panel').collapsed 
			}
			,'info-panel-items': items
			,'info-panel-active-tab':Ext.getCmp('info-tabpanel').items.indexOf(Ext.getCmp('info-tabpanel').getActiveTab()) 
		});
	}
	,onAdd:function(){
		var mask = new Ext.LoadMask(Ext.getBody());
		mask.show();
		var str ='qwertyuipasdfghjklzxcvbnm0123456789';
		var pass = '';
		for (i=0; i<10;i++)
			pass+=str.charAt(Math.floor(str.length*Math.random()));
		var usr = '';//'usr'+Math.ceil(9999*Math.random());
		App.request({
		   url: '/ajax/users/getbyid',
		   callback: function(){
				mask.hide();
		   },
		   success: function(r, o){
		   		var post = Ext.decode(r.responseText);
				if (post.success != false) {
					post.mode = 0;
					post.user = {
						id_tariff: undefined,
						pipe_method: 0,
						dateofcheck: 0,
						code: '',
						username: usr,
						password: pass,
						wwwpassword: pass,
						email: '',
						name: '',
						surname: '',
						address: '',
						detail: '',
						in_ip: '0.0.0.0',
						out_ip: '0.0.0.0',
						maxlogin: 1,
						mac: '',
						check_calling: 0,
						in_pipe: 0,
						out_pipe: 0,
						session_timeout: 86400,
						idle_timeout: 0,
						mindeposit: 0,
						id_pool: undefined,
						id_sluice: 0,
						freemblimit: 0,
						access: 1,
						check_mb: 1,
						is_repl: 1
					};
					this.winUser('/ajax/users/add', post);
				}
		   }
		   ,scope: this
		});		
	}
	,onEdit:function(){
		var mask = new Ext.LoadMask(Ext.getBody());
		mask.show();
		App.request({
		   url: '/ajax/users/getbyid',
		   callback: function(){
				mask.hide();
		   },
		   success: function(r, o){
		   		var post = Ext.decode(r.responseText);
				if (post.success != false) {
					post.user.id = this.getContext().id;
					post.mode = 1;
					mask.hide();
			   		this.winUser('/ajax/users/edit', post);	
				}
		   },
		   params: { id: this.getContext().id },
		   scope: this
		});		
	}
	,winStat: function(){
		var win = Ext.getCmp('win-stat');
		if (win == undefined) {
			var win = new Ext.Window({
				title: 'Статистика пользователя - '+this.getContext().username,
				id: 'win-stat',
				width: 1000,
				height: 600,
				minWidth: 1000,
				minHeight: 600,
				layout: 'fit',
				plain: true,
				modal: true,
				items: new Ext.TabPanel({
				    activeTab: 0,
				    items: [{
						xtype:'statgrid'
						,iconCls:'tab-link'
						,listeners:{
							'beforerender': function(g){
								g.store.baseParams.username=this.getContext().username;
							}
							,scope: this
						}
				    },{
						xtype:'paygrid'
						,iconCls:'tab-payment'
						,listeners:{
							'beforerender': function(g){
								g.store.baseParams.userid=this.getContext().id;
							}
							,scope: this
						}
				    },{
						xtype:'tariffgrid'
						,iconCls:'tab-tariff'
						,listeners:{
							'beforerender': function(g){
								g.store.baseParams.username=this.getContext().username;
							}
							,scope: this
						}
				    }]
				})
			});
		}
		win.show();
	}
	,onPayment:function(){
		this.app.setContext('payments', {
			mode 		: 0 // Добавление
			,iduser 	: this.getContext().id 
			,username 	: this.getContext().username 
		});
		this.app.getModule('payments').winPayment();
	}
	,onPay:function(p){ // onPay
		var datePay = new Date();
		var t = 'Доплата за текущий месяц';
		var url = '/ajax/payments/pay';
		var description = 'Доплата за '+Ext.util.Format.date(datePay, 'F Y');
			
	    var formPanel = new Ext.FormPanel({
	        labelWidth: 170,
			labelAlign: 'right',
			labelAlign: 'right',
			frame: false,
	        bodyStyle:'padding:10px;',
	        defaultType: 'textfield',
	
	        items: 
			[{
	            fieldLabel: 'Сумма платежа',
	            id: 'amount',
				vtype: 'money',
				value: '0.00',
				allowBlank: false,
				listeners:{
					'change': function(f,newv,oldv){
						if (App.getContext('users').price!=0)
							Ext.getCmp('amountfreebyte').setValue(newv/App.getContext('users').price);
					}
				}
	        }, {
	            fieldLabel: 'На основной счет (Мб)',
	            id: 'amountfreebyte',
				vtype: 'mbyte',
				value: '0.000',
				allowBlank: false
	        },{
	            fieldLabel: 'Основание платежа',
	            id: 'description',
				value: description,
				xtype: 'textarea',
				width: '119'
	        }]
	    });
		var form = formPanel.getForm();
		
		var win = Ext.getCmp('win-pay');
		if (win==undefined){
		    var win = new Ext.Window({
		        title: t+' - '+this.getContext().username,
				id: 'win-pay',
		        width: 380,
		        height:220,
		        minWidth: 380,
		        minHeight: 220,
		        layout: 'fit',
		        plain:true,
				modal: true,
		        items: formPanel,
		        buttons: [{
		            text: 'Ок',
					handler: function(){
						var post = {
							iduser: this.getContext().id,
							amount: '0.00',
							amountfreebyte: '0.00',
							description: ''
						};
						for (o in post) 
							if (Ext.getCmp(o)) 
								post[o] = Ext.getCmp(o).getValue();
						if (form.isValid()) {
							Ext.Msg.show({
								title:'Подтверждение',
								msg: 'Провести платеж Доплата за '+t+' для пользователя <b>' + this.getContext().username + '?</b>' +
									'<div class="div-msg">' +
								'<ul>' +
								'<li><div>Сумма платежа:</div>' + post.amount + '</li>' +
								'<li><div>На основной счет:</div>' + post.amountfreebyte + '</li>' +
								'</ul></div>',
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								width: '350',
								fn: function(btn){
									win.el.mask();
									if (btn == 'yes') {
										App.request({
											url: url,
											success: function(r, o){
												win.close();
												Ext.getCmp('user-grid').getStore().reload();
											},
											failure: function(){
											},
											params: post
										});
									};
								}
							})
						}
					}
					,scope: this
		        },{
		            text: 'Отмена',
					handler: function(){
						win.close();
					}
		        }]
		    });
		};
		win.show();
	} // End winPay
	,onPayFee:function(p){ // onPayFee
		var datePay = new Date();
		switch (p)
		{
			case 'monthlyfee':
				var t = 'Абонплата за текущий месяц';
				var url = '/ajax/payments/paymonthly';
				var description = 'Абонплата за '+Ext.util.Format.date(datePay, 'F Y');
				var amount = this.getContext().monthlyfee ||'0.00'
				var fee = 1;
			break;
			case 'dailyfee':
				var t = 'Абонплата за текущий  день';
				var url = '/ajax/payments/paydaily';
				var description = 'Абонплата за '+Ext.util.Format.date(datePay, 'd.m.Y');
				var amount = this.getContext().dailyfee ||'0.00'
				var fee = 1;
			break;
			case 'monthly':
				datePay.setDate(datePay.getDate()+28);
				var t = 'Абонплата за следующий месяц';
				var url = '/ajax/payments/paymonthly';
				var description = 'Абонплата за '+Ext.util.Format.date(datePay, 'F Y');
				var amount = this.getContext().monthlyfee ||'0.00'
				var fee = 0;
			break;
			case 'daily':
				datePay.setDate(datePay.getDate()+1);
				var t = 'Абонплата за следующий  день';
				var url = '/ajax/payments/paydaily';
				var description = 'Абонплата за '+Ext.util.Format.date(datePay, 'd.m.Y');
				var amount = this.getContext().dailyfee ||'0.00'
				var fee = 0;
			break;
		}
			
	    var formPanel = new Ext.FormPanel({
	        labelWidth: 170,
			labelAlign: 'right',
			labelAlign: 'right',
			frame: false,
	        bodyStyle:'padding:10px;',
	        defaultType: 'textfield',
	
	        items: 
			[{
	            fieldLabel: 'Сумма платежа',
	            id: 'amount',
				vtype: 'money',
				value: amount,
				allowBlank: false
	        },{
	            fieldLabel: 'Основание платежа',
	            id: 'description',
				value: description,
				xtype: 'textarea',
				width: '119'
	        }]
	    });
		var form = formPanel.getForm();
		
		var win = Ext.getCmp('win-payfee');
		if (win==undefined){
		    var win = new Ext.Window({
		        title: t+' - '+this.getContext().username,
				id: 'win-payfee',
		        width: 380,
		        height:190,
		        minWidth: 380,
		        minHeight: 190,
		        layout: 'fit',
		        plain:true,
				modal: true,
		        items: formPanel,
		        buttons: [{
		            text: 'Ок',
					handler: function(){
						var post = {
							iduser: this.getContext().id,
							amount: '0.00',
							description: '',
							fee: fee
						};
						for (o in post) 
							if (Ext.getCmp(o)) 
								post[o] = Ext.getCmp(o).getValue();
						if (form.isValid()) {
							Ext.Msg.show({
								title:'Подтверждение',
								msg: 'Провести платеж Абонплата за '+t+' для пользователя <b>' + this.getContext().username + '?</b>' +
									'<div class="div-msg">' +
								'<ul>' +
								'<li><div>Сумма платежа:</div>' + post.amount + '</li>' +
								'</ul></div>',
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								width: '350',
								fn: function(btn){
									if (btn == 'yes') {
										win.el.mask();
										App.request({
											url: url,
											success: function(r, o){
												win.close();
												Ext.getCmp('user-grid').getStore().reload();
											},
											failure: function(){
											},
											params: post
										});
									};
								}
							})
						}
					}
					,scope: this
		        },{
		            text: 'Отмена',
					handler: function(){
						win.close();
					}
		        }]
		    });
		};
		win.show();
	} // End winPayFee
	,onChangeTariff:function(){
		this.winChangeTariff();
	}
	,onChangeTariffNow:function(){
		this.winChangeTariffNow();
	}
	,onActivate: function(){
		this.winChangeState('on');
	}
	,onDeactivate: function(){
		this.winChangeState('off');
	}
	,onOff:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Отключить пользователя <b>' + this.app.getContext('users').username + '</b>?<br>Основание:',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			prompt: true,
			value: 'Отключен администратором',
			width: '330',
			fn: function(btn, text){
				if (btn == 'yes') {
					App.request({
						url: '/ajax/users/off',
						success: function(r, o){
							Ext.getCmp('user-grid').getStore().reload();
						},
						failure: function(){
						},
				 	   	params: { 
							id: this.getContext().id 
							,text: text
						}
					});
				};
			}
			,scope: this
		})
	}
	,onOn:function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Включить пользователя <b>' + this.getContext().username + '</b>?<br>Основание:',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			prompt: true,
			value: 'Включен администратором',
			width: '330',
			fn: function(btn, text){
				if (btn == 'yes') {
					App.request({
						url: '/ajax/users/on',
						success: function(r, o){
							Ext.getCmp('user-grid').getStore().reload();	
						},
						failure: function(){
						},
						params: { 
							id: this.getContext().id
							,text: text
						}
					});
				};
			}
			,scope: this
		})
	}
	,onFee:function(p){
		switch (p)
		{
			case 'monthly':
				var t = 'месяц';
				var url = '/ajax/users/monthly';
			break;
			case 'daily':
				var t = 'день';
				var url = '/ajax/users/daily';
			break;
		}
		
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Снять абонплату за '+t+' с пользователя <b>' + this.getContext().username + '</b>?',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '330',
			fn: function(btn, text){
				if (btn == 'yes') {
					App.request({
						url: url,
						success: function(r, o){
							Ext.getCmp('user-grid').getStore().reload();	
						},
						failure: function(){
						},
						params: { 
							id: this.getContext().id
						}
					});
				};
			}
			,scope: this
		})
	}
	,onDebtsOff: function(){
		Ext.Msg.show({
			title:'Подтверждение',
			msg: 'Вы действительно хотите списать задолженность пользователю <b>' + this.getContext().username + '?</b>',
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			width: '300',
			fn: function(btn){
				if (btn == 'yes') {
					App.request({
						url : '/ajax/users/debtsoff'
						,success: function(r, o){
							Ext.getCmp('user-grid').getStore().reload();
						},
						failure: function(){
						},
						params: {
							id: this.getContext().id
						}
						,scope:this
					});
				};
			}
			,scope:this
		})
	}
	// Add\Edit user window
	,winUser: function(url, post){
		var win = Ext.getCmp('win_user');
		if (win == undefined) {
			var onChange = function(){
				post.user.repl_status = 0;
			}
		// ComboBox
			post.pool.unshift({poolval:'-', poolname:'&nbsp;'});
			var id_pool = new Ext.form.ComboBox({
				store: new Ext.data.JsonStore({
						fields: ['poolval', 'poolname'],
						data: post.pool
					}),
				valueField: 'poolval',
				displayField: 'poolname',
				id: 'id_pool',
				fieldLabel: 'Пул IP адресов',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: true,
				editable: false,
				width: 127,
				listeners: {
					'select':function(cmb,record,index){
						if (cmb.getValue()=='-') {
							cmb.clearValue();
						}
					}
				}
			});
			var id_tariff = new Ext.form.ComboBox({
				store: new Ext.data.JsonStore({
						fields: ['id', 'tariffname', 'mindeposit', 'freemblimit','dateofcheck','id_sluice','check_mb'],
						data: post.tariff
					}),
				valueField: 'id',
				displayField: 'tariffname',
				id: 'id_tariff',
				fieldLabel: 'Тарифный пакет',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127,
				listeners:{
					'select': function(c,r,i){
						Ext.getCmp('mindeposit').setValue(r.data.mindeposit);
						Ext.getCmp('freemblimit').setValue(r.data.freemblimit);
						Ext.getCmp('dateofcheck').setValue(r.data.dateofcheck);
						Ext.getCmp('id_sluice').setValue(r.data.id_sluice);
						Ext.getCmp('check_mb').setValue(r.data.check_mb);
					}
					,'change': onChange
				}
			});
			
			var id_sluice = new Ext.form.ComboBox({
				store: new Ext.data.JsonStore({
						fields: ['id', 'sluicename'],
						data: post.sluice
					}),
				valueField: 'id',
				displayField: 'sluicename',
				id: 'id_sluice',
				fieldLabel: 'Шлюз',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: 'Не установлен!',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127
			});
			
			var pipe_method = new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
					fields: ['id', 'method'],
					data: [[0, 'ng_car'], [1, 'ipfw']]
				}),
				valueField: 'id',
				displayField: 'method',
				value: 0,
				id: 'pipe_method',
				fieldLabel: 'Ограничивать скорость',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127
			});
			
			var dateofcheck = new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
					fields: ['id', 'day'],
					data: [[0, 'Нет'], [1, '1 день'], [2, '2 дня'], [3, '3 дня'], [4, '4 дня'], 
						   [5, '5 дней'], [6, '6 дней'], [7, '7 дней'], [8, '8 дней'], [9, '9 дней'], [10, '10 дней'],
						   [11, '11 дней'], [12, '12 дней'], [13, '13 дней'], [14, '14 дней'], [15, '15 дней']]
				}),
				valueField: 'id',
				displayField: 'day',
				value: 0,
				id: 'dateofcheck',
				fieldLabel: 'Отстрочка платежа',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127
			});
			
			var check_calling = new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
					fields: ['id', 'check'],
					data: [[0, 'Нет'], [1, 'Да']]
				}),
				valueField: 'id',
				displayField: 'check',
				value: 0,
				id: 'check_calling',
				fieldLabel: 'Проверять MAC при подключении',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127
			});
		
			var access = new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
					fields: ['id', 'text'],
					data: [[1, 'Включен'], [0, 'Отключен']]
				}),
				valueField: 'id',
				displayField: 'text',
				value: 1,
				id: 'access',
				fieldLabel: 'Доступ в интернет',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127
			});
		
			var check_mb = new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
					fields: ['id', 'check'],
					data: [[0, 'Нет'], [1, 'Да']]
				}),
				valueField: 'id',
				displayField: 'check',
				value: 0,
				id: 'check_mb',
				fieldLabel: 'Отключать если нет Мб',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127
			});

			var newuser = new Ext.form.ComboBox({
				store: new Ext.data.SimpleStore({
					fields: ['id', 'check'],
					data: [[0, 'Нет'], [1, 'Да']]
				}),
				valueField: 'id',
				displayField: 'check',
				value: 0,
				id: 'newuser',
				fieldLabel: 'Новый пользователь',
				typeAhead: true,
				mode: 'local',
				triggerAction: 'all',
				valueNotFoundText: '',
				selectOnFocus: true,
				allowBlank: false,
				editable: false,
				width: 127
			});
		
		// User FormPanel		
			var formPanel = new Ext.FormPanel({
				labelWidth: 230,
				labelAlign: 'right',
				frame: false,
				defaultType: 'textfield',
				items: {
					id: 'tab',
					xtype: 'tabpanel',
					activeTab: 0,
					border: false,
					defaults: {
						autoHeight: true,
						bodyStyle: 'padding:10px 10px 0 10px'
					},
					items: [{
						title: 'Личные данные',
						layout: 'form',
						defaultType: 'textfield',
						defaults: {width: 250},
						items: [{
							fieldLabel: 'Номер договора',
							id: 'code',
							vtype:'alphanumdot',
                            width: 135,
							listeners:{
								'change': onChange
							}
						}, {
							fieldLabel: 'Фамилия',
							id: 'surname',
							listeners:{
								'change': onChange
							}
						}, {
							fieldLabel: 'Имя, отчество',
							id: 'name',
							listeners:{
								'change': onChange
							}
						}, {
							fieldLabel: 'Адрес',
							id: 'address',
							listeners:{
								'change': onChange
							}
						}, {
							fieldLabel: 'Логин',
							id: 'username',
							allowBlank: false,
							vtype:'alphanumdot'
						}, {
							fieldLabel: 'Пароль',
							id: 'password',
                            inputType:'password',
                            qtip: post.user['password'],
							vtype:'alphanumdot',
                            enableKeyEvents: true
						}, {
							fieldLabel: 'Пароль для просмотра статистики',
							id: 'wwwpassword',
                            inputType:'password',
                            qtip: post.user['wwwpassword'],
							vtype:'alphanumdot',
                            enableKeyEvents: true
						}, {
							fieldLabel: 'Email',
							id: 'email',
							vtype: 'email'
						}, {
							fieldLabel: 'Дополнительная информация',
							id: 'detail',
							xtype: 'textarea',
							height: 50,
							listeners:{
								'change': onChange
							}
						}, {
							fieldLabel: 'Синхронизировать с 1С',
							id: 'is_repl',
							xtype: 'checkbox'
						}]
					}, {
						title: 'Тарифный план',
						layout: 'form',
						defaultType: 'textfield',
						defaults: {width: 135},
						items: [id_tariff, {
                            xtype: 'numberfield',
							fieldLabel: 'Минимальный депозит',
							id: 'mindeposit',
							value: 0
						}, {
                            xtype: 'numberfield',
							fieldLabel: 'Неснимаемый остаток Мб',
							id: 'freemblimit',
							value: 0,
							hiddden: true
						},{
							fieldLabel: 'Входящая скорость (Кб/с) *'
							,id: 'in_pipe'
							,value: 0
						}, {
							fieldLabel: 'Исходящая скорость (Кб/с) *'
							,id: 'out_pipe'
							,value: 0
						}, {
							fieldLabel: 'Максимальное время сессии (сек.)'
							,id: 'session_timeout'
							,value: 86400
						}, {
							fieldLabel: 'Максимальное время простоя (сек.)'
							,id: 'idle_timeout'
							,value: 0
						}
						, dateofcheck
						, check_mb
						, newuser
						,{
							xtype:'label'
							,autoWidth: true	
							,text: '* - ненулевое значение имеет преимущество перед указанным в тарифе.'
							,style: 'color:grey;'
						}]
					}, {
						title: 'Сетевые настройки',
						layout: 'form',
						defaultType: 'textfield',
						defaults: {width: 135},
						items: 
						[{
							fieldLabel: 'Внутренний IP адрес',
							id: 'in_ip',
							value: '0.0.0.0',
							vtype: 'ip'
						}, {
							fieldLabel: 'Внешний IP адрес',
							id: 'out_ip',
							value: '0.0.0.0',
							vtype: 'ip'
						}
						, id_pool
						, {
							xtype: 'textarea',
							fieldLabel: 'Разрешенные MAC адреса',
							id: 'mac'
						}, {
							xtype: 'numberfield',
							negative: false,
							decimal: false,
							fieldLabel: 'Одновременных подключений',
							id: 'maxlogin',
							value: '1'
						}
						, check_calling
						, id_sluice
						, pipe_method
						, access
						]
					}]
				}
			});
            if (post.mode==0){
                Ext.getCmp('username').on('focus', function(f){
                    var s = '';
                    var n = Ext.getCmp('name').getValue().trim().split(/\s+/).reverse();
                    if (n)
                    Ext.each(n, function(i){
                        if (i) s = i[0]+s;
                    });
                    var sn = Ext.getCmp('surname').getValue().trim().split(/\s+/)[0]; 
                    s=s==''?sn:s+'_'+sn;
                    f.setValue(Ext.ux.util.translit(s,true));
                },this);
            }
			var form = formPanel.getForm();
			
			// Add\Edit user Window
			var win = new Ext.Window({
				id: 'win-user',
				layout: 'fit',
				width: 550,
				height: 400,
				minWidth: 550,
				minHeight: 400,
				plain: true,
				modal: true,
				items: formPanel,
				title: 'Новый пользователь',
				buttons: [{
					text: 'Ok',
					handler: function(){
						for (o in post.user) {
							if (Ext.getCmp(o)) {
								var val=Ext.getCmp(o).getValue();
								if (val===true){
									val = 1;
								} else if (val===false){
									val = 0;
								}
								post.user[o] = val;
							}
						}
						if (form.isValid()) {
							App.request({
								url: url,
								success: function(r, o){
									win.close();
									Ext.getCmp('user-grid').getStore().reload();
								},
								failure: function(){
								},
								params: post.user
							});
						}
						else{
							Ext.Msg.show({
							   title:'Ошибка',
							   msg: 'Заполнены не все поля или введены некорректные данные!',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO
							});
						}
					}
				}, {
					text: 'Отмена',
					handler: function(){
						win.hide();
						win.destroy();
					}
				}]
			});
			if (post.mode == 1) {
				win.setTitle('Свойства пользователя - ' + post.user.username);
			}
			for (o in post.user) {
				var e = Ext.getCmp(o);
				if (e) {
					e.setValue(post.user[o]);
				}
			}
			formPanel.getComponent('tab').activate(0);
		}
		win.show();
	}//End winUser
	
	// winChangeTariff
	,winChangeTariff: function(){
		var win = Ext.getCmp('win-chtariff');
		if (win == undefined) {
			var today = new Date();
		    var formPanel = new Ext.FormPanel({
				labelWidth: 120,
				labelAlign: 'right',
				frame: false,
		        bodyStyle:'padding:10px;',
		        defaultType: 'textfield',
		
		        items: [{
		            fieldLabel: 'Новый тариф',
		            xtype: 'combo',
					store: new Ext.data.JsonStore({
							url: App.proxy('/ajax/tariffs/list'),
							fields: ['id', 'tariffname']
						}),
					valueField: 'id',
					displayField: 'tariffname',
					id: 'value',
					typeAhead: true,
					//mode: 'local',
					triggerAction: 'all',
					valueNotFoundText: '',
					selectOnFocus: true,
					allowBlank: false,
					editable: false,
					width: 127
		        },{
		            fieldLabel: 'Дата активации',
		            id: 'opdate',
					xtype: 'datefield',
					allowBlank: false,
					value:today,
					width: 127
		        }]
		    });
			var form = formPanel.getForm();
		
			var win = new Ext.Window({
				id: 'win-chtariff',
				title: 'Смена тарифа',
				width: 320,
				height: 140,
				minWidth: 320,
				minHeight: 140,
				layout: 'fit',
				plain: true,
				modal: true,
				items: formPanel,
				buttons: [{
					text: 'Ок',
					scope: this,
					handler: function(){
						var url = '/ajax/tasks/add';
						if (form.isValid()) {
							Ext.Msg.show({
								title: 'Подтверждение',
								msg: 'Запланировать смену тарифа для пользователя <b>' + this.getContext().username + '?</b>' +
								'<div class="div-msg">' +
								'<ul>' +
								'<li><div>Новый тариф:</div>' +
								Ext.get('value').getValue() +
								'</li>' +
								'<li><div>Дата активации:</div>' +
								Ext.util.Format.date(Ext.getCmp('opdate').getValue()) +
								'</li>' +
								'</ul></div>',
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								width: '330',
								scope: this,
								fn: function(btn){
									if (btn == 'yes') {
										App.request({
											url: url,
											success: function(r, o){
												win.hide();
												win.destroy();
											},
											failure: function(){
											},
											params: {
												attribute: 'Change-tariff',
												username: this.getContext().id,
												value: Ext.getCmp('value').getValue(),
												opdate: Ext.util.Format.date(Ext.getCmp('opdate').getValue(), 'Y-m-d'),
												id_period: 1
											}
											,scope: this
										});
									};
								}
							})
						}
						else{
							Ext.Msg.show({
							   title:'Ошибка',
							   msg: 'Заполнены не все поля!',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO
							});
						}
					}
				}, {
					text: 'Отмена',
					handler: function(){
						win.hide();
						win.destroy();
					}
				}]
			});
			win.setTitle('Смена тарифа - ' + this.app.getContext('users').username);
		}
		win.show();
	} // End winChangeTariff
	// winChangeTariffNow
	,winChangeTariffNow: function(){
		var win = Ext.getCmp('win-chtariff');
		if (win == undefined) {
			var today = new Date();
		    var formPanel = new Ext.FormPanel({
				labelWidth: 120,
				labelAlign: 'right',
				frame: false,
		        bodyStyle:'padding:10px;',
		        defaultType: 'textfield',
		
		        items: [{
		            fieldLabel: 'Новый тариф',
		            xtype: 'combo',
					store: new Ext.data.JsonStore({
							url: App.proxy('/ajax/tariffs/list'),
							fields: ['id', 'tariffname']
						}),
					valueField: 'id',
					displayField: 'tariffname',
					id: 'value',
					typeAhead: true,
					//mode: 'local',
					triggerAction: 'all',
					valueNotFoundText: '',
					selectOnFocus: true,
					allowBlank: false,
					editable: false,
					width: 127
		        }]
		    });
			var form = formPanel.getForm();
		
			var win = new Ext.Window({
				id: 'win-chtariff',
				title: 'Смена тарифа',
				width: 320,
				height: 120,
				minWidth: 320,
				minHeight: 120,
				layout: 'fit',
				plain: true,
				modal: true,
				items: formPanel,
				buttons: [{
					text: 'Ок',
					scope: this,
					handler: function(){
						var url = '/ajax/users/chtariff';
						if (form.isValid()) {
							Ext.Msg.show({
								title: 'Подтверждение',
								msg: 'Вы дествительно хотите сменить тариф для пользователя <b>' + this.getContext().username + '?</b>' +
								'<div class="div-msg">' +
								'<ul>' +
								'<li><div>Новый тариф:</div>'+
								Ext.get('value').getValue() +
								'</li>' +
								'</ul></div>',
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								width: '330',
								scope: this,
								fn: function(btn){
									if (btn == 'yes') {
										App.request({
											url: url,
											success: function(r, o){
												win.hide();
												win.destroy();
												Ext.getCmp('user-grid').getStore().reload();
											},
											failure: function(){
											},
											params: {
												username: this.getContext().username,
												id_tariff: Ext.getCmp('value').getValue(),
												in_pipe: 0,
												out_pipe: 0
											}
											,scope: this
										});
									};
								}
							})
						}
						else{
							Ext.Msg.show({
							   title:'Ошибка',
							   msg: 'Заполнены не все поля!',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO
							});
						}
					}
				}, {
					text: 'Отмена',
					handler: function(){
						win.hide();
						win.destroy();
					}
				}]
			});
			win.setTitle('Смена тарифа - ' + this.app.getContext('users').username);
		}
		win.show();
	} // End winChangeTariffNow
	// winChangeState
	,winChangeState: function(st){
		var win = Ext.getCmp('win-chstate');
		if (win == undefined) {
			var today = new Date();
		    var formPanel = new Ext.FormPanel({
				labelWidth: 130,
				labelAlign: 'right',
				frame: false,
		        bodyStyle:'padding:10px;',
		        defaultType: 'textfield',
		        items: 
				[{
		            fieldLabel: 'Дата '+(st=='off'?'де':'')+'активации',
		            id: 'opdate',
					xtype: 'datefield',
					allowBlank: false,
					value:today,
					width: 127
		        }]
		    });
			var form = formPanel.getForm();
		
			var win = new Ext.Window({
				id: 'win-chtariff',
				title: 'Смена тарифа',
				width: 320,
				height: 110,
				minWidth: 320,
				minHeight: 110,
				layout: 'fit',
				plain: true,
				modal: true,
				items: formPanel,
				buttons: [{
					text: 'Ок',
					scope: this,
					handler: function(){
						var url = '/ajax/tasks/add';
						if (form.isValid()) {
							Ext.Msg.show({
								title: 'Подтверждение',
								msg: 'Запланировать '+ (st=='off'?'де':'')+'активацию пользователя <b>' + this.getContext().username + '?</b>' +
								'<div class="div-msg">' +
								'<ul>' +
								'<li><div>Дата '+ (st=='off'?'де':'')+'активации:</div>' +
								Ext.util.Format.date(Ext.getCmp('opdate').getValue()) +
								'</li>' +
								'</ul></div>',
								buttons: Ext.MessageBox.YESNO,
								icon: Ext.MessageBox.QUESTION,
								width: '330',
								scope: this,
								fn: function(btn){
									if (btn == 'yes') {
										App.request({
											url: url,
											success: function(r, o){
												win.hide();
												win.destroy();
											},
											failure: function(){
											},
											params: {
												attribute: st=='off'?'Deactivate':'Activate',
												username: this.getContext().id,
												value: '',
												opdate: Ext.util.Format.date(Ext.getCmp('opdate').getValue(), 'Y-m-d'),
												id_period: 1
											}
											,scope: this
										});
									};
								}
							})
						}
						else{
							Ext.Msg.show({
							   title:'Ошибка',
							   msg: 'Заполнены не все поля!',
							   buttons: Ext.Msg.OK,
							   icon: Ext.MessageBox.INFO
							});
						}
					}
				}, {
					text: 'Отмена',
					handler: function(){
						win.hide();
						win.destroy();
					}
				}]
			});
			win.setTitle((st=='off'?'Деа':'А')+'ктивация - ' + this.getContext().username);
		}
		win.show();
	} // End winChangeState
}));

