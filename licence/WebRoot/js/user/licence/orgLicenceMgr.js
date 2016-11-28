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
					xtype:'s_combo',
					fieldLabel:'证照类别',
					editable:false,	
					dataUrl:Ext.getPath()+'/adLicenceController/getlicCategory'	,		
					hiddenName:'categoryid'			
				},{
					xtype:'s_textfield',
					name:'id',					
					fieldLabel:'证照编号'				
				}]
			},{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
					xtype:'s_combo',
					fieldLabel:'过期类别',
					editable:false,	
					combodata:[
						[2,'即将过期'],
						[1,'已过期'],						
						[3,'无异常']
					],
					displayField:'text',
					valueField:'value',
					hiddenName:'expdatetype'			
				},{
					xtype:'s_textfield',
					name:'name',					
					fieldLabel:'证照名称'				
				}]
			},{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
				columnWidth:.33,
				defaults:{
					anchor:'90%'
				},
				layout:'column',
				items:[
				{
					columnWidth:.5,
					defaults:{
						anchor:'96%'
					},
					layout:'form',
					items:[{
						xtype:'s_datefield',
						name:'expdategt',
						format:'Y-m-d',					
						fieldLabel:'到期日期', 	
						emptyText:'大于等于'
					}]
				} , 
				{
					columnWidth:.25,
					defaults:{
						anchor:'96%'
					},
					layout:'form',
					items:[{
						xtype:'s_datefield',
						name:'expdateeq',					
						hideLabel : true ,
						format:'Y-m-d',	
						emptyText:'等于'
					}]
				} ,
				{
					columnWidth:.25,
					defaults:{
						anchor:'96%'
					},
					layout:'form',
					items:[{
						xtype:'s_datefield',
						name:'expdatelt',
						format:'Y-m-d',						
						hideLabel : true,
						emptyText:'小于等于'
					}]
				}]
				
			
			},{
					xtype:'s_textfield',
					name:'remark',					
					fieldLabel:'备   注'				
				}]
				
			
			}]
		}]		
	});
	
	
	lookimg=function (id,imgpath){
		if(undefined==imgpath||imgpath==null||imgpath==''){
			MSG.info("此证照没有图片!");
		}
		var ww=window.screen.availWidth;
	 	var hh=window.screen.availHeight;
		window.open(Ext.getPath()+'/adLicenceController/showImg?id='+id, '_blank','left=0,top=0,width='+ww+',height='+hh+',titlebar=yes,menubar=yes,location=yes,directories:=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes' );
	}
	
	
	
	function delLicence(){
		var records=grid.getSelectionModel () .getSelections () ;
		if(records.length==0){
			MSG.info("请勾选数据");
			return ;
		}
		Ext.Ajax.timeout=1000*300;//5分钟
		Ext.MessageBox.confirm("用户确认","确定要删除选中的证照吗?",function(btn) {
   			if(btn == "yes") {
   				var ids="";
				for(var i=0; i<records.length;i++){
					ids+=records[i].data.id+",";
				}
				ids=ids.substring(0,ids.length-1);
				myMask.show();
				Ext.Ajax.request({
					   url: Ext.getPath()+"/adLicenceLoginController/delLicence",							   
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
	
	
	var sm = new Ext.grid.CheckboxSelectionModel({});
	grid = CC.create({
		region:'center',
        xtype:'commongrid',
		dataUrl:Ext.getPath()+'/adLicenceController/getLicenceData',
		baseParams:{orgid:orgId},
		//filtersPlugin:new Ext.ux.sunyard.filter.GridFilters({height:200}),
		pageSize: pageRecorder,
        frame: true,
        title:'['+orgName+']的证照信息',
        stripeRows:false,
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
				header:'证照编号',
				sortable:true,
				width: 150,
				renderer:function(v,m,r){
					var imgpath=r.data['imgpath'];
					var str='<a  href="javascript:lookimg(\''+v+'\',\''+imgpath+'\')" >'+v+'</a>';
					return str;
				}
			},{
				dataIndex:'expdate',
				width:160,
				header:'证照到期日期',
				sortable:true,
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'categoryname',
				width:160,
				header:'证照类别',
				sortable:true,
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'name',
				width:160,
				header:'证照名称',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'orgname',
				width:160,
				header:'所属公司',
				sortable:true,
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'remark',
				width:160,
				header:'证照备注',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'',
				width:160,
				header:buttonHidden?'详情':'修改',
				renderer:function(v,m,r){
					var id=r.data['id'];
					var str='<a  href="javascript:modifyLicence(\''+id+'\')" ><img src="js/extjs/resources/images/icons/fam/cog_edit.png"  > </a>';
					return str;
				}
				
			}],
			
			tbar:[{
				xtype:'button',
				iconCls: 'query_white',
				cls :'white_toolbar_button',
				text:'查询',
				handler:function(){
					var categoryid=panel.getForm().findField("categoryid").getValue();
					var id=panel.getForm().findField("id").getValue();
					var expdatetype=panel.getForm().findField("expdatetype").getValue();
					var remark=panel.getForm().findField("remark").getValue();
					var expdatelt=panel.getForm().findField("expdatelt").getValue();
					var expdateeq=panel.getForm().findField("expdateeq").getValue();
					var expdategt=panel.getForm().findField("expdategt").getValue();			
					var name=panel.getForm().findField("name").getValue();	
					
					//获取grid.getStore().lastOptions的参数, 并覆盖新的参数 ;   start:0  是改了参数要从第一页显示 limit 不变
					Ext.apply(grid.getStore().lastOptions.params,{categoryid:categoryid,id:id,expdatetype:expdatetype,remark:remark
					,expdatelt:expdatelt,expdateeq:expdateeq,expdategt:expdategt,name:name,start:0		
						})	
					grid.getStore().baseParams=grid.getStore().lastOptions.params;//覆盖掉原来的参数和lastOptions
					grid.getStore().reload();
					
					
					/*grid.getStore().baseParams={categoryid:categoryid,id:id,expdatetype:expdatetype,remark:remark
					,expdatelt:expdatelt,expdateeq:expdateeq,expdategt:expdategt,name:name
					};
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
					text:'返回',
					iconCls:'arrow_left',
					handler:function(){
						if(buttonHidden){
							window.location.href=Ext.getPath()+'/adOrgtbController/toOrgIndex';
						}else{
							window.location.href=Ext.getPath()+'/adOrgtbLoginController/toOrgLoginIndex';
						}
						
					
					}
				},{
					text:'新增',
					iconCls:'add',
					hidden:buttonHidden,
					handler:addLicence
				},{
					text: '删除',
					iconCls: 'delete',
					hidden:buttonHidden,
					handler:function(){
						delLicence();
					}
				},{
					text: '导入',
					hidden:buttonHidden,
					iconCls: 'import',
					handler:function(){
						showZipImportProductWin(licTempUrl);
					}
				}
				]	
	});
	grid.getView().getRowClass=function(record,rowIndex,rowParams,store){
		if(record.data.expdate<dateToday ){//已经过期 红色   
             return 'x-grid-record-red';                        
         }else if(record.data.expdate<oneMonthAfter ){//一个月以内过期  黄色
               return 'x-grid-record-yellow';
        }
     }
	
	/*grid.addListener('afterrender', handleGridLoadEvent1);
	
	function handleGridLoadEvent1(g) {
		var store=g.getStore();
		var girdcount=0;
		store.each(function(r){
			if(r.data.expdate<dateToday){//已经过期 红色
				g.getView().getRow(girdcount).style.backgroundColor='#FAD0DB';
			}else if(r.data.expdate<oneMonthAfter ){//一个月以内过期  黄色
                 g.getView().getRow(girdcount).style.backgroundColor='#F3FEC2';                
            }
			girdcount=girdcount+1;
		});
	}
	
	grid.getStore().addListener('load',handleGridLoadEvent);
	function handleGridLoadEvent(store,records) {
		var girdcount=0;
		store.each(function(r){
			if(r.data.expdate<dateToday){//已经过期 红色
				grid.getView().getRow(girdcount).style.backgroundColor='#FAD0DB';
			}else if(r.data.expdate<oneMonthAfter ){//一个月以内过期  黄色
                 grid.getView().getRow(girdcount).style.backgroundColor='#F3FEC2';
                 
            }
			girdcount=girdcount+1;
		});
	}*/

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
           height:80,
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