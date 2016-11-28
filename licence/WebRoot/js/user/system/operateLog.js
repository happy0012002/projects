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
		//title:'审计立项管理',
		layout:'form',
		items:[{
			layout:'column',			
			items:[{
				columnWidth:.25,
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
				columnWidth:.25,
				defaults:{
					anchor:'90%'
				},
				layout:'form',
				items:[{
						xtype:'s_combo',
						fieldLabel:'日志类别',
						editable:false,	
						dataUrl:Ext.getPath()+'/utilController/getDicinfo',
						baseParams:{fieldname:sysLogFieldname}	,							
						allowBlank:false,	
						hiddenName:'operatecategory'			
					}]
			},{
				columnWidth:.5,
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
					columnWidth:.44,
					defaults:{
						anchor:'96%'
					},
					layout:'form',
					items:[{
						xtype:'s_datefield',
						name:'operatetimegt',
						format:'Y-m-d',					
						fieldLabel:'操作日期',
						emptyText:'大于等于'
					}]
				} , 
				{
					columnWidth:.28,
					defaults:{
						anchor:'96%'
					},
					layout:'form',
					items:[{
						xtype:'s_datefield',
						name:'operatetimeeq',					
						hideLabel : true ,
						format:'Y-m-d',	
						emptyText:'等于'
					}]
				} ,
				{
					columnWidth:.28,
					defaults:{
						anchor:'96%'
					},
					layout:'form',
					items:[{
						xtype:'s_datefield',
						name:'operatetimelt',
						format:'Y-m-d',						
						hideLabel : true, 	
						emptyText:'小于等于'
					}]
				}]
				
			
			}]
				
			
			}]
		}]		
	});
	
	
	
	
	
	var sm = new Ext.grid.CheckboxSelectionModel({});
	grid = CC.create({
		region:'center',
        xtype:'commongrid',
		dataUrl:Ext.getPath()+'/syslogController/getAdOperateLogData',
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
				dataIndex:'userid',
				header:'用户名',
				sortable:true,
				width: 100
			},{
				dataIndex:'username',
				header:'用户姓名',
				sortable:true,
				width: 100
			},{
				dataIndex:'operatetime',
				width:100,
				header:'操作时间',
				sortable:true,
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'content',
				width:100,
				header:'日志类别',
				sortable:true,
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			},{
				dataIndex:'operatecontent',
				width:320,
				header:'操作内容',
				renderer:function(v,m,r){
					m.attr='qtip=\"'+v+'\"';
					return v;
				}
				
			}],
			
			tbar:[{
				xtype:'button',
				iconCls: 'query_white',
				cls :'white_toolbar_button',
				text:'查询',
				handler:function(){
					var operatecategory=panel.getForm().findField("operatecategory").getValue();
					var userid=panel.getForm().findField("userid").getValue();
					var operatetimelt=panel.getForm().findField("operatetimelt").getValue();
					var operatetimeeq=panel.getForm().findField("operatetimeeq").getValue();
					var operatetimegt=panel.getForm().findField("operatetimegt").getValue();
					//获取grid.getStore().lastOptions的参数, 并覆盖新的参数 ;   start:0  是改了参数要从第一页显示 limit 不变
					Ext.apply(grid.getStore().lastOptions.params,{userid:userid,operatecategory:operatecategory,operatetimelt:operatetimelt,
							operatetimeeq:operatetimeeq,operatetimegt:operatetimegt,start:0		
						})	
					grid.getStore().baseParams=grid.getStore().lastOptions.params;//覆盖掉原来的参数和lastOptions
					grid.getStore().reload();
					
				}			
			},{
				xtype:'button',
				iconCls: 'reset_white',
				cls :'white_toolbar_button',
				text:'重置',
				handler:function(){
					panel.getForm().reset();
				}
			},{}
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