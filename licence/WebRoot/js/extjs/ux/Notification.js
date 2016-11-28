/**
 * Ext.ux.ToastWindow
 *
 * @author  Edouard Fattal
 * @date	March 14, 2008
 *
 * @class Ext.ux.ToastWindow
 * @extends Ext.Window
 */

Ext.namespace("Ext.ux");

Ext.ux.NotificationMgr = {
	positions :new Ext.util.MixedCollection(),
	noticewins :new Ext.util.MixedCollection()
}

Ext.ux.Notification = Ext.extend(Ext.Window, {
	initComponent: function(){
		Ext.apply(this, {
			iconCls: this.iconCls || 'x-icon-information',
			cls: 'x-notification',
			width: 280,
			height: 180,
			autoHeight: true,
			plain: false,
			draggable: false,
			autoHide :  this.autoHide && true, //�Ƿ��Զ����ش���
			hideDelay: this.hideDelay || 3000 ,//����Զ����أ�n��������ش��ڡ�autoHideΪtrue��hideDelay������
			minimizable: false,
            //constrain:true,
			bodyStyle: 'text-align:left'
		});
		if(this.autoHide) {
			this.task = new Ext.util.DelayedTask(this.hideWin, this);
		}
		Ext.ux.Notification.superclass.initComponent.call(this);
	},
	hideWin:function(){
		this.hide();
		this.close();//�رյ�ǰ����
	},
	
	close: function() {
		//�Ƴ�
		Ext.ux.NotificationMgr.noticewins.remove(this);
		Ext.ux.Notification.superclass.close.call(this);
	},
	
	setMessage: function(msg){
		this.body.update(msg);
	},
	setTitle: function(title, iconCls){
		Ext.ux.Notification.superclass.setTitle.call(this, title, iconCls||this.iconCls);
	},
	onRender:function(ct, position) {
		Ext.ux.Notification.superclass.onRender.call(this, ct, position);
	},
	minimize:function(){
		if(this.minimizable){
			this.hideWin();
		}
	},
	onDestroy: function(){
		Ext.ux.NotificationMgr.positions.get(this.xpos).remove(this.ypos);
		Ext.ux.Notification.superclass.onDestroy.call(this);
	},
	cancelHiding: function(){
		this.addClass('fixed');
		if(this.autoHide) {
			this.task.cancel();
		}
	},
	afterShow: function(){
		Ext.ux.Notification.superclass.afterShow.call(this);
		Ext.fly(this.body.dom).on('click', this.cancelHiding, this);
		if(this.autoHide) {
			this.task.delay(this.hideDelay || 3000);
	   }
	},
	animShow: function(x,y){
		
		this.ypos = x||0;
		this.xpos = y||0;
		do{
			//��ȡ��ǰx��Ķ�λ����
			if(Ext.ux.NotificationMgr.positions.get(this.xpos) == null){
				Ext.ux.NotificationMgr.positions.add(this.xpos,[]);
			}
			//��ȡy�ᶨλ���ݣ������λ����Ϊ-1��˵����ǰ��λ���ݿ���
			while(Ext.ux.NotificationMgr.positions.get(this.xpos).indexOf(this.ypos)>-1)
				this.ypos++;
			
			//this.setSize(this.width,this.height);
		
			this.totalHeight = -20-((this.getSize().height+10)*this.ypos);
			//�����ǰx���ϵ�y�������ǵ�һ����ʾ�������߶ȣ�������߶ȣ��ᵼ����ѭ����
			if(this.ypos == 0 || Ext.getBody().getHeight() - this.height+this.totalHeight > 0){
				this.totalWidth = -20-((this.getSize().width+10)*this.xpos);
				Ext.ux.NotificationMgr.positions.get(this.xpos).push(this.ypos);
				
				this.el.alignTo(document, "br-br", [ this.totalWidth,  this.totalHeight]);
				this.el.slideIn('b', {
					duration: 1,
					callback: this.afterShow,
					scope: this	});
				break;
			}
			else{
				//���y��ĸ߶ȴ��ڵ�ǰ���ڵĸ߶ȣ���ʼ�����µ�x�ᶨλ����
				this.xpos++;
	            //this.totalWidth = -20-((this.getSize().width+10)*this.xpos);
				this.ypos=0;
			}
		}while(true)
		
	},
	animHide: function(){
		if(typeof(Ext.ux.NotificationMgr.positions.get(this.xpos)) != 'undefined'){
		   Ext.ux.NotificationMgr.positions.get(this.xpos).remove(this.ypos);
		   if(Ext.ux.NotificationMgr.positions.get(this.xpos).length == 0){//��ǰx���ϵ�y�ᶨλ����Ϊ0
				Ext.ux.NotificationMgr.positions.removeKey(this.xpos);
			}
		}
		this.el.ghost("b", {
			duration: 1,
			remove: true
		});
	},
	
	/**
	 * ���÷����������ɹ�����ʾ�ɹ�����Ϣ
	 * @param {} title
	 * @param {} msg
	 */
	showSuccess:function(title,msg){
		this.iconCls=	'x-icon-information',
		this.title = title||'success';
		this.html = msg||'process successfully!';
		this.show(document);
		Ext.ux.NotificationMgr.noticewins.add(this);	
	},
	/**
	 * ���÷���������ʧ�ܣ���ʾʧ�ܵ���Ϣ
	 * @param {} title
	 * @param {} msg
	 */
	showFailure:function(title,msg){
		this.iconCls=	'x-icon-error',
		this.title = title||'success';
		this.html = msg||'process successfully!';
		this.show(document);	
		Ext.ux.NotificationMgr.noticewins.add(this);	
	},
	/**
	 * ���÷�������ʾ�����������Ϣ
	 * @param {} title
	 * @param {} msg
	 * @param {} success �����Ƿ�ɹ�
	 */
	showMessage:function(title,msg,success){
		if(success){
			this.iconCls=	'x-icon-information';
			this.autoHide=true;//�Զ����ش���
			this.task = new Ext.util.DelayedTask(this.hideWin, this);
		} else {
			
		}
		this.title = title;
		this.html = msg;
		this.show(document);	
		Ext.ux.NotificationMgr.noticewins.add(this);		
	},
	focus: Ext.emptyFn 

}); 
Ext.EventManager.onWindowResize(function(){
	Ext.ux.NotificationMgr.positions.clear();
	Ext.ux.NotificationMgr.positions.noticewins.clear();
});