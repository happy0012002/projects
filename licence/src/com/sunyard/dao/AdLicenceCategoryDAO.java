package com.sunyard.dao;

import java.util.List;

import com.sunyard.bean.AdLicCategory;

public interface AdLicenceCategoryDAO {

	public void addLicCategory(AdLicCategory lc);

	public void modifyLicCategory(AdLicCategory lc);

	public AdLicCategory getLicenceCategoryById(String id);

	public List<AdLicCategory> getLicenceCategoryByName(String name);

	public List<AdLicCategory>  getAllLicCategory();
}
