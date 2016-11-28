package com.sunyard.service.impl;

import org.apache.log4j.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdOperateLog;
import com.sunyard.service.OperateLogService;
import com.sunyard.util.ConstsMethod;

@Service
@Transactional
public class BaseService {
	
	@Autowired
	private OperateLogService operateLogService;
	
	public static final  Category log=Category.getInstance("licence");
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
}
