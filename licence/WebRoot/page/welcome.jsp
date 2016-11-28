<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ page import="com.sunyard.util.Consts" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title></title>
<script type="text/javascript">
	var path='${pageContext.request.contextPath}';
</script>
<style type="text/css">
body{
	text-align:center;
	color:#1C7DA6;
}
.index{
	font:26px bold;
	
}

.mgr{
	font:26px bold;
	
}
</style>
</head>
<body>
<div style="height:550px;background:url(<%=path %>/js/extjs/resources/images/organize/background.png) repeat-x;">
<c:set var="user" scope="session" value="${user}" />
	<c:if test="${user==null}">	
	<br>
<br>
<br>
<br>
<br>
<br>
 		<span class="index"><h1>欢迎使用证照管理系统</h1></span>
	</c:if>
	
	<c:if test="${user!=null}">	
	<br>
<br>
<br>
<br>
<br>
<br>
		<span class="mgr"><h1>欢迎登录证照管理系统后台</h1></span>
	</c:if>
   </div>
</body>
</html>