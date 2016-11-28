
function modifyUser(userid){
	var win=new Ext.modifyUserFormWin();
	win.setParam({userid:userid});
	win.show();
}

function adduser(){
	 var win=new Ext.addUserFormWin();	 
	 win.show();

}
Ext.addUserFormWin = Ext.extend(Ext.Window,{
    title: '新增用户',
    frame: true,
    width: 480,
    height: 300,
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
        
        Ext.addUserFormWin.superclass.initComponent.call(this);
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
            labelWidth: 70,
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            buttonAlign:'center',
            items: [{
                        xtype: 's_textfield',
                        fieldLabel: '用户名',
                        name: 'userid',
                        maxLength: 10,
                        maskRe: /[a-zA-Z0-9]/i,
                        stripCharsRe : /[^a-zA-Z0-9]/gi,
                        maxLengthText: '用户ID最多10位',
                        emptyText: '用户ID只能为数字字母,最多10位'
            
            
            		},{
                        xtype: 's_textfield',
                        fieldLabel: '用户密码',
                        name: 'password',
                        inputType : 'password',
                        maxLength: 8,
                        maxLengthText: '用户密码最多8位'
                    },{
                        xtype: 's_textfield',
                        fieldLabel: '确认密码',
                        name: 'validduserpwd',
                        inputType : 'password',
                        maxLength: 8,
                        maxLengthText: '用户密码最多8位',
                        listeners:{
                            blur:{
                                fn:function(f){
                                  var userpwd = this.formPanel.getForm().findField('password').getValue();
                                  if(userpwd != f.getValue()){
                                      MSG.error('验证密码输入有误，请重新输入!');
                                      f.reset();
                                  }
                                },
                                scope: this
                            },
                            scope: this
                        }
                    },{
                        xtype: 's_textfield',
                        fieldLabel: '用户姓名',
                        name: 'username',
                        maxLength: 25,
                        maxLengthText: '用户姓名最多25位'
                     },{
		                xtype: 's_textfield',
		                fieldLabel: '联系方式',
		                name: 'tel',
		                maxLength: 25,
		                allowBlank: true
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
            url: Ext.getPath()+'/userController/saveUser?actionType=0',
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




Ext.modifyUserFormWin = Ext.extend(Ext.Window,{
    title: '修改用户',
    frame: true,
    width: 480,
    height: 300,
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
        
        Ext.modifyUserFormWin.superclass.initComponent.call(this);
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
            labelWidth: 70,
            defaults: {
                anchor: '95%',
                allowBlank: false
            },
            buttonAlign:'center',
            items: [{
                        xtype: 's_textfield',
                        fieldLabel: '用户名',
                        name: 'userid',
                        maxLength: 10,
                        maskRe: /[a-zA-Z0-9]/i,
                        stripCharsRe : /[^a-zA-Z0-9]/gi,
                        maxLengthText: '用户ID最多10位',
                        emptyText: '用户ID只能为数字字母,最多10位'
            
            
            		},{
                        xtype: 's_textfield',
                        fieldLabel: '用户姓名',
                        name: 'username',
                        maxLength: 25,
                        maxLengthText: '用户姓名最多25位'
                     },{
		                xtype: 's_textfield',
		                fieldLabel: '联系方式',
		                name: 'tel',
		                maxLength: 25,
		                allowBlank: true
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
            url: Ext.getPath()+'/userController/saveUser?actionType=1',
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
    	this.actionType=1;
    	this.userid=param.userid;
   		this.formPanel.getForm().load({
            url: Ext.getPath()+'/userController/getById?',
            scope: this,
            params: {userid: this.userid},
            waitTitle: '提示',
            waitMsg: '正在加载数据，请稍等...',
            success: function(form,action) {
                this.formPanel.getForm().findField("userid").setReadOnly(true); 
            },
            failure: function(form,action) {
                MSG.error(action.result.errorMessage);
            }
        });	
    	
    
    }
   
    
})
