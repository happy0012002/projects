package com.sunyard.service;

import com.sunyard.bean.AdOperateLog;

public interface OperateLogService{
	
	/**
	 * 
	 * @param userId 用户id
	 * @return
	 */
	public void  saveLog(AdOperateLog log) ;
	
	
}
