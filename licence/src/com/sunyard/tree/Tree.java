package com.sunyard.tree;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 树节节点分析
 * 
 * @author 彭辉 2012-3-13
 */
public class Tree {
	private List<TreeNode> data;
	private Map<String,String> rel = new HashMap<String,String>();
	private TreeNode rootNode;
	private RootFilter rootFilter;
	private ArrayList<TreeNode> roots = new ArrayList<TreeNode>();

	public Tree() {
		super();
	}

	public Tree(List<TreeNode> data) {
		super();
		this.data = data;
	}
	
	/**
	 * 将节点父子管理转换为Map保存
	 */
	private void analyse() {
		if (rootNode != null) {
			rootFilter = null;
			String rootId = rootNode.getId();
			if (data != null && data.size() > 0) {
				for (int i = 0; i < data.size(); i++) {
					TreeNode node = data.get(i);
					String id = node.getId();
					String parent = node.getParentId();
					if (parent.toString().equals(rootId) && id.toString().equals(rootId))
						continue;
					String idx = (String) rel.get(parent);
					if (idx != null && idx.trim().length() > 0) {
						idx += "," + i;
					} else {
						idx = "" + i;
					}
					rel.put(parent, idx);
				}
			}
		} else if (rootFilter != null) {
			if (data != null && data.size() > 0) {
				for (int i = 0; i < data.size(); i++) {
					TreeNode node = data.get(i);
					String parent = node.getParentId();
					if (rootFilter.isRoot(node)) {
						roots.add(node);
						continue;
					}
					String idx = (String) rel.get(parent);
					if (idx != null && idx.trim().length() > 0) {
						idx += "," + i;
					} else {
						idx = "" + i;
					}
					rel.put(parent, idx);
				}
			}
		}
	}

	/**
	 * 递归分析父子关系
	 * @param node
	 */
	private void iterate(TreeNode node) {
		String id = node.getId();
		if (hasChildNodes(id)) {
			List<TreeNode> childNodes = getChildNodes(id);
			node.setChildren(childNodes);
			node.setLeaf(false);
			for (int i = 0; i < childNodes.size(); i++) {
				TreeNode child = childNodes.get(i);
				iterate(child);
			}
		} else {
			node.setLeaf(true);
		}
	}

	/**
	 * 获取节点id获取�?��子节�?
	 * @param node
	 * @return
	 */
	public List<TreeNode> getChildNodes(String id) {
		List<TreeNode> list = new ArrayList<TreeNode>();
		String idx = (String) rel.get(id);
		String[] arr = idx.split(",");
		for (int i = 0; i < arr.length; i++) {
			list.add(data.get(Integer.parseInt(arr[i])));
		}
		return list;
	}

	/**
	 * 根据节点id查询是否有子节点
	 * @param id
	 * @return
	 */
	public boolean hasChildNodes(String id) {
		String idx = (String) rel.get(id);
		return (idx != null) && (idx.length() > 0);
	}

	/**
	 * 获取分析数据
	 * @return
	 */
	public List<TreeNode> getData() {
		return data;
	}

	/**
	 * 设置分析数据
	 * @param data
	 */
	public void setData(List<TreeNode> data) {
		this.data = data;
	}

	/**
	 * 获取根节�?
	 * @return
	 */
	public List<TreeNode> getRootNode() {
		return roots;
	}

	/**
	 * 设置根节�?
	 * @param rootNode
	 */
	public void setRootNode(TreeNode rootNode) {
		this.rootNode = rootNode;
		this.roots.add(rootNode);
	}
	
	/**
	 * 设置根节点条件�?择器
	 * @param rootFilter
	 */
	public void setRootFilter(RootFilter rootFilter) {
		this.rootFilter = rootFilter;
	}
	
	/**
	 * 获取树形结构节点
	 * @return
	 */
	public List<TreeNode> getTreeNode() {
		List<TreeNode> result = new ArrayList<TreeNode>();
		this.analyse();
		for(TreeNode root:roots) {
			iterate(root);
			result.add(root);
		}
		return result;
	}
}
