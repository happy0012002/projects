package com.sunyard.service;

import java.util.List;

import com.sunyard.bean.AdOrgtb;

public interface AdOrgtbService {

	public AdOrgtb getById(String orgId);
	
	public List<AdOrgtb> getAll();
	
	
	public List<AdOrgtb> getByOrgName(String orgName);
	
	public String addAdOrgtb(AdOrgtb adOrgtb);
	
	public void addAdOrgtb(List<AdOrgtb> adOrgtbs);	
	
	public void modify(AdOrgtb adOrgtb);
	
	
	
	public void delOrg(AdOrgtb adOrgtb);
	
}
