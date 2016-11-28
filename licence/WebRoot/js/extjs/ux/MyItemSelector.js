Ext.ns("Ext.sunyard.form")
Ext.sunyard.form.ItemSelector = Ext.extend(Ext.ux.form.ItemSelector,{
	leftLegend:'候选值',
	rightLegend:'已选值',
	autoLoad: true,
	valueAutoLoad: true,
	iconRightAll:"rightAll.gif",
	iconLeftAll:"leftAll.gif",
	onRender: function(ct, position){
        Ext.ux.form.ItemSelector.superclass.onRender.call(this, ct, position);
        var msConfig = [{
            legend: this.leftLegend,
            draggable: true,
            droppable: true,
            width: 100,
            height: 100,
            store: {
				xtype:'jsonstore',
				autoLoad:this.autoLoad, 
	            url:this.dataUrl,
	            baseParams:this.baseParams || {},
	            root:'results',
	            fields:this.dataFields || [{name:'value'},{name:'text'}]
			},
			displayField: 'text',
            valueField: 'value'
        },{
            legend: this.rightLegend,
            droppable: true,
            draggable: true,
            width: 100,
            height: 100,
			displayField: 'text',
            valueField: 'value',
            store:this.valueDataUrl ? {
            	xtype:'jsonstore',
				autoLoad: this.valueAutoLoad, 
	            url:this.valueDataUrl,
	            baseParams:this.baseParams || {},
	            root:'results',
	            fields:this.dataFields || [{name:'value'},{name:'text'}]
            } : new Ext.data.ArrayStore({
		        fields:this.dataFields ||  ['value','text']
		    })
        }];

        this.fromMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[0], msConfig[0]));
        this.fromMultiselect.on('dblclick', this.onRowDblClick, this);

        this.toMultiselect = new Ext.ux.form.MultiSelect(Ext.applyIf(this.multiselects[1], msConfig[1]));
        this.toMultiselect.on('dblclick', this.onRowDblClick, this);

        var p = new Ext.Panel({
            bodyStyle:this.bodyStyle,
            border:this.border,
            layout:"table",
            layoutConfig:{columns:3}
        });

        p.add(this.fromMultiselect);
        var icons = new Ext.Panel({header:false});
        p.add(icons);
        p.add(this.toMultiselect);
        p.render(this.el);
        icons.el.down('.'+icons.bwrapCls).remove();

        // ICON HELL!!!
        if (this.imagePath!="" && this.imagePath.charAt(this.imagePath.length-1)!="/")
            this.imagePath+="/";
        this.iconUp = this.imagePath + (this.iconUp || 'up2.gif');
        this.iconDown = this.imagePath + (this.iconDown || 'down2.gif');
        this.iconLeft = this.imagePath + (this.iconLeft || 'left2.gif');
        this.iconRight = this.imagePath + (this.iconRight || 'right2.gif');
        this.iconTop = this.imagePath + (this.iconTop || 'top2.gif');
        this.iconBottom = this.imagePath + (this.iconBottom || 'bottom2.gif');
        this.iconLeftAll = this.imagePath + (this.iconLeftAll || 'leftAll.gif');
        this.iconRightAll = this.imagePath + (this.iconRightAll || 'leftAll.gif');
        var el=icons.getEl();
        this.toTopIcon = el.createChild({tag:'img', src:this.iconTop, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.toRightAllIcon = el.createChild({tag:'img', src:this.iconRightAll, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.upIcon = el.createChild({tag:'img', src:this.iconUp, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.addIcon = el.createChild({tag:'img', src:this.iconRight, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.removeIcon = el.createChild({tag:'img', src:this.iconLeft, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.downIcon = el.createChild({tag:'img', src:this.iconDown, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.toLeftAllIcon = el.createChild({tag:'img', src:this.iconLeftAll, style:{cursor:'pointer', margin:'2px'}});
        el.createChild({tag: 'br'});
        this.toBottomIcon = el.createChild({tag:'img', src:this.iconBottom, style:{cursor:'pointer', margin:'2px'}});       
        
        this.toTopIcon.on('click', this.toTop, this);
        this.upIcon.on('click', this.up, this);
        this.downIcon.on('click', this.down, this);
        this.toBottomIcon.on('click', this.toBottom, this);
        this.addIcon.on('click', this.fromTo, this);
        this.removeIcon.on('click', this.toFrom, this);
        this.toLeftAllIcon.on('click',this.toLeftAll,this);
        this.toRightAllIcon.on('click',this.toRightAll,this);
        if (!this.drawUpIcon || this.hideNavIcons) { this.upIcon.dom.style.display='none'; }
        if (!this.drawDownIcon || this.hideNavIcons) { this.downIcon.dom.style.display='none'; }
        if (!this.drawLeftIcon || this.hideNavIcons) { this.addIcon.dom.style.display='none'; }
        if (!this.drawRightIcon || this.hideNavIcons) { this.removeIcon.dom.style.display='none'; }
        if (!this.drawTopIcon || this.hideNavIcons) { this.toTopIcon.dom.style.display='none'; }
        if (!this.drawBotIcon || this.hideNavIcons) { this.toBottomIcon.dom.style.display='none'; }

        var tb = p.body.first();
        this.el.setWidth(p.body.first().getWidth());
        p.body.removeClass();

        this.hiddenName = this.name;
        var hiddenTag = {tag: "input", type: "hidden", value: "", name: this.name};
        this.hiddenField = this.el.createChild(hiddenTag);
    },
    toLeftAll:function(){
    	this.reset();
    },
    toRightAll:function(){
    	range = this.fromMultiselect.store.getRange();
        this.fromMultiselect.store.removeAll();
        this.toMultiselect.store.add(range);
        var si = this.toMultiselect.store.sortInfo;
        if (si){
            this.toMultiselect.store.sort(si.field, si.direction);
        }
    }
});