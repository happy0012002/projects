package com.sunyard.util;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Category;





public class AuditInit extends HttpServlet {

	private final Category log=Category.getInstance("licence");
	Map <String,String> map= new HashMap();
	   
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		req.getRequestDispatcher("login.jsp").forward(req, resp);
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		this.doPost(req, resp);
	}


	@Override
	public void destroy() {
		
	}

	
	
	@Override
	public void init() throws ServletException {
		//清理临时目录
		String tempPath=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR);
		FileUtil.deleteFolderChildren(new File(tempPath));
		
		
		Properties prop = new Properties();
	    try {
	    	prop.load(AuditInit.class.getClassLoader().getResourceAsStream("config.properties"));     
	    } catch (FileNotFoundException e) {
	    	log.error("Ftp client config file not found!fileName=[config.properties ]" ,e);
	    } catch (IOException e) {
	    	log.error("Ftp client config file I/O error!fileName=[config.properties]" ,e);
	    }
	   
		
	    // 系统路径
	    Consts.SYSPATH = getServletContext().getRealPath("");
	    Consts.Driver_Name=prop.getProperty("Driver_Name");
	    Consts.URL=prop.getProperty("URL");
	    Consts.UserName=prop.getProperty("UserName");
	    Consts.Password=prop.getProperty("Password");
	  
	    
	    
	    
	    Connection con=null;
	    PreparedStatement ps=null;
	    try {
	    	con=JdbcUtil.getConnection();
	    	if(con==null){
	    		
	    	}
			ps=con.prepareStatement("update aduser set loginflag=0 where loginflag<>0");
			ps.execute();
		} catch (SQLException e) {
			log.error("初始化用户登陆状态出错。系统初试化失败。",e);
			
		}finally{
			JdbcUtil.release(ps);
		}
		
		
		PreparedStatement param=null;
		ResultSet rs = null;
		
	    try {
	    	con=JdbcUtil.getConnection();
	    	param=con.prepareStatement("select paramname,paramvalue from adsysparamtb ");
			rs = param.executeQuery();

			while (rs.next()) {
				int index = 1;
				String[] temp = new String[2];
				for (int i = 0; i < temp.length; i++) {
					temp[i] = String.valueOf(rs.getObject(index));
					index++;
				}
				map.put(temp[0].trim(), temp[1].trim());
			}
		} catch (SQLException e) {
			log.error("初始化系统参数出错。系统初试化失败。",e);
		}finally{
			JdbcUtil.release(rs);
			JdbcUtil.release(ps);
			JdbcUtil.release(con);
		}
		
		Consts.IMGSTORE=map.get("imgstore");
		if(map.containsKey("eachPageCount")){
			Consts.eachPageCount=Integer.valueOf(map.get("eachPageCount"));
		}
		
		if(map.containsKey("enddate")){
			Consts.enddate=map.get("enddate").toString();
		}
		
		  System.out.println(Consts.IMGSTORE+"||"+Consts.SYSPATH);
	}
}
