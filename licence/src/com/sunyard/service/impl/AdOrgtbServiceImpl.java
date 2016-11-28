package com.sunyard.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdOrgtb;
import com.sunyard.dao.AdOrgtbDAO;
import com.sunyard.service.AdOrgtbService;
import com.sunyard.util.Consts;
import com.sunyard.util.StringUtil;

@Service
@Transactional
public class AdOrgtbServiceImpl  extends BaseService implements AdOrgtbService {
	@Autowired
	private AdOrgtbDAO adOrgtbDAO;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public String addAdOrgtb(AdOrgtb adOrgtb) {
		String maxId="00000";
		try{
			 maxId=jdbcTemplate.queryForObject(" select max(id) from adorgtb ",String.class);
		}catch(DataAccessException e){
			//忽略异常
			e.printStackTrace();
		}
		maxId=(maxId==null?"00000":maxId);
		if(maxId=="99999"||maxId.length()>5){
			throw new RuntimeException("公司数量超过99999个，需要扩容，请联系科技人员！");
		}
		adOrgtb.setId(StringUtil.buildNextIdStr(maxId,5));//设置id
		
		adOrgtbDAO.addAdOrgtb(adOrgtb);
		return adOrgtb.getId();
	}

	/**
	 * 批量添加公司
	 */
	public void addAdOrgtb(List<AdOrgtb> adOrgtbs){
		String maxId="00000";
		try{
			 maxId=jdbcTemplate.queryForObject(" select max(id) from adorgtb ",String.class);
		}catch(DataAccessException e){
			//忽略异常
			e.printStackTrace();
		}
		maxId=(maxId==null?"00000":maxId);
		if(maxId=="99999"||maxId.length()>5){
			throw new RuntimeException("公司数量超过99999个，需要扩容，请联系科技人员！");
		}
		maxId=StringUtil.buildNextIdStr(maxId,5);
		
		for(AdOrgtb org:adOrgtbs){			
			org.setId(maxId);			
			maxId=StringUtil.buildNextIdStr(maxId,5);
			adOrgtbDAO.addAdOrgtb(org);
			
		}
	}
	
	
	
	public List<AdOrgtb> getByOrgName(String orgName){
		return adOrgtbDAO.getByOrgName(orgName);
	}
	
	public AdOrgtb getById(String orgId) {
		return adOrgtbDAO.getById(orgId);
	}

	public List<AdOrgtb>  getAll(){
		return adOrgtbDAO.getAll();
	}
	
	public void modify(AdOrgtb adOrgtb) {
		adOrgtbDAO.modify(adOrgtb);
		
	}

	
	/**
	 * 删除机构  连通机构下面的证照全部删除
	 */
	public void delOrg(AdOrgtb adOrgtb){
		adOrgtb.setDelflag(Consts.DELFLAG_DEL);
		this.modify(adOrgtb);
		this.jdbcTemplate.update("update adlicence set delflag="+Consts.DELFLAG_DEL+" where orgid='"+adOrgtb.getId()+"'");
		
	}
	

}
