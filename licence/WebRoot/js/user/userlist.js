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
					name:'userid',					
					fieldLabel:'用户名'				
				}]
			},{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_textfield',
					name:'username',					
					fieldLabel:'姓名'				
				}]
			},{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_combo',
					hiddenName:'loginflag',
					fieldLabel:'登录情况',
					editable:false,	
					combodata:[['0','未登录'],['1','已登录']]
					}]
				
			
			}]
		}]		
	});
	
	function stopResumeUser(type){				
		var records=grid.getSelectionModel () .getSelections () ;
		if(records.length==0){
			MSG.info("请勾选数据");
			return ;
		}
		var desc=(type==1)?"停用":"启用";
		Ext.MessageBox.confirm("用户确认","确定要"+desc+"选中的用户吗?",function(btn) {
   			if(btn == "yes") {   			
				var userids="";
				for(var i=0; i<records.length;i++){
					userids+=records[i].data.userid+",";
					if(sessionUserId==records[i].data.userid){
						MSG.info("不能操作自己的用户！");
						return ;
					}
					if(type==1 && records[i].data.delflag==1){//停用
						MSG.info("用户【"+records[i].data.userid+"】已经停用，不能再次停用！");
						return ;
					}else if(type==2 && records[i].data.delflag==0){//启用
						MSG.info("用户【"+records[i].data.userid+"】已经启用，不能再次启用！");
						return ;
					}
				}
				userids=userids.substring(0,userids.length-1);
				Ext.Ajax.request({
				   url: Ext.getPath()+"/userController/stopResumeUser",							   
				   params: { userIds: userids,type:type },
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
	function unlockUser(){
		var records=grid.getSelectionModel () .getSelections () ;
		if(records.length==0){
			MSG.info("请勾选数据");
			return ;
		}
		Ext.MessageBox.confirm("用户确认","确定要解锁选中的用户吗?",function(btn) {
   			if(btn == "yes") {
   				var userids="";
				for(var i=0; i<records.length;i++){
					userids+=records[i].data.userid+",";
					if(sessionUserId==records[i].data.userid){
						MSG.info("不能操作自己的用户！");
						return ;
					}
					if(records[i].data.loginflag==0){
						MSG.info("用户【"+records[i].data.userid+"】未登录，不能解锁！");
						return ;
					}
				}
				userids=userids.substring(0,userids.length-1);
				Ext.Ajax.request({
					   url: Ext.getPath()+"/userController/unlockUser",							   
					   params: { userIds: userids },
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
		dataUrl:Ext.getPath()+'/userController/getUserData',
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
				dataIndex:'userid',
				header:'用户名',
				width: 150
			},{
				dataIndex:'username',
				width:160,
				header:'姓名',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'tel',
				width:160,
				header:'联系方式',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'loginflag',
				width:160,
				header:'登录情况',
				renderer:function(v,m,r){
					if(v==0){
						return "未登录";
					}else{
						return "<span style='color:green;'>已登录</span>";
					
					}
					
				}
				
			},{
				dataIndex:'delflag',
				width:160,
				header:'状态',
				renderer:function(v,m,r){
					if(v==0){
						return "启用";
					}else{
						return "<span style='color:red;'>停用</span>";
					
					}
					
				}
				
			},{
				dataIndex:'userid',
				width:160,
				header:'修改',
				renderer:function(v,m,r){
					if(sessionUserId==v){
					 	return '';
					}else{
					
						var str='<a  href="javascript:modifyUser('+v+')" ><img src="js/extjs/resources/images/icons/fam/cog_edit.png"  > </a>';					
						return str;
					}
				}
				
			}],
			
			tbar:[{
				xtype:'button',
				iconCls: 'query_white',
				cls :'white_toolbar_button',
				text:'查询',
				handler:function(){
					var userid=panel.getForm().findField("userid").getValue();
					var username=panel.getForm().findField("username").getValue();
					var loginflag=panel.getForm().findField("loginflag").getValue();	
					
					//获取grid.getStore().lastOptions的参数, 并覆盖新的参数 ;   start:0  是改了参数要从第一页显示 ,limit 不变
					Ext.apply(grid.getStore().lastOptions.params,{userid:userid,username:username,loginflag:loginflag,start:0		
						})	
					grid.getStore().baseParams=grid.getStore().lastOptions.params;//覆盖掉原来的参数和lastOptions
					grid.getStore().reload();
					
									
					/*grid.getStore().baseParams={userid:userid,username:username,loginflag:loginflag};
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
//	                hidden:userOrgLevel!='3'?true:false,
					text:'新增',
					iconCls:'add',
					handler:adduser
				},{
					text: '停用',
					iconCls: 'delete',
					handler:function(){
						stopResumeUser(1);
					}
				},{
					text: '启用',
					iconCls: 'redo',
					handler: function(){
						stopResumeUser(2);
					}
				},{
					text: '解锁',
					iconCls: 'unlock',
					tooltip: '导入产品信息',
					handler: function(){
						unlockUser();
					}
				}/*,'-',{
					xtype: 'tbseparator',
					hidden:userOrgLevel==1
				}*/
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