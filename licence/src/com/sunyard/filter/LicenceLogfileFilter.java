package com.sunyard.filter;

import java.io.File;
import java.io.FilenameFilter;
import java.util.List;
import com.sunyard.util.ConstsMethod;

public class LicenceLogfileFilter implements FilenameFilter{

	
	private List<String> needFilePattern=null;
	private String today=ConstsMethod.getCurrentDate();
	
	
	public boolean accept(File dir, String name) {
		
		for(String s:needFilePattern){
			if(!today.equals(s) && name.endsWith(s+".log")){
				return true;
			}else if(today.equals(s)){//不带日期
				if("licence.log".equals(name)){
					return true;
				}
				
			}
			
		}
		return false;
	}
	
	public LicenceLogfileFilter(List<String> list){
		
		needFilePattern=list;
		
	}

}
