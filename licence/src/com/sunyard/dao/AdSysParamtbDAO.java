package com.sunyard.dao;

import java.util.List;

import com.sunyard.bean.AdSysParamtb;
import com.sunyard.bean.param.PageParam;

public interface AdSysParamtbDAO {

	
	public AdSysParamtb getById(Integer id) ;	
	
	
	public void modify(AdSysParamtb adSysParamtb);
	
	public AdSysParamtb getByParamName(String paramname);
	
	
	
	
	public void add(AdSysParamtb adSysParamtb);
	public List<AdSysParamtb> pageList(PageParam pageParam);
}
