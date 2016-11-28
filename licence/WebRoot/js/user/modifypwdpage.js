var grid;
Ext.onReady(function(){
	Ext.QuickTips.init();
	
	formPanel = CC.create({
            xtype: 'sunyardform',
            frame: true,
            border: false,
            region: 'north',
            layout: 'form',
            height: 65,
            labelWidth: 100,
			style:'margin-left:200px;',
            buttonAlign:'center',
            items: [{
                        xtype: 's_textfield',
                        fieldLabel: '用 户 名',
                        name: 'userid',
                        maxLength: 10,
                        width:280,
                        maskRe: /[a-zA-Z0-9]/i,
                        stripCharsRe : /[^a-zA-Z0-9]/gi,
                        allowBlank:false,
                        maxLengthText: '用户ID最多10位',
                        emptyText: '用户ID只能为数字字母,最多10位'
            
            
            		},{
                        xtype: 's_textfield',
                        fieldLabel: '新 密 码',
                        name: 'password',
                        allowBlank:false,
                        inputType : 'password',
                        maxLength: 8,
                        width:280,
                        maxLengthText: '用户密码最多8位'
                    },{
                        xtype: 's_textfield',
                        fieldLabel: '确认新密码',
                        name: 'validduserpwd',
                        inputType : 'password',
                        maxLength: 8,
                        allowBlank:false,
                        width:280,
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
                    	xtype: 'panel',
                    	layout:'column',
                    	items:[{
                    		columnWidth: 0.2,
                    		layout:'form',
                    		style:'margin-left:100px;',
                    		items:[{
				                xtype: 'button',
				                text: '提 交',
				                width: 60,
				                labelAlign:'center',
				                handler: function() {
			                        submitForm();
				                }
				            }]
                    	},{
                    		columnWidth: 0.2,
                    		layout:'form',
                    		items:[ {
					                xtype: 'button',
					                text: '重 置',
					                width: 60,
					                labelAlign:'center',
					                handler: function() {
					                    formPanel.getForm().reset();
					                }
					            }]
                    	}]
                    }
		     ]
        
        });
        
      submitForm=function() {
        var form = formPanel.getForm();
        if(!form.isValid()) {
            MSG.error("您的输入有误，请检查！");
            return;
        }
        
        form.submit({
            url: Ext.getPath()+'/userController/modifypwd?',
            waitTitle :'提示信息',
            waitMsg :'系统正在处理，请稍等...',
            scope: this,
            success: function(form,action) {
                MSG.info("修改密码成功！",'提示',function() {	
                	formPanel.getForm().reset(); 
                },this);
            },
            failure: function(form,action) {
                if(action && action.result.errorMessage) {
                    MSG.error(action.result.errorMessage);
                }
            }
        });
    }
    
    
	new Ext.Viewport({
		layout:'fit',
		items:formPanel
	});

});