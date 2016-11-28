package com.sunyard.util;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.sunyard.bean.AdUser;
import com.sunyard.util.JdbcUtil;

public class LoginFilter implements Filter {

	public void destroy() {
		// TODO Auto-generated method stub
	}

	public void doFilter(ServletRequest arg0, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException {
		HttpServletRequest request=(HttpServletRequest)arg0;
		HttpServletResponse response=(HttpServletResponse)arg1;
		
		String uri = request.getRequestURI().toLowerCase();
		//图片、样式文件等放行
		if( uri.endsWith(".jpg") || uri.endsWith(".gif") || uri.endsWith(".js")  
	        || uri.endsWith(".css") || uri.endsWith(".xml") || uri.endsWith(".html") 
	        || uri.endsWith(".htm") || uri.endsWith(".swf") || uri.endsWith(".xls")
	        || uri.endsWith(".png") || uri.endsWith(".ico") || uri.endsWith("wsdl")||uri.indexOf("webservice") != -1) {
			arg2.doFilter(arg0, arg1);
			return;
	    }
		
		
		//登录类放行
		if(uri.endsWith("/licence/")
				|| uri.indexOf("/logincontroller/") != -1 
				|| uri.indexOf("/adorgtbcontroller/") != -1 
				|| uri.indexOf("/adlicencecontroller/") != -1 
				||uri.indexOf("/loadresourcescontroller/") != -1 
				||uri.indexOf("/utilcontroller/") != -1 ) {
			arg2.doFilter(arg0, arg1);
			return;
		}
		
		HttpSession session=request.getSession();
		AdUser user=(AdUser)session.getAttribute("user");
		
		if(user == null){	//session中user为null 或 处于登陆状态不可再登陆		
			if(uri.indexOf("app/logincontroller/loginout") != -1){  //用户session过期之后，点击退出直接跳到登录页，不用跳转到提示页
				RequestDispatcher rd = request.getRequestDispatcher("app/loginController/toLoginIndex");
				rd.forward(request, response);
				return;
			}
			String type = request.getHeader("X-Requested-With");
			
			if("XMLHttpRequest".equals(type)){
				response.setCharacterEncoding("utf-8");
				response.getWriter().write("{success:false,errorMessage:'您暂时不能访问该页面，请重新登陆后再进行操作。'}");
				return;
			}
			request.setAttribute("forward", "app/loginController/toLoginIndex");
			request.setAttribute("message","您暂时不能访问该页面，请重新登陆后再进行操作。");
			request.getRequestDispatcher("/message.jsp").forward(request,response);
			return;
		}else{
			Connection con=null;
			PreparedStatement ps=null;
			boolean isLogin = false;
			try {
				con=JdbcUtil.getConnection();
				ps=con.prepareStatement("select loginflag from aduser where userid='"+user.getUserid()+"'");
				ResultSet rs = ps.executeQuery();
				while(rs.next()) {
					isLogin = rs.getString("loginflag").equals("0")? false : true;
					break;
				}
			} catch (Exception e) {
				e.printStackTrace();
			} finally{
				JdbcUtil.release(ps);
				JdbcUtil.release(con);
			}
			if (!isLogin) {
				String type = request.getHeader("X-Requested-With");
				if("XMLHttpRequest".equals(type)){
					response.setCharacterEncoding("utf-8");
					response.getWriter().write("{success:false,errorMessage:'您暂时不能访问该页面，请重新登陆后再进行操作。'}");
					return;
				}
				
				request.setAttribute("forward", "app/loginController/toLoginIndex");
				request.setAttribute("message","您暂时不能访问该页面，请重新登陆后再进行操作。");
				request.getRequestDispatcher("/message.jsp").forward(request,response);
				return;
			}
			arg2.doFilter(arg0, arg1);
			return;
		}

	}

	public void init(FilterConfig arg0) throws ServletException {
		// TODO Auto-generated method stub

	}

}
