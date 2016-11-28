package com.sunyard.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdUser;
import com.sunyard.dao.AdUserDAO;
import com.sunyard.service.UserService;

@Service
@Transactional
public class AdUserServiceImpl extends BaseService implements UserService {
	
	@Autowired
	private AdUserDAO  adUserDAO;
	
	public AdUser getById(String  userId){
		
		return adUserDAO.getById(userId);	
	}
	
	/**
	 * @param userId 用户id
	 * @param loginFlag
	 */
	public void setLoginFlag(String  userId,Integer loginFlag) {
		AdUser user=new AdUser();
		user.setUserid(userId);
		user.setLoginflag(loginFlag);
		adUserDAO.setLoginFlag(user);
	}

	public void addUser(AdUser user) {
		adUserDAO.addUser(user);
	}
	
	
	public void modifyUser(AdUser user){
		adUserDAO.modifyUser(user);
	}

}
