package com.sunyard.util;

public class StringUtil {
	
	
	public static boolean isNotNull(String s){
		if(s==null || "".equals(s.trim()) || "null".equalsIgnoreCase(s) || "undefined".equalsIgnoreCase(s))
			return false;
		else
			return true;
	}
	
	public static boolean isNull(String s){
		if(s==null || "".equals(s.trim()) || "null".equalsIgnoreCase(s) || "undefined".equalsIgnoreCase(s))
			return true;
		else
			return false;
	}
	
	
	public static String  buildStr(int num,int strLength){
		String numStr=String.valueOf(num);
		if(numStr.length()>strLength){
			throw new RuntimeException("所需字符串长度小于数字位数，数字被截断!");
		}
		for(int i=0;i<strLength;i++){
			numStr="0"+numStr;
		}
		return numStr.substring(numStr.length()-strLength);
		
	}
	
	public static String  buildNextIdStr(String maxId,int strLength){
		
		int num=Integer.parseInt(maxId);
		num++;
		return buildStr(num,strLength);
		
	}
	
	
}
