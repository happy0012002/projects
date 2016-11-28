package com.sunyard.service;

import com.sunyard.bean.AdSysParamtb;

public interface SysParamService {
	
	
	public void modify(AdSysParamtb adSysparamtb);
	
	
	public AdSysParamtb getById(Integer id);
	
	public AdSysParamtb getByParamName(String paramname);
}
