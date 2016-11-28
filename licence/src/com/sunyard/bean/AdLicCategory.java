package com.sunyard.bean;

/**
 *  证照种类
 * @author Administrator
 *
 */
public class AdLicCategory {
	
	private String id;//编号：格式两位数字 01 
	private String name;//分类名称
	private String createuser;//创建人
	private String createtime;//创建时间
	private Integer delflag;//删除标志 0 未删除 1 已删除
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	public String getCreateuser() {
		return createuser;
	}
	public void setCreateuser(String createuser) {
		this.createuser = createuser;
	}
	public String getCreatetime() {
		return createtime;
	}
	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}
	public Integer getDelflag() {
		return delflag;
	}
	public void setDelflag(Integer delflag) {
		this.delflag = delflag;
	}
	

}
