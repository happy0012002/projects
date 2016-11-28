package com.sunyard.util;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sunyard.util.StringUtil;

public class ConstsMethod {

	private static long timeId = new Date().getTime() * 100;

	/**
	 * 获取唯一Id
	 * 
	 * @return
	 */
	public synchronized static String getUniqueTime() {
		return String.valueOf(++timeId);
	}

	/**
	 * 
	 * @param StringArray
	 * @return
	 */
	public static String getWebServerFilePath(String... StringArray) {
		String ret = Consts.SYSPATH;
		for (String path : StringArray) {
			ret += File.separatorChar;
			ret += path;
		}
		return ret;
	}

	public static String getTempPath() {
		return getWebServerFilePath(Consts.TEMP_DIR);
	}

	public static String getWebServerIndexFilePath(String... StringArray) {
		String ret = Consts.SYSPATH;
		ret = ret.substring(0, ret.length() - 6);
		ret += File.separatorChar;
		ret += "AuditIndex";
		for (String path : StringArray) {
			ret += File.separatorChar;
			ret += path;
		}
		return ret;
	}

	public static String getWebServerFilePathWithSource(String sourcePath,
			String... StringArray) {
		for (String path : StringArray) {
			sourcePath += File.separatorChar;
			sourcePath += path;
		}
		return sourcePath;
	}

	public static String getCurrentTime() {
		return Consts.yyyy_MM_dd_HHmmss.format(new Date());
	}

	public static String getCurrentDate() {
		return Consts.yyyy_MM_dd.format(new Date());
	}

	public static String getOneMonthAfter() {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, 1);
		String oneMonthAfter = Consts.yyyy_MM_dd.format(c.getTime());
		return oneMonthAfter;
	}

}
