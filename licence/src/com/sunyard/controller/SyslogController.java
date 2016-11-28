package com.sunyard.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.sunyard.bean.AdLicence;
import com.sunyard.bean.AdOperateLog;
import com.sunyard.bean.AdUser;
import com.sunyard.extjs.pagination.PaginationBeanParam;
import com.sunyard.extjs.store.JsonData;
import com.sunyard.extjs.util.ExcelExport;
import com.sunyard.filter.LicenceLogfileFilter;
import com.sunyard.filter.TomcatLogfileFilter;
import com.sunyard.util.Consts;
import com.sunyard.util.ConstsMethod;
import com.sunyard.util.FileUtil;
import com.sunyard.util.StringUtil;
import com.sunyard.util.ZIPUtil;


@Controller
@RequestMapping(value = "/syslogController")
@SessionAttributes("user")
public class SyslogController extends BaseController {

	@RequestMapping(value = "/toSysLog")
	public String toSysLog(){
		return "page/system/syslogTab";
	}
	
	/**
	 * 操作日志
	 * @return
	 */
	@RequestMapping(value = "/toOperateLog")
	public String toOperateLog(){		
		return "page/system/operateLog";
	}
	
	/**
	 * 错误日志
	 * @return
	 */
	@RequestMapping(value = "/toSysErrorLog")
	public String toSysErrorLog(){
		return "page/system/sysErrorLog";
	}
	
	
	
	@RequestMapping("/getAdOperateLogData")
	@ResponseBody
	public JsonData getAdOperateLogData(PaginationBeanParam param,AdOperateLog operateLog){
		JsonData jd=new JsonData();
		try{
			String sql="select a.*,b.username, c.content from adoperatelog a,aduser b,addicinfo c  where a.userid=b.userid and (c.fieldname='"+Consts.SYSLOG_FIELDNAME+"' and c.code=a.operatecategory ) ";
		
			if(StringUtil.isNotNull(operateLog.getUserid()))	{
				sql+=" and a.userid ='"+operateLog.getUserid()+"'";
			}
			if(StringUtil.isNotNull(operateLog.getOperatecategory()))	{
				sql+=" and a.operatecategory='"+operateLog.getOperatecategory()+"'";
			}			
			
			if(StringUtil.isNotNull(operateLog.getOperatecontent()))	{
				sql+=" and a.operatecontent like'%"+operateLog.getOperatecontent()+"%'";
			}
			
			
			if(StringUtil.isNotNull(operateLog.getOperatetimelt()))	{
				sql+=" and a.operatetime <= '"+operateLog.getOperatetimelt().trim()+" 23:59:59'";
			}
			if(StringUtil.isNotNull(operateLog.getOperatetimeeq()))	{
				sql+=" and a.operatetime like '%"+operateLog.getOperatetimeeq()+"%'";
			}
			if(StringUtil.isNotNull(operateLog.getOperatetimegt()))	{
				sql+=" and a.operatetime >='"+operateLog.getOperatetimegt().trim()+" 00:00:00'";
			}
			
			
			param.setSql(sql);
			if(StringUtil.isNull(param.getSort())){
				param.setSort("operatetime");
				param.setDir(" desc ");
			}
			
			jd=this.paginationTemplate.getJsonData(param);
		}catch(Exception e){
			log.error("",e);
		}
		return jd;
	}
	
	
	/**
	 * 证照信息导出
	 * @param param
	 * @param licence
	 * @param response
	 */
	@RequestMapping("/getAdOperateLogData/export")
	public void getAdOperateLogDataExport(PaginationBeanParam param,AdOperateLog operateLog,HttpServletResponse response){
		if(param.getLimit().intValue()==10000){//导出全部
			param.setLimit(60000);
			param.setMaxlimit(60000);
		}
		JsonData jd=this.getAdOperateLogData(param, operateLog);	
		ExcelExport.createExcel(param.getExportFileName(), param.getExportFields(), jd, response);
		
	}
	
	@RequestMapping(value="/downloadLog")
	public void downloadLog(@ModelAttribute("user") AdUser user,String type,String begindate,String enddate,HttpServletResponse response,HttpServletRequest request){		
		response.reset();
		try {
			
			response.setHeader("Content-disposition", "attachment;" +
					" filename=" + java.net.URLEncoder.encode(Consts.LOG_DIR+".zip", "UTF-8"));
			response.setContentType("application/ostet-stream"); 
			List<String> newLogfileDates=new ArrayList<String>();
			Calendar begin= Calendar.getInstance();
			if("1".equals(type)){//今天
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));				
			}else if("2".equals(type)){//最近三天
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));//今天
				begin.add(Calendar.DAY_OF_YEAR, -1);
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));//昨天
				begin.add(Calendar.DAY_OF_YEAR, -1);
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));//前天
			}else if("3".equals(type)){//最新5天
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));
				begin.add(Calendar.DAY_OF_YEAR, -1);
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));
				begin.add(Calendar.DAY_OF_YEAR, -1);
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));
				begin.add(Calendar.DAY_OF_YEAR, -1);
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));
				begin.add(Calendar.DAY_OF_YEAR, -1);
				newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));
			}else if("4".equals(type)){//自定义
				begin.setTime(Consts.yyyy_MM_dd.parse(begindate));
				Calendar end= Calendar.getInstance();
				end.setTime(Consts.yyyy_MM_dd.parse(enddate));
				long days=(end.getTimeInMillis()-begin.getTimeInMillis())/(1000*3600*24);
				newLogfileDates.add(begindate);
				for(long i=0;i<days;i++){
					begin.add(Calendar.DAY_OF_YEAR, 1);
					newLogfileDates.add(Consts.yyyy_MM_dd.format(begin.getTime()));
				}
			}
			
			
			String tempPath=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),Consts.LOG_DIR);
			String tempUserDir=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid());	
			FileUtil.prepareDir(tempUserDir);
			
			new File(tempPath).mkdirs();
			
			//拷贝tomcat/logs 下面的日志
			
			String tomcatLogsPath=tempUserDir.substring(0,tempUserDir.indexOf("webapps"))+"logs";
			File tomcatLogsDir=new File(tomcatLogsPath);
			String[] filePaths=tomcatLogsDir.list(new TomcatLogfileFilter(newLogfileDates));
			for(String s:filePaths){
				
				FileUtil.copyFileToDirectory(tomcatLogsPath+File.separator+s, tempPath);
			}
			
			//拷贝licence\log 下面的日志
			String licenceLogPath=ConstsMethod.getWebServerFilePath(Consts.LOG_DIR);	
			filePaths=new File(licenceLogPath).list(new LicenceLogfileFilter(newLogfileDates));
			
			for(String s:filePaths){
				FileUtil.copyFileToDirectory(licenceLogPath+File.separator+s, tempPath);				
			}
			
			String zipFilePath=tempUserDir+File.separator+Consts.LOG_DIR+".zip";
			ZIPUtil.zip(tempPath, zipFilePath);
			this.write(response.getOutputStream(), zipFilePath);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("",e);
		}
	}
	
	
	
}
