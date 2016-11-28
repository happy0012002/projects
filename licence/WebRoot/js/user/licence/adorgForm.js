
function modifyorg(id){
	var win=new Ext.modifylcFormWin();
	win.setParam({id:id});
	if(buttonHidden){
		win.setTitle('查询公司详细');
	}
	win.show();
}

function addorg(){
	 var win=new Ext.addlcFormWin();	 
	 win.show();

}
Ext.addlcFormWin = Ext.extend(Ext.Window,{
    title: '新增公司',
    frame: true,
    width: 480,
    height: 320,
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
        
        Ext.addlcFormWin.superclass.initComponent.call(this);
    },
    scope: this,
    initForm: function() {
        this.formPanel = CC.create({
            xtype: 'sunyardform',
            frame: true,
            border: false,
            region: 'north',
            layout: 'form',
            height: 65,
            labelWidth: 80,
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            buttonAlign:'center',
            items: [{
                        xtype: 's_textfield',
                        fieldLabel: '公司名称',
                        name: 'orgname',
                        maxLength: 100,
                        maxLengthText: '公司名称最多100位'
            
            
            		},{
                        xtype: 's_textfield',
                        fieldLabel: '公司地址',
                        name: 'address',
                        maxLength: 150,
                        maxLengthText: '公司地址最多150位',
                        allowBlank:true
            
            
            		},
            		{
                        xtype: 's_textfield',
                        fieldLabel: '联系人',
                        name: 'tel',
                        maxLength: 100,
                        maxLengthText: '联系人最多100位',
                        allowBlank:true
            
            
            		},
            		{
                        xtype: 's_textfield',
                        fieldLabel: '联系方式',
                        name: 'contact',
                        maxLength: 100,
                        allowBlank:true,
                        maxLengthText: '联系方式最多100位'
            
            
            		},
            		{
                        xtype: 's_textarea',
                        fieldLabel: '备注',
                        name: 'remark',
                        maxLength: 500,
                        height:80,
                        maxLengthText: '备注最多500位',
                        allowBlank:true
            
            
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
            url: Ext.getPath()+'/adOrgtbLoginController/saveAdOrgtb?actionType=0',
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
    }
    
});




Ext.modifylcFormWin = Ext.extend(Ext.Window,{
    title: '修改证照类别',
    frame: true,
     width: 480,
    height: 320,
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
        
        Ext.modifylcFormWin.superclass.initComponent.call(this);
    },
    scope: this,
    initForm: function() {
        this.formPanel = CC.create({
            xtype: 'sunyardform',
            frame: true,
            border: false,
            region: 'north',
            layout: 'form',
            height: 65,
            labelWidth: 80,
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            buttonAlign:'center',
            items: [{
		                xtype: 'hidden',
		                fieldLabel: '公司编号',
		                name: 'id'
		            },{
                        xtype: 's_textfield',
                        fieldLabel: '公司名称',
                        name: 'orgname',
                        maxLength: 100,
                        maxLengthText: '公司名称最多100位'
            
            
            		},{
                        xtype: 's_textfield',
                        fieldLabel: '公司地址',
                        name: 'address',
                        maxLength: 150,
                        maxLengthText: '公司地址最多150位',
                        allowBlank:true
            
            
            		},
            		{
                        xtype: 's_textfield',
                        fieldLabel: '联系人',
                        name: 'tel',
                        maxLength: 100,
                        maxLengthText: '联系人最多100位',
                        allowBlank:true
            
            
            		},
            		{
                        xtype: 's_textfield',
                        fieldLabel: '联系方式',
                        name: 'contact',
                        maxLength: 100,
                        allowBlank:true,
                        maxLengthText: '联系方式最多100位'
            
            
            		},
            		{
                        xtype: 's_textarea',
                        fieldLabel: '备注',
                        name: 'remark',
                        maxLength: 500,
                        height:80,
                        maxLengthText: '备注最多500位',
                        allowBlank:true
            
            
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
             url: Ext.getPath()+'/adOrgtbLoginController/saveAdOrgtb?actionType=1',
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
    	this.id=param.id;
   		this.formPanel.getForm().load({
            url: Ext.getPath()+'/adOrgtbController/getOrgById?',
            scope: this,
            params: {id: this.id},
            waitTitle: '提示',
            waitMsg: '正在加载数据，请稍等...',
            success: function(form,action) {
            	
            },
            failure: function(form,action) {
                 MSG.error(action.result.errorMessage);
            }
        });	
    	
    
    }
   
    
})
