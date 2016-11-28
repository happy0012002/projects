<%@ page language="java" import="java.util.*" pageEncoding="GBK" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ page import="com.sunyard.util.Consts"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ path + "/";
%>

<!DOCTYPE html>
<html lang="en">
<html>
	<head>
		<base href="<%=basePath%>">

		<title></title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

		<LINK href="js/extjs/resources/css/ext-all.css" type=text/css rel=stylesheet>
		
		<link href="style/newFrame/notAuditStaffmain.css" rel="stylesheet" type="text/css" />
		<link href="style/newFrame/head-manu.css" rel="stylesheet" type="text/css" />
		
		<script type="text/javascript" src="<%=path %>/app/loadResourcesController/loadAllJavaScript"></script>
		<!--  <script type="text/javascript" src="js/extjs/adapter/ext/ext-base.js" ></script>
		<script type="text/javascript" src="js/extjs/ext-all.js"></script>-->
	
		<script src="js/newFrame/jquery-1.11.2.min.js" type="text/javascript"></script>
		<script src="js/newFrame/mainIndex.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			var path='${pageContext.request.contextPath}';
			var topMenuStr='${requestScope.topMenuStr}';	//一级菜单权限
			var secondMenuName='';
			function logout(){
				Ext.MessageBox.buttonText.yes = "确定";
				Ext.MessageBox.buttonText.no = "取消";  
				Ext.MessageBox.minWidth = 200;  
				Ext.MessageBox.confirm("用户确认","确定要退出系统吗?",function(btn) {
	      			if(btn == "yes") {
	      				var version = (new Date()).getTime();
						document.location=path+"/app/loginController/loginout?version="+version;
	      			}
	   			});
			}
			function toHomepage(){	
				ShowMain('app/loginController/toNotAuditPersonalWorkbench','1','','','','','','');      			
			}
			
			window.onunload = function(){
				var version = (new Date()).getTime();
				jQuery.ajax({
				   type: "GET",
				   url: path+"/app/loginController/loginout?version="+version,
				   dataType: "json",
				   async: false
				});
				
				
			}
		</script>
		
		<script type="text/javascript">
		
		
		function ShowInfo(){
		 var infoFormPanel =CC.create({
	    	  xtype:'sunyardform',
	          //cls:'panelborder',
	          frame : true,
	          autoScroll : false ,
	          labelWidth : 100,          
	          defaults : {
		         anchor : '95%'
	          },
	          labelAlign:'right',
              items: [{
		         xtype: 'textfield',
		         name: 'userid',
		         readOnly:true,
		         fieldLabel: '用户ID'
	          },{
		         xtype: 'textfield',
		         name: 'username',
		         readOnly:true,
		         fieldLabel: '用户名称'
	          },{
		         xtype: 'textfield',
		         name: 'roleid',
		         readOnly:true,
		         fieldLabel: '用户角色'
	          },{
	             xtype : 'textfield',
			     fieldLabel:'审计负责人',
			     name:'leaderflagshow',
			     readOnly:true			     
			  },{
		         xtype: 'textfield',
		         name: 'ownorg',
		         readOnly:true,
		         fieldLabel: '所属机构'
	          },{
		         xtype: 'textfield',
		         name: 'passwordeditdate',
		         readOnly:true,
		         fieldLabel: '密码修改日期'
	          },{
		         xtype: 'textfield',
		         name: 'Password_valid',
		         readOnly:true,
		         fieldLabel: '密码有效日期'
	          },{
		         xtype: 'textarea',
		         name: 'managerorg',
		         readOnly:true,
		         fieldLabel: '管辖机构',
		         height:100
	         },{
	 	         xtype: 'textarea',
		         name: 'describe',
		         readOnly:true,
		         fieldLabel: '描述'
	      }]
      }); 
	      	
    	var infoWin = CC.create({
			xtype:'s_window',
			height: 480,
			width: 550,
			layout: 'fit',
			title:'个人资料',	
			closable: true,
			closeAction: 'hide',
			items:[infoFormPanel],
			buttonAlign: 'center',
			modal:true,
			buttons :[{
                 text:'确定',
                 cls:'formPanelButton',
                 //iconCls:'back',
                 handler : function(){	
                       infoWin.hide();
                 }}]
	    });
	    infoWin.show();
	    infoFormPanel.getForm().load({	
		waitTitle : '提示信息',
		waitMsg : '系统正在处理，请稍等...',
		url : Ext.getPath()	+ '/MyWorkController/MyWorkUserinfo',		
		success: function(form,action) {
			var data = action.result.data;
			infoFormPanel.getForm().findField('Password_valid').setValue(valid);
		},
		failure: function(form,action) {
			MSG.error('请求失败，请联系管理员');
		}
	  });	   
    }
    
    function updatePassword(){
		 var updatePassFormPanel =CC.create({
	    	  xtype:'sunyardform',
	          //cls:'panelborder',
	          frame : true,
	          autoScroll : false ,
	          labelWidth : 100,          
	          defaults : {
		         anchor : '95%'
	          },
	          labelAlign:'right',
		      border:false,
		      labelAlign:'right',
		      layout:'form',
		      items:[{
				xtype: 'textfield',
		        name: 'edituserid',
		        readOnly:true,
		        width:250,		        
			    fieldLabel: '用户ID'
	        },{
				xtype: 'textfield',
		        name: 'oldpassword',
		        allowBlank:false,
		        inputType:'password',
		        width:250,
			    fieldLabel: '旧密码'
	        },{
				xtype: 'textfield',
		        name: 'newpassword1',
		        allowBlank:false,
		        inputType:'password',
		        width:250,
			    fieldLabel: '新密码'
	        },{
				xtype: 'textfield',
		        name: 'newpassword2',
		        inputType:'password',
		        allowBlank:false,
		        width:250,
			    fieldLabel: '确认新密码'
	        }]
           }); 
	      	
    	var updatePassWin = CC.create({
			xtype:'s_window',
			height: 230,
			width: 500,
			layout: 'fit',
			title:'修改密码',	
			closable: true,
			closeAction: 'hide',
			items:[updatePassFormPanel],
			buttonAlign: 'center',
			modal:true,
			buttons :[{
	        	text:'提交',
	        	handler:function(){
	        	    if(!updatePassFormPanel.getForm().isValid()) {
							Ext.Msg.alert('错误信息',"您有未填写信息,请填写！");
							return;
					};
					if(updatePassFormPanel.getForm().findField('newpassword1').getValue()!=updatePassFormPanel.getForm().findField('newpassword2').getValue()){
							Ext.Msg.alert('错误信息',"密码与确认密码不一致，请确认！");
							return;
					}
					if(updatePassFormPanel.getForm().findField('newpassword1').getValue()==updatePassFormPanel.getForm().findField('oldpassword').getValue()){
							Ext.Msg.alert('错误信息',"新密码与旧密码必须不同，请确认！");
							return;
					}
	        	   updatePassFormPanel.getForm().submit({  
								url :Ext.getPath()+ '/systemUserController/sysUserPasswordSubmit',
								method : 'POST',
								success : function(form,action) {
										Ext.Msg.alert('提示',"修改成功",function() {
												//window.location.href = 'systemAction.do?method=sysUserPassword';
												updatePassWin.hide();
										});
								},
								failure : function(form,action) {
									 Ext.MessageBox.alert("提示",action.result.errorMessage,
											function() {
												//window.location.href = 'systemAction.do?method=sysUserPassword';
											});  
								}
				  });
				}
	        },{
	        	text:'重置',
	        	handler:function(){
	        	    var userid = updatePassFormPanel.getForm().findField('edituserid').getValue();
	        		updatePassFormPanel.getForm().reset();
	        		updatePassFormPanel.getForm().findField('edituserid').setValue(userid);
	        	}
	        }]
	    });
	    updatePassWin.show();	 
	    updatePassFormPanel.getForm().load({	
		waitTitle : '提示信息',
		waitMsg : '系统正在处理，请稍等...',
		url : Ext.getPath()	+ '/MyWorkController/MyWorkUserinfo',		
		success: function(form,action) {
			var data = action.result.data;
			updatePassFormPanel.getForm().findField('edituserid').setValue(data.userid);
		},
		failure: function(form,action) {
			MSG.error('请求失败，请联系管理员');
		}
	  });   	   
    }
		
		
			// 上面的菜单路径点击事件 貌似此方法已经废弃  全部调用的是main.jsp 的contentMenuheadClick 
			function  contentMenuheadClick(topprivid,secondprivid,thridprivid){
					if(null!=topprivid && ''!=topprivid ){					
						$("#left-menu a").each(function(){
							if(topprivid==$(this).attr('name')){
								$(this).trigger('click',secondprivid);
								if(null!=thridprivid &&''!=thridprivid){
									$(this).trigger('click',thridprivid);
									 slideup();
								}
							}
						});
					}				
			}
			function slideup(){//隐藏菜单			
				$("#menu").slideUp(300);
				$("#content").css("left","45px");
			}
			jQuery(document).ready(function () {
				//右上角加号点击事件，出现下拉菜单
				$('#head-manu-ul li').has('ul').click(function(){
					if($(this).children('ul').css('visibility') == 'visible'){
						$(this).children('ul').css('visibility','hidden');
					}else{
						$(this).children('ul').css('visibility','visible');
					}
				});
				
				$("#left-menu ul").bind('click',function(e){					
					e.stopPropagation();
					e.preventDefault();
				});
				$("#left-menu").bind('click',function(e){
					e.stopPropagation();
					e.preventDefault();
					$("#menu").slideUp(300);
					$("#content").css("left","45px");
				});
				
				
				
			});
     		
		</script>
	
		
	</head>

	<body>		
		<div id="content" class="content">
			<div class="content-head">
				<div style="margin:0;padding:0;float:left;margin-left:20px;">
					<ul style="list-style: none;margin:0;padding: 0;float:left;">
		                <li style="list-style: none;margin: 0;padding: 0;float:left;">
		                    <img style="margin-top:4px;" src="images/newFrame/logo.png" alt=""/>
		                </li>
		                <li style="list-style: none;margin:3px 0px 3px 10px;padding-left:10px;float:left;height:32px;line-height:32px;color:#FF8000;font-size:12px;border-left:1px solid #ddd;">证照管理系统 V1.0</li>
		            </ul>
				</div>	
			
				<div id="logout" style="float:right;margin-right:0;padding:0;">					
					<a href="javascript:logout();" title="退出" ><img src="images/newFrame/logout.gif"/></a>
				</div>			
				<div style="float:right;font-size:80%;">
					您好，<font style="font-weight:600;" color="#FF8000">${user.username}</font>
				</div>
			</div>
			<div id="main_menu" class="menu" style="top:50px;margin-top:50px;margin-left:50px;width:20%;">
				<ul>
					<li>证照管理
					<ul>
						<li>证照类别管理</li>
						<li>公司管理</li>
						<li>证照管理</li>
					</ul>
					</li>
					<li>系统设置
					<ul>
						<li>系统参数配置</li>
						<li>用户管理</li>
						<li>密码修改</li>
						<li>用户监控</li>
						<li>系统备份</li>
						<li>操作日志</li>
					</ul>
					</li>
					
									
					
					
				</ul>
            </div>
			<div id="main_right_frame" class="content-main" style="overflow:hidden;">
				<iframe id="main_right" 
	                       class = "info"
	                       name="main_right" 
	                       frameborder="0" 
	                       src="app/loginController/welcome" 
	                       scrolling="hidden" >
	            </iframe>
            </div>
		</div>
	</body>
</html>
