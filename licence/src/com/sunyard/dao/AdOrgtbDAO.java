package com.sunyard.dao;

import java.util.List;

import com.sunyard.bean.AdOrgtb;

public interface AdOrgtbDAO {

	
	public AdOrgtb getById(String orgId);
	
	public List<AdOrgtb>  getAll();
	
	public List<AdOrgtb> getByOrgName(String orgName);
	
	public void addAdOrgtb(AdOrgtb adOrgtb);
	
	public void modify(AdOrgtb adOrgtb);
}
