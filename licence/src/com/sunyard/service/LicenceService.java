package com.sunyard.service;

import java.util.List;

import com.sunyard.bean.AdLicCategory;
import com.sunyard.bean.AdLicence;

public interface LicenceService {

	public AdLicCategory getLicenceCategoryById(String id);
	
	public List<AdLicCategory>  getLicenceCategoryByName(String name);
	
	public String addLicCategory(AdLicCategory lc);
	
	public List<AdLicCategory> getAllLicCategory();	
	
	public void modifyLicCategory(AdLicCategory lc);
	
	
	
	
	
	
	
	public AdLicence getLicenceById(String id);
	
	public String addLicence(AdLicence licence);
	
	public void addLicence(List<AdLicence> licences);
	
	
	public void modifyLicence(AdLicence licence);
	
}
