Ext.SearchWindow = Ext.extend(Ext.Window,{
	//搜索完毕是否收缩窗口默认 true
	hideAfterSearch: true,
	//搜索按钮的Text
	sbtnText: '搜索',
	//关闭按钮的Text
	ctbnText: '重置',
	paramPrefix : 'filters',
	buttonAlign: 'center',
	window: this,
	width: 400,
	height: 200,
	store: null,
	searchForm: null,
	filters: [],
	bodyStyle: 'padding:1px;overflow-x:hidden;',
	
	initComponent : function(){
		this.window = this;
		this.initSearchWindow();
		if(this.store) {
			this.store.on("beforeload", function(store,options) {
				var tmp = this.getFormatFilters();
				if(tmp) {
					options.params[this.paramPrefix] = tmp;
				} else {
					if (store.lastOptions && store.lastOptions.params && store.lastOptions.params[this.paramPrefix]) {
		                delete store.lastOptions.params[this.paramPrefix];
		            }
				}
			}, this);
		}
		Ext.Window.superclass.initComponent.call(this);
	},
	
	initSearchWindow:function(){
		this.title = '搜索条件';
		//非模态对话框
		this.modal = false;
		this.y = 0;
		//this.width = width;
		//this.height = height;
		//不可以拖拽
		this.draggable = false;
        //可以收缩
        this.collapsible = true;
       // this.resizable = false;
        this.layout = 'fit';
       // this.plan = true;
        this.closable = true;
        this.closeAction = 'hide';
        
        if(this.searchForm) {
        	this.items = [this.searchForm];
        }
        
        this.tools = [{
        		id: 'close',
        		handler: function(event,toolEl,panel,tc) {
        			panel.hide();
        		}	
        	}
        ],
        this.buttons = [{
            text: this.sbtnText,
            window: this,
            handler: function() {
            	//隐藏搜索对话框
            	/*
            	if(this.window.hideAfterSearch) {
            		this.window.toggleCollapse(true); 
            	}
            	*/
            	this.window.collapse();
            	
            	this.window.doSearch();
            }
        },{
            text: this.ctbnText,
            window: this,
            handler: function(){
               this.window.doReset();
            }
        }]
	},
	
	doSearch : function() {
		if(this.searchForm) {
			this.filters = [];
			this.addFilters(this.filters);
		}
	
		if(this.store) {
			var start = this.store.paramNames.start;
            if (this.store.lastOptions && this.store.lastOptions.params && this.store.lastOptions.params[start]) {
                this.store.lastOptions.params[start] = 0;
            }
			
            this.store.reload();
		}
	},
	
	doReset : function() {
		if(this.searchForm) {
			this.searchForm.form.reset();
		}
	},
	
	getFormatFilters: function() {
		var tmp = '';
		for(var i = 0 ; i < this.filters.length; i++) {
			if(this.filters[i][1] && this.filters[i][1] != "") {
				tmp += this.filters[i][0] + "@" + this.filters[i][1] + "@";
			}
		}
		return tmp;
	},
	
	// 添加过滤条件  
	addFilters: function(filters) {
		
	}
});