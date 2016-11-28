package com.sunyard.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;

import com.sunyard.bean.AdUser;
import com.sunyard.extjs.ExtFormResult;
import com.sunyard.extjs.pagination.PaginationBeanParam;
import com.sunyard.extjs.store.JsonData;
import com.sunyard.service.UserService;
import com.sunyard.util.Consts;
import com.sunyard.util.ConstsMethod;
import com.sunyard.util.Descrypt;
import com.sunyard.util.StringUtil;


/**
 * 用户管理
 * @author Administrator
 *
 */
@Controller
@RequestMapping(value = "/userController")
@SessionAttributes("user")
public class UserController extends BaseController {

	@Autowired
	private UserService userService;

	/**
	 * 用户列表页面
	 * 
	 * @return
	 */
	@RequestMapping("/toUserList")
	public String toUserList() {
		return "page/userList";
	}

	
	/**
	 * 查询用户数据
	 * @param param
	 * @param user
	 * @return
	 */
	@RequestMapping("/getUserData")
	@ResponseBody
	public JsonData getUserData(PaginationBeanParam param, AdUser user) {

		JsonData jd = null;
		try {
			String sql = "select * from aduser where 1=1";
			
			if(null!=user.getLoginflag()){
				sql+=" and loginflag="+user.getLoginflag();
			}
			if(StringUtil.isNotNull(user.getUserid())){
				sql+=" and userid like '%"+user.getUserid()+"%'";		
			}
			if(StringUtil.isNotNull(user.getUsername())){
				sql+=" and username like '%"+user.getUsername()+"%'";		
			}
			param.setSql(sql);
			param.setSort("userid");
			jd = this.paginationTemplate.getJsonData(param);

		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
		}
		return jd;

	}

	
	/**
	 * 用户修改和添加
	 * @param user
	 * @param actionType
	 * @param request
	 * @return
	 */
	@RequestMapping("/saveUser")
	@ResponseBody
	public ExtFormResult<String> saveUser( AdUser user,int actionType,HttpServletRequest request) {
		AdUser sessionUser=(AdUser)request.getSession().getAttribute("user");
		ExtFormResult<String> efr=new ExtFormResult<String>();
		try {
			AdUser exsitUser=userService.getById(user.getUserid());
			if(0==actionType){//新增
				
				if(exsitUser!=null){
					efr.setSuccess(false);
					efr.setErrorMessage("新增用户失败！原因：用户名不能重复，该用户名已经存在！");
					return efr;
				}
				user.setLoginflag(0);
				user.setCreatetime(ConstsMethod.getCurrentTime());
				user.setDelflag(Consts.DELFLAG_NOTDEL);
				//加密
				StringBuffer out=new StringBuffer();
				out=new Descrypt().StrEnscrypt(new StringBuffer(user.getPassword()), out);
				user.setPassword(out.toString());
				
				userService.addUser(user);				
				this.saveOperateLog(sessionUser.getUserid(), "添加用户["+user.getUserid()+"]", Consts.SYSLOG_TYPE_USERMGR);
				efr.setData("新增用户成功！");
			}else{//修改
				if(exsitUser==null){
					efr.setSuccess(false);
					efr.setErrorMessage("修改用户失败！原因：该用户不存在！");
					return efr;
				}
				exsitUser.setRoleid(user.getRoleid());
				exsitUser.setTel(user.getTel());
				exsitUser.setUsername(user.getUsername());
				userService.modifyUser(exsitUser);
				this.saveOperateLog(sessionUser.getUserid(), "修改用户["+user.getUserid()+"]", Consts.SYSLOG_TYPE_USERMGR);
				efr.setData("修改用户成功！");
			}
			
			efr.setSuccess(true);
			
		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
			efr.setSuccess(false);
			efr.setErrorMessage("新增或修改用户失败！原因："+e.toString());
		}
		return efr;

	}
	
	
	/**
	 * 查询用户根据userid
	 * @param userid
	 * @param request
	 * @return
	 */
	@RequestMapping("/getById")
	@ResponseBody
	public ExtFormResult<AdUser> getById(String userid,HttpServletRequest request) {
		ExtFormResult<AdUser>  efr=new ExtFormResult<AdUser> ();
		try{
			AdUser adUser=this.userService.getById(userid);
			if(null==adUser){
				efr.setSuccess(false);
				efr.setErrorMessage("查询失败，用户名为【"+userid+"】的用户没有找到！");				
			}else{
				
				efr.setSuccess(true);
				efr.setData(adUser);
			}
			
		}catch(Exception e){
			efr.setSuccess(false);
			efr.setErrorMessage("查询失败，用户名为【"+userid+"】的用户没有找到！");
			e.printStackTrace();
			log.error("",e);
			
		}
		return efr;
		
	}
	
	
	/**
	 * 密码修改页面
	 * @param request
	 * @return
	 */
	@RequestMapping("/toModifyPwdPage")
	public String toModifyPwdPage(HttpServletRequest request) {			
		return "page/modifypwdpage";	
	}
	
	/**
	 * 密码修改
	 * @param user
	 * @param request
	 * @return
	 */
	@RequestMapping("/modifypwd")
	@ResponseBody
	public ExtFormResult<String> modifypwd(AdUser user,HttpServletRequest request) {
		AdUser sessionUser=(AdUser)request.getSession().getAttribute("user");
		ExtFormResult<String> efr=new ExtFormResult<String>();
		try {
			AdUser exsitUser=userService.getById(user.getUserid());
			if(exsitUser==null){
				efr.setSuccess(false);
				efr.setErrorMessage("修改密码失败！原因：该用户不存在！");
				return efr;
			}
			//加密
			StringBuffer out=new StringBuffer();
			out=new Descrypt().StrEnscrypt(new StringBuffer(user.getPassword()), out);
			exsitUser.setPassword(out.toString());
			userService.modifyUser(exsitUser);
			this.saveOperateLog(sessionUser.getUserid(), "修改用户["+user.getUserid()+"]的密码。", Consts.SYSLOG_TYPE_PWDMODIRY);
			efr.setData("修改用户密码成功！");
			efr.setSuccess(true);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
			efr.setSuccess(false);
			efr.setErrorMessage("修改密码失败！原因："+e.toString());
		}
		return efr;
		
	}
	
	/**
	 *  解锁用户
	 * @param userId
	 * @param request
	 * @return
	 */
	@RequestMapping("/unlockUser")
	@ResponseBody
	public ExtFormResult<String> unlockUser(String  userIds,HttpServletRequest request) {
		AdUser sessionUser=(AdUser)request.getSession().getAttribute("user");
		ExtFormResult<String> efr=new ExtFormResult<String>();
		try {
			for(String userId:userIds.split(",")){
				AdUser exsitUser=userService.getById(userId);
				if(exsitUser==null){
					efr.setSuccess(false);
					efr.setErrorMessage("解锁用户失败！原因：该用户不存在！");
					return efr;
				}
				exsitUser.setLoginflag(0);
				userService.modifyUser(exsitUser);
				this.saveOperateLog(sessionUser.getUserid(), "解锁用户["+userId+"]", Consts.SYSLOG_TYPE_USERMGR);
			}
			efr.setData("解锁用户成功！");
			efr.setSuccess(true);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
			efr.setSuccess(false);
			efr.setErrorMessage("解锁用户失败！原因："+e.toString());
		}
		return efr;
		
	}
	
	
	/**
	 *  停用和启用用户
	 * @param userId
	 * @param request
	 * @param type 1 停用  2启用
	 * @return
	 */
	@RequestMapping("/stopResumeUser")
	@ResponseBody
	public ExtFormResult<String> stopResumeUser(String  userIds,HttpServletRequest request ,int type) {
		AdUser sessionUser=(AdUser)request.getSession().getAttribute("user");
		String desc=(type==1)?"停用":"启用";
		ExtFormResult<String> efr=new ExtFormResult<String>();
		try {
			
			for(String userId:userIds.split(",")){
				AdUser exsitUser=userService.getById(userId);
				if(exsitUser==null){
					efr.setSuccess(false);
					efr.setErrorMessage(desc+"用户["+userId+"]失败！原因：该用户不存在！");
					return efr;
				}
				exsitUser.setDelflag(type==1?Consts.DELFLAG_DEL:Consts.DELFLAG_NOTDEL);				
				exsitUser.setLoginflag(0);//踢出该用户				
				userService.modifyUser(exsitUser);
				this.saveOperateLog(sessionUser.getUserid(), desc+"用户["+userId+"]", Consts.SYSLOG_TYPE_USERMGR);
			}
			efr.setData(desc+"用户成功！");
			efr.setSuccess(true);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("", e);
			efr.setSuccess(false);
			efr.setErrorMessage(desc+"用户失败！原因："+e.toString());
		}
		return efr;
		
	}
}