package com.sunyard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.sunyard.bean.AdSysParamtb;
import com.sunyard.bean.AdUser;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.extjs.pagination.PaginationBeanParam;
import com.sunyard.extjs.store.JsonData;
import com.sunyard.service.SysParamService;
import com.sunyard.util.Consts;

@Controller
@RequestMapping("/sysParamController")
@SessionAttributes("user")
public class SysParamController extends BaseController {

	@Autowired
	private SysParamService sysParamService;

	/**
	 * 系统参数列表页面
	 * @return
	 */
	@RequestMapping("/toSysParamIndex")
	public String toSysParamIndex() {
		return "page/sysParamIndex";
	}

	
	/**
	 * 系统参数查询
	 * @param param
	 * @return
	 */
	@RequestMapping("/getSysParamData")
	@ResponseBody
	public JsonData getSysParamData(PaginationBeanParam param){		
		JsonData jd=new JsonData();
		try{
			String sql="select * from adsysparamtb where id>1  ";
			param.setSort("id");		
			param.setSql(sql);
			jd=this.paginationTemplate.getJsonData(param);
		}catch(Exception e){
			e.printStackTrace();
			log.error("查询系统参数出错！",e);			
		}
		return jd;

	}
	
	
	/**
	 * 修改系统参数
	 * @param user
	 * @param sysParam
	 * @return
	 */
	@RequestMapping("/modifySysParam")
	@ResponseBody 
	public ExtFormResult<String> modifySysParam(@ModelAttribute("user") AdUser user,AdSysParamtb sysParam){
		ExtFormResult<String>  efr=new ExtFormResult<String> ();
		try{
			AdSysParamtb oldSysParam=sysParamService.getById(sysParam.getId());
			if(null==oldSysParam){
				efr.setSuccess(false);
				efr.setErrorMessage("修改系统参数失败！原因：该系统参数不存在！");
				return efr;
			}
			oldSysParam.setParamvalue(sysParam.getParamvalue());
			oldSysParam.setParamdesc(sysParam.getParamdesc());
			this.sysParamService.modify(oldSysParam);
			this.saveOperateLog(user.getUserid(), "修改系统参数["+oldSysParam.getParamname()+"]", Consts.SYSLOG_TYPE_SYSPARAMMODIFY);
			efr.setSuccess(true);
			efr.setData("修改系统参数成功！");
			
		}catch(Exception e){	
			e.printStackTrace();
			efr.setSuccess(false);
			efr.setErrorMessage("修改系统参数失败！原因："+e.toString());
		}		
		return efr;		
	}
	
	
	/**
	 * 根据id查询系统参数
	 * @param paramId
	 * @return
	 */
	@RequestMapping("/getById")
	@ResponseBody 
	public ExtFormResult<AdSysParamtb> getById(Integer paramId){
		ExtFormResult<AdSysParamtb>  efr=new ExtFormResult<AdSysParamtb> ();
		try{
			AdSysParamtb sysParam=sysParamService.getById(paramId);
			if(null==sysParam){
				efr.setSuccess(false);
				efr.setErrorMessage("查询系统参数失败！原因：该系统参数不存在！");
				return efr;
			}			
			efr.setSuccess(true);
			efr.setData(sysParam);
			
		}catch(Exception e){	
			e.printStackTrace();
			efr.setSuccess(false);
			efr.setErrorMessage("查询系统参数失败！原因："+e.toString());
		}		
		return efr;		
	}
	
}
