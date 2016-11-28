<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page language="java" import="com.sunyard.util.Consts" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>"></base>    
    <title></title>    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">  
	<script type="text/javascript" src="<%=path %>/app/loadResourcesController/loadAllJavaScript"></script>
	<script type="text/javascript" charset="utf-8" src="<%=path %>/js/user/system/sysErrorLog.js"></script>	
	<script type="text/javascript" charset="utf-8" src="<%=path %>/js/common/prevent_backspaceEvent.js"></script>
	<script type="text/javascript">
		var pageRecorder=<%=Consts.eachPageCount %>;
	</script>
	
	<style type="text/css">
		.add {
			background-image: url(js/extjs/resources/images/icons/fam/add.png) !important;
		}
		.delete {
	        background-image:url(js/extjs/resources/images/icons/fam/delete.gif) !important;
	    }
	    .arrow_left {
	        background-image:url(js/extjs/resources/images/icons/fam/arrow_left.png) !important;
	    }
	     .import {
	        background-image:url(js/extjs/resources/images/icons/fam/publish.png) !important;
	    }	    
	    	    
	</style>	
  </head>
  
  <body>
  </body>
</html>
