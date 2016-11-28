package com.sunyard.util;

import java.sql.Connection;
import java.sql.PreparedStatement;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import com.sunyard.bean.AdUser;


public class UserListener implements HttpSessionListener {


	public void sessionCreated(HttpSessionEvent event) {
		// TODO Auto-generated method stub
	}

	public void sessionDestroyed(HttpSessionEvent arg0) {
		HttpSession session=arg0.getSession();
		
		AdUser user=(AdUser)session.getAttribute("user");
		if(null==user){
			return;	
		}
		
		Connection con=null;
		PreparedStatement ps=null;
		try {
			con=JdbcUtil.getConnection();
			ps=con.prepareStatement("update aduser set loginflag=0 where userid='"+user.getUserid()+"'");
			ps.execute();
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			JdbcUtil.release(ps);
			JdbcUtil.release(con);
			session.removeAttribute("user");
		}
	}

}
