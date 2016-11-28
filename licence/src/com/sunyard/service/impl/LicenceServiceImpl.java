package com.sunyard.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdLicCategory;
import com.sunyard.bean.AdLicence;
import com.sunyard.dao.AdLicenceCategoryDAO;
import com.sunyard.dao.AdLicenceDAO;
import com.sunyard.service.LicenceService;
import com.sunyard.util.StringUtil;

@Service
@Transactional
public class LicenceServiceImpl extends BaseService implements LicenceService  {

	@Autowired
	private AdLicenceDAO adLicenceDAO;
	
	@Autowired
	private  AdLicenceCategoryDAO adLicenceCategoryDAO;
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	public String addLicCategory(AdLicCategory lc) {
		String maxId="00";
		try{
			 maxId=jdbcTemplate.queryForObject(" select max(id) from adliccategory ",String.class);
		}catch(DataAccessException e){
			//忽略异常
			e.printStackTrace();
		}
		maxId=(maxId==null?"00":maxId);
		if(maxId=="99"||maxId.length()>2){
			throw new RuntimeException("证照种类超过99种，需要扩容，请联系科技人员！");
		}
		String id=StringUtil.buildNextIdStr((maxId), 2);
		lc.setId(id);
		adLicenceCategoryDAO.addLicCategory(lc);
		return id;
		
	}
	public void modifyLicCategory(AdLicCategory lc) {
		adLicenceCategoryDAO.modifyLicCategory(lc);
		
	}
	public AdLicCategory getLicenceCategoryById(String id) {
		return adLicenceCategoryDAO.getLicenceCategoryById(id);
	}

	public List<AdLicCategory>  getLicenceCategoryByName(String name) {
		return adLicenceCategoryDAO.getLicenceCategoryByName(name);
	}

	public List<AdLicCategory>  getAllLicCategory(){
		
		return adLicenceCategoryDAO.getAllLicCategory();
		
		
	}

	public String addLicence(AdLicence licence) {
		String maxId="0000000";
		try{
			 maxId=jdbcTemplate.queryForObject(" select max(id) from adlicence ",String.class);
		}catch(DataAccessException e){
			//忽略异常
			e.printStackTrace();
		}
		maxId=(maxId==null?"0000000":maxId);
		if(maxId=="9999999"||maxId.length()>7){
			throw new RuntimeException("证照数量超过9999999个，需要扩容，请联系科技人员！");
		}
		String id=StringUtil.buildNextIdStr(maxId,7);
		licence.setId(id);
		adLicenceDAO.addLicence(licence);
		return id;
		
	}
	
	public void addLicence(List<AdLicence> licences){
		String maxId="0000000";
		try{
			 maxId=jdbcTemplate.queryForObject(" select max(id) from adlicence ",String.class);
		}catch(DataAccessException e){
			//忽略异常
			e.printStackTrace();
		}
		maxId=(maxId==null?"0000000":maxId);		
		
		if(maxId=="9999999"||maxId.length()>7){
			throw new RuntimeException("证照数量超过9999999个，需要扩容，请联系科技人员！");
		}		
		String id=StringUtil.buildNextIdStr(maxId,7);
		
		for(AdLicence lic:licences){
			lic.setId(id);
			adLicenceDAO.addLicence(lic);
			id=StringUtil.buildNextIdStr(id,7);
		}
		

		
		
	}

	public AdLicence getLicenceById(String id) {
		return adLicenceDAO.getLicenceById(id);
	}

	public void modifyLicence(AdLicence licence) {
		adLicenceDAO.modifyLicence(licence);
		
	}

}
