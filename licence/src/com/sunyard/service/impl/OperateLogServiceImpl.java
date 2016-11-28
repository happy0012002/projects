package com.sunyard.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdOperateLog;
import com.sunyard.dao.AdOperateLogDAO;
import com.sunyard.service.OperateLogService;


@Service
@Transactional
public class OperateLogServiceImpl  implements OperateLogService {
	
	@Autowired
	private AdOperateLogDAO  adOperateLogDAO;

	public void  saveLog(AdOperateLog log) {
		adOperateLogDAO.saveLog(log);
	}

}
