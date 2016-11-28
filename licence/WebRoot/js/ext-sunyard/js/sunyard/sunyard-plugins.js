Ext.ns("Ext.ux.sunyard","Ext.ux.PagingToolbar");
Ext.ux.sunyard.ExportPlugin = Ext.extend(Ext.util.Observable,{
	height:300,
	constructor: function(config){
		if(config!=null&&config.height!=null &&config.height!=''){
			this.height=config.height
       }
       Ext.apply(this, config);
       Ext.ux.sunyard.ExportPlugin.superclass.constructor.call(this);
    },
    init:function(grid){
    	this.grid = grid;
    	var cfg = [{
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
    	var tbar = grid.getTopToolbar(); 
    	if(tbar){
    		tbar.add(cfg);
    	}else{
    		grid.elements += ',tbar';
            grid.topToolbar = grid.createToolbar(cfg);	    	
	    }
	    this.addEvents("afterSelectExportField");
		this.on("afterSelectExportField",this.onAfterSelectExportField,this);
		grid.on("destroy",this.onDestroy,this);
    },
	onAfterSelectExportField:function(form,values){
		var header = this.exportHeader;
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
		Ext.ux.Printer.print(this.grid);
	},
	getExportItem:function(){
		var grid = this.grid;
		var cm = grid.getColumnModel();
		var count = cm.getColumnCount();			
		this.exportHeader = this.exportHeader ? this.exportHeader : new Ext.util.MixedCollection (false,function(obj){return obj.name});
		this.exportHeader.clear();
		var items = [{
			xtype:'textfield',
			fieldLabel: '导出文件名',
			anchor : '90%',
			name:'fileName',
			value:'sunyard'
		}];
		if(grid.selColumnable!==false){
			var checkboxitems = [];
			for(var i = 0 ; i < count ; i++){
				var c = cm.getColumnAt(i);
				if(c instanceof Ext.grid.ActionColumn || c instanceof Ext.sunyard.grid.CustActionColumn || !cm.getDataIndex(i)) continue;					
				var fieldName = cm.config[i]['renderfield'] || cm.getDataIndex(i);
				checkboxitems.push({boxLabel: cm.getColumnHeader(i), name: 'exportFieldcheckbox', inputValue:fieldName, checked: true});	
				this.exportHeader.add({header:cm.getColumnHeader(i),name:fieldName});
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
		return items;
	},
	_getExportWin:function(){
		var o = this.getExportItem();
		if(!this._exportWin){
			var _form = Ext.create({
					xtype:'form',
					labelAlign:'right',
					plain:true,
					frame:true,
					labelWidth: 80,
					items:o
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
				bodyStyle: 'padding:1px;overflow-x:hidden;',
				items:[_form],
				buttons:[{
					text:'确定',
					handler:function(){
						this.fireEvent("afterSelectExportField",_form,_form.getForm().getValues());
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
		}else{
			var form = this._exportWin.getComponent(0);
			form.removeAll(true);
			form.add(o);
			form.doLayout();
		}
		return this._exportWin;
	},
	exportParam:{},
	_exportCurrPage:function(){
		this.exportParam={};
		Ext.apply(this.exportParam,this.grid.getStore().baseParams);
		Ext.apply(this.exportParam,this.grid.getStore().lastOptions.params);
		this._getExportWin().show();
	},
	_exportAllPage:function(){
		this.exportParam={};
		Ext.apply(this.exportParam,this.grid.getStore().baseParams);
		Ext.apply(this.exportParam,this.grid.getStore().lastOptions.params);
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
        fd.dom.action = this.exportURL||this.grid.exportURL||this.grid.dataUrl+"/export";
        fd.dom.reset();
        for(var k in param){
        	if(!fd.child('input[name='+k+']')){
        		Ext.DomHelper.append(fd,{tag:'input',name:k,type:'hidden'},true);
        	}
        	fd.child('input[name='+k+']').set({value:param[k]});
        }
        try{
        	return fd;
        }finally{
        	fd = null;
        }
	},
	onDestroy:function(){
		if(this._exportWin){
			this._exportWin.destroy();
			delete this._exportWin;
		}
		this.purgeListeners();
	}
});

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
			    	data : [[5,5],[10,10],[15,15],[20,20],[25,25],[30,30],[40,40],[50,50],[100,100],[500,500]] 
				}), 
				width:50, 
			    displayField:'state', 
			    typeAhead: true, 
			    mode: 'local', 
				value:ptb.pageSize, 
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

Ext.ux.sunyard.CheckExportPlugin = Ext.extend(Ext.util.Observable,{
	height: 300,
	constructor: function(config){
       Ext.apply(this, config);
       Ext.ux.sunyard.CheckExportPlugin.superclass.constructor.call(this);
    },
    init:function(grid){
    	this.grid = grid;
    	var cfg = [{
            text : '选择导出',
            tooltip : '选择导出',
            iconCls : 'exportExcel',
            handler : this._exportCheckPage,
            scope : this
	    }];
    	var tbar = grid.getTopToolbar(); 
    	if(tbar){
    		tbar.add(cfg);
    	}else{
    		grid.elements += ',tbar';
            grid.topToolbar = grid.createToolbar(cfg);	    	
	    }
	    this.addEvents("afterSelectExportField");
		this.on("afterSelectExportField",this.onAfterSelectExportField,this);
		grid.on("destroy",this.onDestroy,this);
    },
	onAfterSelectExportField:function(form,values){
		var header = this.exportHeader;
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
		Ext.ux.Printer.print(this.grid);
	},
	getExportItem:function(){
		var grid = this.grid;
		var cm = grid.getColumnModel();
		var count = cm.getColumnCount();			
		this.exportHeader = this.exportHeader ? this.exportHeader : new Ext.util.MixedCollection (false,function(obj){return obj.name});
		this.exportHeader.clear();
		var items = [{
			xtype:'textfield',
			fieldLabel: '导出文件名',
			anchor : '90%',
			name:'fileName',
			value:'sunyard'
		}];
		if(grid.selColumnable!==false){
			var checkboxitems = [];
			for(var i = 0 ; i < count ; i++){
				var c = cm.getColumnAt(i);
				if(c instanceof Ext.grid.ActionColumn || c instanceof Ext.sunyard.grid.CustActionColumn || !cm.getDataIndex(i)) continue;					
				var fieldName = cm.config[i]['renderfield'] || cm.getDataIndex(i);
				checkboxitems.push({boxLabel: cm.getColumnHeader(i), name: 'exportFieldcheckbox', inputValue:fieldName, checked: true});	
				this.exportHeader.add({header:cm.getColumnHeader(i),name:fieldName});
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
		return items;
	},
	_getExportWin:function(){
		var o = this.getExportItem();
		if(!this._exportWin){
			var _form = Ext.create({
					xtype:'form',
					plain:true,
					frame:true,
					labelWidth: 80,
					labelAlign:'right',
					items:o
				})
			this._exportWin = new Ext.Window({
				width:600,
				height:this.height,
				title:'数据导出',
				shadow : true,
				modal : true,
				closeAction:'hide',
				layout:'fit',
				buttonAlign : 'center',
				defaults:{autoScroll :true},
				bodyStyle: 'padding:1px;overflow-x:hidden;',
				items:[_form],
				buttons:[{
					text:'确定',
					handler:function(){
						this.fireEvent("afterSelectExportField",_form,_form.getForm().getValues());
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
		}else{
			var form = this._exportWin.getComponent(0);
			form.removeAll(true);
			form.add(o);
			form.doLayout();
		}
		return this._exportWin;
	},
	exportParam:{},
	_exportCheckPage:function(){
		var selected=this.grid.getSelectionModel().getSelections();
		if(selected.length<=0){
				MSG.alert('请勾选数据！');
				return;
		}
		var str = "";
		for(var i=0; i<selected.length; i++){
			var temp = selected[i];
			str += temp.data['require_id'] + ',';
		}
		str = str.substring(0, str.length - 1);
		this.exportParam={ids:str};
		Ext.apply(this.exportParam,this.grid.getStore().baseParams);
		Ext.apply(this.exportParam,this.grid.getStore().lastOptions.params);
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
        fd.dom.action = this.exportURL||this.grid.exportURL||this.grid.dataUrl+"/export";
        fd.dom.reset();
        for(var k in param){
        	if(!fd.child('input[name='+k+']')){
        		Ext.DomHelper.append(fd,{tag:'input',name:k,type:'hidden'},true);
        	}
        	fd.child('input[name='+k+']').set({value:param[k]});
        }
        try{
        	return fd;
        }finally{
        	fd = null;
        }
	},
	onDestroy:function(){
		if(this._exportWin){
			this._exportWin.destroy();
			delete this._exportWin;
		}
		this.purgeListeners();
	}
});