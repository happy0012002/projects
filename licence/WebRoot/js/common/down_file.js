function Load(){
	var WebOffice = document.getElementById("WebOffice");
	WebOffice.WebUrl = path+'/template4/office_server.jsp';
	//以下属性必须设置，实始化iWebOffice
	//WebOffice.FileName=filename;
	//WebOffice.FileType=filetype;
	//var editable = ('undefined'!= typeof RuleContentCanCopy)&&RuleContentCanCopy=='0'?'0,1':'4,1';
	WebOffice.EditType = '4,1';
	//WebOffice.UserName=userid;
	WebOffice.ShowToolBar = "2";  //ShowToolBar:是否显示工具栏:1显示,0不显示
	WebOffice.ShowMenu="0";
}

function downAndOpen(serverFilePath, fileName){
	downSeverFileToClient(serverFilePath, fileName);
}

function downSeverFileToClient(serverFilePath, fileName){
	
	WebOffice.WebUrl = path+'/template4/office_server.jsp';
   	Ext.Ajax.request({
   		url:Ext.getPath()+"/utilController/downFileToClient",
   		params: {serverFilePath: serverFilePath, fileName: fileName},
   		//async: false,
   		callback: function(o, s, response) {
   			var json = Ext.decode(response.responseText);
   			if(json && json.success) {
			  	if (createDirectory()) {
			  		WebOffice.WebMkDirectory("c:\\AuditFile\\");
				  	if(WebOffice.WebGetFile("c:\\AuditFile\\"+fileName, fileName)){
				  		WebOffice.WebOpenLocalFile(localpath); //打开本地文档
				  	} else {
				  		reValue =false;
				  		alert("下载文件失败。无法打开。");
				  	}	  		
			  	} else {
			  		WebOffice.WebMkDirectory("c:\\AuditFile\\");
				  	if(WebOffice.WebGetFile("c:\\AuditFile\\"+fileName, fileName)){
				  		WebOffice.WebOpenLocalFile(localpath); //打开本地文档
				  	} else {
				  		alert("下载文件失败。无法打开。");
				  	}
			  	}
   			}
   			if(json && !json.success) {
   				alert(json.errorMessage);
   			}
   		}
   	});
}

/**
 * 文件上传到服务
 * @param {} webOffice weboffice对象
 * @param {} fileName  上传的文件名称
 */
//function upLoadFileToServer(){//path, fileName, uploadFileType
//	var retValue="";
//	if(createDirectory(WebOffice)){//创建本机目录
//		if(WebOffice.WebPutFile('C:\\Users\\lenovo\\Desktop\\swt.txt', 'swt.txt')){
//		   	Ext.Ajax.request({
//		   		url:Ext.getPath()+"/adPubFileController/upLoadFileToServer",
//		   		params: {fileName:'swt.txt', catalogFile:'versionfile'},
//		   		async: false,
//		   		callback: function(o,s,response) {
//		   			var json = Ext.decode(response.responseText);
//		   			if(json && json.success) {
//		   				retValue = json.data;
//		   			}
//		   			if(json && !json.success) {
//		   				return "";
//		   			}
//		   		}
//		   	});	
//			
//		} else {
//			alert("文档上传到应用服务失败，请查看系统是否正常。");
//			return "";
//		}
//	} else {
//		alert("本机目录(C:\AuditFile)创建失败。");
//		return "";
//	}
//	return retValue;
//}

/**
 * 在C盘创建一个临时目录AuditFile
 */
function createDirectory(){
	WebOffice.WebDelTree("c:\\AuditFile\\");
	var ret = WebOffice.WebMkDirectory("c:\\AuditFile\\");
	//alert(ret);
	return ret;
}

function openFile(){
	WebOffice.WebOpenLocalFile(localpath); //打开本地文档
}

var WebOpenPrint=function(){ //打印
 	WebOffice.WebOpenPrint();
}

var WebFullSize=function(){ //全屏显示
	WebOffice.FullSize();
}

function UnLoad(){
    WebOffice.WebClose();  //作用：退出iWebOffice
}