<%@ page language="java" import="java.util.*" pageEncoding="GBK" isELIgnored="false"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ path + "/";
%>

<!DOCTYPE html>
<html lang="en">
<html>
	<head>
		<base href="<%=basePath%>">

		<title>My JSP 'index.jsp' starting page</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

		<link href="style/newFrame/jquery-accordion-menu.css" rel="stylesheet" type="text/css" />

		<script src="js/newFrame/jquery-1.11.2.min.js" type="text/javascript"></script>
		<script src="js/newFrame/jquery-accordion-menu.js" type="text/javascript"></script>
		
		<script type="text/javascript">
			var secondMenuHtml = '${requestScope.secondMenuHtml}';
			var secondprivid='${requestScope.secondprivid}';
			//var secondMenuHtml = '<ul id="demo-list"><li><a href="javascript:void(0);">预警管理</a><ul class="submenu"><li><a href="javascript:ShowMain(\'systemAction.do?method=MXSX_EXT\',\'2\');">预警专题管理</a></li></ul></li></ul>';
			
			function ShowMain(url,type,topname,topprivid,secondname,secondprivid,thridname,thridprivid) {
			    parent.ShowMain(url,type,topname,topprivid,secondname,secondprivid,thridname,thridprivid);
			}
			function  contentMenuheadClick(topprivid,secondprivid,thridprivid){
				parent.contentMenuheadClick(topprivid,secondprivid,thridprivid);
			}
			jQuery(document).ready(function () {
				$("#jquery-accordion-menu").html(secondMenuHtml);
				jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
				
				
				jQuery("#jquery-accordion-menu").bind('mouseleave',function(e){
					var x=e.screenX;
					var y=e.screenY;
					if(x>245){
						e.stopPropagation();
						e.preventDefault();
						parent.slideup();
					}else{
						return ;
					}
					
				
				});
			});
			
			$(function(){
				//隐藏菜单二级菜单切换
				$("#demo-list li").click(function(){
					$("#demo-list li.active").removeClass("active");
					$(this).addClass("active");
				});
				
				if(null!=secondprivid &&''!=secondprivid){
					$("#demo-list li").each(function(){					
						if($(this).attr('id')==secondprivid){
							$(this).click();
						}										
					});				
				}

			});
     		
		</script>
	
		
	</head>

	<body>
		<div class="menu white">
			<div class="jquery-accordion-menu-outer">
				<div id="jquery-accordion-menu" class="jquery-accordion-menu">
					
				</div>
			</div>
		</div>
	</body>
</html>
