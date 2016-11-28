package com.sunyard.service;

import java.util.List;

import com.sunyard.bean.AdDicinfo;

public interface AdDicinfoService {
	
	
	public List<AdDicinfo> getByFieldname(String fieldName);
	
	public AdDicinfo getById(String fieldName,String code);

}
