Ext.onReady(function(){
	Ext.QuickTips.init();
	url=Url;
	panel = new Ext.TabPanel({
          deferredRender: true,
          activeTab:0,
          lazyLoad:true, 
          layoutOnTabChange: true,
          border: false, 
          autoDestroy: false, 
          items: [
          	{          	
          	 xtype: 'panel',
          	 title:'所有证照',
             autoScroll: false,            
             layout: 'fit',
			 loadMask:'页面加载中...', 
			 listeners:{activate:function(p){
			 	document.getElementById('alllic').contentWindow.location.reload(true);			 
			 }},
             html:'<iframe src="'+url+'" name="ifr_basic" id="alllic" width="100%" marginwidth="0" height="100%" marginheight="0" scrolling="auto" frameborder="0"></iframe>'
          },{
          	
          	 xtype: 'panel',
          	 title:'即将过期证照',
             autoScroll: false,            
             layout: 'fit',
			 loadMask:'页面加载中...', 
			 listeners:{activate:function(p){
			 	document.getElementById('almostexplic').contentWindow.location.reload(true);			 
			 }},
             html:'<iframe src="'+url+'expdatetype=2" name="ifr_basic" id="almostexplic" width="100%" marginwidth="0" height="100%" marginheight="0" scrolling="auto" frameborder="0"></iframe>'
          },
          {
          	
          	 xtype: 'panel',
          	 title:'已过期证照',
             autoScroll: false,            
             layout: 'fit',
			 loadMask:'页面加载中...', 
			 listeners:{activate:function(p){
			 	document.getElementById('explic').contentWindow.location.reload(true);			 
			 }},
             html:'<iframe src="'+url+'expdatetype=1" name="ifr_basic"  id="explic" width="100%" marginwidth="0" height="100%" marginheight="0" scrolling="auto" frameborder="0"></iframe>'
          }
          ,{
          	
          	 xtype: 'panel',
          	 title:'无异常证照',
             autoScroll: false,            
             layout: 'fit',
			 loadMask:'页面加载中...', 
			 listeners:{activate:function(p){
			 	document.getElementById('normallic').contentWindow.location.reload(true);			 
			 }},
             html:'<iframe src="'+url+'expdatetype=3" name="ifr_basic" id="normallic"  width="100%" marginwidth="0" height="100%" marginheight="0" scrolling="auto" frameborder="0"></iframe>'
          }
          
          ]
	});
	new Ext.Viewport({
			items:[panel],
			layout: 'fit'
	});

});