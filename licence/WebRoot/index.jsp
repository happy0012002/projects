<%@ page language="java" import="java.util.*" pageEncoding="utf-8" isELIgnored="false"%>
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
		
		<link href="style/newFrame/index.css" rel="stylesheet" type="text/css" />
		<link href="style/newFrame/main.css" rel="stylesheet" type="text/css" />
		<link href="style/newFrame/head-manu.css" rel="stylesheet" type="text/css" />
		
		<script type="text/javascript" src="<%=path %>/app/loadResourcesController/loadAllJavaScript"></script>
	
		<script src="js/newFrame/jquery-1.11.2.min.js" type="text/javascript"></script>
		<script src="js/newFrame/index.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			var path='${pageContext.request.contextPath}';
			function changemain_right(id){
				if(id==2){
					document.getElementById('main_right').src="app/adOrgtbController/toOrgIndex";
				}else{
					document.getElementById('main_right').src="app/adOrgtbController/toOrgIndex";
				}
			}
			function logout(){
				Ext.MessageBox.buttonText.yes = "确定";
				Ext.MessageBox.buttonText.no = "取消";  
				Ext.MessageBox.minWidth = 200;  
				Ext.MessageBox.confirm("用户确认","确定要退出系统吗?",function(btn) {
	      			if(btn == "yes") {
	      				var version = (new Date()).getTime();
						window.top.location.href=path+"/app/loginController/loginout?version="+version;
	      			}
	   			});
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
			
			// 上面的菜单路径点击事件
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
				
				//左侧菜单点击事件
				$("#left-menu a").click(function(event,secondprivid){
					var name = $(this).attr("name");
					$("#left-menu i.current").removeClass("current");
					$(this).find("i").addClass("current");
					if(name == 'COMP_QUERY'){
						if( $("#menu").css("display")=='block' ){
							$("#menu").slideUp(300);
							$("#content").css("left","45px");
						}
						ShowMain('app/adOrgtbController/toOrgIndex','1','','','','','','');
					}else if(name == 'EXIT'){
						logout();
					}else if(name == 'TOMGR'){	
						window.location.href='app/loginController/toLoginIndex';
					}else if(name == 'LICENCE_QUERY'){
						ShowMain('app/adLicenceController/toAllLicenceQueryTab','1','','','','','','');
					}else{
						if( $("#menu").css("display")=='none' ){
							$("#menu").slideDown(300);
						}
						ShowSecondManu(name,secondprivid);
					}
					event.stopPropagation();
					
				});
				
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
				
				
				
			});
		</script>
		
	</head>

	<body>	
		<div id="left-menu" class="left-menu">
				<ul>
				<li></li>
				<c:set var="user" scope="session" value="${user}" />
				<c:if test="${user==null}">	
	            <li><a name="COMP_QUERY" href="javascript:void(0);" title="公司查询"><i class="icon-home"></i></a></li>	
	            <li><a name="LICENCE_QUERY" href="javascript:void(0);" title="证照查询"><i class="icon-fxcsj"></i></a></li>	
	            <li><a name="TOMGR" href="javascript:void(0);" title="后台管理"><i class="icon-zsk"></i></a></li>
	            </c:if>
	            
	            
	            <c:if test="${user!=null}">
				<li><a name="GSGL1" href="javascript:void(0);" title="公司及证照管理"><i class="icon-sjxxgl"></i></a></li>
				<li><a name="XTSZ1" href="javascript:void(0);" title="系统设置"><i class="icon-jcgl"></i></a></li>
	            <li><a name="EXIT" href="javascript:void(0);" title="退出"><i class="icon-logout"></i></a></li>
	            </c:if>
        	</ul>
		</div>	
		<div id="menu" class="menu">
			<iframe id="second_menu" 
                       class = "second_menu"
                       name="second_menu" 
                       frameborder="0" 
                       src="" 
                       scrolling="auto">
            </iframe>
		</div>
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
				
				<c:if test="${user!=null}">
				<div style="float:right;font-size:80%;">
					您好，<font style="font-weight:600;" color="#FF8000">${user.username}</font>！
					&nbsp;&nbsp;&nbsp;
				</div>
				</c:if>		
				
			</div>
			<div class="content-menuhead" id="content-menuhead">
				<span id="topmenu" class="topmenu"></span> > 
				<span id="secondmenu" class="secondmenu"></span> > 
				<span id="thridmenu" class="thridmenu"></span>
			</div>
			<div id="main_right_frame" class="content-main" style="overflow:hidden;">
				<iframe id="main_right" 
	                       class = "info"
	                       name="main_right" 
	                       frameborder="0" 
	                       src="app/loginController/welcome" 
	                       scrolling="no" >
	            </iframe>
            </div>
		</div>


  	<div id="imgdiv">
  	<iframe id="imgid" src="" marginwidth="0" marginheight="0" frameborder="0" width="400" height="400" scrolling="auto"></iframe>
  	</div>
  </body>
</html>
