var grid;
Ext.onReady(function(){
	Ext.QuickTips.init();
			
	var sm = new Ext.grid.CheckboxSelectionModel({});
	grid = CC.create({
		region:'center',
        xtype:'commongrid',
        title:'系统参数',
		dataUrl:Ext.getPath()+'/sysParamController/getSysParamData',
		//filtersPlugin:new Ext.ux.sunyard.filter.GridFilters({height:200}),
		pageSize: pageRecorder,
        frame: true,
        stripeRows: true,
        loadMask: true, 
		plugins:[new Ext.sunyard.PagingToolbarPlugin({
				plugins:[new Ext.sunyard.PagingToolbar.PageCount(),new Ext.ux.ProgressBarPager()]
			})],	
		checkboxSelModel: new Ext.grid.CheckboxSelectionModel(),				
		columns:[{
				dataIndex:'id',
				header:'编号',
				width: 150
			},{
				dataIndex:'paramname',
				width:160,
				header:'参数名称',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'paramvalue',
				width:160,
				header:'参数值',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'paramdesc',
				width:160,
				header:'参数描述',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'id',
				width:160,
				header:'修改',
				renderer:function(v,m,r){
					var str='<a  href="javascript:modifyParam(\''+v+'\')" ><img src="js/extjs/resources/images/icons/fam/cog_edit.png"  > </a>';					
					return str;
				}				
			}]
	});
	
	
	

	new Ext.Viewport({
		layout:'fit',
		items:grid
	});

});