package com.sunyard.tree;

import java.util.ArrayList;
import java.util.List;

public class TreeNode {
	private String id;
	private String text;
	private String type;
	private String cls;
	private String icon;
	private String iconCls;
	private String href;
	private String hrefTarget;
	private boolean leaf;
	private boolean expanded = false;
	private Boolean checked = null;
	private List<TreeNode> children = new ArrayList<TreeNode>();	
	private String parentId;
	private boolean hidden;
	private String flagStr;
	private String desc;
	private String qtip;
	
	public String getQtip() {
		return qtip;
	}

	public void setQtip(String qtip) {
		this.qtip = qtip;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}
	
	public boolean getHidden() {
		return hidden;
	}

	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}

	public TreeNode(){
		
	}

	public TreeNode(String id, String text, boolean leaf) {
		super();
		this.id = id;
		this.text = text;
		this.leaf = leaf;
	}
	public TreeNode(String id, String text, boolean leaf, String href) {
		super();
		this.id = id;
		this.text = text;
		this.leaf = leaf;
		this.href = href;
	}
	
	public TreeNode(String id, String text, String cls, boolean leaf,
			String href) {
		super();
		this.id = id;
		this.text = text;
		this.cls = cls;
		this.leaf = leaf;
		this.href = href;
	}
	
	public TreeNode(String id, String text, String type, String cls,
			String icon, String iconCls, String href, String hrefTarget,
			boolean leaf, boolean expanded, Boolean checked,
			List<TreeNode> children) {
		super();
		this.id = id;
		this.text = text;
		this.type = type;
		this.cls = cls;
		this.icon = icon;
		this.iconCls = iconCls;
		this.href = href;
		this.hrefTarget = hrefTarget;
		this.leaf = leaf;
		this.expanded = expanded;
		this.checked = checked;
		this.children = children;
	}
	
	public TreeNode(String id, String text, String iconCls) {
		super();
		this.id = id;
		this.text = text;
		this.iconCls = iconCls;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getCls() {
		return cls;
	}

	public void setCls(String cls) {
		this.cls = cls;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getHrefTarget() {
		return hrefTarget;
	}

	public void setHrefTarget(String hrefTarget) {
		this.hrefTarget = hrefTarget;
	}

	public boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(boolean leaf) {
		this.leaf = leaf;
	}

	public boolean isExpanded() {
		return expanded;
	}

	public void setExpanded(boolean expanded) {
		this.expanded = expanded;
	}

	public Boolean getChecked() {
		return checked;
	}

	public void setChecked(Boolean checked) {
		this.checked = checked;
	}

	public List<TreeNode> getChildren() {
		return children;
	}

	public void setChildren(List<TreeNode> children) {
		this.children = children;
		
		if(children != null && children.size() > 0) {
			this.setLeaf(false); 
		} else {
			this.setLeaf(true); 
		}
	}
	
	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getFlagStr() {
		return flagStr;
	}

	public void setFlagStr(String flagStr) {
		this.flagStr = flagStr;
	}
}
