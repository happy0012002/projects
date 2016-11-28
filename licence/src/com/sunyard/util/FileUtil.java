package com.sunyard.util;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.io.FileUtils;

/**
 * 对文件进行操作
 * @author Administrator
 *
 */
public class FileUtil {
	
	private static DateFormat yyyy_MM_dd=new  SimpleDateFormat("yyyy-MM-dd");
	/**
	 * 拷贝文件
	 * @param srcFilePath  源文件
	 * @param desFilePath  目标文件
	 */
	public static void copyFile(String srcFilePath, String desFilePath) {
		try {
			FileUtils.copyFile(new File(srcFilePath),new File(desFilePath));
			
		} catch (IOException e) {
			throw new RuntimeException("拷贝文件失败。",e);
		}
	}
	
	public static void copyFileToDirectory(String srcFilePath, String destDir) {
		try {
			FileUtils.copyFileToDirectory(new File(srcFilePath), new File(destDir));
			
		} catch (IOException e) {
			throw new RuntimeException("拷贝文件失败。",e);
		}
	}
	/**
	 * 
	 * @param imgPath  源头图片路径
	 * @param expdate  过期日期
	 * @param imgName  文件名称 不带路径 仅仅用于展示用
	 * @return
	 */
	public static String storeImg(String imgPath,String expdate,String imgName) {
//		String dateStr=yyyy_MM_dd.format(new Date());
		String suffix=imgName.substring(imgName.lastIndexOf("."));
		String imgPathInStore=expdate+File.separator+ConstsMethod.getUniqueTime()+suffix;
		try {
			FileUtils.copyFile(new File(imgPath)
			,new File(Consts.IMGSTORE+File.separator+imgPathInStore));
			return imgPathInStore;
		} catch (IOException e) {
			throw new RuntimeException("拷贝文件失败。",e);
		}
	}
	
	/**
	 * 删除文件夹及其里的所有文件
	 * @param dir
	 */
	public static void deleteFolder(File dir) {
		if (dir == null || !dir.exists() || !dir.isDirectory())
			return;
		for (File file : dir.listFiles()) {
			if (file.isFile())
				file.delete(); // 删除所有文件
			else if (file.isDirectory())
				deleteFolder(file); // 递规的方式删除文件夹
		}
		dir.delete();// 删除目录本身
	}
	/**
	 * 删除文件夹及其里的所有文件
	 * @param dir
	 */
	public static void deleteFolderChildren(File dir) {
		if (dir == null || !dir.exists() || !dir.isDirectory())
			return;
		for (File file : dir.listFiles()) {
			if (file.isFile())
				file.delete(); // 删除所有文件
			else if (file.isDirectory())
				deleteFolder(file); // 递规的方式删除文件夹
		}
	}
	
	
	public static void prepareDir(String dirPath){
		prepareDir(new File(dirPath));
		
		
	}
	public static void prepareDir(File dirFile){
		if(dirFile.exists()){//存在就清理一下
			FileUtil.deleteFolderChildren(dirFile);
    	}else{//不存在就新建
    		dirFile.mkdirs();
    	}
		
		
	}
}
