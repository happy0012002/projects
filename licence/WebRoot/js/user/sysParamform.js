
function modifyParam(paramId){
	var win=new Ext.modifyParamWin();
	win.setParam({paramId:paramId});
	win.show();
}

Ext.modifyParamWin = Ext.extend(Ext.Window,{
    title: '修改系统参数',
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
        
        Ext.modifyParamWin.superclass.initComponent.call(this);
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
                        xtype: 'hidden',
                        fieldLabel: '参数名称',
                        name: 'id'         
            
            		},{
                        xtype: 's_textfield',
                        fieldLabel: '参数名称',
                        name: 'paramname',
                        maxLength: 25,
                        readOnly:true,
                        maxLengthText: '用户ID最多25位'           
            
            		},{
                        xtype: 's_textfield',
                        fieldLabel: '参数值',
                        name: 'paramvalue',
                        allowBlank:false,
                        maxLength:150,
                        maxLengthText: '参数值最多150位'
                     },{
                        xtype: 's_textfield',
                        fieldLabel: '参数描述',
                        name: 'paramdesc',
                        maxLength:250,
                        maxLengthText: '参数描述最多250位'
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
            url: Ext.getPath()+'/sysParamController/modifySysParam?',
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

   		this.formPanel.getForm().load({
            url: Ext.getPath()+'/sysParamController/getById',
            scope: this,
            params: {paramId : param.paramId},
            waitTitle: '提示',
            waitMsg: '正在加载数据，请稍等...',
            success: function(form,action) {
            },
            failure: function(form,action) {
                  MSG.error(action.result.errorMessage);
              
            }
        });	
    	
    
    }
   
    
});
