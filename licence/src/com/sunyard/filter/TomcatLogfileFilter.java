package com.sunyard.filter;

import java.io.File;
import java.io.FilenameFilter;
import java.util.List;

public class TomcatLogfileFilter implements FilenameFilter{
	
	private List<String> needFilePattern=null;

	public boolean accept(File dir, String name) {
		for(String s:needFilePattern){
			if(name.endsWith(s+".log")){
				return true;
			}
			
		}
		return false;
		
		
	}
	public TomcatLogfileFilter(List<String> list){		
		needFilePattern=list;
		
	}
}
