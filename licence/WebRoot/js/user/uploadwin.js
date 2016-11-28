
download_file= function(filePath,fileName){
	window.location.href=Ext.getPath()+'/utilController/downloadTempFile?filePath='+filePath+'&fileName='+fileName;
}
var commonUploadWin=null;
showcommonImportWin=function(url,filePath,fileName){		
		if(commonUploadWin==null){			
			var uploadform = new Ext.FormPanel({
				labelWidth:70,
				frame:true,
				fileUpload: true, //该属性必须配置，否则提交无法成功
				enctype:'multipart/form-data',	//该属性必须配置，否则提交无法成功
				labelAlign:'right',
				defaults:{
					width:300
				},
				items:[{
					html:"<font color='red'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在上传文件之前请先下载批量导入模板&nbsp;&nbsp;</font><a href='javascript:download_file(\""
					+filePath+"\",\""+fileName+"\")'>点击下载</a><br><font color='red'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;书写完成后，请上传</font>",
					border:false,
					xtype: 'label',
					frame:true
				  },{
					xtype: 'textfield',
		            fieldLabel: '文件路径',
		            name: 'form-file',
		            inputType : 'file'
				}]
			});
			commonUploadWin=new Ext.Window({				
				width:400,
				height:200,
				frame:true,
				closeAction:'hide',
				items:[uploadform],
			
			buttons:[{
				text:'上传',
				handler:function(){
				    var filePath = uploadform.getForm().findField('form-file').getValue();
				    if(filePath == null || filePath == ''){
						Ext.Msg.alert('提示',"请您选择要上传的文件！");
						return;
					}
					
				    uploadform.getForm().submit({  
			            url: url, 
			            waitTitle: '提示', 
			            waitMsg:'数据上传中, 请稍等...',
			            params:{
							filePath: filePath
	          			},
			            success:function(form, action) { 
			            	MSG.info(action.result.data,'提示',function(){
			            		commonUploadWin.hide();
			            		grid.getStore().reload();
			            	}); 
			            },  
			            failure : function(form, action) {  			            	
			            	MSG.error(action.result.errorMessage);  
			            }
			        }); 
				 }	 
			}]				
			});
		}
			
		commonUploadWin.show();
}

download_zipfile= function(){
	window.location.href=Ext.getPath()+'/utilController/downloadLicenceImportTemp';
}
var zipUploadWin=null;
showZipImportProductWin=function(url){	
		if(zipUploadWin==null){			
			var uploadform = new Ext.FormPanel({
				labelWidth:70,
				frame:true,
				fileUpload: true, //该属性必须配置，否则提交无法成功
				enctype:'multipart/form-data',	//该属性必须配置，否则提交无法成功
				labelAlign:'right',
				defaults:{
					width:300
				},
				items:[{
					html:"<font color='red'> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在上传文件之前请先下载批量导入模板&nbsp;&nbsp;</font><a href='javascript:download_zipfile()'>点击下载</a><br><font color='red'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;书写完成后，请打包成zip格式上传</font>",
					border:false,
					xtype: 'label',
					frame:true
				  },{
					xtype: 'textfield',
		            fieldLabel: '文件路径',
		            name: 'form-file',
		            inputType : 'file'
				}]
			});
			zipUploadWin=new Ext.Window({				
				width:400,
				height:200,
				frame:true,
				closeAction:'hide',
				items:[uploadform],
			
			buttons:[{
				text:'上传',
				handler:function(){
				    var filePath = uploadform.getForm().findField('form-file').getValue();
				    if(filePath == null || filePath == ''){
						Ext.Msg.alert('提示',"请您选择要上传的zip压缩文件！");
						return;
					}
					
				    uploadform.getForm().submit({  
			            url: url,   
			            waitTitle: '提示', 
			            waitMsg:'数据上传中, 请稍等...',
			            params:{
							filePath: filePath
	          			},
			            success:function(form, action) { 
			            	MSG.info(action.result.data,'提示',function(){
			            		zipUploadWin.hide();
			            		grid.getStore().reload();
			            	}); 
			            },  
			            failure : function(form, action) {  
			            	MSG.error(action.result.errorMessage);  
			            }
			        }); 
				 }	
			}]
			});
			
		}
		zipUploadWin.show();
}