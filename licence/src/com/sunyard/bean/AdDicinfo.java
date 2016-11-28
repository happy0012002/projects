package com.sunyard.bean;


/**
 * 字段表
 * @author Administrator
 *
 */
public class AdDicinfo {

	private String fieldname; //分类
	private String code;//分类中具体代码
	private String content;//内容
	private String parentfieldname;//父级分类名称
	private String parentcode;//父级分类代码

	public String getFieldname() {
		return fieldname;
	}

	public void setFieldname(String fieldname) {
		this.fieldname = fieldname;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getParentfieldname() {
		return parentfieldname;
	}

	public void setParentfieldname(String parentfieldname) {
		this.parentfieldname = parentfieldname;
	}

	public String getParentcode() {
		return parentcode;
	}

	public void setParentcode(String parentcode) {
		this.parentcode = parentcode;
	}

}
