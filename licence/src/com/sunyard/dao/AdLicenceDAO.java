package com.sunyard.dao;

import org.springframework.dao.DataAccessException;

import com.sunyard.bean.AdLicence;
import com.sunyard.util.StringUtil;

public interface AdLicenceDAO {
	
	public void addLicence(AdLicence licence);

	public AdLicence getLicenceById(String id);

	public void modifyLicence(AdLicence licence);
	

}
