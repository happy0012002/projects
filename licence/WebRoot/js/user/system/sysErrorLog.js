Ext.onReady(function(){
	Ext.QuickTips.init();
	panel=new Ext.form.FormPanel({		
		defaults:{
			anchor: '95%'			
		},
		width:400,
		border:false,
		frame:true,
		labelAlign:'right',
		layout:'form',
		labelWidth:120,
		buttonAlign:'center',
		items:[{
				xtype:'s_combo',
				hiddenName:'type',
				fieldLabel:'日志下载选项',				
				combodata:[['1','今天'],['2','最新3天'],['3','最新5天'],['4','自定义']]	,
				editable:false,
				allowBlank:false,
				listeners:{select:{ 
					fn:function(combo,record ,index  ){
							if('4'==record.data.value){
								panel.getForm().findField('begindate').enable ();
								panel.getForm().findField('enddate').enable ();
							}else{	
								panel.getForm().findField('begindate').setValue('');	
								panel.getForm().findField('enddate').setValue('');					
								panel.getForm().findField('begindate').disable();
								panel.getForm().findField('enddate').disable();
							}				
						}
					}
				}
				
			},{			
				xtype:'s_datefield',
				name:'begindate',
				format:'Y-m-d',
				disabled:true,					
				fieldLabel :' 开 始 日 期 '
			},{
				xtype:'s_datefield',
				name:'enddate',
				format:'Y-m-d',	
				disabled :true,					
				fieldLabel :' 结 束 日 期 '
			}
			]
			,
			
			buttons:[{
					xtype:'button',
					iconCls: 'query_white',
					cls :'white_toolbar_button',
					text:'提交',
					style:'margin-top:50px;',
					handler:function(){
						if(!panel.getForm().isValid()){
							MSG.error("请选择“日志下载选项”！");
							return;
						}
						
						var type=panel.getForm().findField('type').getValue();	
						var begindate=panel.getForm().findField('begindate').getValue();	
						var enddate=panel.getForm().findField('enddate').getValue();
						if('4'==type){
							if(""==begindate || ""==enddate || null==begindate || null==enddate ){
								MSG.error("选择“自定义”时，开始和截止日期不能为空！")
								return;
							}
						}
						
						if(""!=begindate && ""!=enddate && null!=begindate && null!=enddate ){
							if(begindate>enddate){
								MSG.error("开始日期不能大于结束日期！")
								return;
							}
						}
						window.location.href=Ext.getPath()+"/syslogController/downloadLog?type="+type+"&begindate="+begindate+"&enddate="+enddate;
						
					}
			
				},{
					xtype:'button',
					iconCls: 'reset_white',
					style:'margin-top:50px;',
					cls :'white_toolbar_button',
					text:'重置',
					handler:function(){
						panel.getForm().reset();				
						panel.getForm().findField('begindate').disable();
						panel.getForm().findField('enddate').disable();
					}
				
				
				}]		
	});
	
	
	
	new Ext.Viewport({
		layout:'form',
		style:'padding-left:200px;',
		items:[panel]	
	});

});