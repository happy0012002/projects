package com.sunyard.bean;

public class AdUser {
	private String userid;//用户名
	private String password;//密码
	private String username;//姓名
	private String tel;//联系电话
	private Integer loginflag;//登录状态 0未登录 1已登录
	private String createtime;//创建时间
	private String pwdeditdate;//最后密码修改时间
	private String roleid;//角色 逗号分隔
	private Integer delflag;//状态 0未删除  1删除
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public Integer getLoginflag() {
		return loginflag;
	}
	public void setLoginflag(Integer loginflag) {
		this.loginflag = loginflag;
	}
	public String getCreatetime() {
		return createtime;
	}
	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}
	public String getPwdeditdate() {
		return pwdeditdate;
	}
	public void setPwdeditdate(String pwdeditdate) {
		this.pwdeditdate = pwdeditdate;
	}
	public String getRoleid() {
		return roleid;
	}
	public void setRoleid(String roleid) {
		this.roleid = roleid;
	}
	public Integer getDelflag() {
		return delflag;
	}
	public void setDelflag(Integer delflag) {
		this.delflag = delflag;
	}

	
}
