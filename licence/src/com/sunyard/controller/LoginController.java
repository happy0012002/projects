package com.sunyard.controller;

import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.sunyard.bean.AdSysParamtb;
import com.sunyard.bean.AdUser;
import com.sunyard.service.SysParamService;
import com.sunyard.service.UserService;
import com.sunyard.util.Consts;
import com.sunyard.util.ConstsMethod;
import com.sunyard.util.Descrypt;
import com.sunyard.util.FileUtil;

/**
 * 登录类
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/loginController")
public class LoginController extends BaseController {

	
	@Autowired
	private UserService userService;
	
	@Autowired
	private SysParamService sysParamService;
	
	
	/**
	 * 到空白页面   显示功能还未开发  
	 * @return
	 */
	@RequestMapping("/toBlank")
	public String toBlank(){		
		return "info";
	}
	
	/**
	 * 欢迎页面
	 * @param session
	 * @return
	 */
	@RequestMapping(value="/welcome")
	public String welcome(HttpSession session) {
		
		return "page/welcome";
	}
	
	
	
	/**
	 * 登录页面
	 * @return
	 */
	@RequestMapping("/toLoginIndex")
	public String toLoginIndex(){		
		return "loginIndex";
	}
	
	
	
	
	
	
	
	/**
	 * 用户登录
	 * @param loginName
	 * @param password
	 * @param request
	 * @param session
	 * @param map
	 * @return
	 */
	@RequestMapping(value = "/toManageIndex")
	public String toManageIndex(String loginName, String password,
			HttpServletRequest request, HttpSession session, ModelMap map) {
		
		try {
			String today=Consts.yyyy_MM_dd.format(new Date());
			if (today.compareTo(Consts.enddate)>0) {//过期				
				return "sysexpdate";
			}
			
			
			if (StringUtils.isBlank(loginName)) {
				map.put("errorMessage", "错误：用户名不能为空！");
				return "loginIndex";
			}

			if (StringUtils.isBlank(password)) {
				map.put("errorMessage", "错误：密码不能为空！");
				return "loginIndex";
			}
			
			Descrypt des = new Descrypt();
			StringBuffer pwdBuffer = new StringBuffer(password);
			StringBuffer newPwdBuffer = new StringBuffer();
			newPwdBuffer = des.StrEnscrypt(pwdBuffer, newPwdBuffer);

			// 检查用户名和密码
			AdUser user = userService.getById(loginName);
			if (user == null) {
				log.error(loginName + "登入失败，当前用户不存在。");
				map.put("errorMessage", "错误：当前用户不存在。");
				return "loginIndex";
			}
			if (!newPwdBuffer.toString().equals(user.getPassword())) {
				log.error(loginName + "登入失败，密码不正确。");
				map.put("errorMessage", "错误：密码不正确。");
				return "loginIndex";
			}
			
			if (Consts.DELFLAG_DEL==user.getDelflag().intValue()) {
				log.error(loginName + "登入失败，当前用户已停用。");
				map.put("errorMessage", "错误：当前用户已停用。");
				return "loginIndex";
			}
			
			// 检查用户登录状态
			 if(user.getLoginflag() != 0) {
				 map.put("errorMessage", "错误：用户["+loginName+"]处于登录状态，不能重复登录！");
				 return "loginIndex";
			 }
			
			 
			 
			 userService.setLoginFlag(loginName, 1);
			 
			 String tempFilePath = ConstsMethod.getWebServerFilePath(Consts.TEMP_DIR,user.getUserid());
			 FileUtil.prepareDir(tempFilePath);	
			 
			 
			 session.setAttribute("user", user);
			
			 AdSysParamtb adSysParamtb= sysParamService.getByParamName("eachPageCount");
			 if(null!=adSysParamtb){
				 Consts.eachPageCount=Integer.valueOf(adSysParamtb.getParamvalue());
			 }
			
			 this.saveOperateLog(user.getUserid(), "登录系统后台.", Consts.SYSLOG_TYPE_LOGININ);
			
			 return "index";
			 
		}catch(Exception e){
			e.printStackTrace();
			log.error("用户登录出错", e);
			map.put("errorMessage", "用户登录出错。"+e.toString());
			return "loginIndex";
		}
		
		
		
	}
	
	
	/**
	 * 退出系统后天
	 * @param session
	 * @return
	 */
	@RequestMapping(value="/loginout")
	public String loginout(HttpSession session) {
		
		try {
			AdUser user = (AdUser)session.getAttribute("user");
			if (user != null) {
				userService.setLoginFlag(user.getUserid(), 0);
				this.saveOperateLog(user.getUserid(), "登出系统后台.", Consts.SYSLOG_TYPE_LOGINOUT);
				session.removeAttribute("user");
			} 
		} catch (Exception e) {
			e.printStackTrace();
			log.error("用户登出失败",e);
		} finally {
			session.invalidate();
		}
		return "loginIndex";
	}
	
	
	
	
	
	public static void main(String[] args){
		String password="1";
		Descrypt des = new Descrypt();
		StringBuffer pwdBuffer = new StringBuffer(password);
		StringBuffer newPwdBuffer = new StringBuffer();
		newPwdBuffer = des.StrEnscrypt(pwdBuffer, newPwdBuffer);
		System.out.println(newPwdBuffer);
		
	}
	
	
	
	/**
	 * 查询菜单
	 * @param operprivid
	 * @param secondprivid
	 * @param session
	 * @param request
	 * @param response
	 * @param map
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "/getSecondMenu")
	public String getSecondMenu(String operprivid,String secondprivid,  HttpSession session, HttpServletRequest request, HttpServletResponse response, ModelMap map) throws Exception {
//		UserstbYj user = (UserstbYj)request.getSession().getAttribute("user");
//		String roleId = user.getRoleid().replaceAll(",", "','");
		
		String fsql = "select max(funcid) from adfunctb where operid='" + operprivid + "'";
		String fristId = jdbcTemplate.queryForObject(fsql, String.class);
	
		//二级菜单
		StringBuffer levelTwo = new StringBuffer();
		 
		levelTwo.append("select distinct a.orderid, a.funcid, a.funcvalue, a.funcname, a.parentfuncid, a.operid ")
				.append("from adfunctb a ")
				.append("where a.delflag =0 and a.funclevel=2 and a.parentfuncid=");
		levelTwo.append(fristId).append(" order by orderid asc");
		
		List<Map<String, String>> menu = jdbcTemplate.query(levelTwo.toString(), new RowMapper<Map<String, String>>(){
			public Map<String, String> mapRow(ResultSet rs, int index)
			throws SQLException {
				Map<String, String> map = new HashMap<String, String>();
				map.put("id", rs.getString("funcid"));
				map.put("operid", rs.getString("operid"));
				map.put("pid", rs.getString("parentfuncid"));
				map.put("name", rs.getString("funcname"));
				map.put("url", rs.getString("funcvalue"));
				return map;
			}
		});	
		
		//三级菜单	
		String level3Pid = "";
		for(Map<String, String> each:menu){
			level3Pid = level3Pid + each.get("id") +",";
		}
		level3Pid = level3Pid.length() > 0?level3Pid.substring(0, level3Pid.length()-1):level3Pid;
		
		StringBuffer levelThree = new StringBuffer();
		levelThree.append("select distinct a.orderid, a.funcid, a.funcvalue, a.funcname, a.parentfuncid, a.funclevel, a.operid ")
				  .append("from adfunctb a ")				  
				  .append("where a.delflag=0 and a.funclevel=3 and a.parentfuncid in(")
				  .append(level3Pid).append(") order by orderid asc");
		
		
		
		List<Map<String, String>> func = jdbcTemplate.query(levelThree.toString(), new RowMapper<Map<String, String>>(){
			public Map<String, String> mapRow(ResultSet rs, int index)
					throws SQLException {
				Map<String, String> map = new HashMap<String, String>();
				map.put("id", rs.getString("funcid"));
				map.put("operid", rs.getString("operid"));
				map.put("pid", rs.getString("parentfuncid"));
				map.put("name", rs.getString("funcname"));
				map.put("url", rs.getString("funcvalue"));
				return map;
			}
		});	
		
		String secondMenuHtml = getSecondMenuHtml(menu,func);
		
		map.put("secondMenuHtml", secondMenuHtml);
		map.put("secondprivid", secondprivid);
		return "secondMenu";
	}
	
	/**
	 * 组装菜单
	 * @param secondMenuList
	 * @param thridMenuList
	 * @return
	 */
	private String getSecondMenuHtml(List<Map<String, String>> secondMenuList,List<Map<String, String>> thridMenuList){
		Map<String,Map<String,String>> topMenuMap=this.getTopMenuMap();
		String secondMenuHtml = "<ul id=\"demo-list\">";
		for(Map<String, String> second:secondMenuList){
			String li = "<li id=\""+second.get("operid")+"\" ><a href=\"javascript:void(0);\">"+second.get("name")+"</a>";
			int num = 0;
			String thridMenuHtml = "";
			for(Map<String, String> thrid:thridMenuList){
				if(thrid.get("pid").equals(second.get("id"))){
					String subLi = "<li id=\""+thrid.get("operid")+"\" ><a href=\"javascript:ShowMain(\\'"+thrid.get("url")+"\\',\\'2\\',\\'"+
					topMenuMap.get(second.get("pid")).get("name")+"\\',\\'"+topMenuMap.get(second.get("pid")).get("operprivid")
					+"\\',\\'"+second.get("name")+"\\',\\'"+second.get("operid")+"\\',\\'"+thrid.get("name")+"\\',\\'"+thrid.get("operid")+"\\');\">"+thrid.get("name")+"</a></li>";
					if(num == 0){
						thridMenuHtml = thridMenuHtml + "<ul class=\"submenu\">";
					}
					thridMenuHtml = thridMenuHtml + subLi;
					num++;
				}
			}
			if(num > 0){
				thridMenuHtml = thridMenuHtml + "</ul>";
			}
			secondMenuHtml = secondMenuHtml + li + thridMenuHtml + "</li>";
		}
		secondMenuHtml = secondMenuHtml + "</ul>";
		return secondMenuHtml;
	}
	
	/**
	 * 查询一级菜单
	 * @return
	 */
	private Map<String,Map<String,String>> getTopMenuMap(){
		SqlRowSet set=this.jdbcTemplate.queryForRowSet("select * from  adfunctb where funclevel=1");
		Map<String,Map<String,String>> map=new HashMap<String,Map<String,String>>();
		while (set.next()){
			Map<String,String> subMap=new HashMap<String,String>();
			subMap.put("name", set.getString("funcname"));
			subMap.put("operprivid",set.getString("operid"));
			map.put(String.valueOf(set.getInt("funcid")), subMap);
		}
		return map;
	}
	
}
