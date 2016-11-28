package com.sunyard.bean;

/**
 * 证照
 * @author Administrator
 *
 */
public class AdLicence {

	private String id;//编号 格式：6位唯一编码
	private String expdate;//过期日期
	private String orgid;//公司编号
	private String categoryid;//种类编号
	private String name;//名称
	private String remark;//备注
	private String imgpath;//图片路径
	private String imgname;//图片名称
	private Integer group;//分组 如果分组一样说明是同一个证照 只是一个新 一个旧而已
	private String createtime;//创建时间
	private String createuser;//创建用户
	private Integer delflag;//删除标志 0未删除 1删除
	
	//非持久化字段
	
	
	private String  expdatetype;
	private String expdatelt;
	private String expdateeq;
	private String expdategt;
	private String orgName;

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getExpdate() {
		return expdate;
	}
	public void setExpdate(String expdate) {
		this.expdate = expdate;
	}
	public String getOrgid() {
		return orgid;
	}
	public void setOrgid(String orgid) {
		this.orgid = orgid;
	}
	public String getCategoryid() {
		return categoryid;
	}
	public void setCategoryid(String categoryid) {
		this.categoryid = categoryid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getImgpath() {
		return imgpath;
	}
	public void setImgpath(String imgpath) {
		this.imgpath = imgpath;
	}
	public Integer getGroup() {
		return group;
	}
	public void setGroup(Integer group) {
		this.group = group;
	}
	public String getCreatetime() {
		return createtime;
	}
	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}
	public String getCreateuser() {
		return createuser;
	}
	public void setCreateuser(String createuser) {
		this.createuser = createuser;
	}
	
	public Integer getDelflag() {
		return delflag;
	}
	public void setDelflag(Integer delflag) {
		this.delflag = delflag;
	}
	public String getImgname() {
		return imgname;
	}
	public void setImgname(String imgname) {
		this.imgname = imgname;
	}
	public String getExpdatetype() {
		return expdatetype;
	}
	public void setExpdatetype(String expdatetype) {
		this.expdatetype = expdatetype;
	}
	public String getExpdatelt() {
		return expdatelt;
	}
	public void setExpdatelt(String expdatelt) {
		this.expdatelt = expdatelt;
	}
	public String getExpdateeq() {
		return expdateeq;
	}
	public void setExpdateeq(String expdateeq) {
		this.expdateeq = expdateeq;
	}
	public String getExpdategt() {
		return expdategt;
	}
	public void setExpdategt(String expdategt) {
		this.expdategt = expdategt;
	}
	public String getOrgName() {
		return orgName;
	}
	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	
	
	
}
