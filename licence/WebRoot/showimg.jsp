<%@ page language="java" import="java.util.*" pageEncoding="UTF-8" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

String licId=request.getParameter("licId");
%>
 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>"></base>
    
    <title>证照图片</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">  

	<script type="text/javascript" src="<%=path %>/app/loadResourcesController/loadAllJavaScript"></script>
	
	<script type="text/javascript">
		var pageRecorder=10;
		var path=Ext.getPath();
		var id='${requestScope.licId}';
		function preimg(id){
			document.getElementById("imgshow").src=Ext.getPath()+"/productController/downloadImg?id="+id;
		}
		function showimg(){		
			document.getElementById("imgshow").src=Ext.getPath()+"/adLicenceController/downloadImg?id="+id;
		
		}		
		
		
	</script>
	
	<style type="text/css">

	    body{
	    	text-align:center;	
	    	margin-top:2px;   
	    	color:#666;
	    }
	   
	</style>
	
	
  </head>
  
  <body onload="showimg()">
  	
  	<img id="imgshow" src="" >
	
  </body>
</html>
