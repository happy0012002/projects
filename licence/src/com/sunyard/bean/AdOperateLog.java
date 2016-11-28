package com.sunyard.bean;

/**
 * 操作日志
 * @author Administrator
 *
 */
public class AdOperateLog {
	
	
	private Integer id;//编号 数据库自增
	private String userid;//用户名
	private String operatetime;//操作时间
	private String operatecontent;//操作内容
	private String operatecategory;//操作种类
	
	private String operatetimeeq;
	private String operatetimelt;
	private String operatetimegt;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getUserid() {
		return userid;
	}
	public void setUserid(String userid) {
		this.userid = userid;
	}
	public String getOperatetime() {
		return operatetime;
	}
	public void setOperatetime(String operatetime) {
		this.operatetime = operatetime;
	}
	public String getOperatecontent() {
		return operatecontent;
	}
	public void setOperatecontent(String operatecontent) {
		this.operatecontent = operatecontent;
	}
	public String getOperatecategory() {
		return operatecategory;
	}
	public void setOperatecategory(String operatecategory) {
		this.operatecategory = operatecategory;
	}
	public String getOperatetimeeq() {
		return operatetimeeq;
	}
	public void setOperatetimeeq(String operatetimeeq) {
		this.operatetimeeq = operatetimeeq;
	}
	public String getOperatetimelt() {
		return operatetimelt;
	}
	public void setOperatetimelt(String operatetimelt) {
		this.operatetimelt = operatetimelt;
	}
	public String getOperatetimegt() {
		return operatetimegt;
	}
	public void setOperatetimegt(String operatetimegt) {
		this.operatetimegt = operatetimegt;
	}
	


}
