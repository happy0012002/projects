<%@ page language="java" import="java.util.*" pageEncoding="GB18030" isELIgnored="false"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>"></base>
    
    <title>信息</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<LINK href="images/MasterPage.css" type=text/css rel=stylesheet>
	<link href="style/common.css" rel="stylesheet" type="text/css" />
	<link href="style/layout.css" rel="stylesheet" type="text/css" />
	<script language="JavaScript" src="js/function.js"></script>
	<script type="text/javascript" src="js/WebEnter.js"></script>
	<script type="text/javascript">
			var path='${pageContext.request.contextPath}';
			function toNext(){ 
				window.top.location.href=path+'/${forward}';
				/*if('loginIndex.jsp'=='${forward}')
				{
					
				}else{
					var jspPath = path+'/${forward}';
					if (jspPath.indexOf('app/auditCasesManageController/toManageIndex?caseType=') != -1) {
						window.parent.location.href = jspPath;
					} else {
						window.location.href = jspPath;
					}
				}*/
			}
		
	</script>
  </head>
  
  <body>
  	 <div class="item" >
	    <div class="Header" ><h3 id="WidTitle" >信息</h3> </div>
        <div class="content">
	    <table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" >
	      	<tr><td><br></td></tr>
	      	<tr>
	      		<td align="center" >${message}</td>
	      	</tr>
	      	<tr><td><br></td></tr>
	      	<tr>
	      	<c:choose>
	      	<c:when test="${'#'==forward}">
	      		<td align="center"></td>
	      	</c:when>
	      	<c:otherwise>
	      		<td align="center"><input type="button" class="btn" value="确定" onclick="toNext()"></td>
	      	</c:otherwise>
	      	</c:choose>
	      	</tr>
	    </table>
	  </div>
	</div>
  </body>
</html>
