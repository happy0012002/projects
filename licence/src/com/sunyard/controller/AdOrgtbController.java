package com.sunyard.controller;

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

import com.sunyard.bean.AdOrgtb;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.extjs.pagination.PaginationBeanParam;
import com.sunyard.extjs.store.JsonData;
import com.sunyard.extjs.util.ExcelExport;
import com.sunyard.service.AdOrgtbService;
import com.sunyard.tree.RootFilter;
import com.sunyard.tree.Tree;
import com.sunyard.tree.TreeNode;
import com.sunyard.util.Consts;
import com.sunyard.util.StringUtil;

/**
 * 公司查询  不需要登录
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/adOrgtbController")
public class AdOrgtbController  extends BaseController{
	
	@Autowired
	private AdOrgtbService adOrgtbService;
	
	/**
	 * 公司查询页面
	 * @return
	 */
	@RequestMapping("/toOrgIndex")
	public String toProductIndex(){	
		String today=Consts.yyyy_MM_dd.format(new Date());
		if (today.compareTo(Consts.enddate)>0) {//过期				
			return "sysexpdate";
		}
		return "adorgindex";
	}	
	
	/**
	 * 公司数据
	 * @param param
	 * @param adOrgtb
	 * @param productParam
	 * @return
	 */
	@RequestMapping("/getOrgData")
	@ResponseBody
	public JsonData getOrgData(PaginationBeanParam param,AdOrgtb adOrgtb){
		JsonData jd=new JsonData();
		try{
			String sql="select * from adorgtb  where delflag="+Consts.DELFLAG_NOTDEL;
		
			if(StringUtil.isNotNull(adOrgtb.getOrgname()))	{
				sql+=" and orgname like'%"+adOrgtb.getOrgname()+"%'";
			}
			if(StringUtil.isNotNull(adOrgtb.getId()))	{
				sql+=" and id like '%"+adOrgtb.getId()+"%'";
			}			
			
			if(StringUtil.isNotNull(adOrgtb.getRemark()))	{
				sql+=" and remark like'%"+adOrgtb.getRemark()+"%'";
			}
			if(StringUtil.isNotNull(adOrgtb.getAddress()))	{
				sql+=" and address like'%"+adOrgtb.getAddress()+"%'";
			}
			
			param.setSql(sql);
			if(StringUtil.isNull(param.getSort())){
				param.setSort("orgname");
				param.setDir("asc");
			}
			
			jd=this.paginationTemplate.getJsonData(param);
		}catch(Exception e){
			log.error("",e);
		}
		return jd;
	}
	
	
	

	@RequestMapping("/getOrgData/export")
	public void getOrgDataExport(PaginationBeanParam param,AdOrgtb adOrgtb,HttpServletResponse response){
		if(param.getLimit().intValue()==10000){//导出全部
			param.setLimit(60000);
			param.setMaxlimit(60000);
		}
		JsonData jd=this.getOrgData(param, adOrgtb);		
		ExcelExport.createExcel(param.getExportFileName(), param.getExportFields(), jd, response);
		
	}
	
	
	
	
	@RequestMapping("/getOrgById")
	@ResponseBody
	public ExtFormResult<AdOrgtb> getOrgById(String id,HttpServletRequest request) {
		ExtFormResult<AdOrgtb>  efr=new ExtFormResult<AdOrgtb> ();
		try{
			AdOrgtb org=this.adOrgtbService.getById(id);
			if(null==org){
				efr.setSuccess(false);
				efr.setErrorMessage("查询公司失败，该公司编号【"+id+"】没有找到！");		
				return efr;
			}else{
				
				efr.setSuccess(true);
				efr.setData(org);
			}
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("查询失败，该公司编号【"+id+"】没有找到！");
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
	

	@RequestMapping(value="/getOrgComboTree")
	@ResponseBody
	public List<TreeNode>  getOrgComboTree(){
		List<AdOrgtb> orgs=adOrgtbService.getAll();
		List<TreeNode> nodeList=new ArrayList<TreeNode>();
		TreeNode root=new TreeNode();
		root.setId("00000");
		root.setText("公司列表");
		root.setParentId("");
		nodeList.add(root);
		
		for(AdOrgtb org:orgs){
			TreeNode n=new TreeNode();
			n.setId(org.getId());
			n.setText(org.getOrgname());
			n.setParentId("00000");
			nodeList.add(n);
			
		}
		Tree tree=new Tree(nodeList);
		tree.setRootFilter(new RootFilter(){
			
			public boolean isRoot(TreeNode node){
				
				return "00000".equals(node.getId());
			}
			
			
		});
		return tree.getTreeNode();
	
	}

	/**
	 * 获得公司选项
	 * @param query
	 * @return
	 */
	@RequestMapping(value="/getOrgComboTree/first")
	@ResponseBody
	public ExtFormResult<Map<String, String>> getOrgComboTreeFirst(String query) {
		ExtFormResult<Map<String, String>> ret = new ExtFormResult<Map<String, String>>();
		AdOrgtb  org = adOrgtbService.getById(query);
		Map<String, String> map = new HashMap<String, String>();
		map.put(query, org== null ? query : org.getOrgname());
		ret.setData(map);
		ret.setSuccess(true);
		return ret;
	}
	
}
