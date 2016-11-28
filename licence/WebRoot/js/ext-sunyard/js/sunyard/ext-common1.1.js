Ext.namespace("Ext.ux.grid","Ext.ux","Ext.ux.PagingToolbar");
Ext.ux.grid.DynamicGridPanel = Ext.extend(Ext.grid.GridPanel,{	
	initComponent: function(){
		this.stripeRows = true;
		this.hasRender = false;
		Ext.ux.grid.DynamicGridPanel.superclass.initComponent.apply(this, arguments);
/*		this.on("mouseover",function(e){e.stopPropagation();});
		this.on("mouseoout",function(e){e.stopPropagation();});
		this.afterMethod("processEvent",function(n,e){e.stopPropagation();});*/
		this.plugins = this.plugins ? this.plugins : [];
		if(this.filterable===true){
			this.filtersPlugin = this.filtersPlugin ? this.filtersPlugin : new Ext.ux.grid.GridFilters({
				menuFilterText:"过滤",
				updateBuffer : 1000,
				encode:true,
				filters:this.filterCols ? this.filterCols : []
			});
			if(Ext.isArray(this.plugins))
				this.plugins.push(this.filtersPlugin);
			else
				this.plugins = [this.plugins,this.filtersPlugin];
		}
		if(this.expanderRow){
			if(Ext.isArray(this.plugins)){
				this.plugins.push(this.expanderRow);
			}else{
				this.plugins = [this.plugins,this.expanderRow];
			}
		}
	},	
	onRender: function(ct, position){ 		
		Ext.ux.grid.DynamicGridPanel.superclass.onRender.call(this, ct, position); 
		this.el.mask('数据加载中...');
		this.store.on("beforeload",function(store){
			if(store.baseParams.loadtime==undefined){ 
				store.baseParams.loadtime = 1;
			}else{
				store.baseParams.loadtime++;
			}
		});
		this.store.on('metachange', function(){
			var groupField = this.store.groupField;
			var _serviceColumn = this.store.reader.jsonData.columns;
			if(!_serviceColumn)return;
			if(Ext.isString(_serviceColumn))
				_serviceColumn = Ext.decode(_serviceColumn);
			if(typeof(_serviceColumn) === 'object'){
				var columns = []; 
				if(this.expanderRow){columns.push(this.expanderRow)};
				if(this.rowNumberer) { columns.push(new Ext.grid.RowNumberer()); }
				if(this.checkboxSelModel) { columns.push(this.checkboxSelModel); }				
				Ext.each(_serviceColumn, function(column){
					for(var k in column){
	            		if(Ext.isEmpty(column[k]))
	            			delete column[k];
	            	}
	            	if(column['hidden']===true)delete column['align'];
	            	if(!column['dataIndex'])column['dataIndex']=column['name'];
	            	if(column['dataIndex']===groupField)column['hidden']=true;
					columns.push(column);
				});
				if(this.actionColumn)
					if(Ext.isArray(this.actionColumn)){
						columns = columns.concat(this.actionColumn)
					}else{
						columns.push(this.actionColumn);
					}
				if(this.extraColumn){
					if(Ext.isArray(this.extraColumn)){
						for(var i = 0 ; i < this.extraColumn.length ; i++){
							var column = this.extraColumn[i];
							var columnIndex = column.columnIndex==undefined ? columns.length : column.columnIndex;
							columnIndex = columnIndex > columns.length ? columns.length : columnIndex;
							columns.splice(columnIndex,0,column);
//							delete column.columnIndex;
						}
					}else{
						var column = this.extraColumn;
						var columnIndex = column.columnIndex==undefined ? columns.length : column.columnIndex;
						columnIndex = columnIndex > columns.length ? columns.length : columnIndex;
						columns.splice(columnIndex,0,column);
//						delete column.columnIndex;
					}
				}
				Ext.each(columns,function(column){
					if(!column['renderer']&&column['renderfield']){
	            		column['renderer'] = function(value, metaData, record, rowIndex, colIndex, store){
	            			return record.get(column['renderfield']);
	            		}
	            	}
				});
				this.getColumnModel().setConfig(columns);
				if(!this.store.groupField&&this.groupField){
					this.store.groupField = this.groupField;
					delete this.groupField;
				}
				if(this.filters)
					if(this.filters.filters.getCount() == 0){					
						this.filters.addFilters(this.getColumnModel());
					}			
			}

			this.el.unmask(); 
		},this);
		if(this.autoLoad!==false){
			this.store.load({params:{start: 0, limit: 20}});
		}else{
			this.el.unmask(); 
		}
	 }
});
Ext.reg('sunyardDynamicGridPanel',Ext.ux.grid.DynamicGridPanel);
Ext.namespace("Ext.ux.sunyard");
Ext.ux.sunyard.CommonGrid = Ext.extend(Ext.ux.grid.DynamicGridPanel,{
	initComponent:function(){
		var storeCfg = this.storeCfg ? this.storeCfg : {};
		Ext.applyIf(storeCfg,{
			xtype:'groupingstore',
			url:this.storeURL||this.url||Ext.getPath()+'/gridController/getGridData',
			autoDestroy: true,
			groupDir : this.groupDir ? this.groupDir : "ASC",
			reader : new Ext.data.JsonReaderEx(),
			baseParams : this.baseParams ? this.baseParams : {}
		});
		var store = Ext.create(storeCfg);
		delete this.storeCfg;
		this.plugins = this.plugins ? this.plugins : [];
		if(this.summaryPlugin){ 
			this.plugins.push(this.summaryPlugin)
		}else{
			this.plugins.push(new Ext.ux.grid.GroupSummary());
		}
		Ext.apply(this,{
			store:store,
			sm: this.checkboxSelModel || new Ext.grid.RowSelectionModel({singleSelect:true}),
			filterable:true,
//			plugins:[this.summaryPlugin ? this.summaryPlugin : new Ext.ux.grid.GroupSummary()],
			pageSize:this.pageSize ? this.pageSize : 20,
			bbar:new Ext.PagingToolbar({
		        pageSize: this.pageSize ? this.pageSize : 20,
		        store: store,
		        displayInfo: true,
		        displayMsg : "第{0}条到{1}条,共{2}条",
		        emptyMsg:"没有记录",
		        plugins : new Ext.ux.PagingToolbar.PageCount(),
		        items:[{
		        	text : '过滤配置',
		        	menu : {
		        		items:[{
				        	text:'自动过滤:打开',
				        	enableToggle: true,
				        	handler:this.setAutoFilter,
							scope:this
				        },{
							text:'本地过滤:关闭' ,
							enableToggle: true,
							handler: this.setLocalFilter,
							scope : this
						},{
				            text: '查看过滤条件',
				            tooltip: '查看所有的过滤条件',
				            handler: this.filterCondition,
				            scope : this
				        },{
				            text: '清除过滤条件',
				            tooltip: '清除所有的过滤条件',
				            handler: this.clearfilter,
				            scope : this
				        },{
				        	text:'进行过滤',
				        	handler:this._doFilter,
				        	scope:this
				        }]		        	
		        	}
		        },{
		        	text : '分组配置',
		        	menu : {
		        		items:[{
							text:'远程分组:关闭',
							enableToggle: true,
							handler:this.setRemoteGroup,
							scope:this
						},{
							text:'分组方向：升序',
							handler:this.setGroupDir,
							scope:this
						},{
							text:'清除分组',
							handler:this.clearGroup,
							scope:this
						}]
		        	}
		        },{
					text:'远程排序:关闭',
					enableToggle: true,
					handler:this.setRemoteSort,
					scope:this
				}]
		    }),
			columns : [],		
			expanderRow:this.expanderRow,
			view: new Ext.grid.GroupingView({
				hideGroupedColumn : true,
            	forceFit: true,
	            groupByText:"按这个字段分组",
	            showGroupsText:"通过分组显示"
	        }),
	        loadMask : {msg:"数据加载中..."}
		});
		Ext.ux.grid.DynamicGridPanelEx.superclass.initComponent.apply(this, arguments);
	},
	setRemoteGroup:function(button,state){
		var store = this.store;
		var sortLocal = store.remoteGroup = !store.remoteGroup;
		var text = '远程分组:' + (sortLocal ? '打开' : '关闭');
		button.setText(text);
		store.lastOptions.params["start"] = 0;
		store.applyGroupField();
		if(!sortLocal){
			if(store.baseParams){
                delete store.baseParams.groupBy;
                delete store.baseParams.groupDir;
            }
            var lo = store.lastOptions;
            if(lo && lo.params){
                delete lo.params.groupBy;
                delete lo.params.groupDir;
            }
		}
		store.reload();
	},
	setGroupDir:function(button,state){
		var store = this.store;
		store.groupDir = store.groupDir == "ASC" ? "DESC" : "ASC";
		var text = '分组方向:' + (store.groupDir == "ASC" ? '升序' : '降序');
		button.setText(text);
		if(store.remoteGroup){
			store.lastOptions.params.groupDir = store.groupDir;
			store.reload();
			store.sort();
		}else{
			store.sort();
			store.fireEvent('datachanged', store);
		}
	},
	clearGroup:function(){
		 this.store.clearGrouping();
	},
	setRemoteSort:function(button, state){
		var store = this.store;
		var sortLocal = store.remoteSort = !store.remoteSort;
		var text = '远程排序:' + (sortLocal ? '打开' : '关闭');
		button.setText(text);
		store.hasMultiSort = true;
		store.lastOptions.params["start"] = 0;
		store.reload();
	},
	setAutoFilter:function(button, state){
		var filterPlugin = this.filters;
		var autoFilter = filterPlugin.autoReload = !filterPlugin.autoReload;
		var text = '自动过滤:' + (autoFilter ? '打开' : '关闭');
		button.setText(text);
	},
	setLocalFilter:function(button,state){
		var filterPlugin = this.filters;
		var local = filterPlugin.local = !filterPlugin.local;
        var text = '本地过滤:' + (local ? '打开' : '关闭');
        filterPlugin.bindStore(this.getStore());
        button.setText(text);
        this.getStore().reload();
	},
	filterCondition:function(){
    	var _filterData = this.filters.getFilterData();
    	var comparisons = {'gt':'大于','lt':'小于','eq':'等于'};
    	var cm = this.getColumnModel();
    	var _s = "";
    	var v ;
    	Ext.each(_filterData,function(obj){
    		var cson = obj.data.comparison ? comparisons[obj.data.comparison] : '';
    		if(obj.data.type=='list'){
    			v = cson+obj.data.text;
    		}else{
    			v = cson+obj.data.value;
    		}
    		_s += cm.getColumnHeader(cm.findColumnIndex(obj.field))+":"+v+"<br/>"
    	});
        Ext.Msg.alert('过滤条件',_s);
	},
	clearfilter:function(){
    	var filterPlugin = this.filters;
        filterPlugin.clearFilters();
        if(!filterPlugin.autoReload)
        	filterPlugin.deferredUpdate.delay(filterPlugin.updateBuffer);
	},
	_doFilter:function(){
   		var filterPlugin = this.filters;
		filterPlugin.deferredUpdate.delay(filterPlugin.updateBuffer);
	}
});
Ext.ux.sunyard.CommonGridForPrint = Ext.extend(Ext.ux.sunyard.CommonGrid,{
	exportParam:{},
	initComponent:function(){
		Ext.applyIf(this,{exportURL:Ext.getPath()+'/gridController/exportExcel'});
		var _baseTbar = [{
	            text : '打印',
	            tooltip : '打印',
	            iconCls : 'printGrid',
	            handler : this._onPrint,
	            scope : this
		    },{
	            text : '导出当前页',
	            tooltip : '导出当前页',
	            iconCls : 'exportExcel',
	            handler : this._exportCurrPage,
	            scope : this
		    },{
		    	text: '导出全部',
	            tooltip: '导出全部',
	            iconCls : 'exportExcelAll',
	            handler: this._exportAllPage,
	            scope : this
		    }];
		this.tbar = this.tbar ? this.tbar : [];
		if(Ext.isArray(this.tbar)){
			this.tbar = _baseTbar.concat(this.tbar)
		}else{
			this.tbar = _baseTbar.push(this.tbar);
		}
		Ext.ux.sunyard.CommonGridForPrint.superclass.initComponent.apply(this,arguments);
		this.addEvents("afterSelectExportField");
		this.on("afterSelectExportField",this.onAfterSelectExportField,this);
	},
	onAfterSelectExportField:function(form,values,header){
		var exportField = [];
		if(values["exportFieldcheckbox"])
		for(var i = 0 ; i < values["exportFieldcheckbox"].length ; i ++){
			exportField.push(header.item(values["exportFieldcheckbox"][i]));
		}
		Ext.apply(this.exportParam,{"exportFields":Ext.encode(exportField),exportFileName:values['fileName']});
		var fd = this.getExportForm(this.exportParam);
	    fd.dom.submit();
	},
	_onPrint:function(){
		Ext.ux.Printer.print(this);
	},
	_getExportWin:function(){
		if(!this._exportWin){
			var cm = this.getColumnModel();
			var count = cm.getColumnCount();			
			var exportDefine = new Ext.util.MixedCollection (false,function(obj){return obj.name});
			var items = [{
				xtype:'textfield',
				fieldLabel: '导出文件名',
				anchor : '90%',
				name:'fileName',
				value:'sunyard'
			}];
			if(this.selColumnable!==false){
				var checkboxitems = [];
				for(var i = 0 ; i < count ; i++){
					if(!cm.getDataIndex(i))continue;					
					var fieldName = cm.config[i]['renderfield'] || cm.getDataIndex(i);
					checkboxitems.push({boxLabel: cm.getColumnHeader(i), name: 'exportFieldcheckbox', inputValue:fieldName, checked: true});	
					exportDefine.add({header:cm.getColumnHeader(i),name:fieldName});
				}
				items.splice(0,0,{
					xtype: 'checkboxgroup',
		            fieldLabel: '字段选择',
		            itemCls: 'x-check-group-alt',
		            columns: 4,
		            vertical: true,
		            items: checkboxitems
				});
			}
			var _form = Ext.create({
					xtype:'form',
					plain:true,
					frame:true,
					labelWidth: 75,
					items:items
				})
			this._exportWin = new Ext.Window({
				width:600,
				height:250,
				title:'数据导出',
				shadow : true,
				modal : true,
				closeAction:'hide',
				layout:'fit',
				autoScroll:true,
				buttonAlign : 'center',
				defaults:{autoScroll :true},
				items:[_form],
				buttons:[{
					text:'确定',
					handler:function(){
						this.fireEvent("afterSelectExportField",_form,_form.getForm().getValues(),exportDefine);
					},
					scope:this
				},{
					text:'关闭',
					handler:function(){
						this._exportWin.hide();
					},
					scope:this
				}]
			});
		}
		return this._exportWin;
	},
	_exportCurrPage:function(){
		Ext.apply(this.exportParam,this.getStore().baseParams);
		Ext.apply(this.exportParam,this.getStore().lastOptions.params);
		this._getExportWin().show();
	},
	_exportAllPage:function(){
		Ext.apply(this.exportParam,this.getStore().baseParams);
		Ext.apply(this.exportParam,this.getStore().lastOptions.params);
		delete this.exportParam['start'];
	    delete this.exportParam['limit'];
	    this._getExportWin().show();
	},
	getExportForm : function(param){
		var fd=Ext.get('frmDummy');
        if (!fd) {
            fd=Ext.DomHelper.append(Ext.getBody(),
            	{tag:'form',method:'post',id:'frmDummy', 
            	target:'_blank',name:'frmDummy',cls:'x-hidden'},
            	true);
        }
        fd.dom.action = this.exportURL;
        fd.dom.reset();
        for(var k in param){
        	if(!fd.child('#'+k)){
        		Ext.DomHelper.append(fd,{tag:'input',name:k,type:'hidden'},true);
        	}
        	fd.child('#'+k).set({value:param[k]});
        }
        return fd;
	},
	destroy:function(){
		if(this._exportWin) this._exportWin.destroy();
		Ext.ux.sunyard.CommonGridForPrint.superclass.destroy.call(this);
	}
});
Ext.ux.SunyardCombo = Ext.extend(Ext.form.ComboBox,{
	initComponent:function(){
		this.store = {
			xtype:'jsonstore',
            url:this.url ? this.url : '',
            root:this.root ? this.root :'results',
            fields:this.fields ? this.fields : [],
            baseParams:this.baseParams ?  this.baseParams : {}
		}
		Ext.apply(this,{
			typeAhead: true,
			submitValue:true,
			forceSelection: true,
			triggerAction: this.triggerAction ? this.triggerAction : 'query',
	        emptyText:'请选择...',
	        minChars:1,
	        selectOnFocus:true,
	        autoSelect:true
		});
		Ext.ux.SunyardCombo.superclass.initComponent.call(this,arguments);
	},
    setValue : function(v){
    	Ext.ux.SunyardCombo.superclass.setValue.call(this,v);
    	if(this.store.getCount() == 0&&!Ext.isEmpty(v)){
    		this.setValueEx(v);
    	}
    	return this;
    },
    setValueEx:function(v){
    	if(!Ext.isEmpty(v)){
	    	var o = this;
			var params = Ext.apply({},this.store.baseParams);
			params[this.queryParam] = v;
			Ext.Ajax.request({
				url:this.url+"/first",
				success:function(response,options){
					var result = Ext.decode(response.responseText);
					if(result.success){
						for(var key in result.data){
							if(Ext.isString(key)){
								if(key.trim()==String(v).trim())
									o.setRawValue(result.data[key]);
							}else{
								o.setRawValue(result.data[v]);
							}
						}						
					}else{
						Ext.Msg.alert('提示信息',result.errorMessage);
					}
				},
				params:params
			});
    	}
    },
    onTriggerClick : function(){
        if(this.readOnly || this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
            this.el.focus();
        }else {
            this.onFocus({});
            if(this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            }else if(this.triggerAction == 'query'){
                this.doQuery(this.getRawValue(),true);
            } else {
                this.doQuery(this.getRawValue());
            }
            this.el.focus();
        }
    }
});
Ext.reg('sunyardCombo',Ext.ux.SunyardCombo);
Ext.ux.PagingToolbar.PageCount = Ext.extend(Ext.util.Observable,{
	constructor: function(config){
       Ext.apply(this, config);
       Ext.ux.PagingToolbar.PageCount.superclass.constructor.call(this);
    },
    init : function(ptb){
    	var len = ptb.items.length;
    	var index = len;
    	if(len>2) index = index-2;
    	index = 11;
    	//ptb.insert(index++,'-');
    	ptb.insert(index++,'每页显示数  ');
    	ptb.insert(index, { 	
				xtype:"combo",
			    store:new Ext.data.SimpleStore({ 
			    	fields: ['abbr', 'state'], 
			    	data : [[5,5],[10,10],[15,15],[20,20],[30,30],[40,40],[60,60],[80,80],[100,100],[500,500]] 
				}), 
				width:50, 
			    displayField:'state', 
			    typeAhead: true, 
			    mode: 'local', 
				value:20, 
				triggerAction: 'all', 
				selectOnFocus:true, 
				listeners:{ 
					select:{ 
						fn:function(combo, value){
							ptb.pageSize = parseInt(combo.getValue());
							ptb.store.reload({params:{start:0,limit:combo.getValue()}});       
						} 
					}  
				} 
			});
    }
});
Ext.ux.SunyardFormPanel = Ext.extend(Ext.FormPanel,{
	initComponent : function(){
        Ext.ux.SunyardFormPanel.superclass.initComponent.call(this);
        this.addEvents('beforeSubmit','afterSuccess','afterFailure','loadRemoteRecord');
    },
    onRemoteLoad:function(rec){
		this.getForm().load({
			url:this.loadURL || this.submitURL+"/load",
			scope:this,
			params:rec.data,
			waitTitle :'提示信息',
			waitMsg :'数据加载中请稍候。。',
			success:function(form,action){
				this.fireEvent("loadRemoteRecord",form,action);
			},
			failure:function(){
				Ext.Msg.alert('错误提示','数据加载失败！！');
			}
		});	
	},
	idFieldValidate:function(oriData,fields){
		fields = fields || this.idFields || [];
		if(Ext.isString(fields)){
			var f = this.getForm().findField(fields);
			if(oriData[fields]!=f.getValue()) {
				f.markInvalid("主键不允许修改!");
				return false;
			}
		}else{
			for(var i=0,len=fields.length ; i < len ; i++){
				var fname = fields[i];
				var f = this.getForm().findField(fname);
				if(oriData[fname]!=f.getValue()) {
					f.markInvalid("主键不允许修改!");
					return false;
				}
			}
		}
	},
    onSubmit:function(cfg){
    	cfg = cfg ? cfg : {};
    	Ext.applyIf(cfg,{
			clientValidation :true,
			waitTitle :'提示信息',
			waitMsg :'提交中请稍候。。',
			url:this.submitURL,
			success:function(form,action){
				Ext.Msg.alert('提示信息','操作成功',function(){
					this.fireEvent('afterSuccess',form,action,cfg._method);
				},this);
			},
			failure:function(form,action){
				var errMsg = action.result ? action.result.errorMessage : '操作失败！！'
				Ext.Msg.alert("错误提示",errMsg);
				this.fireEvent('afterFailure',form,action,cfg._method);
			},
			scope:this
		});
		if(this.fireEvent('beforeSubmit',this,this.getForm(),cfg)!==false){
    		this.getForm().submit(cfg);
		}
    }
});
Ext.reg('sunyardForm',Ext.ux.SunyardFormPanel);
Ext.ux.CRUDGridFormPanel = Ext.extend(Ext.Panel,{
	initComponent : function(){
		Ext.apply(this,{
//			frame:true,
			layout:'border'
		});
		if(!this.buttons)
		this.buttons = [{
				text:'新增',
				handler:this.onNew,
				scope:this
			},{
				text:'修改',
				handler:this.onEdit,
				scope:this
			},{
				text:'删除',
				handler:this.onDel,
				scope:this
			},{
				text:'重置',
				handler:this.onReset,
				scope:this
			}];
		Ext.applyIf({
			baseFormFieldValues : {}
		});
		this.initGrid();
		this.initForm();
		Ext.ux.CRUDGridFormPanel.superclass.initComponent.call(this,arguments);
	},
	onNew:function(){
		var ct = this;
		var baseFormFieldValues = Ext.apply({operType:1,_method:'PUT'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		ct.form.onSubmit();
	},
	onEdit:function(){
		var ct = this;
		var baseFormFieldValues = Ext.apply({operType:2,_method:'POST'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		ct.form.onSubmit();
	},
	onDel:function(){
		var ct = this;		
		var baseFormFieldValues = Ext.apply({operType:3,_method:'DELETE'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		ct.form.onSubmit();
	},
	onReset:function(){
		var gridsm = this.grid.getSelectionModel();
		gridsm.clearSelections();
		this.form.getForm().reset();
	},
	initGrid:function(){
		this.gridPlugins = this.gridPlugins ? this.gridPlugins : [];
		var store = Ext.create({
			xtype:'jsonstore',
			url:this.url,
			autoDestroy: true,
			reader : new Ext.data.JsonReaderEx(),
			baseParams : this.baseParams ? this.baseParams : {}
		});
		this.gridCfg = this.gridCfg ? this.gridCfg : {};
			Ext.applyIf(this.gridCfg,{
			frame:true,
			region:'center',
			xtype:'sunyardDynamicGridPanel',
			autoLoad:this.gridAutoLoad,
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			store:store,
			bbar:new Ext.PagingToolbar({
		        pageSize: this.pageSize ? this.pageSize : 20,
		        store: store,
		        displayInfo: true,
		        displayMsg : "第{0}条到{1}条,共{2}条",
		        emptyMsg:"没有记录",
		        plugins : new Ext.ux.PagingToolbar.PageCount()}),
			columns : [],		
			expanderRow:this.expanderRow,
			plugins: this.gridPlugins,
			view: new Ext.grid.GridView({
	            forceFit: true
	        }),
	        loadMask : {msg:"数据加载中..."}
		});
		this.grid = this.grid ? this.grid : this.gridCfg ? Ext.create(this.gridCfg) : null;
		delete this.gridCfg;
		if(!this.items) this.items = [];
		this.items.push(this.grid);
		this.grid.getSelectionModel().on('rowselect', function(sm, rowIdx, r){
			this.loadFormData(r.data);
		}, this);
	},
	initForm:function(){
		this.formCfg = this.formCfg ? this.formCfg : {};
		Ext.applyIf(this.formCfg,{
			region:'south',
			split: true,
			height:200,
			collapseMode:'mini',
			submitURL:this.submitURL
		});
		var _items = this.formCfg.items;
		_items.push({
	    	xtype:'hidden',
	    	name:'operType'
	    },{
	    	xtype:'hidden',
	    	name:'_method'
	    });
		this.form = this.form ? this.form : this.formCfg ? Ext.create(this.formCfg) : null;
		delete this.formCfg;
		if(!this.items) this.items = [];
		this.items.push(this.form);
		this.form.on("afterSuccess",function(form,action){
			this.grid.getSelectionModel().clearSelections();
			this.grid.store.reload();
			this.form.getForm().reset();
		},this);
	},
	load:function(cfg){
		this.grid.store.load(cfg);
	},
	loadFormData:function(values){
		if(this.form)
			this.form.getForm().setValues(values);
	}
});
Ext.reg('CRUDGridFormPanel',Ext.ux.CRUDGridFormPanel);
Ext.ux.CRUDGridFormWin = Ext.extend(Ext.ux.sunyard.CommonGrid,{
	remoteFormLoad : false,
	initComponent : function(){
		Ext.applyIf(this,{
			columns : [],
			readOnly:false,
			tbar : [{
				text:'新增',				
				iconCls: 'silk-add',
				tooltip: '新增',
				handler:this.onShowNewWin,
				hidden:this.readOnly,
				scope:this
			},{
				text:'修改',				
				iconCls: 'silk-accept',
				tooltip:'修改',
				handler:this.onShowEditWin,
				hidden:this.readOnly,
				scope:this
			},{
				text:'删除',				
				iconCls: 'silk-delete',
				tooltip:'删除',
				handler:this.onShowDelWin,
				hidden:this.readOnly,
				scope:this
			},{
				text:'查看',
				iconCls: 'silk-preview',
				tooltip:'查看',
				handler:this.onShowViewWin,
				scope:this
			}]
		});
/*		this.store = Ext.create({
			xtype:'jsonstore',
			url:this.url,
			autoDestroy: true,
			reader : new Ext.data.JsonReaderEx(),
			baseParams : this.baseParams ? this.baseParams : {}
		});
		delete this.baseParams;*/
		if(null==this.view) 
			this.view = new Ext.grid.GridView({
	            forceFit: true
	       	})
	    this.initForm();
	    this.initWin();
		Ext.ux.CRUDGridFormWin.superclass.initComponent.apply(this, arguments);
		this.addEvents("loadformrecord");
	},
	onNew:function(){
		var ct = this;
		var baseFormFieldValues = Ext.apply({operType:1,_method:'PUT'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		ct.form.onSubmit({_method:'PUT'});
	},
	onEdit:function(){
		var ct = this;
		var baseFormFieldValues = Ext.apply({operType:2,_method:'POST'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		if(false!==ct.form.idFieldValidate(this.getRecordData()))
			ct.form.onSubmit({_method:'POST'});
	},
	onDel:function(){
		var ct = this;		
		var baseFormFieldValues = Ext.apply({operType:3,_method:'DELETE'},ct.baseFormFieldValues);
		ct.loadFormData(baseFormFieldValues);
		if(false!==ct.form.idFieldValidate(this.getRecordData()))
			ct.form.onSubmit({_method:'DELETE'});
	},
	onReset:function(){
		this.form.getForm().reset();
		var gridsm = this.getSelectionModel();
		gridsm.clearSelections();
	},
	onReloadData:function(){
		var gridsm = this.getSelectionModel();
		if(gridsm.getCount()==0){
			Ext.Msg.alert('提示信息','请选择一条记录');
			return;
		}
		this.loadFormData(gridsm.getSelected().data);
	},
	initForm:function(){
		this.formCfg = this.formCfg ? this.formCfg : {};
		Ext.applyIf(this.formCfg,{
			submitURL:this.submitURL
		});
		Ext.apply(this.formCfg,{
			border:false
		});
		var _items = this.formCfg.items;
		if(_items)
			_items.push({
		    	xtype:'hidden',
		    	name:'operType'
		    },{
		    	xtype:'hidden',
		    	name:'_method'
		    });
		this.form = this.form ? this.form : this.formCfg ? Ext.create(this.formCfg) : null;
		delete this.formCfg;
		this.form.on("afterSuccess",this.formSubmitSuc,this);
		this.form.on('loadRemoteRecord',function(form,action){
			this.fireEvent('loadformrecord',form,action.result.data);
		},this);
		return this.form;
	},
	formSubmitSuc:function(){
		this.onReset();
		this.store.reload();
		this.win.hide();
	},
	initWin:function(){
		this.winCfg = this.winCfg ? this.winCfg : {};
		Ext.apply(this.winCfg,{
			plain:true
		});
		Ext.applyIf(this.winCfg,{
			width:600,
			height:400,
			shadow : true,
			modal : true,
			closeAction:'hide',
			layout:'fit',
			defaults:{autoScroll :true},
			bodyStyle: 'padding:1px;overflow-x:hidden;',
			items:[this.form],			
			buttons:[{
				text:'新增',
				handler:this.onNew,
				itemId:'new',
				hidden:true,
				scope:this
			},{
				text:'修改',
				handler:this.onEdit,
				itemId:'edit',
				hidden:true,
				scope:this
			},{
				text:'删除',
				handler:this.onDel,
				itemId:'del',
				hidden:true,
				scope:this
			},{
				text:'重置',
				handler:this.onReset,
				itemId:'reset',
				hidden:true,
				scope:this
			},{
				text:'重载',
				handler:this.onReloadData,
				itemId:'reloadData',
				hidden:true,
				scope:this
			}]
			
		});
		this.winTitle = this.winCfg.winTitle ? this.winCfg.winTitle : '';
		this.win = new Ext.Window(this.winCfg);
		this.win.on('hide',function(){
//			this.onReset();
		},this);
	},
	setWinTitle:function(title){
		this.win.setTitle(title);
	},
	showWin:function(btn,fn,scope){
		this.win.show(btn,fn,scope);
	},
	hideWinBtn:function(){
		var fbar = this.win.getFooterToolbar();
		fbar.getComponent('new').hide();
		fbar.getComponent('edit').hide();
		fbar.getComponent('del').hide();
		fbar.getComponent('reset').hide();
		fbar.getComponent('reloadData').hide();
	},
	onShowNewWin:function(btn){
		this.showWin(btn);
		this.setWinTitle('新增-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('new').show();
		this.win.getFooterToolbar().getComponent('reset').show();
		this.onReset();
		this.setReocrd(null);
	},
	onShowEditWin:function(btn){
		if(!this.isSelected())return;
		this.showWin(btn,function(){
			this.setWinTitle('修改-'+this.winTitle);
			this.hideWinBtn();
			this.win.getFooterToolbar().getComponent('edit').show();
			this.win.getFooterToolbar().getComponent('reloadData').show();
			this.loadSelectedRecord();	
		},this);
	},
	onShowDelWin:function(btn){
		if(!this.isSelected())return;
		this.showWin(btn);
		this.setWinTitle('删除-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('del').show();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadSelectedRecord();
	},
	onShowViewWin:function(btn){
		if(!this.isSelected())return;
		this.showWin(btn);
		this.setWinTitle('查看-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadSelectedRecord();
	},
	isSelected:function(){
		if(this.getSelectionModel().getCount()==0){
			Ext.Msg.alert('提示信息','请选择一条记录');
			return false;
		}
		return true;
	},
	setReocrd:function(rec){
		this._selectedRecord = rec;
	},
	getRecord:function(){		
		return this._selectedRecord || this.getSelectionModel().getSelected();
	},
	getRecordData:function(){
		var rec = this.getRecord();
		return rec ? rec.data : {};
	},
	loadFormRecord:function(rec){
		this.setReocrd(rec);
		if(this.form){
			if(this.remoteFormLoad)
				this.form.onRemoteLoad(rec);
			else{
				this.form.getForm().loadRecord(rec);
				this.fireEvent('loadformrecord',this.form.getForm(),rec.data);
			}
		}
	},
	loadSelectedRecord:function(){
		if(this.isSelected()&&this.form){
			this.loadFormRecord(this.getSelectionModel().getSelected());
		}
	},
	load:function(cfg){
		this.store.load(cfg);
	},
	loadFormData:function(values){
		if(this.form)
			this.form.getForm().setValues(values);
	},
	destroy:function(){
		if(this.win) this.win.destroy();
		Ext.ux.CRUDGridFormWin.superclass.destroy.call(this);
	}
});
Ext.reg('CRUDGridFormWin',Ext.ux.CRUDGridFormWin);
Ext.ux.CRUDGridFormWin2 = Ext.extend(Ext.ux.CRUDGridFormWin,{
	processCRUD:Ext.emptyFn,
	initComponent:function(){
		var _items = [];
		if(this.editable!==false){
			_items.push({
                iconCls: 'edit',   
                tooltip: '修改',
                handler: function(grid, rowIndex, colIndex) {
                	var args = Array.prototype.slice.call(arguments,0);
                	args.splice(0,0,'edit');
                	if(false===this.processCRUD.apply(this,args))
                		return;
                    var rec = this.store.getAt(rowIndex);
                    this.onShowEditWin(rec);
                },
                scope:this
            });
		}
		if(this.deleteable!==false){
			_items.push({
                iconCls: 'delete',  
                tooltip: '删除',
                handler: function(grid, rowIndex, colIndex) {
                	var args = Array.prototype.slice.call(arguments,0);
                	args.splice(0,0,'delete');
                	if(false===this.processCRUD.apply(this,args))
                		return;
                    var rec = this.store.getAt(rowIndex);
                    this.onShowDelWin(rec);
                },
                scope:this
            });
		}
		if(this.preview!==false){
			_items.push({
                iconCls: 'preview',   
                tooltip: '查看',
                handler: function(grid, rowIndex, colIndex) {
                	var args = Array.prototype.slice.call(arguments,0);
                	args.splice(0,0,'preview');
                	if(false===this.processCRUD.apply(this,args))
                		return;
                    var rec = this.store.getAt(rowIndex);
                    this.onShowViewWin(rec);
                },
                scope:this
            });
		}
		Ext.applyIf(this,{
			tbar:this.addedable===false ? [] :[{
				text:'新增',
				iconCls: 'silk-add',
				handler:this.onShowNewWin,
				hidden:this.readOnly,
				tooltip: '新增',
				scope:this
			}],
			actionColumn:{
                xtype: 'actioncolumn',
                header:'操作',
                align:'center',
                dataIndex:'',
                width: 60,
                items: _items
            }
		});
		Ext.ux.CRUDGridFormWin2.superclass.initComponent.apply(this, arguments);
	},
	onReloadData:function(){
		if(this._selectedRecord){
			this.loadFormRecord(this._selectedRecord);
		}
	},
	onShowEditWin:function(rec){
		this.showWin();
		this.setWinTitle('修改-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('edit').show();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadFormRecord(rec);
//		this.loadFormData(rec.data)
	},
	onShowDelWin:function(rec){
		this.showWin();
		this.setWinTitle('删除-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('del').show();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadFormRecord(rec);
//		this.loadFormData(rec.data)
	},
	onShowViewWin:function(rec){
		this.showWin();
		this.setWinTitle('查看-'+this.winTitle);
		this.hideWinBtn();
		this.win.getFooterToolbar().getComponent('reloadData').show();
		this.loadFormRecord(rec);
//		this.loadFormData(rec.data)
	}
});
Ext.reg('CRUDGridFormWin2',Ext.ux.CRUDGridFormWin2);
Ext.ux.grid.DynamicGridPanelEx = Ext.extend(Ext.ux.grid.DynamicGridPanel,{
	initComponent : function(){
		var store = Ext.create({
			xtype:'jsonstore',
			url:this.url,
			autoDestroy: true,
			reader : new Ext.data.JsonReaderEx(),
			baseParams : this.baseParams ? this.baseParams : {}
		});
		Ext.apply(this,{
			xtype:'sunyardDynamicGridPanel',
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			store:store,
			bbar:new Ext.PagingToolbar({
		        pageSize: this.pageSize ? this.pageSize : 20,
		        store: store,
		        displayInfo: true,
		        displayMsg : "第{0}条到{1}条,共{2}条",
		        emptyMsg:"没有记录",
		        plugins : new Ext.ux.PagingToolbar.PageCount()}),
			columns : [],		
			expanderRow:this.expanderRow,
			view: new Ext.grid.GridView({
	            forceFit: true
	        }),
	        loadMask : {msg:"数据加载中..."}
		});
		Ext.ux.grid.DynamicGridPanelEx.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('DynamicGridPanelEx',Ext.ux.grid.DynamicGridPanelEx);
Ext.onReady(function(){
	Ext.QuickTips.init();
	Ext.BLANK_IMAGE_URL=Ext.getPath()+"/resources/images/default/s.gif";
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	Ext.form.Field.prototype.msgTarget = 'side';
});