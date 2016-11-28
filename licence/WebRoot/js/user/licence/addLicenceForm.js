
function modifyLicence(id){
	var win=new Ext.modifyLicenceFormWin();
	win.setParam({id:id});
	if(buttonHidden){
		win.setTitle('查看证照详细');
	}
	win.show();
}

function addLicence(){
	 var win=new Ext.addLicenceFormWin();	
	 win.setParam({orgid:orgId});
	 win.show();
}
function addLicenceWithoutorgId(){
	 var win=new Ext.addLicenceFormWin();	
	 win.show();
}
Ext.addLicenceFormWin = Ext.extend(Ext.Window,{
    title: '新增证照',
    frame: true,
    width: 500,
    height: 360,
    shadow : true,
    maximizable : true,
    modal: true,
    closeAction: 'close',
    layout : 'fit',
    bodyStyle: 'padding:1px;overflow-x:hidden;',
    initComponent: function() {
        this.initForm();
        Ext.apply(this,{
            layout: 'fit',
            items: [this.formPanel]
        });
        
        Ext.addLicenceFormWin.superclass.initComponent.call(this);
    },
    scope: this,
    initForm: function() {
        this.formPanel = CC.create({
            xtype: 'sunyardform',
            frame: true,
            border: false,
            region: 'north',
            layout: 'form',
            fileUpload: true, //该属性必须配置，否则提交无法成功
			enctype:'multipart/form-data',	//该属性必须配置，否则提交无法成功
            height: 65,
            labelWidth: 80,
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            buttonAlign:'center',
            items: [{
                        xtype: 's_datefield',
                        fieldLabel: '过期日期',
                        name: 'expdate',
                        allowBlank:false,
                        format:'Y-m-d'
            
            
            		},{
						xtype:'s_combo',
						fieldLabel:'证照类别',
						editable:false,	
						dataUrl:Ext.getPath()+'/adLicenceController/getlicCategory'	,	
						firstUrl:Ext.getPath()+'/adLicenceController/getlicCategory/first'	,	
						allowBlank:false,	
						hiddenName:'categoryid'			
					},{
						xtype:'s_combotree',
						fieldLabel:'所属公司',
						editable:false,	
						dataUrl:Ext.getPath()+'/adOrgtbController/getOrgComboTree',		
						hiddenName:'orgid',
						onSelect:function(node,e){
			                e.stopEvent();
			                if(node.attributes.id== '00000'){
			                    return;
			                }
			                if(this.fireEvent('beforeselect', this, node) !== false){
			                    this.setValue(node.id||node.text);
			                    this.collapse();
			                    this.fireEvent('select', this, node);
			                }
			            }
								
					},{
                        xtype: 's_textfield',
                        fieldLabel: '证照名称',
                        name: 'name',
                        maxLength: 100,
                        maxLengthText: '公司地址最多100位',
                        allowBlank:true
            		},{
						xtype: 'textfield',
			            fieldLabel: '图  片',
			            name: 'form-file',
			            allowBlank:false,	
			            inputType : 'file'
					},            		
            		{
                        xtype: 's_textarea',
                        fieldLabel: '备  注',
                        name: 'remark',
                        maxLength: 500,
                        height:80,
                        maxLengthText: '备注最多500位',
                        allowBlank:true
            
            
            		},{
            		
            		
            		
            		
            		}
		     ]
            ,buttons:[
            	{
	                xtype: 'button',
	                text: '提 交',
	                width: 60,
	                labelAlign:'center',
	                handler: function() {
                        this.submitForm();
	                },
                    scope: this
	            },{
	                xtype: 'button',
	                text: '重 置',
	                width: 60,
	                labelAlign:'center',
	                handler: function() {
	                    this.formPanel.getForm().reset();
	                },
	                scope: this
	            }
            
            ]
        
        });
    },
    submitForm: function() {
        var form = this.formPanel.getForm();
        if(!form.isValid()) {
            MSG.error("您的输入有误，请检查！");
            return;
        }
        
        form.submit({
            url: Ext.getPath()+'/adLicenceLoginController/saveLicence?actionType=0',
            waitTitle :'提示信息',
            waitMsg :'系统正在处理，请稍等...',
            scope: this,
            success: function(form,action) {
                MSG.info(action.result.data,'提示',function() {
                	grid.getStore().reload();
                	this.close();
                },this);
            },
            failure: function(form,action) {
                if(action && action.result.errorMessage) {
                    MSG.error(action.result.errorMessage);
                }
            }
        });
    },
    setParam:function(param){
    	 this.formPanel.getForm().findField("orgid").setValue(param.orgid);
    
    }
});


lookimg=function (id,imgpath){
		if(undefined==imgpath||imgpath==null||imgpath==''){
			MSG.info("此证照没有图片!");
		}
		var ww=window.screen.availWidth;
	 	var hh=window.screen.availHeight;
		window.open(Ext.getPath()+'/adLicenceController/showImg?id='+id, '_blank','left=0,top=0,width='+ww+',height='+hh+',titlebar=yes,menubar=yes,location=yes,directories:=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes' );
	}
	
Ext.modifyLicenceFormWin = Ext.extend(Ext.Window,{
    title: '修改证照',
    frame: true,
    width: 500,
    height: 360,
    shadow : true,
    maximizable : true,
    modal: true,
    closeAction: 'close',
    layout : 'fit',
    bodyStyle: 'padding:1px;overflow-x:hidden;',
    initComponent: function() {
        this.initForm();
        Ext.apply(this,{
            layout: 'fit',
            items: [this.formPanel]
        });
        
        Ext.modifyLicenceFormWin.superclass.initComponent.call(this);
    },
    scope: this,
    initForm: function() {
        this.formPanel = CC.create({
            xtype: 'sunyardform',
            frame: true,
            border: false,
            region: 'north',
            layout: 'form',
            fileUpload: true, //该属性必须配置，否则提交无法成功
			enctype:'multipart/form-data',	//该属性必须配置，否则提交无法成功
            height: 65,
            labelWidth: 80,
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            buttonAlign:'center',
            items: [{
            			xtype: 'hidden',
                        fieldLabel: '编号',
                        name: 'id'      
            
            	},{
                        xtype: 's_datefield',
                        fieldLabel: '过期日期',
                        name: 'expdate',
                        allowBlank:false,
                        format:'Y-m-d'
            
            
            		},{
						xtype:'s_combo',
						fieldLabel:'证照类别',
						editable:false,	
						dataUrl:Ext.getPath()+'/adLicenceController/getlicCategory'	,	
						firstUrl:Ext.getPath()+'/adLicenceController/getlicCategory/first'	,
						hiddenName:'categoryid',
						initQueryFlag:true			
					},{
						xtype:'s_combotree',
						fieldLabel:'所属公司',
						editable:false,	
						dataUrl:Ext.getPath()+'/adOrgtbController/getOrgComboTree',		
						hiddenName:'orgid',
						onSelect:function(node,e){
			                e.stopEvent();
			                if(node.attributes.id== '00000'){
			                    return;
			                }
			                if(this.fireEvent('beforeselect', this, node) !== false){
			                    this.setValue(node.id||node.text);
			                    this.collapse();
			                    this.fireEvent('select', this, node);
			                }
			            }								
					},{
                        xtype: 's_textfield',
                        fieldLabel: '证照名称',
                        name: 'name',
                        maxLength: 100,
                        maxLengthText: '公司地址最多100位',
                        allowBlank:true
            		},{
						xtype: 'displayfield',
			            fieldLabel: buttonHidden?'图  片': '原 图  片',
			            name:'oldimg',
			            allowBlank:true
					}, {
						xtype: 'textfield',
			            fieldLabel: '新 图  片',
			            name: 'form-file',
			            hidden:buttonHidden,
			            allowBlank:true,	
			            inputType : 'file'
					},            		
            		{
                        xtype: 's_textarea',
                        fieldLabel: '备  注',
                        name: 'remark',
                        maxLength: 500,
                        height:80,
                        maxLengthText: '备注最多500位',
                        allowBlank:true
            
            
            		},{
            		
            		
            		
            		
            		}
		     ]
            ,buttons:[
            	{
	                xtype: 'button',
	                text: '提 交',
	                width: 60,
	                labelAlign:'center',
	                hidden:buttonHidden,
	                handler: function() {
                        this.submitForm();
	                },
                    scope: this
	            },{
	                xtype: 'button',
	                text: '重 置',
	                hidden:buttonHidden,
	                width: 60,
	                labelAlign:'center',
	                handler: function() {
	                    this.setParam({id:this.id});
	                },
	                scope: this
	            }
            
            ]
        
        });
    },
    submitForm: function() {
        var form = this.formPanel.getForm();
        if(!form.isValid()) {
            MSG.error("您的输入有误，请检查！");
            return;
        }
        
        form.submit({
            url: Ext.getPath()+'/adLicenceLoginController/saveLicence?actionType=1',
            waitTitle :'提示信息',
            waitMsg :'系统正在处理，请稍等...',
            scope: this,
            success: function(form,action) {
                MSG.info(action.result.data,'提示',function() {
                	grid.getStore().reload();
                	this.close();
                },this);
            },
            failure: function(form,action) {
                if(action && action.result.errorMessage) {
                    MSG.error(action.result.errorMessage);
                }
            }
        });
    },
    setParam:function(param){
    	 this.formPanel.getForm().findField("id").setValue(param.id);
    	 this.id=param.id,
    	 this.formPanel.getForm().load({
            url: Ext.getPath()+'/adLicenceController/getLicenceById?',
            scope: this,
            params: {id: this.id},
            waitTitle: '提示',
            waitMsg: '正在加载数据，请稍等...',
            success: function(form,action) {
            	var oldimgpath=action.result.data.imgpath;
            	if(null==oldimgpath||""==oldimgpath ||undefined==oldimgpath){
            		this.formPanel.getForm().findField("oldimg").setValue('无');
            	}else{
            		this.formPanel.getForm().findField("oldimg").setValue('<a  href="javascript:lookimg(\''+action.result.data.id+'\',\''+action.result.data.imgpath+'\')" >'+action.result.data.imgname+'</a>');
            	}
            	
            },
            failure: function(form,action) {
                 MSG.error(action.result.errorMessage);
            }
        });	
    
    }
});




