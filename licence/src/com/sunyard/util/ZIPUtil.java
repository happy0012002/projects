package com.sunyard.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipFile;
import org.apache.tools.zip.ZipOutputStream;

public class ZIPUtil {
	/**
	  * 创建目录
	  * 
	  * @param path
	  *            目录绝对路径名
	  */
	 static void createDir(String path) {
	  File dir = new File(path);
	  if (dir.exists() == false)
	   dir.mkdir();
	 }

	 /**
	  * 取得文件名,不包含后缀名
	  * 
	  * @param name
	  *            完整文件名
	  * @return 文件名(不包含后缀名)
	  */
	 static String getSuffixName(String name) {
	  return name.substring(0, name.lastIndexOf("."));
	 }

//	 public static void main(String[] args) throws Exception {
//	  unzip("F:/test/auditprojectdir.zip", "F:/auditprojectoutdir");
//	  System.out.println("over....................");
//	 }

	 /**
	  * 解压zip文件
	  * 
	  * @param zipFilePath
	  *            zip文件绝对路径
	  * @param unzipDirectory
	  *            解压到的确
	  * @throws Exception
	  */
	 public static void unzip2(String zipFilePath, String unzipDirectory)
	   throws Exception {
	  // 创建文件对象
	  File file = new File(zipFilePath);
	  File file1 = new File(unzipDirectory);
	  if(file1.isFile()==false){
		  file1.mkdir();
	  }
	  // 创建zip文件对象
	  ZipFile zipFile = new ZipFile(file);
	  // 创建本zip文件解压目录
	  File unzipFile = new File(unzipDirectory + "/"
	    + getSuffixName(file.getName()));
	  if (unzipFile.exists())
	   unzipFile.delete();
	  unzipFile.mkdir();
	  // 得到zip文件条目枚举对象
	  Enumeration zipEnum = zipFile.getEntries();
	  // 定义输入输出流对象
	  InputStream input = null;
	  OutputStream output = null;
	  // 定义对象
	  ZipEntry entry = null;
	  // 循环读取条目
	  while (zipEnum.hasMoreElements()) {
	   // 得到当前条目
	   entry = (ZipEntry) zipEnum.nextElement();
	   String entryName = new String(entry.getName());
	   // 用/分隔条目名称
	   String names[] = entryName.split("\\/");
	   int length = names.length;
	   String path = unzipFile.getAbsolutePath();
	   for (int v = 0; v < length; v++){
	    if (v < length - 1) { // 最后一个目录之前的目录
		 path += "/" + names[v] + "/";
		 createDir(path);
		} else { // 最后一个
		 if (entryName.endsWith("/")) // 为目录,则创建文件夹
		  createDir(unzipFile.getAbsolutePath() + "/" + entryName);
		 else { // 为文件,则输出到文件
		  input = zipFile.getInputStream(entry);
		  output = new FileOutputStream(new File(unzipFile
		    .getAbsolutePath()
		    + "/" + entryName));
		  byte[] buffer = new byte[1024 * 8];
		  int readLen = 0;
		  while ((readLen = input.read(buffer, 0, 1024 * 8)) != -1)
		   output.write(buffer, 0, readLen);
		  // 关闭流
		  zipFile.close();
		  input.close();
		  output.flush();
		  output.close();
	     }
	    }
	   }
	  }
	 }
  
	 public static void unzip(String zipFilePath, String unzipDirectory)throws Exception{
		 if(null!=zipFilePath && null!=unzipDirectory){
			 File file1=new File(zipFilePath);
			 InputStream input = null;
			 OutputStream output = null;
			 ZipFile zipFile=null;
			 try {
				zipFile=new ZipFile(file1);
				File unzipFolder=new File(unzipDirectory);
				if(unzipFolder.exists())
					FileUtil.deleteFolder(unzipFolder);
				unzipFolder.mkdirs();
				
				Enumeration zipEnum=zipFile.getEntries();
				ZipEntry entry=null;
				while(zipEnum.hasMoreElements()){
					entry=(ZipEntry)zipEnum.nextElement();
					String entryName=new String(entry.getName());
					String names[]=entryName.split("\\/");
					int length=names.length;
					String path=unzipFolder.getAbsolutePath();
					for(int v=0;v<length;v++){
						if(v<length-1){ // 最后一个目录之前的目录
							path+="/"+names[v]+"/";
							createDir(path);
						}else{//最后一个
							if (entryName.endsWith("/")) // 为目录,则创建文件夹
								createDir(unzipFolder.getAbsolutePath()+"/"+entryName);
							else{//为文件,则输出到文件
								input = zipFile.getInputStream(entry);
								output = new FileOutputStream(new File(unzipFolder.getAbsolutePath()+"/"+entryName));
								byte[] buffer = new byte[1024 * 8];
								int readLen = 0;
								while((readLen = input.read(buffer, 0, 1024 * 8)) != -1)
									output.write(buffer, 0, readLen);
							  
						     }
						}
					}
				}
			} catch (IOException e) {
				throw e;
			} finally {
				// 关闭流
				try {
					if(null!=zipFile)
						zipFile.close();
				} catch (Exception e) {
					throw e;
				} finally {
					try {
						if(null!=input)
							input.close();
					} catch (Exception e) {
						throw e;
					} finally {
						try {
							if(null!=output){
								output.flush();
								output.close();
							}
						} catch (Exception e) {
							throw e;
						}
					}
				}
			}
		 }
	 }
	 
	 
	public static void zip(String filePath,String zipFilePath){
		FileOutputStream fos=null;
		ZipOutputStream zos=null;
		try{
			fos=new FileOutputStream(zipFilePath);
			zos=new ZipOutputStream(fos);
			writeZipFile(new File(filePath),zos,"");
		}catch (Exception e){
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try{
				if(null!=zos)
					zos.close();
			}catch (IOException e){
				e.printStackTrace();
			}finally{
				try {
					if(null!=fos)
						fos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	public static void zip(File[] fileList,String zipFilePath){
		FileOutputStream fos=null;
		ZipOutputStream zos=null;
		try{
			fos=new FileOutputStream(zipFilePath);
			zos=new ZipOutputStream(fos);
			for(File file:fileList)
				writeZipFile(file,zos,"");
		}catch (Exception e){
			e.printStackTrace();
		}finally{
			try{
				if(null!=zos)
					zos.close();
			}catch (IOException e){
				e.printStackTrace();
			}finally{
				try {
					if(null!=fos)
						fos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
	private static void writeZipFile(File f, ZipOutputStream zos, String hiberarchy) {
		if(f.exists())
			if(f.isDirectory()){
				hiberarchy += f.getName() + "/";
				File[] fif = f.listFiles();
				for(int i = 0; i < fif.length; i++)
					writeZipFile(fif[i], zos, hiberarchy);
		    }else{
		    	FileInputStream fis = null;
		    	try{
		    		fis = new FileInputStream(f);
		    		ZipEntry ze = new ZipEntry(hiberarchy + f.getName());
		    		zos.putNextEntry(ze);
		    		byte[] b = new byte[1024];
		    		while (fis.read(b) != -1) {
		    			zos.write(b);
		    			b = new byte[1024];
		    		}
		    	}catch(FileNotFoundException e){
		    		e.printStackTrace();
		    	}catch(IOException e){
		    		e.printStackTrace();
		    	}finally{
		    		try {
		    			if(fis != null)
		    				fis.close();
		    		} catch (IOException e) {
		    			e.printStackTrace();
		    		}
		    	}

		    }
	}



	public static void main(String[] args)throws Exception{
		ZIPUtil.unzip( "g:\\audit.zip","g:\\aaa");
	}

}
