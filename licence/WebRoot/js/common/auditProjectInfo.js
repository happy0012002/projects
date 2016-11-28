// 项目概况
	function desc(auditId) {
		var myMask = new Ext.LoadMask(Ext.getBody(), {msg : "请稍等..."});
		myMask.show();
		var itemTpl = xtp;
		Ext.Ajax.request({
			url : path+"/app/addArchivesController/showProjectInfo",
			params : {auditId : auditId},
			success : function(response, options) {
				myMask.hide();
				var oprations = Ext.decode(response.responseText);
				var _win = new Ext.Window({
							title:'项目概况',
							width : 700,
							height:340,
							autoScroll:true,
							buttonAlign : 'center',
							frame : true,
							resizable : true,
							maximizable: true,
							modal:true,
							frame : true,
							closeAction : "destroy",
							defaults: {anchor: '95%'},
							html : itemTpl.applyTemplate(oprations)
						});
				_win.show();
			},
			failure : function(response, options) {
				myMask.hide();
				var respText = Ext.util.JSON.decode(response.responseText);
				Ext.Msg.show({
							title : '提示',
							width : 250,
							msg : '数据加载错误。',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
				return;
			}
		});
	}
	
	function lookOrganize(auditId,organizeid){
	   organizeWin = new Ext.Window({
			maximizable :true,
			width : 700,
			height : 500,	
			closeAction:'close',				
			title : '架构'+organizeid,
			id:'organizewin',
			autoScroll:true,
			buttonAlign : 'center',
			layout : 'fit',
			html:'<iframe id="orgframe"  height="100%" width="100%" align="middle"></iframe>'				
		});	
	organizeWin.show();	
	organizeWin.maximize();
	orgframe.location.href=Ext.getPath()+'/offSiteAuditController/organizedate?currentData=&auditOrganizeid='+organizeid+'&auditOrganizename=&projectId='+auditId+'&type=edit&look=true';	
}
	
	var xtp = new Ext.XTemplate(
			'<div id="divTemplate">',
			'<table width="100%" border="0" cellspacing="0" cellpadding="3" class="main_table">',
			'<tr>',
				'<td width="17%" align="center" >项目名称：</td>','<td align="left" width="35%">{auditName}</td>',
				'<td width="15%" align="center" >项目编号：</td>','<td align="left" width="35%">{auditId}</td>', 
			'</tr>', 
			
			'<tr>',
				'<td width="17%" align="center" >项目类型：</td>','<td align="left" width="35%">{auditType}</td>', 
				'<td width="15%" align="center" >项目状态：</td>','<td align="left" width="35%">{progressFlagShow}</td>',
			'</tr>',
			
			'<tr>',
				'<td  width="17%" align="center" >项目级别：</td>','<td  align="left" width="35%">{auditGrade}</td>',
				'<td width="15%" align="center" >立项依据：</td>','<td align="left" width="35%">{auditCause}</td>', 
			'</tr>',
			
			'<tr>',
				'<td width="17%" align="center" >立项人：</td>','<td align="left" width="35%">{createUserid}</td>',
			    "<td width='15%' align='center' >组织架构：</td>","<td align='left' width='35%'><a href=\"javascript: lookOrganize('"+'{auditId}'+"','"+'{organizeid}'+"')\" title=\"查看组织架构\">点击查看</a></td>",			
			'</tr>', 
	
			'<tr>',
				'<td width="17%" align="center" >立项日期：</td>','<td align="left" width="35%">{createTime}</td>',
				'<td width="15%" align="center" >实施期间：</td>','<td align="left" width="35%">{startDate}</td>', 			
			'</tr>', 
			
			'<tr>',
			    '<td width="17%" align="center" >审计期间：</td>','<td align="left" width="35%">{adEndDate}</td>',
			    '<td width="15%" align="center" >审计对象：</td>','<td align="left" width="35%"><div style="overflow:auto;height:100px">{auditObjectShow}</div></td>', '</tr>',
			'<tr>',
			    '<td width="17%" align="center" >审计目的与目标：</td>','<td align="left" colspan="3" width="70%">{auditTarget}</td>',
			'</tr>',
			'<tr>',
			    '<td width="17%" align="center" >审计范围：</td>','<td align="left" colspan="3" width="70%">{auditRound}</td>', 
			'</tr>',			
			'<tr>',			
				'<td  width="17%" align="center" valign="top" >审计内容：</td>',
				'<td align="left" valign="top" colspan="3">{auditRemark}</td>', 
			'</tr>',
			'</table>', 
			'</div>'
	);