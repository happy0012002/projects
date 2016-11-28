package com.sunyard.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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

import com.sunyard.bean.AdOrgtb;
import com.sunyard.bean.AdUser;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.service.AdOrgtbService;
import com.sunyard.util.Consts;
import com.sunyard.util.ConstsMethod;
import com.sunyard.util.ExcelUtil;
import com.sunyard.util.FileUtil;
import com.sunyard.util.StringUtil;



/**
 * 公司查询  需要登录
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/adOrgtbLoginController")
@SessionAttributes("user")
public class AdOrgtbLoginController  extends BaseController {

	
	@Autowired
	private AdOrgtbService adOrgtbService;
	
	/**
	 * 公司管理页面
	 * @return
	 */
	@RequestMapping("/toOrgLoginIndex")
	public String toOrgLoginIndex(HttpServletRequest request){
		
		request.setAttribute("orgTempPath", Consts.ORG_IMPORT_TEMPLATE_PATH);
		request.setAttribute("orgTempName",Consts.ORG_MPORT_TEMPLATE_NAME );
		return "page/licence/adorgloginindex";
	}	
	
	
	/**
	 * 公司修改和添加
	 * @param adOrgtb
	 * @param actionType
	 * @param request
	 * @param user
	 * @return
	 */
	@RequestMapping("/saveAdOrgtb")
	@ResponseBody
	public ExtFormResult<String> saveAdOrgtb( AdOrgtb adOrgtb,int actionType,HttpServletRequest request,@ModelAttribute("user") AdUser user) {

		ExtFormResult<String> efr=new ExtFormResult<String>();
		try {
			
			if(Consts.ACTION_TYPE_ADD==actionType){//新增
				List<AdOrgtb> exsitOrgs=adOrgtbService.getByOrgName(adOrgtb.getOrgname());
				if(exsitOrgs.size()>0){
					efr.setSuccess(false);
					efr.setErrorMessage("新增公司失败！原因：["+adOrgtb.getOrgname()+"]名字的公司已经存在！");
					return efr;
				}
				adOrgtb.setCreatetime(ConstsMethod.getCurrentTime());
				adOrgtb.setCreateuser(user.getUserid());
				adOrgtb.setDelflag(Consts.DELFLAG_NOTDEL);				
				String orgId=adOrgtbService.addAdOrgtb(adOrgtb);
				this.saveOperateLog(user.getUserid(), "添加公司["+orgId+"]", Consts.SYSLOG_TYPE_ORGMGR);
				efr.setData("新增公司成功！");
			}else{//修改
				AdOrgtb exsitOrg=adOrgtbService.getById(adOrgtb.getId());
				if(exsitOrg==null){
					efr.setSuccess(false);
					efr.setErrorMessage("修改公司失败！原因：该公司不存在！");
					return efr;
				}
				
				List<AdOrgtb> exsitOrgs=adOrgtbService.getByOrgName(adOrgtb.getOrgname());
				for(AdOrgtb org:exsitOrgs){
					if(!org.getId().equals(adOrgtb.getId())){
						efr.setSuccess(false);
						efr.setErrorMessage("修改公司失败！原因：["+adOrgtb.getOrgname()+"]名字的公司已经存在！");
						return efr;
					}
				}
				
				exsitOrg.setAddress(adOrgtb.getAddress());
				exsitOrg.setContact(adOrgtb.getContact());
				exsitOrg.setOrgname(adOrgtb.getOrgname());
				exsitOrg.setRemark(adOrgtb.getRemark());
				exsitOrg.setTel(adOrgtb.getTel());
				exsitOrg.setCreateuser(user.getUserid());
				exsitOrg.setCreatetime(ConstsMethod.getCurrentTime());
				adOrgtbService.modify(exsitOrg);
				this.saveOperateLog(user.getUserid(), "修改公司["+exsitOrg.getId()+"]", Consts.SYSLOG_TYPE_ORGMGR);
				efr.setData("修改公司成功！");
			}
			
			efr.setSuccess(true);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
			efr.setSuccess(false);
			efr.setErrorMessage("新增或修改公司失败！原因："+e.toString());
		}
		return efr;

	}
	
	/**
	 * 批量导入公司
	 * @param user
	 * @param request
	 * @param response
	 */
	@RequestMapping("/importOrg")
	public void importOrg(@ModelAttribute("user") AdUser user,HttpServletRequest request,HttpServletResponse response) {
		try{
			MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;//将HttpServletRequest对象转换为MultipartHttpServletRequest对象
	        MultipartFile multipartFile = multipartRequest.getFile("form-file");  //页面控件的文件流 
	        response.setCharacterEncoding("gbk");
	        if(null!=multipartFile){
	        	String fileInTemp=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid(),multipartFile.getOriginalFilename()); 
	        	File workDir=new File(ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid()));
	        	FileUtil.prepareDir(workDir);
	        	multipartFile.transferTo(new File(fileInTemp));
	        	if(!multipartFile.getOriginalFilename().endsWith(".xls")){	        		
	        		throw new Exception("文件格式不对！请导入2003版Excel文件");
	        	}
	        	
	        	HSSFWorkbook workbook = new HSSFWorkbook(new FileInputStream(fileInTemp));
				// 获得指定的表
				HSSFSheet sheet = workbook.getSheetAt(0); // 默认第一个
				int maxRow=sheet.getLastRowNum();
				if(maxRow>500){
					throw new Exception("一次导入最多500行！");
				}
				int maxCol=4;
				List<AdOrgtb> orgList=new ArrayList<AdOrgtb>();
				List<String> existOrgName=this.jdbcTemplate.queryForList("select orgname from adorgtb where delflag="+Consts.DELFLAG_NOTDEL, String.class);
				for(int col1=0;col1<maxCol;col1++){//列头 验证
					String content=ExcelUtil.getContent(sheet,0,col1);						
					if(col1==0){//公司名称
						if(!content.trim().equals("公司名称*")){
							throw new Exception("导入模板的格式不对，没有找到“公司名称*”列，请重新下载模板进行导入");
						}
					}else if(col1==1){//公司地址
						if(!content.trim().equals("公司地址")){
							throw new Exception("导入模板的格式不对，没有找到“公司地址”列，请重新下载模板进行导入");
						}
					}else if(col1==2){//联系人
						if(!content.trim().equals("联系人")){
							throw new Exception("导入模板的格式不对，没有找到“联系人”列，请重新下载模板进行导入");
						}
					}else if(col1==3){//联系电话
						if(!content.trim().equals("联系电话")){
							throw new Exception("导入模板的格式不对，没有找到“联系电话”列，请重新下载模板进行导入");
						}
					}else if(col1==4){//备注
						if(!content.trim().equals("备注")){
							throw new Exception("导入模板的格式不对，没有找到“备注”列，请重新下载模板进行导入");
						}
					}
				}
				
				
				for(int row=1;row<=maxRow;row++){
					AdOrgtb org=new AdOrgtb();
					for(int col=0;col<maxCol;col++){
						String content=ExcelUtil.getContent(sheet,row,col);						
						if(col==0){//公司名称 不能为空  长度小于100
							if(StringUtil.isNull(content)){
								throw new Exception("第"+(row+1)+"行，公司名称不能为空");
							}
							if(StringUtil.isNotNull(content)&& content.length()>100){
								throw new Exception("第"+(row+1)+"行，公司名称长度不能超过100。");
							}
							if(existOrgName.contains(content)){
								throw new Exception("第"+(row+1)+"行，公司名称["+content+"]与系统里已存在的或者“"+Consts.ORG_MPORT_TEMPLATE_NAME+"”里其它行的公司名称重复。");
							}
							if(content.indexOf("说明：带*的列是必填的")==0){
								throw new Exception("请删除说明文字那一行，再导入");								
							}
							existOrgName.add(content);
							org.setOrgname(content);
						}else if(col==1){//公司地址 可以为空 长度小于150
							if(StringUtil.isNotNull(content)&& content.length()>150){
								throw new Exception("第"+(row+1)+"行，公司地址长度不能超过150。");
							}
							org.setAddress(content);
						}else if(col==2){//联系人 可以为空   长度小于100
							if(StringUtil.isNotNull(content)&& content.length()>100){
								throw new Exception("第"+(row+1)+"行，联系人长度不能超过100。");
							}
							org.setContact(content);
						}else if(col==3){//联系电话 可以为空 长度小于 100
							if(StringUtil.isNotNull(content)&& content.length()>100){
								throw new Exception("第"+(row+1)+"行，联系电话长度不能超过100。");
							}
							org.setTel(content);
						}else if(col==4){//备注 可以为空 长度小于 500
							if(StringUtil.isNotNull(content)&& content.length()>500){
								throw new Exception("第"+(row+1)+"行，备注长度不能超过500。");
							}
							org.setRemark(content);
						}	
						
					}
					org.setCreatetime(ConstsMethod.getCurrentTime());
					org.setCreateuser(user.getUserid());
					org.setDelflag(Consts.DELFLAG_NOTDEL);
					orgList.add(org);
					
				}
				
				this.adOrgtbService.addAdOrgtb(orgList);	
				this.saveOperateLog(user.getUserid(), "批量导入公司。", Consts.SYSLOG_TYPE_ORGMGR);				
				response.getWriter().write("{success:true,data:\"导入公司成功！\"}");
	        	
	        	
	        }
		}catch(Exception e){
			e.printStackTrace();
			log.error("",e);
			try {
				response.getWriter().write("{success:false,errorMessage:\"导入公司失败！原因："+e.toString()+"\"}");
			} catch (IOException e1) {
				log.error("",e);
				e1.printStackTrace();
			}
		}       
	}
	
	
	/**
	 * 删除公司 批量
	 * @param ids
	 * @param request
	 * @return
	 */
	@RequestMapping("/delOrg")
	@ResponseBody
	public ExtFormResult<String> delOrg(@ModelAttribute("user") AdUser user,String ids,HttpServletRequest request) {
		ExtFormResult<String>  efr=new ExtFormResult<String> ();
		try{
			for(String id:ids.split(",")){
				AdOrgtb org=this.adOrgtbService.getById(id);
				
				if(null==org){
					efr.setSuccess(false);
					efr.setErrorMessage("删除公司失败，公司编号【"+id+"】没有找到！");		
					return efr;
				}else{
					adOrgtbService.delOrg(org);
					this.saveOperateLog(user.getUserid(), "删除公司["+org.getId()+"]。", Consts.SYSLOG_TYPE_ORGMGR);
					
				}	
				
			}
			efr.setSuccess(true);
			efr.setData("删除公司成功！");
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("删除公司失败，原因："+e.toString());
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
	
	
}
