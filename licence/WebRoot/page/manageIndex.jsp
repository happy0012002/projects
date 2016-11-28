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
			var topMenuStr='${requestScope.topMenuStr}';	//һ���˵�Ȩ��
			var secondMenuName='';
			function logout(){
				Ext.MessageBox.buttonText.yes = "ȷ��";
				Ext.MessageBox.buttonText.no = "ȡ��";  
				Ext.MessageBox.minWidth = 200;  
				Ext.MessageBox.confirm("�û�ȷ��","ȷ��Ҫ�˳�ϵͳ��?",function(btn) {
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
		         fieldLabel: '�û�ID'
	          },{
		         xtype: 'textfield',
		         name: 'username',
		         readOnly:true,
		         fieldLabel: '�û�����'
	          },{
		         xtype: 'textfield',
		         name: 'roleid',
		         readOnly:true,
		         fieldLabel: '�û���ɫ'
	          },{
	             xtype : 'textfield',
			     fieldLabel:'��Ƹ�����',
			     name:'leaderflagshow',
			     readOnly:true			     
			  },{
		         xtype: 'textfield',
		         name: 'ownorg',
		         readOnly:true,
		         fieldLabel: '��������'
	          },{
		         xtype: 'textfield',
		         name: 'passwordeditdate',
		         readOnly:true,
		         fieldLabel: '�����޸�����'
	          },{
		         xtype: 'textfield',
		         name: 'Password_valid',
		         readOnly:true,
		         fieldLabel: '������Ч����'
	          },{
		         xtype: 'textarea',
		         name: 'managerorg',
		         readOnly:true,
		         fieldLabel: '��Ͻ����',
		         height:100
	         },{
	 	         xtype: 'textarea',
		         name: 'describe',
		         readOnly:true,
		         fieldLabel: '����'
	      }]
      }); 
	      	
    	var infoWin = CC.create({
			xtype:'s_window',
			height: 480,
			width: 550,
			layout: 'fit',
			title:'��������',	
			closable: true,
			closeAction: 'hide',
			items:[infoFormPanel],
			buttonAlign: 'center',
			modal:true,
			buttons :[{
                 text:'ȷ��',
                 cls:'formPanelButton',
                 //iconCls:'back',
                 handler : function(){	
                       infoWin.hide();
                 }}]
	    });
	    infoWin.show();
	    infoFormPanel.getForm().load({	
		waitTitle : '��ʾ��Ϣ',
		waitMsg : 'ϵͳ���ڴ������Ե�...',
		url : Ext.getPath()	+ '/MyWorkController/MyWorkUserinfo',		
		success: function(form,action) {
			var data = action.result.data;
			infoFormPanel.getForm().findField('Password_valid').setValue(valid);
		},
		failure: function(form,action) {
			MSG.error('����ʧ�ܣ�����ϵ����Ա');
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
			    fieldLabel: '�û�ID'
	        },{
				xtype: 'textfield',
		        name: 'oldpassword',
		        allowBlank:false,
		        inputType:'password',
		        width:250,
			    fieldLabel: '������'
	        },{
				xtype: 'textfield',
		        name: 'newpassword1',
		        allowBlank:false,
		        inputType:'password',
		        width:250,
			    fieldLabel: '������'
	        },{
				xtype: 'textfield',
		        name: 'newpassword2',
		        inputType:'password',
		        allowBlank:false,
		        width:250,
			    fieldLabel: 'ȷ��������'
	        }]
           }); 
	      	
    	var updatePassWin = CC.create({
			xtype:'s_window',
			height: 230,
			width: 500,
			layout: 'fit',
			title:'�޸�����',	
			closable: true,
			closeAction: 'hide',
			items:[updatePassFormPanel],
			buttonAlign: 'center',
			modal:true,
			buttons :[{
	        	text:'�ύ',
	        	handler:function(){
	        	    if(!updatePassFormPanel.getForm().isValid()) {
							Ext.Msg.alert('������Ϣ',"����δ��д��Ϣ,����д��");
							return;
					};
					if(updatePassFormPanel.getForm().findField('newpassword1').getValue()!=updatePassFormPanel.getForm().findField('newpassword2').getValue()){
							Ext.Msg.alert('������Ϣ',"������ȷ�����벻һ�£���ȷ�ϣ�");
							return;
					}
					if(updatePassFormPanel.getForm().findField('newpassword1').getValue()==updatePassFormPanel.getForm().findField('oldpassword').getValue()){
							Ext.Msg.alert('������Ϣ',"���������������벻ͬ����ȷ�ϣ�");
							return;
					}
	        	   updatePassFormPanel.getForm().submit({  
								url :Ext.getPath()+ '/systemUserController/sysUserPasswordSubmit',
								method : 'POST',
								success : function(form,action) {
										Ext.Msg.alert('��ʾ',"�޸ĳɹ�",function() {
												//window.location.href = 'systemAction.do?method=sysUserPassword';
												updatePassWin.hide();
										});
								},
								failure : function(form,action) {
									 Ext.MessageBox.alert("��ʾ",action.result.errorMessage,
											function() {
												//window.location.href = 'systemAction.do?method=sysUserPassword';
											});  
								}
				  });
				}
	        },{
	        	text:'����',
	        	handler:function(){
	        	    var userid = updatePassFormPanel.getForm().findField('edituserid').getValue();
	        		updatePassFormPanel.getForm().reset();
	        		updatePassFormPanel.getForm().findField('edituserid').setValue(userid);
	        	}
	        }]
	    });
	    updatePassWin.show();	 
	    updatePassFormPanel.getForm().load({	
		waitTitle : '��ʾ��Ϣ',
		waitMsg : 'ϵͳ���ڴ������Ե�...',
		url : Ext.getPath()	+ '/MyWorkController/MyWorkUserinfo',		
		success: function(form,action) {
			var data = action.result.data;
			updatePassFormPanel.getForm().findField('edituserid').setValue(data.userid);
		},
		failure: function(form,action) {
			MSG.error('����ʧ�ܣ�����ϵ����Ա');
		}
	  });   	   
    }
		
		
			// ����Ĳ˵�·������¼� ò�ƴ˷����Ѿ�����  ȫ�����õ���main.jsp ��contentMenuheadClick 
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
			function slideup(){//���ز˵�			
				$("#menu").slideUp(300);
				$("#content").css("left","45px");
			}
			jQuery(document).ready(function () {
				//���ϽǼӺŵ���¼������������˵�
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
		                <li style="list-style: none;margin:3px 0px 3px 10px;padding-left:10px;float:left;height:32px;line-height:32px;color:#FF8000;font-size:12px;border-left:1px solid #ddd;">֤�չ���ϵͳ V1.0</li>
		            </ul>
				</div>	
			
				<div id="logout" style="float:right;margin-right:0;padding:0;">					
					<a href="javascript:logout();" title="�˳�" ><img src="images/newFrame/logout.gif"/></a>
				</div>			
				<div style="float:right;font-size:80%;">
					���ã�<font style="font-weight:600;" color="#FF8000">${user.username}</font>
				</div>
			</div>
			<div id="main_menu" class="menu" style="top:50px;margin-top:50px;margin-left:50px;width:20%;">
				<ul>
					<li>֤�չ���
					<ul>
						<li>֤��������</li>
						<li>��˾����</li>
						<li>֤�չ���</li>
					</ul>
					</li>
					<li>ϵͳ����
					<ul>
						<li>ϵͳ��������</li>
						<li>�û�����</li>
						<li>�����޸�</li>
						<li>�û����</li>
						<li>ϵͳ����</li>
						<li>������־</li>
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
