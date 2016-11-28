package com.sunyard.dao;

import java.util.List;

import com.sunyard.bean.AdUser;

public interface AdUserDAO {
	
	 public AdUser getById(String userId);
	
	 /**
	 * @param userId 用户id
	 * @param loginFlag
	 */
	public void setLoginFlag(AdUser adUser);
		
	public void addUser(AdUser user) ;
	
	
	public void modifyUser(AdUser user) ;
	
	
	
	
	
	
	
	 public List<AdUser> getUser(); 
	
	 public AdUser getUser(AdUser user);
	 
	
	 public void insertUser(AdUser user);
	 
	 public int updateUser(AdUser user);
	 
	 public int deleteUser(Long id);
}
