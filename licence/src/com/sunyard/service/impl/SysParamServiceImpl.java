package com.sunyard.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdSysParamtb;
import com.sunyard.dao.AdSysParamtbDAO;
import com.sunyard.service.SysParamService;

@Service
@Transactional
public class SysParamServiceImpl extends BaseService implements SysParamService {

	@Autowired
	private AdSysParamtbDAO adSysParamtbDAO;
	
	
	public AdSysParamtb getById(Integer id) {
		return adSysParamtbDAO.getById(id);
	}

	public void modify(AdSysParamtb adSysparamtb) {
		adSysParamtbDAO.modify(adSysparamtb);
		
	}
	public AdSysParamtb getByParamName(String paramname){
		return adSysParamtbDAO.getByParamName(paramname);
	}

}
