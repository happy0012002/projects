Ext.ns("Ext.sunyard.filter")
Ext.sunyard.filter.TreeGridFilters = Ext.extend(Ext.util.Observable, {
	encode : true,
	paramPrefix : 'filter',
	width:400,
	height:300,
	local:true,
	constructor : function (config) {
        config = config || {};
        this.filters = new Ext.util.MixedCollection();
        this.filters.getKey = function (o) {
            return o ? o.dataIndex : null;
        };
        this.addFilters(config.filters);
        delete config.filters;
        Ext.apply(this, config);
    },
	init:function(grid){
		if (grid instanceof Ext.sunyard.TreeGrid) {
            this.grid = grid;

            if(this.filters.getCount() == 0){
                this.addFilters(this.grid.columns);
            }
            this.grid.filters = this;
            
            this.filterTool = new Ext.tree.TreeFilter(this.grid, {
        		clearBlank: true,
        		autoClear: true
        	});

            this.grid.addEvents({'filterupdate': true});
            
            if (grid.rendered){
                this.onRender();
            } else {
                grid.on({
                    scope: this,
                    single: true,
                    render: this.onRender,
                    hide:this.hideQueryWin
                });
            }
            var cfg = {
	            text : '搜索',
	            tooltip : '搜索',
	            iconCls : 'showQueryWin',
	            handler : this.showQueryWin,
	            scope : this
		    };
            var tbar = grid.getTopToolbar(); 
	    	if(tbar){
	    		tbar.add(cfg);
	    	}else{
	    		grid.elements += ',tbar';
	            grid.topToolbar = grid.createToolbar(cfg);	    	
		    }
        } 
	},
	filterTree:function(){
		Ext.each(this.hiddenPkgs, function(n){
			if(n.ui)
			n.ui.show();
		});
		if(this.getFilterData().length==0){
			this.filterTool.clear();
			return;
		}
		this.grid.expandAll();
		var fn = this.getRecordFilter();
		this.filterTool.filterBy(function(n){
			return !n.isLeaf() || fn(n);
		});
		this.hiddenPkgs = [];
		this.grid.root.cascade(function(n){
			if(!n.isLeaf() && n.ui.ctNode.offsetHeight < 3){
				n.ui.hide();
				this.hiddenPkgs.push(n);
			}
		},this);
	},
	getRecordFilter : function () {
        var f = [], len, i;
        this.filters.each(function (filter) {
            if (filter.active) {
                f.push(filter);
            }
        });
        len = f.length;
        return function (record) {
            for (i = 0; i < len; i++) {
                if (!f[i].validateRecord(record)) {
                    return false;
                }
            }
            return true;
        };
    },
    reload : function () {
        if (this.local) {
        	this.filterTree();
        }
    },
    clearFilters : function () {
        this.filters.each(function (filter) {
            filter.setActive(false);
        });
    },
    getFilter : function (dataIndex) {
        return this.filters.get(dataIndex);
    },
    getFilterData : function () {
        var filters = [], i, len;
        this.filters.each(function (f) {
            if (f.active) {
                var d = [].concat(f.serialize());
                for (i = 0, len = d.length; i < len; i++) {
                    filters.push({
                        field: f.dataIndex,
                        data: d[i]
                    });
                }
            }
        });
        return filters;
    },
    removeAll : function () {
        if(this.filters){
            Ext.destroy.apply(Ext, this.filters.items);
            // remove all items from the collection
            this.filters.clear();
        }
    },
    getQueryWin:function(){
    	if(!this.form){
    		this.form = Ext.create({
				xtype:'form',
				autoScroll:true,
				frame:true,
		        bodyStyle: 'padding:2px;',
		        labelWidth:75,
		        border:false,
	       		defaults:{anchor:'95%'},
	       		items:[]
			});
    	}
    	if(!this.win){
    		this.win = Ext.create({
				xtype:'window',
				title:'搜索条件',
				renderTo:this.grid.container,
				draggable :false,
				closeAction:'hide',
				collapsible:true,
				layout:'fit',
				items:this.form,
				bodyStyle: 'padding:1px;overflow-x:hidden;',
				width:this.width,
				height:this.height,
				buttons:[{
					text:'确定',
					handler:this.onSubmit,
					scope:this
				},{
					text:'重置',
					handler:this.onReset,
					scope:this
				}]
			});
			this.createForm();
    	}
    	var w = this.grid.getWidth()/2;
        w = w > this.width ? this.width : w;
    	var h = this.grid.getHeight()/2;
    	h = h > this.height ? this.height : h;
    	var p = this.grid.getPosition();
    	this.win.setSize(w,h);    	
    	this.win.setPagePosition(p[0]+((this.grid.getWidth())-w)/2,p[1]);
//    	this.win.show();
//    	this.form.doLayout();
    	return this.win;
    },
    onSubmit:function(){
    	if(this.form.getForm().isValid()){ 
    		this.reload();
    		this.win.collapse();
    	}
    },
    onReset:function(){
    	this.form.getForm().reset();
    	this.filters.each(function (f) {
    		f.fireUpdate();
        });
    },
    showQueryWin:function(){
    	this.getQueryWin().show();
    },
    hideQueryWin:function(){
    	this.getQueryWin().hide();
    },
    onRender : function () {
    },
    destroy : function () {
    	this.removeAll();
        this.purgeListeners();
    	if(this.win){
    		this.win.destroy();
    		delete this.win;
    		delete this.form;
    	}
    },
    createForm:function(){
    	this.form.removeAll();
    	this.filters.each(function(item){
    		this.add(item.content);
    	},this.form);
    	this.form.doLayout();
    },
    addFilters : function (filters) {
        if (filters) {
            var i, len, filter, cm = false, dI;
            if (filters instanceof Ext.tree.Column) {
                filters = filters.config;
                cm = true;
            }
            for (i = 0, len = filters.length; i < len; i++) {
            	var f = filters[i];
            	if(f instanceof Ext.tree.Column){
            		filter = f.filter;
            		if(filter){
            			Ext.apply(filter,{dataIndex:f.dataIndex,header:f.header});
            		}
            	} else {
                    filter = filters[i];
                }
                if (filter) {
                    this.addFilter(filter);
                }
            }
//            this.createwin();
        }
    },
    addFilter : function (config) {
        var Cls = this.getFilterClass(config.type),
            filter = new Cls(config);
        this.filters.add(filter);

        Ext.util.Observable.capture(filter, this.onStateChange, this);
        return filter;
    },
    getFilterClass : function (type) {
        switch(type) {
            case 'auto':
              type = 'string';
              break;
            case 'int':
            case 'float':
              type = 'numeric';
              break;
            case 'bool':
              type = 'boolean';
              break;
        }
        return Ext.sunyard.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
    }
});
Ext.sunyard.filter.Filter = Ext.extend(Ext.util.Observable, {
	active : false,
	dataIndex : null,
	content:null,
	updateBuffer : 500,
	constructor : function (config) {
        Ext.apply(this, config);            
        this.addEvents(
            'activate',
            'deactivate',
            'serialize',
            'update'
        );
        Ext.sunyard.filter.Filter.superclass.constructor.call(this);
//        this.content = new Ext.menu.Menu();
        this.init(config);
        if(config && config.value){
            this.setValue(config.value);
            this.setActive(config.active !== false, true);
            delete config.value;
        }
    },
    destroy : function(){
        if (this.content){
            this.content.destroy();
        }
        this.purgeListeners();
    },
    init : Ext.emptyFn,
    getValue : Ext.emptyFn,
    setValue : Ext.emptyFn,
    isActivatable : function(){
        return true;
    },
    getSerialArgs : Ext.emptyFn,
    validateRecord : function(){
        return true;
    },
    serialize : function(){
        var args = this.getSerialArgs();
        this.fireEvent('serialize', args, this);
        return args;
    },
    fireUpdate : function(){
        if (this.active) {
            this.fireEvent('update', this);
        }
        this.setActive(this.isActivatable());
    },
    setActive : function(active, suppressEvent){
        if(this.active != active){
            this.active = active;
            if (suppressEvent !== true) {
                this.fireEvent(active ? 'activate' : 'deactivate', this);
            }
        }
    } 
});
Ext.sunyard.filter.StringFilter = Ext.extend(Ext.sunyard.filter.Filter,{
	emptyText: '输入搜索条件..',
    selectOnFocus: true,
    init : function (config) {
        Ext.applyIf(config, {
            enableKeyEvents: true,
            emptyText: this.emptyText,
    		selectOnFocus: this.selectOnFocus,
    		fieldLabel : this.header||this.dataIndex||this.renderfield,
            listeners: {
                scope: this,
                keyup: this.onInputKeyUp
            }
        });

        this.content = new Ext.form.TextField(config); 
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    getValue : function () {
        return this.content.getValue().toString();
    },
    setValue : function (value) {
        this.content.setValue(value);
        this.fireEvent('update', this);
    },
    isActivatable : function () {
        return this.getValue().length > 0;
    },
    getSerialArgs : function () {
        return {type: 'string', value: this.getValue()};
    },
    validateRecord : function (record) {
        var val = record.attributes[this.dataIndex];

        if(typeof val != 'string') {
            return (this.getValue().length === 0);
        }

        return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
    },
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
//            this.menu.hide(true);
            return;
        }
        this.updateTask.delay(this.updateBuffer);
    }
});
Ext.sunyard.filter.NumericFilter = Ext.extend(Ext.sunyard.filter.Filter,{
	init:function(config){
		this.name = this.dataIndex||this.renderfield;
		this.createContent(config); 
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},
	onChange:function(){
    	this.updateTask.delay(this.updateBuffer);	
    },
	createContent:function(config){
		var defaultCfg = Ext.apply({},{
			xtype:'numberfield',
			flex : 1,
			enableKeyEvents: true,
			listeners: {
                scope: this,
                keyup: this.onInputKeyUp,
                change : this.onChange
            }
		});
		this.content = new Ext.form.CompositeField({
			fieldLabel : this.header||this.dataIndex||this.renderfield,			
			items:[Ext.apply({
				name:'gt'+this.name,
				emptyText:'大于'
			},defaultCfg),Ext.apply({
				name:'lt'+this.name,
				emptyText:'小于'
			},defaultCfg),Ext.apply({
				name:'eq'+this.name,
				emptyText:'等于'
			},defaultCfg)]
		});
	},
	getValue:function(){
		var v = {};
		this.content.eachItem(function(item) {
			if(''!=item.getValue())
            	v[item.getName().substring(0,2)] = item.getValue();
        });
        return v;
	},
	setValue:function(v){
		v = (v || '');
		var value = v;
		if(Ext.isString(v)){
			v = v.split(',');
			value = {
				gt:(v.length>0 ? v[0] : ''),
				lt:(v.length>1 ? v[1] : ''),
				eq:(v.length>2 ? v[2] : '')
			};
		}		
		this.content.eachItem(function(field) {
			field.setValue(value[field.getName().substring(0,2)]);            
        });
	},
	isActivatable : function () {
       var values = this.getValue();
       for (key in values) {
            if (values[key] !== undefined) {
                return true;
            }
        }
        return false;
    },
    getSerialArgs : function () {
        var key,
            args = [],
            values = this.getValue();
        for (key in values) {
            args.push({
                type: 'numeric',
                comparison: key,
                value: values[key]
            });
        }
        return args;
    },
    validateRecord : function (record) {
        var val = record.attributes[this.dataIndex],
            values = this.getValue();
        if (values.eq !== undefined && val != values.eq) {
            return false;
        }
        if (values.lt !== undefined && val >= values.lt) {
            return false;
        }
        if (values.gt !== undefined && val <= values.gt) {
            return false;
        }
        return true;
    },
    onInputKeyUp : function (field, e) {
        var k = e.getKey();
        if (k == e.RETURN && field.isValid()) {
            e.stopEvent();
//            this.menu.hide(true);
            return;
        }
        this.updateTask.delay(this.updateBuffer);
    }
});
Ext.sunyard.filter.DateFilter = Ext.extend(Ext.sunyard.filter.NumericFilter,{
	dateFormat:'Ymd',
	onSelect:function(){
    	this.updateTask.delay(this.updateBuffer);	
    },
	createContent:function(config){
		var defaultCfg = Ext.apply({},{
			format:this.dateFormat,
			xtype:'s_datefield',
			enableKeyEvents: true,
			flex : 1,
			listeners: {
                scope: this,
                select : this.onSelect,
                keyup: this.onInputKeyUp
            }
		});
		this.content = new Ext.form.CompositeField({
			fieldLabel : this.header||this.dataIndex||this.renderfield,			
			items:[Ext.apply({
				name:'gt'+this.name,
				emptyText:'大于'
			},defaultCfg),Ext.apply({
				name:'lt'+this.name,
				emptyText:'小于'
			},defaultCfg),Ext.apply({
				name:'eq'+this.name,
				emptyText:'等于'
			},defaultCfg)]
		});
	},
	getSerialArgs : function () {
        var key,
            args = [],
            values = this.getValue();
        for (key in values) {
            args.push({
                type: 'date',
                comparison: key,
                value: values[key]
            });
        }
        return args;
    },
    getValue:function(){
		var v = {};
		this.content.eachItem(function(item) {
			if(''!=item.getRawValue()){
            	v[item.getName().substring(0,2)] = item.getRawValue();
			}
        });
        return v;
	}
});
Ext.sunyard.filter.ListFilter = Ext.extend(Ext.sunyard.filter.StringFilter,{
	phpMode:true,
	init : function (config) {
        Ext.applyIf(config, {
            enableKeyEvents: true,
            emptyText: this.emptyText,
    		selectOnFocus: this.selectOnFocus,
    		fieldLabel : this.header||this.dataIndex||this.renderfield,
            listeners: {
                scope: this,
                select: this.onSelect,
                change: this.onSelect,
                keyup: this.onInputKeyUp
            }
        });
        this.createContent(config);
        this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
    },
    onSelect:function(){
    	this.updateTask.delay(this.updateBuffer);	
    },
    getSerialArgs : function () {
        var args = {type: 'list', value: this.phpMode ? this.getValue() : this.getValue(),dataType:this.dataType,dataField:this.dataField};
        return args;
    },
    validateRecord : function (record) {
        var val = record.attributes[this.dataField] || record.attributes[this.dataIndex];
		return val == this.getValue();
    },
    createContent:function(config){
    	if(config.options){
    		this.content = Ext.create(Ext.applyIf({ 	
				xtype:"combo",
			    store:new Ext.data.SimpleStore({ 
			    	fields: config.fields ? config.fields : ['value','text'], 
			    	data : config.options 
				}), 
			    displayField:'text', 
			    valueField:'value',
			    typeAhead: true, 
			    mode: 'local', 
				triggerAction: 'all', 
				selectOnFocus:true 
			},config));    		
    	}else{
    		config.dataUrl = config.dataUrl || config.url;
    		this.content = Ext.create(Ext.applyIf({
    			xtype:'s_combo'
    		},config));
    	}
    }
});