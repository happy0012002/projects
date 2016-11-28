package com.sunyard.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sunyard.bean.AdDicinfo;
import com.sunyard.bean.AdLicCategory;
import com.sunyard.bean.AdUser;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.service.AdDicinfoService;
import com.sunyard.util.Consts;
import com.sunyard.util.ConstsMethod;
import com.sunyard.util.FileUtil;

@Controller
@RequestMapping(value = "/utilController")
public class UtilController extends BaseController {

	@Autowired
	private AdDicinfoService  adDicinfoService;
	
	
	@RequestMapping(value="/downloadTempZipFile")
	public void downloadTempZipFile(String filePath,String zipName,HttpServletResponse response,HttpServletRequest request){		
		response.reset();
		try {
			AdUser user=request.getSession().getAttribute("user")!=null?(AdUser)request.getSession().getAttribute("user"):null;
			response.setHeader("Content-disposition", "attachment;" +
					" filename=" + java.net.URLEncoder.encode(zipName, "UTF-8"));
			response.setContentType("application/ostet-stream"); 			
			String tempPath="";
			String tempDir="";
			if(user!=null){
				tempPath=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),zipName);
				tempDir=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid());
				
			}else{
				tempPath=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,String.valueOf((System.currentTimeMillis())),zipName);
				tempDir=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,String.valueOf((System.currentTimeMillis())));
			}

			FileUtil.prepareDir(tempDir);
			String sourceFilePath = ConstsMethod.getWebServerFilePath(filePath);
			FileUtil.copyFile(sourceFilePath, tempPath);
			System.out.println("remotepath:"+tempPath);
			this.write(response.getOutputStream(), tempPath);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("",e);
		}
	}
	
	
	@RequestMapping(value="/downloadLicenceImportTemp")
	public void downloadLicenceImportTemp(HttpServletResponse response,HttpServletRequest request){
		downloadTempZipFile(Consts.LICENCE_IMPORT_TEMPLATE_PATH ,Consts.LICENCE_IMPORT_TEMPLATE_ZIPNAME+".zip",response,request  );
		
	}
	
	
	@RequestMapping(value="/downloadTempFile")	
	public void downloadTempFile(String filePath,String fileName,HttpServletResponse response,HttpServletRequest request){
		
		response.reset();
		try {
			AdUser user=request.getSession().getAttribute("user")!=null?(AdUser)request.getSession().getAttribute("user"):null;
			fileName=new String(fileName.getBytes("ISO8859-1"),"utf-8") ;
			response.setHeader("Content-disposition", "attachment;" +
					" filename=" + java.net.URLEncoder.encode(fileName, "UTF-8"));
			response.setContentType("application/x-xls");
			
			String tempPath="";
			String tempDir="";
			if(user!=null){
				tempPath=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),fileName);
				tempDir=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid());
				
			}else{
				tempPath=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,String.valueOf((System.currentTimeMillis())),fileName);
				tempDir=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,String.valueOf((System.currentTimeMillis())));
			}

			FileUtil.prepareDir(tempDir);			
			String sourceFilePath = ConstsMethod.getWebServerFilePath(filePath);
			FileUtil.copyFile(sourceFilePath, tempPath);
			System.out.println("remotepath:"+tempPath);
			this.write(response.getOutputStream(), tempPath);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("",e);
		}
	}
	
	
	
	/**
	 * 获得dicinfo 对应的fieldname 下拉数据
	 * @return
	 */
	@RequestMapping(value="/getDicinfo")
	@ResponseBody
	public ExtFormResult<Map<String,String>>  getDicinfo(String fieldname){
		ExtFormResult<Map<String,String>>  ret=new ExtFormResult<Map<String,String>> ();
		try{
			List<AdDicinfo> list=this.adDicinfoService.getByFieldname(fieldname);
			List<Map<String,String>> l=new ArrayList<Map<String,String>>();
			
			for(AdDicinfo dic:list){
				Map<String,String> data=new HashMap<String,String>();
				data.put("text", dic.getContent());
				data.put("value",dic.getCode());
				l.add(data);
			}
			ret.setResults(l);
			ret.setSuccess(true);
			
		}catch(Exception e){
			e.printStackTrace();
			log.error("查询字典表类别fieldname="+fieldname+"失败",e);
			ret.setSuccess(false);
			ret.setErrorMessage("查询字典表类别fieldname="+fieldname+"失败，原因："+e.toString());
		}
		
		return ret;
	}
	
	/**
	 * 获得dicinfo 对应的fieldname 的具体下拉项
	 * @return
	 */
	@RequestMapping(value = "/getDicinfo/first")
	@ResponseBody
	public ExtFormResult<Map<String, String>> getDicinfoFirst(String fieldname,String query) {
		ExtFormResult<Map<String, String>> ret = new ExtFormResult<Map<String, String>>();
		try {
			AdDicinfo dicinfo = this.adDicinfoService.getById(fieldname, query);
			Map<String, String> data = new HashMap<String, String>();
			data.put("text", dicinfo.getContent());
			data.put("value", dicinfo.getCode());
			ret.setData(data);
			ret.setSuccess(true);

		} catch (Exception e) {
			e.printStackTrace();
			log.error("查询字典表类别具体项失败", e);
			ret.setSuccess(false);
			ret.setErrorMessage("查询字典表类别具体项失败，原因：" + e.toString());
		}
		return ret;
	}
}
