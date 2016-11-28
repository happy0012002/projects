<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sunyard.util.Consts" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" " http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
	<head>
		<base href="<%=basePath%>"></base>

		<title></title>
    	
	    <link rel="stylesheet" type="text/css" href="js/extjs/resources/css/ext-all.css" />
	    <link  rel="stylesheet" type="text/css"  href="style/login/login.css"/>
		
		<script type="text/javascript" src="<%=path%>/js/extjs/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="<%=path%>/js/extjs/ext-all.js"></script>
		<script type="text/javascript" src="<%=path%>/js/user/mywork/login/cookie.js"></script>
		<script type="text/javascript" src="<%=path%>/js/user/sysSoft_win.js"></script>

		
	<script type="text/javascript">
			var path='${pageContext.request.contextPath}';
			var screenHeight = window.screen.height;
			var loginName = "${requestScope.loginName }";
			var password = "${requestScope.password }";
			var logintype = "${requestScope.logintype }"; 
			var pwdflag = "${requestScope.pwdflag }";   // 密码标志
		    var loginMessage='${requestScope.errorMessage}';
			var cookieUserName='';
			
			var downSoft = function() {
				var softWin = new Ext.SysSoftWindow();
				softWin.show();
			};

			var mask = new Ext.LoadMask(Ext.getBody(),{
				msg: '系统登入中，请稍等...'
			});	
			window.onload = function(){
				/*cookieUserName = getCookieValue("userName");
				if(null!=cookieUserName && ''!=cookieUserName){
					document.getElementById('loginName').value=cookieUserName;
				}
				document.getElementById('password').focus();*/
			}
		
			function login(){
				var loginname=document.getElementById('loginName');
				var password=document.getElementById('password');
				if(loginname.value==''){
					MSG.error("用户名不能为空。");
					return;
				}
				if(password.value==''){
				    MSG.error("密码不能为空。");
					return;
				}
				/*
				if(cookieUserName!=loginname){
				    if(null!=cookieUserName && ""!=cookieUserName){
				    	deleteCookie("userName","/");
				    }
					setCookie("userName",loginname.value,24,"/"); 
				}*/
				submitForm();
			}
		
			function submitForm(loginName,password){
				
				mask.show();
			    var form=document.getElementById('loginForm');
				form.action='app/loginController/toManageIndex';
				form.submit();
			}
		
			Ext.apply(Ext.form.VTypes,{
			  password:function(val,field){   
		          if(field.confirmTo){   
		              var pwd=Ext.get(field.confirmTo);                     
		              return val.trim()== pwd.getValue().trim(); 
		          }    
	          }   
	        }); 
        
        MSG = Ext.apply({},{
			title:'提示信息',
			show:function(config){
				Ext.Msg.show(config);
			},
			common:function(msg,title,icon,fn,scope){
				Ext.Msg.show({
		           title: title,
		           msg: msg,
		           buttons: Ext.MessageBox.OK,
		           fn: fn,
		           scope:scope||window,
		           icon: icon
		       });
			},
			alert:function(msg,title,fn,scope){
				title = title || this.title;
				Ext.Msg.alert(title,msg,fn,scope);
			},
			info:function(msg,title,fn,scope){
				title = title || this.title;
				MSG.common(msg,title,Ext.MessageBox.INFO,fn,scope);
			},
			warning:function(msg,title,fn,scope){
				title = title || '警告信息';
				MSG.common(msg,title,Ext.MessageBox.WARNING,fn,scope);
			},
			error:function(msg,title,fn,scope){
				title = title || '错误信息';
				MSG.common(msg,title,Ext.MessageBox.ERROR,fn,scope);
			},
			question:function(msg,title,fn,scope){
				title = title || '信息';
				MSG.common(msg,title,Ext.MessageBox.QUESTION,fn,scope);
			},
			confirm:function(msg,title,fn,scope){
				title = title || this.title;
				Ext.Msg.confirm(title,msg,fn,scope);
			}
		});
		
		if(Ext.MessageBox){
		   Ext.MessageBox.buttonText = {
		      ok     : "确定",
		      cancel : "取消",
		      yes    : "是",
		      no     : "否"
		   };
		}
		
		Ext.onReady(function() {
			Ext.QuickTips.init();
			
			var aspNetHidden=document.getElementById('aspNetHidden');//获得元素
			if(900<=screenHeight){
				aspNetHidden.style.height='70px';
			}else if(900>screenHeight && screenHeight>=768){
				aspNetHidden.style.height='25px';
			}else{
				aspNetHidden.style.height='10px';
			}
			var formPanel = new Ext.FormPanel({
				frame: true,
				labelWidth: 80,
				labelAlign:'right',
				defaults: {
					allowBlank: false,
					anchor: '92%',
					msgTarget: 'side'
				},
				items: [{
					xtype: 'label',
					name: 'userid',
					fieldLabel: '用户名',
					text: loginName
				},{
					xtype: 'textfield',
					inputType:'password',
					name: 'oldpassword',
					fieldLabel: '原密码',
					blankText:"原密码不能为空！"
				},{
					xtype: 'textfield',
					inputType:'password',
					name: 'newpassword',
					id: 'newpassword',
					fieldLabel: '新密码',
					blankText:"新密码不能为空！"
				},{
					xtype: 'textfield',
					inputType:'password',
					name: 'confirmpassword',
					id: 'confirmpassword',
					confirmTo: 'newpassword',
					fieldLabel: '确认密码',
					vtype:'password',  
			        vtypeText:'两次密码输入不一致!',
			        blankText: '确认密码不能为空'
				}]
			});
			
			var window = new Ext.Window({
				title: '重置密码',
				modal: true,
				height: 200,
				layout:'fit',
				width: 400,
				autoScroll:true,
				buttonAlign : 'center',
				items: formPanel,
				buttons: [{
					text: '确定',
					handler: function() {
						submitResetForm();
					}
				},{
					text: '取消',
					handler: function() {
						window.close();
					}
				}]
			});
			
			function submitResetForm() {
				var resetForm = formPanel.getForm();
				var oldPassword = resetForm.findField("oldpassword").getValue();
				var newpassword = resetForm.findField("newpassword").getValue();
				var confirmpassword = resetForm.findField("confirmpassword").getValue()
				
				if(oldPassword == "") {
					MSG.error("原密码不能为空！");
					return;
				}
				
				if(newpassword == "") {
					MSG.error("新密码不能为空！");
					return;
				}
				
				if(confirmpassword == "") {
					MSG.error("确认密码不能为空！");
					return;
				}
				
				if(oldPassword == newpassword) {
					MSG.error("新密码和原密码不能相同！");
					return;
				}
				
				if(newpassword != confirmpassword) {
					MSG.error("确认密码和新密码输入不一致！");
					return;
				}
				
				if(!resetForm.isValid()) {
					return;
				}
				
				resetForm.submit({
					waitTitle :'提示信息',
					waitMsg :'提交中请稍候...',
					url: 'app/loginController/resetPwd',
					params: {
						userid: loginName
					},
					success: function(form,action) {
						MSG.info("重置密码成功","提示信息",function() {
							document.getElementById('password').value = newpassword;
							window.close();
							submitForm();
						});
					},
					failure: function(form,action) {
						if(action.result && action.result.errorMessage) {
							MSG.error(action.result.errorMessage);
						} else {
							MSG.error("提交失败，请检查网络配置！");
						}
					} 
				});
			}
			
			(function() {
			    if(null!=loginMessage && ''!=loginMessage){
			    	MSG.error(loginMessage);
			    }
				if(!Ext.isEmpty(pwdflag)) {
					if(pwdflag == '-1') {
						MSG.warning('您的密码已经过期，您必须重置密码才能登录！','警告',function() {
							window.show();
						});
					} else {
						var msg = pwdflag == "0" ? "您的密码今天到期，是否重置密码？" : "您的密码还有"+pwdflag+"天到期，是否重置密码？";
						MSG.confirm(msg,'用户确认',function(btn) {
							if(btn == 'yes') {
								window.show();
							} else {
								document.getElementById('password').value = password;
								submitForm(true);
							}
						});
					}
				}
			}).defer(200);
		});
		
		
		function doOnLoginNameKeyPress() {
			var k=event.keyCode; 
			if ((k<=57 && k>=48) || (k>=97 && k <=122) || (k>=65 && k <=90)){
				return true;
			} else if (event.keyCode=='13'){
			    return false;
			} else { 
			    alert("用户名是最多10位的数字字母组合."); 
			    return false;
			}
		};
		
		function KeyDown() {
		   if (event.keyCode == 13)   {
		        event.returnValue=false;     
		        event.cancel = true;     
		        document.getElementById('loginForm').submit();  
	       } 
        } 
		
	</script>

	<style>
		form{padding-top:3px;}
		.x-grid3-scroller{
			overflow:hidden;
			position:relative;
		}
	</style>
	
	</head>

	<body style="background-repeat:repeat-x; background-image:url(images/login/images/new/bbbg.png);background-color:#BEE1F5" >
		<form method="post" action="javascript:login()" id="loginForm">
		    <div id="ui_id_mian">
		         <img src="images/login/images/new/logo.png" />
		         <div id="aspNetHidden"></div>
		         <div id="ui_id_login_box" style="background-image:url(images/login/images/new/form_bg.png);"> 
		         	<div class="ui_table">   
		                <table>
		                    <tr>
		                          <th><span class="th_span">用户名:</span></th>
			                      <td width="250"> <input name="loginName" type="text" id="loginName" value="${requestScope.loginName }" onkeydown="KeyDown()"/>
								  </td>
		                    </tr>
		                    <tr>
		                        <th><span class="th_span">密&nbsp;&nbsp;&nbsp;&nbsp;码:</span></th>
		                        <td><input name="password" type="password" id="password" onkeydown="KeyDown()"/> 
								</td>
		                    </tr>
		                </table>  
	                </div>
	                <div class="ui_button" > 
	               
		                <a href="javascript:document.getElementById('loginForm').submit();" id="loginBtn">
	                		<span><img src="images/login/images/new/logins.png" style="margin:10px 10px 10px 100px;"/></span>
                		</a>
                		<a href="" id="backindex">
	                		<span><img src="images/login/images/new/backindexs.png" style="margin:10px 10px;"/></span>
                		</a> 
                		
               		</div>
	                <div class="ui_foot">
	                	<span>建议浏览器IE8及以上，分辨率1024*768及以上</span>
	                	<!-- <a style="float:right;" href="">
	                		<span style="float:right;">返回首页</span>
                		</a> -->
	                </div>
		        </div>
		    </div>
		</form>
	</body>
</html>
