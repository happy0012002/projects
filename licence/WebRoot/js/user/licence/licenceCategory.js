var grid;
Ext.onReady(function(){
	Ext.QuickTips.init();
	
	panel=new Ext.form.FormPanel({		
		defaults:{
			anchor: '100%',
			labelWidth: 80
		},
		border:false,
		frame:true,
		labelAlign:'right',
		layout:'form',
		items:[{
			//xtype:'form',
			layout:'column',			
			items:[{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_textfield',
					name:'id',					
					fieldLabel:'类别编号'				
				}]
			},{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_textfield',
					name:'name',					
					fieldLabel:'类别名称'				
				}]
			}]
		}]		
	});
	
	function delliccategory(){
		var records=grid.getSelectionModel () .getSelections () ;
		if(records.length==0){
			MSG.info("请勾选数据");
			return ;
		}
		Ext.MessageBox.confirm("用户确认","确定要删除选中的证照类别吗?",function(btn) {
   			if(btn == "yes") {
   				var ids="";
				for(var i=0; i<records.length;i++){
					ids+=records[i].data.id+",";
				}
				ids=ids.substring(0,ids.length-1);
				Ext.Ajax.request({
					   url: Ext.getPath()+"/adLicenceLoginController/delLicenceCategory",							   
					   params: { ids: ids },
					   success: function(response,opts){								  
						  var obj= Ext.decode(response.responseText);
						  if(obj.success){
							  MSG.info(obj.data,'提示',function(){
				            		grid.getStore().reload();
				            	}); 
							  
						  }else{
							  MSG.info(obj.errorMessage,'提示');
						  }	
					   },
					   failure: function(response,opts){
						   MSG.error("通信错误，请联系管理员！");
					   }
					});	
   			}
	   	});
		
	}	
	
			
	var sm = new Ext.grid.CheckboxSelectionModel({});
	grid = CC.create({
		region:'center',
        xtype:'commongrid',
		dataUrl:Ext.getPath()+'/adLicenceController/getLicenceCategoryData',
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
				header:'类别编号',
				width: 150
			},{
				dataIndex:'name',
				width:160,
				header:'类别名称',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'username',
				width:160,
				header:'创建人',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'createtime',
				width:160,
				header:'创建时间'
				
			},{
				dataIndex:'id',
				width:160,
				header:'修改',
				renderer:function(v,m,r){
					var str='<a  href="javascript:modifyliccategory(\''+v+'\')" ><img src="js/extjs/resources/images/icons/fam/cog_edit.png"  > </a>';
					
					return str;
				}
				
			}],
			
			tbar:[{
				xtype:'button',
				iconCls: 'query_white',
				cls :'white_toolbar_button',
				text:'查询',
				handler:function(){
					var name=panel.getForm().findField("name").getValue();	
					var id=panel.getForm().findField("id").getValue();									
					
					
					//获取grid.getStore().lastOptions的参数, 并覆盖新的参数 ;   start:0  是改了参数要从第一页显示 limit 不变
					Ext.apply(grid.getStore().lastOptions.params,{name:name,id:id,start:0		
						})	
					grid.getStore().baseParams=grid.getStore().lastOptions.params;//覆盖掉原来的参数和lastOptions
					grid.getStore().reload();
					
					/*grid.getStore().baseParams={name:name,id:id};
					grid.getStore().load();*/
					
					
				}			
			},{
				xtype:'button',
				iconCls: 'reset_white',
				cls :'white_toolbar_button',
				text:'重置',
				handler:function(){
					panel.getForm().reset();
				}
			},{},{
					text:'新增',
					iconCls:'add',
					handler:addliccategory
				},{
					text: '删除',
					iconCls: 'delete',
					handler:function(){
						delliccategory();
					}
				}
				]	
	});
	
	
	
	var items = [];
    items.push({
       xtype: 'panel',
       layout: 'border',
       defaults: {
           split: true
       },       
       items: [{
           region: 'north',
           collapseMode: 'mini',
           layout: 'fit',
           height:50,
           items: panel
       },{
           region: 'center',
           collapsible: false,
           layout: 'fit',
           items: grid
       }]
   }); 
	
	new Ext.Viewport({
		layout:'fit',
		items:items
	});

});