// ux
if (Ext.ux.grid.GridFilters){
	Ext.apply(Ext.ux.grid.GridFilters.prototype, {
		menuFilterText	: "Фильтр"
	});
}

if (Ext.ux.menu.ListMenu){
	Ext.apply(Ext.ux.menu.ListMenu.prototype, {
		loadingText		: "Загрузка ..."
	});
}

if (Ext.ux.grid.LockingGridView){
	Ext.apply(Ext.ux.grid.LockingGridView.prototype, {
	    lockText : 'Заблокировать',
	    unlockText : 'Разблокировать'
	});
}