package com.sunyard.service;

import java.util.List;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sunyard.bean.AdUser;

public interface UserService {
	
	/**
	 * 
	 * @param userId 用户id
	 * @return
	 */
	public AdUser getById(String  userId) ;
	
	
	/**
	 * @param userId 用户id
	 * @param loginFlag
	 */
	public void setLoginFlag(String  userId,Integer loginFlag) ;
	
	
	
	
	public void addUser(AdUser user) ;
	
	
	public void modifyUser(AdUser user) ;
}
