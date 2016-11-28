package com.sunyard.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdDicinfo;
import com.sunyard.dao.AdDicinfoDAO;
import com.sunyard.service.AdDicinfoService;

@Service
@Transactional
public class AdDicinfoServiceImpl extends BaseService implements AdDicinfoService {
	
	@Autowired
	private AdDicinfoDAO adDicinfoDAO;

	public List<AdDicinfo> getByFieldname(String fieldName){
		return adDicinfoDAO.getByFieldname(fieldName);
	}
	
	public AdDicinfo getById(String fieldName,String code){
		return adDicinfoDAO.getById(fieldName,code);
		
	}
}
