Ext.onReady(function(){
	Ext.QuickTips.init();
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"正在处理中，请稍后..."});
	
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
			layout:'column',			
			items:[{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_textfield',
					name:'orgname',					
					fieldLabel:'公司名称'				
				}]
			},{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_textfield',
					name:'address',					
					fieldLabel:'公司地址'				
				}]
			},{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_textfield',
					name:'remark',					
					fieldLabel:'备注'				
				}]
				
			
			}]
		}]		
	});
	
	
	
	function delorg(){
		var records=grid.getSelectionModel () .getSelections () ;
		if(records.length==0){
			MSG.info("请勾选数据");
			return ;
		}
		Ext.Ajax.timeout=1000*300;//5分钟
		Ext.MessageBox.confirm("用户确认","确定要删除选中的公司吗?删除公司会连同该公司的所有证照全部删除。",function(btn) {
   			if(btn == "yes") {
   				var ids="";
				for(var i=0; i<records.length;i++){
					ids+=records[i].data.id+",";
				}
				ids=ids.substring(0,ids.length-1);
				myMask.show();
				Ext.Ajax.request({
					
					   url: Ext.getPath()+"/adOrgtbLoginController/delOrg",							   
					   params: { ids: ids },
					   success: function(response,opts){
					   	  myMask.hide();								  
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
					   		myMask.hide();
						   MSG.error("通信错误，请联系管理员！");
					   }
					});	
   			}
	   	});
		
	}	
	
	
	licenceOfOrg=function(orgid){
		if(buttonHidden){
			window.location.href=Ext.getPath()+"/adLicenceController/toOrgLicenceQuery?orgId="+orgid;
		}else{
			window.location.href=Ext.getPath()+"/adLicenceLoginController/toOrgLicenceMgr?orgId="+orgid;
		}
		
	}
	
	var sm = new Ext.grid.CheckboxSelectionModel({});
	grid = CC.create({
		region:'center',
        xtype:'commongrid',
		dataUrl:Ext.getPath()+'/adOrgtbController/getOrgData',
		//filtersPlugin:new Ext.ux.sunyard.filter.GridFilters({height:200}),
		pageSize: pageRecorder,
        frame: true,
        stripeRows: true,
        loadMask: true, 
		plugins:[new Ext.sunyard.PagingToolbarPlugin({
				plugins:[new Ext.sunyard.PagingToolbar.PageCount(),new Ext.ux.ProgressBarPager()]
			}),new Ext.ux.sunyard.ExportPlugin({height:300})],	
		checkboxSelModel: new Ext.grid.CheckboxSelectionModel(),
		storeCfg:{
			remoteSort:true
		},				
		columns:[{
				dataIndex:'id',
				header:'公司编号',
				sortable:true,
				width: 150
			},{
				dataIndex:'orgname',
				width:160,
				header:'公司名称',
				sortable:true,
				renderer:function(v,m,r){
					var orgid=r.data['id'];
					m.attr='qtip=\"'+v+'\"';
					var str='<a  href="javascript:licenceOfOrg(\''+orgid+'\')" >'+v+' </a>';
					return str;
				}
				
			},{
				dataIndex:'address',
				width:160,
				header:'公司地址',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'contact',
				width:160,
				header:'联系人',
				hidden:true,
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'tel',
				width:160,
				header:'联系电话',
				hidden:true,
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'remark',
				width:160,
				header:'备注',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'',
				width:160,
				header:buttonHidden?'详情':'修改',
				renderer:function(v,m,r){
					var id=r.data["id"];
					var str='<a  href="javascript:modifyorg(\''+id+'\')" ><img src="js/extjs/resources/images/icons/fam/cog_edit.png"  > </a>';
					return str;
				}
				
			}],
			
			tbar:[{
				xtype:'button',
				iconCls: 'query_white',
				cls :'white_toolbar_button',
				text:'查询',
				handler:function(){
					var orgname=panel.getForm().findField("orgname").getValue();
					var address=panel.getForm().findField("address").getValue();
					var remark=panel.getForm().findField("remark").getValue();
					
					//获取grid.getStore().lastOptions的参数, 并覆盖新的参数 ;   start:0  是改了参数要从第一页显示 limit 不变
					Ext.apply(grid.getStore().lastOptions.params,{remark:remark,orgname:orgname,address:address,start:0		
						})	
					grid.getStore().baseParams=grid.getStore().lastOptions.params;//覆盖掉原来的参数和lastOptions
					grid.getStore().reload();
					
					/*grid.getStore().baseParams={remark:remark,orgname:orgname,address:address						};
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
					hidden:buttonHidden,
					handler:addorg
				},{
					text: '删除',
					iconCls: 'delete',
					hidden:buttonHidden,
					handler:function(){
						delorg();
					}
				},{
					text: '导入',
					iconCls: 'import',
					hidden:buttonHidden,
					handler:function(){
						showcommonImportWin(orgTempUrl,orgTempPath,orgTempName);
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
		items:[items]	
	});

});