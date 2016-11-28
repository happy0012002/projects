package com.sunyard.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.sunyard.bean.AdLicCategory;
import com.sunyard.bean.AdLicence;
import com.sunyard.bean.AdOrgtb;
import com.sunyard.bean.AdUser;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.service.AdOrgtbService;
import com.sunyard.service.LicenceService;
import com.sunyard.util.Consts;
import com.sunyard.util.ConstsMethod;
import com.sunyard.util.DateUtil;
import com.sunyard.util.ExcelUtil;
import com.sunyard.util.FileUtil;
import com.sunyard.util.StringUtil;
import com.sunyard.util.ZIPUtil;



/**
 * 证照类别和证照管理   周平
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/adLicenceLoginController")
@SessionAttributes("user")
public class AdLicenceLoginController  extends BaseController{

	@Autowired
	private LicenceService licenceService;
	
	@Autowired
	private AdOrgtbService adOrgtbService;
	
	/**
	 * 证照类别管理首页
	 * @return
	 */
	@RequestMapping(value = "/toLicenceCategoryPage")
	public String toLicenceCategoryPage(){		
		return "page/licence/licenceCategory";		
	}
	
	
	/**
	 * 修改和添加证照类别
	 * @param user
	 * @param lc
	 * @param actionType
	 * @param request
	 * @return
	 */
	@RequestMapping("/saveLicenceCategory")
	@ResponseBody
	public ExtFormResult<String> saveLicenceCategory(@ModelAttribute("user") AdUser user,AdLicCategory lc,int actionType,HttpServletRequest request) {

		ExtFormResult<String> efr=new ExtFormResult<String>();
		try {
			
			if(0==actionType){//新增	
				List<AdLicCategory>  exsitLcs=licenceService.getLicenceCategoryByName(lc.getName());
				if(exsitLcs.size()>0){
					efr.setSuccess(false);
					efr.setErrorMessage("新增证照类别失败！原因：证照类别名称不能重复，该证照类别名称已经存在！");
					return efr;
				}
				lc.setCreatetime(ConstsMethod.getCurrentTime());
				lc.setDelflag(Consts.DELFLAG_NOTDEL);
				lc.setCreateuser(user.getUserid());
								
				String liccId=licenceService.addLicCategory(lc);
				this.saveOperateLog(user.getUserid(), "添加证照类别["+liccId+"]。", Consts.SYSLOG_TYPE_LICCMGR);
				efr.setData("新增证照类别成功！");
			}else{//修改
				AdLicCategory exsitLc=licenceService.getLicenceCategoryById(lc.getId());
				if(exsitLc==null){
					efr.setSuccess(false);
					efr.setErrorMessage("修改证照类别失败！原因：该证照类别不存在！");
					return efr;
				}
				List<AdLicCategory> sameNameLiccs=licenceService.getLicenceCategoryByName(lc.getName().trim());
				for(AdLicCategory licc:sameNameLiccs){
					if(!licc.getId().equals(lc.getId())){
						efr.setSuccess(false);
						efr.setErrorMessage("修改证照类别失败！原因：该证照类别名称["+lc.getName().trim()+"]已经存在！");
						return efr;
					}
					
				}
					
				exsitLc.setName(lc.getName().trim());
				licenceService.modifyLicCategory(exsitLc);
				this.saveOperateLog(user.getUserid(), "修改证照类别["+exsitLc.getId()+"]。", Consts.SYSLOG_TYPE_LICCMGR);
				efr.setData("修改证照类别成功！");
			}
			
			efr.setSuccess(true);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
			efr.setSuccess(false);
			efr.setErrorMessage("新增或修改证照类别失败！原因："+e.toString());
		}
		return efr;

	}
	
	
	/**
	 * 删除证照类别
	 * @param ids
	 * @param request
	 * @return
	 */
	@RequestMapping("/delLicenceCategory")
	@ResponseBody
	public ExtFormResult<String> delLicenceCategory(@ModelAttribute("user") AdUser user,String ids,HttpServletRequest request) {
		ExtFormResult<String>  efr=new ExtFormResult<String> ();
		try{
			for(String id:ids.split(",")){
				AdLicCategory lc=this.licenceService.getLicenceCategoryById(id);
				
				if(null==lc){
					efr.setSuccess(false);
					efr.setErrorMessage("删除证照类别失败，证照类别编号【"+id+"】没有找到！");		
					return efr;
				}else{
					lc.setDelflag(Consts.DELFLAG_DEL);
					licenceService.modifyLicCategory(lc);
					this.saveOperateLog(user.getUserid(), "删除证照类别["+lc.getId()+"]。", Consts.SYSLOG_TYPE_LICCMGR);
				}	
				
			}
			efr.setSuccess(true);
			efr.setData("删除证照类别成功！");
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("删除证照类别失败，原因："+e.toString());
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
	
	
	//----------分割线 以上是证照类别 以下是证照
	
	
	/**
	 * 证照管理页面
	 */
	@RequestMapping(value = "/toAllLicenceMgrTab")
	public String toAllLicenceMgrTab(HttpServletRequest request){	
		request.setAttribute("Url", "app/adLicenceLoginController/toAllLicenceMgrDetail?");
		return "page/licence/allLicenceMgrTab";		
	}
	
	/**
	 * 证照管理页面
	 * @return
	 */
	@RequestMapping(value = "/toAllLicenceMgrDetail")
	public String toAllLicenceMgrDetail(String expdatetype,HttpServletRequest request){
		request.setAttribute("expdatetype", expdatetype);
		request.setAttribute("dateToday", ConstsMethod.getCurrentDate());
		request.setAttribute("oneMonthAfter", ConstsMethod.getOneMonthAfter());
		request.setAttribute("buttonHidden", "false");
		return "page/licence/allLicenceMgrDetail";		
	}
	
	/**
	 * 某某公司的证照管理页面
	 * @param orgId
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/toOrgLicenceMgr")
	public String toOrgLicenceMgr(String orgId,HttpServletRequest request){	
		AdOrgtb adOrgtb=this.adOrgtbService.getById(orgId);
		
		
		if(null!=adOrgtb){
			request.setAttribute("orgName", adOrgtb.getOrgname());
			request.setAttribute("orgId", orgId);
		}
		// 分别查询出每个类别的总数和名称  即将过期是1个月 黄色  已经过期 红色
		request.setAttribute("dateToday", ConstsMethod.getCurrentDate());
		request.setAttribute("oneMonthAfter", ConstsMethod.getOneMonthAfter());
		
		return "page/licence/orgLicenceMgr";		
	}
	
	
	/**
	 * 修改和添加证照
	 * @param user
	 * @param licence
	 * @param actionType
	 * @param request
	 * @param response
	 */
	@RequestMapping("/saveLicence")
	public void saveLicence(@ModelAttribute("user") AdUser user,AdLicence licence,int actionType,HttpServletRequest request,HttpServletResponse response) {

		try {
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;//将HttpServletRequest对象转换为MultipartHttpServletRequest对象
	        MultipartFile multipartFile = multipartRequest.getFile("form-file");  //页面控件的文件流 
	        response.setCharacterEncoding("gbk");
	        
			if(0==actionType){//新增	
				if(null==multipartFile){//图片不能为空
		        	throw new Exception("新增证照图片不能为空！");
		        }
				String fileName = multipartFile.getOriginalFilename();  //上传文件的名称
	        	if(!Consts.allowed_img_suffix.contains(fileName.substring(fileName.lastIndexOf(".")))){
	        		throw new Exception("图片格式无法识别或该文件不是图片.");
	        	}
	        	
	        	if(StringUtil.isNotNull(licence.getName())){//证照名称不能重复
	        		//先不做限制
	        		
	        	}
		        String tempFilePath = ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),fileName);//服务器的文件路径
		        multipartFile.transferTo(new File(tempFilePath));
		        String imgPath= FileUtil.storeImg(tempFilePath,licence.getExpdate(), fileName);
		      
		        
		        licence.setImgpath(imgPath);
		        licence.setImgname(fileName);
				licence.setDelflag(Consts.DELFLAG_NOTDEL);
				licence.setCreateuser(user.getUserid());
				licence.setCreatetime(ConstsMethod.getCurrentTime());
				licence.setGroup(0);
				String licid=licenceService.addLicence(licence);
				this.saveOperateLog(user.getUserid(), "添加证照["+licid+"]。", Consts.SYSLOG_TYPE_LICMGR);
				response.getWriter().write("{success:true,data:\"添加证照成功！\"}");
				
			}else{//修改
				AdLicence exsitLicence=licenceService.getLicenceById(licence.getId());
				if(exsitLicence==null){
					response.getWriter().write("{success:false,errorMessage:\"修改证照失败！原因：没有找到对应证照。\"}");
				}
				if(StringUtil.isNotNull(multipartFile.getOriginalFilename())){//图片不空 则替换旧图片 
					
					String fileName = multipartFile.getOriginalFilename();  //上传文件的名称
		        	if(!Consts.allowed_img_suffix.contains(fileName.substring(fileName.lastIndexOf(".")))){
		        		throw new Exception("图片格式无法识别或该文件不是图片.");
		        	}
		        	 String tempFilePath = ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),fileName);//服务器的文件路径
				     multipartFile.transferTo(new File(tempFilePath));
				     String imgPath= FileUtil.storeImg(tempFilePath,licence.getExpdate(), fileName);
		        	
				     exsitLicence.setImgpath(imgPath);
				     exsitLicence.setImgname(fileName);
		        }
//				else{//没有图片  则还是老图片
//		        }
				exsitLicence.setCreateuser(user.getUserid());
				exsitLicence.setCreatetime(ConstsMethod.getCurrentTime());
				exsitLicence.setCategoryid(licence.getCategoryid());
				exsitLicence.setExpdate(licence.getExpdate());
				exsitLicence.setOrgid(licence.getOrgid());
				exsitLicence.setName(licence.getName());
				exsitLicence.setRemark(licence.getRemark());
				licenceService.modifyLicence(exsitLicence);
				this.saveOperateLog(user.getUserid(), "修改证照["+exsitLicence.getId()+"]。", Consts.SYSLOG_TYPE_LICMGR);
				response.getWriter().write("{success:true,data:\"修改证照成功！\"}");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
			try {
				response.getWriter().write("{success:false,errorMessage:\"新增或修改证照类别失败！原因："+e.toString()+"\"}");
			} catch (IOException e1) {
				log.error("",e);
				e1.printStackTrace();
			}
		}


	}
	
	/**
	 * 导入证照
	 * @param user
	 * @param request
	 * @param response
	 */
	@RequestMapping("/importLicence")
	public void importLicence(@ModelAttribute("user") AdUser user,HttpServletRequest request,HttpServletResponse response) {
		try{
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;//将HttpServletRequest对象转换为MultipartHttpServletRequest对象
	        MultipartFile multipartFile = multipartRequest.getFile("form-file");  //页面控件的文件流 
	        response.setCharacterEncoding("gbk");
	        if(null!=multipartFile){
	        	String fileInTempUser=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),multipartFile.getOriginalFilename()); 
	        	File workDir=new File(ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid()));
	        	FileUtil.prepareDir(workDir);
	        	multipartFile.transferTo(new File(fileInTempUser));
	        	if(!multipartFile.getOriginalFilename().endsWith(".zip")){	        		
	        		throw new Exception("文件格式不对！请导入zip压缩文件");
	        	}
	        	
	        	ZIPUtil.unzip(fileInTempUser, ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid()));
	        	File WorkDir=new File(ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),Consts.LICENCE_IMPORT_TEMPLATE_ZIPNAME));//工作目录
	        	File licenceImportExcel=new File(ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),Consts.LICENCE_IMPORT_TEMPLATE_ZIPNAME,Consts.LICENCE_IMPORT_TEMPLATE_NAME));//工作目录
	        	if(!licenceImportExcel.exists()){
	        		throw new Exception ("证照导入格式错误，没有找到“证照导入模板.xls”文件，请重新下载模板进行导入。");
	        	}
	        	HSSFWorkbook workbook = new HSSFWorkbook(new FileInputStream(licenceImportExcel));
				// 获得指定的表
				HSSFSheet sheet = workbook.getSheetAt(0); // 默认第一个
				int maxRow=sheet.getLastRowNum();
				if(maxRow>500){
					throw new Exception("一次导入最多500行！");
				}
				int maxCol=6;
				for(int col1=0;col1<maxCol;col1++){//列头 验证
					String content=ExcelUtil.getContent(sheet,0,col1);						
					if(col1==0){//证照到期日期*
						if(!content.trim().equals("证照到期日期*")){
							throw new Exception("导入模板的格式不对，没有找到“证照到期日期*”列，请重新下载模板进行导入");
						}
					}else if(col1==1){//证照类别*
						if(!content.trim().equals("证照类别*")){
							throw new Exception("导入模板的格式不对，没有找到“证照类别*”列，请重新下载模板进行导入");
						}
					}else if(col1==2){//所属公司名称*
						if(!content.trim().equals("所属公司名称*")){
							throw new Exception("导入模板的格式不对，没有找到“所属公司名称*”列，请重新下载模板进行导入");
						}
					}else if(col1==3){//证照名称
						if(!content.trim().equals("证照名称")){
							throw new Exception("导入模板的格式不对，没有找到“证照名称”列，请重新下载模板进行导入");
						}
					}else if(col1==4){//备注
						if(!content.trim().equals("备注")){
							throw new Exception("导入模板的格式不对，没有找到“备注”列，请重新下载模板进行导入");
						}
					}else if(col1==4){//图片路径*
						if(!content.trim().equals("图片路径*")){
							throw new Exception("导入模板的格式不对，没有找到“图片路径*”列，请重新下载模板进行导入");
						}
					}
				}
				
				Map<String,String> existOrgMap=new HashMap<String,String>();
				
				Map<String,String> existLicCategoryMap=new HashMap<String,String>();
				
				List<AdOrgtb> existOrgList =this.adOrgtbService.getAll();
				for(AdOrgtb org:existOrgList){
					existOrgMap.put(org.getOrgname(), org.getId());					
				}
				
				List<AdLicCategory>   licCategoryList=this.licenceService.getAllLicCategory();
				for(AdLicCategory licc:licCategoryList){					
					existLicCategoryMap.put(licc.getName(), licc.getId());
				}
				List<AdLicence> adLicenceList=new ArrayList<AdLicence>();
				
				for(int row=1;row<=maxRow;row++){
					AdLicence lic=new AdLicence();
					for(int col=0;col<maxCol;col++){
						String content=ExcelUtil.getContent(sheet,row,col);						
						if(col==0){//证照到期日期* 不能为空  格式要正确 yyyy-MM-dd
							if(StringUtil.isNull(content)){
								throw new Exception("第"+(row+1)+"行，证照到期日期不能为空");
							}
							if(!DateUtil.validateIdDate(content)){
								throw new Exception("第"+(row+1)+"行，证照到期日期["+content+"]不正确，正确格式例如[2016-11-12]，而且是有效的。");
							}
							
							lic.setExpdate(content);
							
						}else if(col==1){//证照类别* 不能为空 系统中存在
							if(StringUtil.isNull(content)){
								throw new Exception("第"+(row+1)+"行，证照类别不能为空。");
							}
							if(!existLicCategoryMap.containsKey(content)){
								throw new Exception("第"+(row+1)+"行，证照类别["+content+"]在系统中找不到，请先在证照类别管理里面添加后再导入。");
							}
							
							lic.setCategoryid(existLicCategoryMap.get(content));
						}else if(col==2){//所属公司名称* 不能为空 系统中存在
							if(StringUtil.isNull(content)){
								throw new Exception("第"+(row+1)+"行，所属公司名称不能为空。");
							}
							if(!existOrgMap.containsKey(content)){
								throw new Exception("第"+(row+1)+"行，所属公司名称["+content+"]在系统中找不到，请先在公司管理里面添加后再导入。");
							}
							lic.setOrgid(existOrgMap.get(content));
						}else if(col==3){//证照名称 可以为空 长度小于 100
							if(StringUtil.isNotNull(content)&& content.length()>100){
								throw new Exception("第"+(row+1)+"行，证照名称长度不能超过100。");
							}
							lic.setName(content);
						}else if(col==4){//备注 可以为空 长度小于 500
							if(StringUtil.isNotNull(content)&& content.length()>500){
								throw new Exception("第"+(row+1)+"行，备注长度不能超过500。");
							}
							lic.setRemark(content);
						}else if(col==5){//图片路径* 不能为空 图片在文件夹中能找到，而且后缀正确
							if(StringUtil.isNull(content)){
								throw new Exception("第"+(row+1)+"行，图片路径不能为空。");
							}
							File imgFile=new File(WorkDir+File.separator+content);
							if(!imgFile.exists()){
								throw new Exception("第"+(row+1)+"行，图片路径不正确，对应的图片找不到，请检查。");
							}
							String imgName=content.replace("/", "\\");
							if(imgName.lastIndexOf("\\")!=-1){
								imgName=imgName.substring(imgName.lastIndexOf("\\"));
							}
							String imgPathInStore=FileUtil.storeImg(imgFile.getAbsolutePath(), lic.getExpdate(), imgName);
							lic.setImgname(imgName);
							lic.setImgpath(imgPathInStore);
						}	
						
					}
					lic.setCreatetime(ConstsMethod.getCurrentTime());
					lic.setCreateuser(user.getUserid());
					lic.setDelflag(Consts.DELFLAG_NOTDEL);
					adLicenceList.add(lic);
					
				}
				
				this.licenceService.addLicence(adLicenceList);
				this.saveOperateLog(user.getUserid(), "批量导入证照。", Consts.SYSLOG_TYPE_LICMGR);
				response.getWriter().write("{success:true,data:\"导入证照成功！\"}");
	        	
	        	
	        	
	        }
		}catch(Exception e){
			e.printStackTrace();
			log.error("",e);
			try {
				response.getWriter().write("{success:false,errorMessage:\"导入证照失败！原因："+e.toString()+"\"}");
			} catch (IOException e1) {
				log.error("",e);
				e1.printStackTrace();
			}
		}       
	}
	
	
	/**
	 * 根据ID查询证照
	 * @param id
	 * @param request
	 * @return
	 */
	@RequestMapping("/getLicenceById")
	@ResponseBody
	public ExtFormResult<AdLicence> getLicenceById(String id,HttpServletRequest request) {
		ExtFormResult<AdLicence>  efr=new ExtFormResult<AdLicence> ();
		try{
			AdLicence licence=this.licenceService.getLicenceById(id);
			if(null==licence){
				efr.setSuccess(false);
				efr.setErrorMessage("查询证照失败，该证照编号【"+id+"】没有找到！");	
				return efr;
			}else{
				
				efr.setSuccess(true);
				efr.setData(licence);
			}
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("查询失败，该证照编号【"+id+"】没有找到！");
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
	/**
	 * 删除公司 批量
	 * @param ids
	 * @param request
	 * @return
	 */
	@RequestMapping("/delLicence")
	@ResponseBody
	public ExtFormResult<String> delLicence(@ModelAttribute("user") AdUser user,String ids,HttpServletRequest request) {
		ExtFormResult<String>  efr=new ExtFormResult<String> ();
		try{
			for(String id:ids.split(",")){
				AdLicence lic=this.licenceService.getLicenceById(id);
				
				if(null==lic){
					efr.setSuccess(false);
					efr.setErrorMessage("删除证照失败，证照编号【"+id+"】没有找到！");		
					return efr;
				}else{
					lic.setDelflag(Consts.DELFLAG_DEL);
					this.licenceService.modifyLicence(lic);
					this.saveOperateLog(user.getUserid(), "删除证照["+lic.getId()+"]。", Consts.SYSLOG_TYPE_LICMGR);
					
				}	
				
			}
			efr.setSuccess(true);
			efr.setData("删除证照成功！");
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("删除证照失败，原因："+e.toString());
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
}
