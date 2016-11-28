Ext.SearchWindow = Ext.extend(Ext.Window,{
	//��������Ƿ���������Ĭ�� true
	hideAfterSearch: true,
	//������ť��Text
	sbtnText: '����',
	//�رհ�ť��Text
	ctbnText: '����',
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
		this.title = '��������';
		//��ģ̬�Ի���
		this.modal = false;
		this.y = 0;
		//this.width = width;
		//this.height = height;
		//��������ק
		this.draggable = false;
        //��������
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
            	//���������Ի���
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
	
	// ��ӹ�������  
	addFilters: function(filters) {
		
	}
});