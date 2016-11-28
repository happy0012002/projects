package com.sunyard.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Consts {

	//数据库配置
	public static String Driver_Name=null;
	public static String URL=null;
	public static String UserName=null;
	public static String Password=null;
	
	//图片根目录
	public static String IMGSTORE=null;	
	
	//ϵͳ系统根路径
	public static String  SYSPATH=null;
	
	public static final String TEMP_DIR="temp";//temp目录
	public static final String LOG_DIR="log";
	
	public static Integer eachPageCount=20;//每页显示行社
	
	//模板路径
	public static final String  LICENCE_IMPORT_TEMPLATE_PATH="template/证照信息.zip";
	public static final String  LICENCE_IMPORT_TEMPLATE_NAME="证照导入模板.xls";
	public static final String  LICENCE_IMPORT_TEMPLATE_ZIPNAME="证照信息";
	
	public static final String  ORG_IMPORT_TEMPLATE_PATH="template/adorgtemp.xls";
	public static final String  ORG_MPORT_TEMPLATE_NAME="公司导入模板.xls";
	
	public static String enddate="";
	
	
	
	
	//日期格式化 
	public static final DateFormat yyyy_MM_dd=new SimpleDateFormat("yyyy-MM-dd");
	public static final DateFormat yyyy_MM_dd_HHmmss=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	public static final DateFormat yyyyMMdd=new SimpleDateFormat("yyyyMMdd");

	public static final String showDate="yyyy年MM月dd日";//日期格式化类型
	
	public static final int DELFLAG_NOTDEL=0;//未删除
	public static final int DELFLAG_DEL=1;//已删除
	
	
	public static final int ACTION_TYPE_ADD=0;//新增	
	public static final int ACTION_TYPE_MODYFI=1;//修改
	
	
	
	public static final String[] EXCEL_COLUMN_NO={"A","B","C","D","E","F","G","H","H","J","K","L","M","N","O"};//excel第几列	
	public static List<String> allowed_img_suffix=null;//允许的图片格式
	public static Map<String,String> ContentTypeMap=new HashMap<String,String>();
	static{
		allowed_img_suffix=new ArrayList<String>();
		allowed_img_suffix.add(".png");
		allowed_img_suffix.add(".gif");
		
		allowed_img_suffix.add(".bmp");
		allowed_img_suffix.add(".dib");
		
		allowed_img_suffix.add(".jpg");
		allowed_img_suffix.add(".jfif");
		allowed_img_suffix.add(".jpeg");
		allowed_img_suffix.add(".jpe");
		
		allowed_img_suffix.add(".tif");
		allowed_img_suffix.add(".tiff");
		
		allowed_img_suffix.add(".svg");
		allowed_img_suffix.add(".pcx");
		allowed_img_suffix.add(".dxf");
		allowed_img_suffix.add(".wmf");
		allowed_img_suffix.add(".emf");
		allowed_img_suffix.add(".lic");
		allowed_img_suffix.add(".fli");
		allowed_img_suffix.add(".flc");
		allowed_img_suffix.add(".eps");
		allowed_img_suffix.add(".tga");
		
		
		/*value="image/bmp">BMP
		value="image/gif">GIF
		value="image/jpeg">JPEG
		value="image/tiff">TIFF
		value="image/x-dcx">DCX
		value="image/x-pcx">PCX
		value="text/html">HTML
		value="text/plain">TXT
		value="text/xml">XML
		value="application/afp">AFP
		value="application/pdf">PDF
		value="application/rtf">RTF 
		value="application/msword">MSWORD
		value="application/vnd.ms-excel">MSEXCEL
		value="application/vnd.ms-powerpoint">MSPOWERPOINT
		value="application/wordperfect5.1">WORDPERFECT
		value="application/vnd.lotus-wordpro">WORDPRO
		value="application/vnd.visio">VISIO
		value="application/vnd.framemaker">FRAMEMAKER
		value="application/vnd.lotus-1-2-3">LOTUS123*/
	}
	
	
	public static final String SYSLOG_FIELDNAME="SyslogType";
	public static final String SYSLOG_TYPE_LOGININ="0101";//登录
	public static final String SYSLOG_TYPE_LOGINOUT="0102";//登出
	public static final String SYSLOG_TYPE_PWDMODIRY="0103";//密码修改
	public static final String SYSLOG_TYPE_USERMGR="0104";//用户管理
	public static final String SYSLOG_TYPE_SYSPARAMMODIFY="0201";//系统参数修改
	public static final String SYSLOG_TYPE_LICCMGR="0301";//证照管理
	public static final String SYSLOG_TYPE_ORGMGR="0401";//公司管理
	public static final String SYSLOG_TYPE_LICMGR="0501";//证照管理
	
	
	
	
	
	
	
}
