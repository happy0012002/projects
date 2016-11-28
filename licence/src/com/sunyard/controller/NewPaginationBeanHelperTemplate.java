package com.sunyard.controller;

import com.sunyard.extjs.pagination.PaginationBeanHelperTemplate;
import com.sunyard.extjs.pagination.PaginationBeanParam;
import com.sunyard.extjs.store.JsonData;
import com.sunyard.extjs.store.MetaData;



public class NewPaginationBeanHelperTemplate extends  PaginationBeanHelperTemplate {	
	
	public JsonData getJsonData(PaginationBeanParam param,Object[] args) {
		int start = param.getStart().intValue();
		int limit = param.getLimit().intValue();
		//Object[] params = new Object[0];
		JsonData jd = new JsonData();
		MetaData md = getMetaData(param);
		if ((param.getLoadtime().intValue() == 1) || (param.getSumup() == null) || (param.getSumup().booleanValue()))//��һ�μ���
			jd.setCount(getTotalSize(param.getCountSql(getDatabase()), args));
		else {
			jd.setCount(param.getTotalSize());
		}

		jd.setResults(getData(md, param.getQuerySql(getDatabase()), args, start, limit));
		jd.setMetaData(md);
		jd.setColumns(param.getFieldsDefine());
		return jd;
	}
	
//	 public static MetaData getMetaData(PaginationBeanParam param)
//	  {
//	    MetaData md = new MetaData();
//	    md.setIdProperty(param.getIdProperty());
//	    md.setSortInfo(param.getSortMap());
//	    return md;
//	  }
//	 protected Long getTotalSize(String sql, Object[] params)
//	  {
//	    long s = System.currentTimeMillis();
//	    Long count = Long.valueOf(this.jdbcTemplate.queryForLong(sql, params));
//	    long e = System.currentTimeMillis();
//	    log.info("final countSql : [{}] ִ���� {} ����.", sql, Long.valueOf(e - s));
//	    return count;
//	  }
//	 
//	 public String getCountSql(String database) {
//		    return SqlParserFactory.getSqlParser(database).getCountSql(this);
//		  }

}
