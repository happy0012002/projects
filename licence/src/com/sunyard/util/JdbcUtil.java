package com.sunyard.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.sunyard.util.Consts;

/**
 * 修改getConnection方法 彭辉 2012-3-1
 * 
 * @author
 * 
 */
public class JdbcUtil {

	/**
	 * 取消了方法同步 获取数据库连接
	 * 
	 * @return
	 */
	private static Log log = LogFactory.getLog(JdbcUtil.class);
    private static int i =0;
	public static Connection getConnection() {
		Connection con = null;
		try {
			Class.forName(Consts.Driver_Name);
			con = DriverManager.getConnection(Consts.URL, Consts.UserName,
					Consts.Password);
		} catch (Exception e) {
			if(i<4){
				i++;
				return getConnection();
			}
			log.error("创建连接失败:" ,e);
		    e.printStackTrace();
		}
		return con;
	}

	

	

	public static List<String[]> pubFindBig(Connection con, String sql, Integer num) {
		// Connection con=null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		List<String[]> list = new ArrayList();
		try {
			// con=JdbcUtil.getConnection();
			con.setAutoCommit(false);
			ps = con.prepareStatement(sql);
			rs = ps.executeQuery();
			if (rs == null) {
				return null;
			}
			while (rs.next()) {
				int index = 1;
				String[] temp = new String[num];
				for (int i = 0; i < temp.length; i++) {
					String t = String.valueOf(rs.getObject(index));
					if ("null".equals(t)) {
						temp[i] = "";
						index++;
					} else {
						temp[i] = t;
						index++;
					}
				}
				list.add(temp);
			}
			con.commit();
		} catch (SQLException e) {
			try {
				con.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
			}
			e.printStackTrace();
		} finally {
			JdbcUtil.release(rs);
			JdbcUtil.release(ps);
			// JdbcUtil.release(rs, ps, con);
		}
		return list;
	}

	public static void printRs(ResultSet rs) {
		try {
			StringBuffer sb = new StringBuffer();
			ResultSetMetaData meta = rs.getMetaData();
			int num = meta.getColumnCount();
			for (int j = 1; j <= num; j++) {
				String title = meta.getColumnName(j);
				int size = meta.getColumnDisplaySize(j);
				if (size != 0) {
					int bsize = size - title.length();
					for (int i = 0; i < bsize / 2; i++) {
						sb.append(" ");
					}
					sb.append(title);
					int lsize = 0;
					if (bsize % 2 == 0) {
						lsize = bsize / 2;
					} else {
						lsize = bsize / 2 + 1;
					}
					for (int i = 0; i < lsize; i++) {
						sb.append(" ");
					}
				}
			}
			sb.append("\n");
			while (rs.next()) {
				for (int j = 1; j <= num; j++) {
					String col = rs.getString(j);
					int size = meta.getColumnDisplaySize(j);
					if (size != 0) {
						int bsize = size;
						if (col != null)
							bsize = size - col.length();
						for (int i = 0; i < bsize / 2; i++) {
							sb.append(" ");
						}
						sb.append(col);
						int lsize = 0;
						if (bsize % 2 == 0) {
							lsize = bsize / 2;
						} else {
							lsize = bsize / 2 + 1;
						}
						for (int i = 0; i < lsize; i++) {
							sb.append(" ");
						}
					}
				}
				sb.append("\n");
			}
		} catch (Exception e) {
			log.error("",e);
			e.printStackTrace();
		}
	}

	/**
	 * 释放数据库连接资源
	 * 
	 * @param o
	 */
	public static void release(Object o) {
		try {
			if (o instanceof ResultSet) {
				((ResultSet) o).close();
			} else if (o instanceof Statement) {
				((Statement) o).close();
			} else if (o instanceof Connection) {
				((Connection) o).close();
			}
		} catch (Exception e) {
			log.error("",e);
			e.printStackTrace();
		}
	}

	/**
	 * 释放数据库连接资源
	 * 
	 * @param rs
	 * @param stmt
	 * @param con
	 */
	public static void release(ResultSet rs, Statement stmt, Connection con) {
		if (rs != null) {
			try {
				rs.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		if (stmt != null) {
			try {
				stmt.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		if (con != null) {
			try {
				con.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

	}

	public static void excute(String[] sqls) {
		Connection conn = null;
		Statement statement = null;
		try {
			conn = JdbcUtil.getConnection();
			statement = conn.createStatement();
			for (String sql : sqls) {
				statement.addBatch(sql);
			}
			statement.executeBatch();
			conn.commit();
		} catch (SQLException e) {
			try {
				conn.rollback();
			} catch (SQLException e1) {
				e1.printStackTrace();
				throw new RuntimeException("未知错误");
			}
			e.printStackTrace();
			String message = e.getMessage();
			if (message.indexOf("ORA") != -1) {
				message = StringUtils.substringAfter(message, "ORA");
				message = "ORA" + message;
			}
			throw new RuntimeException(message.replaceAll("\n", ""));
		} finally {
			try {
				statement.close();
			} catch (SQLException e1) {
				log.error("",e1);
				e1.printStackTrace();
			}
			try {
				conn.close();
			} catch (SQLException e) {
				log.error("",e);
				e.printStackTrace();
			}
		}
	}

	public static String changeDBType(Long dbType) {
		if (dbType == 0) {
			return "db2";
		} else if (dbType == 1) {
			return "oracle";
		} else {
			throw new RuntimeException("暂时不支持数据库类型" + dbType);
		}
	}

	public static void main(String[] args) {
		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
			String url = "jdbc:oracle:thin:@172.16.16.91:1521:auditdb";
			Connection con = DriverManager.getConnection(url, "sjxt2", "sjxt2");
			Statement stat = con.createStatement();
			ResultSet rs = stat.executeQuery("select * from dicinfo");
			while (rs.next()) {
				System.out.println(rs.getString(2) + rs.getString(3));
			}
			rs.close();
			stat.close();
			con.close();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}