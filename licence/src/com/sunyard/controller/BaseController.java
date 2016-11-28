package com.sunyard.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;

import com.sunyard.bean.AdOperateLog;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.extjs.controller.AbstractExtBaseController;
import com.sunyard.service.OperateLogService;
import com.sunyard.util.ConstsMethod;



@Controller
@SuppressWarnings("deprecation")
public abstract class BaseController extends AbstractExtBaseController {

	public static final  Category log=Category.getInstance("licence");
	@Autowired
	private OperateLogService operateLogService;

	
	@Resource(name="JdbcTemplate")
	protected JdbcTemplate jdbcTemplate;	
	

	
	@Resource(name="paginationBeanHelperTemplate")
	protected NewPaginationBeanHelperTemplate paginationTemplate;
	
	/**
	 * 没有调用
	 * @param servletResponse
	 * @param ret
	 * @throws IOException
	 */
	public void buildAndWriteUploadResponse(
			final HttpServletResponse servletResponse, ExtFormResult<?> ret)
			throws IOException {
		servletResponse.setContentType("text/html;charset=UTF-8");
		PrintWriter out = servletResponse.getWriter();
		String responseJson = com.sunyard.util.JacksonUtil.serializeObjectToJson(ret);
		out.write("<html><body><textarea>");
		out.write(responseJson.replaceAll("&quot;", "\\&quot;"));
		out.write("</textarea></body></html>");
		out.flush();
		out.close();
	}
	
	/**
	 *  保存日志
	 * @param userId
	 * @param operateContent 不能超过1000个字
	 * @param type  查询 addicinfo  的 fieldname=SyslogType
	 */
	public void saveOperateLog(String userId,String operateContent,String type){
		
		AdOperateLog operateLog=new AdOperateLog();
		if(operateContent.length()>1000){
			operateContent=operateContent.substring(0,1000);
		}
		operateLog.setOperatecategory(type);
		operateLog.setOperatecontent(operateContent);
		operateLog.setOperatetime(ConstsMethod.getCurrentTime());
		operateLog.setUserid(userId);
		try{
			operateLogService.saveLog(operateLog);
		}catch(Exception e){//忽略异常 为了不影响主功能
			e.printStackTrace();
			log.error("保存日志失败！",e);
		}
		
	}
	
	/**
	 * 
	 * @param os
	 * @param filePath
	 */
	public void write(OutputStream os,String filePath){
		FileInputStream fis=null;
		try{
			fis= new FileInputStream(new File(filePath));
			byte[] buf = new byte[1024]; 
	    	int count=0;
	    	while((count = fis.read(buf))>-1){
	    		os.write(buf,0,count);
	    	}
		}catch(Exception e){
			log.error("",e);
		}finally{
			try {
				fis.close();
				
			} catch (IOException e) {
				
				e.printStackTrace();
				log.error("",e);
			}finally{
				try {
					os.close();
				} catch (IOException e) {
					e.printStackTrace();
					log.error("",e);
				}	
				
			}
	    	
		}
    	
	}

}
