package com.sunyard.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sunyard.bean.AdLicCategory;
import com.sunyard.bean.AdLicence;
import com.sunyard.bean.AdOrgtb;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.extjs.pagination.PaginationBeanParam;
import com.sunyard.extjs.store.JsonData;
import com.sunyard.extjs.util.ExcelExport;
import com.sunyard.service.AdOrgtbService;
import com.sunyard.service.LicenceService;
import com.sunyard.util.Consts;
import com.sunyard.util.ConstsMethod;
import com.sunyard.util.FileUtil;
import com.sunyard.util.StringUtil;

/**
 * 证照和证照查询
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/adLicenceController")
public class AdLicenceController  extends BaseController{

	@Autowired
	private LicenceService licenceService;
	
	@Autowired
	private AdOrgtbService adOrgtbService;
	
	/**
	 * 获得证照类别列表数据
	 * @param param
	 * @param name
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/getLicenceCategoryData")
	@ResponseBody
	public JsonData getLicenceCategoryData(PaginationBeanParam param,String name,String id){		
		JsonData jd=new JsonData();
		try{
			String sql="select a.*,b.username from adliccategory a left join aduser b   on a.createuser= b.userid where  a.delflag= "+Consts.DELFLAG_NOTDEL;

			if(StringUtil.isNotNull(id)){				
				sql+=" and a.id like '%"+id+"%'";				
			}
			
			if(StringUtil.isNotNull(name)){				
				sql+=" and a.name like '%"+name+"%'";				
			}
			if(StringUtil.isNull(param.getSort())){
				param.setSort("id");
			}			
			param.setSql(sql);
			jd=this.paginationTemplate.getJsonData(param);
		}catch(Exception e){
			e.printStackTrace();
			log.error("",e);
		}
		return jd;	
	}
	
	
	
	/**
	 * 获得证照类别
	 * @param id
	 * @param request
	 * @return
	 */
	@RequestMapping("/getLicenceCategoryById")
	@ResponseBody
	public ExtFormResult<AdLicCategory> getLicenceCategoryById(String id,HttpServletRequest request) {
		ExtFormResult<AdLicCategory>  efr=new ExtFormResult<AdLicCategory> ();
		try{
			AdLicCategory lc=this.licenceService.getLicenceCategoryById(id);
			if(null==lc){
				efr.setSuccess(false);
				efr.setErrorMessage("查询证照类别失败，该证照类别编号【"+id+"】没有找到！");				
			}else{
				
				efr.setSuccess(true);
				efr.setData(lc);
			}
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("查询证照类别失败，原因："+e.toString());
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
	
	
	
	/**
	 * 获得证照类别 下拉数据
	 * @return
	 */
	@RequestMapping(value="/getlicCategory")
	@ResponseBody
	public ExtFormResult<Map<String,String>>  getlicCategory(){
		ExtFormResult<Map<String,String>>  ret=new ExtFormResult<Map<String,String>> ();
		try{
			List<AdLicCategory> list=this.licenceService.getAllLicCategory();
			List<Map<String,String>> l=new ArrayList<Map<String,String>>();
			
			for(AdLicCategory lc:list){
				Map<String,String> data=new HashMap<String,String>();
				data.put("text", lc.getName());
				data.put("value", lc.getId());
				l.add(data);
			}
			ret.setResults(l);
			ret.setSuccess(true);
			
		}catch(Exception e){
			e.printStackTrace();
			log.error("查询证照类别失败",e);
			ret.setSuccess(false);
			ret.setErrorMessage("查询证照类别失败，原因："+e.toString());
		}
		
		return ret;
	}
	
	/**
	 * 获得具体的证照类别下拉选项
	 * @param query
	 * @return
	 */
	@RequestMapping(value = "/getlicCategory/first")
	@ResponseBody
	public ExtFormResult<Map<String, String>> getlicCategoryFirst(String query) {
		ExtFormResult<Map<String, String>> ret = new ExtFormResult<Map<String, String>>();
		try {
			AdLicCategory lc = this.licenceService.getLicenceCategoryById(query);
			Map<String, String> data = new HashMap<String, String>();
			data.put("text", lc.getName());
			data.put("value", lc.getId());
			ret.setData(data);
			ret.setSuccess(true);

		} catch (Exception e) {
			e.printStackTrace();
			log.error("查询证照类别失败", e);
			ret.setSuccess(false);
			ret.setErrorMessage("查询证照类别失败，原因：" + e.toString());
		}
		return ret;
	}
	
	
	
	//----------------------------证照方法
	/*@RequestMapping("/toLicenceTab") 废弃
	public String toLicenceTab(){	
		
		return "licencetab";
	}
	
	
	@RequestMapping("/toLicenceType")
	public String toLicenceType(HttpServletRequest request ,int type){		
		request.setAttribute("type", type);
		
		return "adlicenceindex";
	}*/
	
	
	/**
	 * 显示证照图片的页面
	 */
	@RequestMapping("/showImg")
	public String showImg(HttpServletRequest request ,String id){		
		request.setAttribute("licId", id);		
		return "showimg";
	}
	
	
	/**
	 * 下载图片
	 * @param id
	 * @param response
	 * @param request
	 */
	@RequestMapping("/downloadImg")
	public void downloadImg(String id,HttpServletResponse response,HttpServletRequest request){
		try {
			AdLicence p=this.licenceService.getLicenceById(id);
			response.setCharacterEncoding("gbk");
			
			String imgPathInStore=Consts.IMGSTORE+File.separator+p.getImgpath();
			String imgPathInTemp=ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,String.valueOf((System.currentTimeMillis())),p.getImgpath());//存在并发错误可能性
			FileUtil.copyFile(imgPathInStore, imgPathInTemp);
			write(response.getOutputStream(),imgPathInTemp);
			
		}catch(Exception e){
			e.printStackTrace();
			log.error("下载图片出错",e);
		}
		
	}
	
	/**
	 * 所有证照查询页面
	 * @return
	 */
	@RequestMapping(value = "/toAllLicenceQueryTab")
	public String toAllLicenceQueryTab(HttpServletRequest request){
		String today=Consts.yyyy_MM_dd.format(new Date());
		if (today.compareTo(Consts.enddate)>0) {//过期				
			return "sysexpdate";
		}
		request.setAttribute("Url", "app/adLicenceController/toAllLicenceQueryDetail?");
		return "page/allLicenceQueryTab";		
	}
	
	/**
	 * 所有证照查询页面
	 * @return
	 */
	@RequestMapping(value = "/toAllLicenceQueryDetail")
	public String toAllLicenceDetail(String expdatetype,HttpServletRequest request){
		request.setAttribute("expdatetype", expdatetype);
		request.setAttribute("dateToday", ConstsMethod.getCurrentDate());
		request.setAttribute("oneMonthAfter", ConstsMethod.getOneMonthAfter());
		return "page/allLicenceQueryDetail";		
	}
	
	/**
	 * 某个公司的证照查询页面
	 * @param orgId
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/toOrgLicenceQuery")
	public String toOrgLicenceQuery(String orgId,HttpServletRequest request){	
		AdOrgtb adOrgtb=this.adOrgtbService.getById(orgId);
		
		
		if(null!=adOrgtb){
			request.setAttribute("orgName", adOrgtb.getOrgname());
			request.setAttribute("orgId", orgId);
		}
		// 分别查询出每个类别的总数和名称  即将过期是1个月 黄色  已经过期 红色
		request.setAttribute("dateToday", ConstsMethod.getCurrentDate());
		request.setAttribute("oneMonthAfter", ConstsMethod.getOneMonthAfter());
		
		return "page/orgLicenceQuery";		
	}
	
	/**
	 * 获得证照列表数据
	 * @param param
	 * @param licence
	 * @return
	 */
	@RequestMapping(value = "/getLicenceData")
	@ResponseBody
	public JsonData getLicenceData(PaginationBeanParam param,AdLicence licence){		
		JsonData jd=new JsonData();
		try{
			String sql="select a.*,c.orgname,b.name as categoryname from adlicence a, adliccategory b ,adorgtb c where a.categoryid=b.id and c.id=a.orgid ";
				   sql+=" and a.delflag="+Consts.DELFLAG_NOTDEL;
			
			if(StringUtil.isNotNull(licence.getCategoryid())){
				sql+=" and a.categoryid='"+licence.getCategoryid()+"'";
			}
			if(StringUtil.isNotNull(licence.getId())){
				sql+=" and a.id like '%"+licence.getId()+"%'";
			}
			
			if(StringUtil.isNotNull(licence.getRemark())){
				sql+=" and a.remark like '%"+licence.getRemark()+"%'";
			}
			if(StringUtil.isNotNull(licence.getName())){
				sql+=" and a.name like '%"+licence.getName()+"%'";
			}
			
			if(StringUtil.isNotNull(licence.getOrgName())){
				sql+=" and c.orgname like '%"+licence.getOrgName()+"%'";
			}
			if(StringUtil.isNotNull(licence.getOrgid())){
				sql+=" and c.id= '"+licence.getOrgid()+"'";
			}
			
			if(StringUtil.isNotNull(licence.getExpdatetype())){
				String dateToday=ConstsMethod.getCurrentDate();	
				String oneMonthAfter=ConstsMethod.getOneMonthAfter();				
				if("1".equals(licence.getExpdatetype())){//已过期 过期日期小于今天
					sql+=" and a.expdate <'"+dateToday+"'";
				}else if("2".equals(licence.getExpdatetype())){//即将过期 过期日期大于等于今天 且小于一个月以后的今天
					sql+=" and a.expdate >='"+dateToday+"' and a.expdate<'"+oneMonthAfter+"'";
				}else if("3".equals(licence.getExpdatetype())){//其他 过期日期大于一个月以后的今天
					sql+=" and a.expdate >='"+oneMonthAfter+"'";
				}
				
			}
			
			if(StringUtil.isNotNull(licence.getExpdateeq())){
				sql+=" and a.expdate='"+licence.getExpdateeq()+"'";
			}
			if(StringUtil.isNotNull(licence.getExpdatelt())){
				sql+=" and a.expdate<='"+licence.getExpdatelt()+"'";
			}
			if(StringUtil.isNotNull(licence.getExpdategt())){
				sql+=" and a.expdate>='"+licence.getExpdategt()+"'";
			}
			
			if(StringUtil.isNull(param.getSort())){
				param.setSort("id");
				param.setDir("asc");
			}			
			param.setSql(sql);
			jd=this.paginationTemplate.getJsonData(param);
		}catch(Exception e){
			e.printStackTrace();
			log.error("",e);
		}
		return jd;	
	}
	
	/**
	 * 证照信息导出
	 * @param param
	 * @param licence
	 * @param response
	 */
	@RequestMapping("/getLicenceData/export")
	public void getLicenceDataExport(PaginationBeanParam param,AdLicence licence,HttpServletResponse response){
		if(param.getLimit().intValue()==10000){//导出全部
			param.setLimit(60000);
			param.setMaxlimit(60000);
		}
		JsonData jd=this.getLicenceData(param, licence);	
		ExcelExport.createExcel(param.getExportFileName(), param.getExportFields(), jd, response);
		
	}
	
	/**
	 * 获得证照类别
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
			}else{
				
				efr.setSuccess(true);
				efr.setData(licence);
			}
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("查询证照失败，原因："+e.toString());
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
	
	
	
	
	
}
