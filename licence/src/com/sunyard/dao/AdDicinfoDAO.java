package com.sunyard.dao;

import java.util.List;

import com.sunyard.bean.AdDicinfo;

public interface AdDicinfoDAO {

	
	public AdDicinfo getById(String fieldName,String code);
	
	
	public List<AdDicinfo> getByFieldname(String fieldName);
	
	
	public List<AdDicinfo> getByParentFieldname(String parentFieldName);
	
	
	public List<AdDicinfo> getByParentCode(String parentFieldName,String parentCode);
	
	
	public void add(AdDicinfo adDicinfo);
	
	
	public void modify(AdDicinfo adDicinfo);
	
	
	
	public void deleteByFieldname (String fieldname);
	
	
	
	public void delete(String fieldname,String code);
	
	
	
	public void deleteByParentFieldname(String parentFieldname);
	
	
	
	public void deleteByParentcode(String parentFieldname,String parentCode);
}
