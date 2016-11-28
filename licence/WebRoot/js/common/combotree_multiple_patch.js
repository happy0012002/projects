
Ext.override(Ext.sunyard.form.ComboTree,{
	valueSeparator:',',
	getAllData:false,
	clearValue : function(){
        if(this.hiddenField){
            this.hiddenField.value = '';
        }
        this.treeCfg.root.cascade(function(n){
        	if(n.getUI().isChecked()){
        		n.getUI().toggleCheck();
        	}
        });
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
        this.value = '';
    },
    initTree:function(){
    	this.treeCfg = this.treeCfg || {};
    	this.treeCfg = Ext.applyIf(this.treeCfg,{
            	renderTo:this.innerList,
	            autoScroll:true,
	            bodyStyle:'padding:0px',            
			    rootVisible:false,
			    height:this.maxHeight,
			    lines:false,
			    animCollapse:false,
			    animate: false,
			    border:false,
			    filterFieldWidth:this.filterFieldWidth||100,
			    plugins:[new Ext.sunyard.filter.TreeIconPlugin({
			    	iconCls: 'clean-field',
				   	tooltip: '清理',
					iconClick:this.clearValue,
					scope:this
		    	})],
			   loader:this.loader||new Ext.tree.TreeLoader({
	                dataUrl: this.dataUrl,
	                requestMethod: this.requestMethod,
	                listeners:{
	                	"beforeload":function(o){
	            			Ext.apply(o.baseParams,this.baseParams||{});
	            		},
	            		scope:this
	                }
	            }),
			    //构造根节点
				root: new Ext.tree.AsyncTreeNode({
				    id: this.rootNode||'',
					expanded: false
				})
			});
		Ext.override(Ext.sunyard.TbarTree,{
			onCheckChange:function(node, checked){
				node.updateCheck(checked);
		    	(function(parentNode){
		    		var fn = arguments.callee;
		    		if(parentNode.getDepth()>0){
		        		var parentChecked = false;
		        		parentNode.eachChild(function(child){
		        		    if(child.isExpandable ()){
		        			parentChecked = parentChecked || child.getUI().isChecked();
		        			}
		        		});
		        		//if(parentNode.getUI().isChecked()!==parentChecked){
							//parentNode.getUI()._setCheck(parentChecked);
							//fn(parentNode.parentNode);
		        		//}
		    		}else{
		    			return;
		    		}
		    	})(node.parentNode);
		    	this.fireEvent("aftercheckchange",node,checked,this);
			}
		});
    	this.innerTree = new Ext.sunyard.TbarTree(this.treeCfg);
		this.mon(this.innerTree,{
			scope:this,
			click:this.onSelect,
			aftercheckchange:this.onAfterCheckChange
		});
    },
    onAfterCheckChange:function(node,checked,tree){
    	var arr;
    	if(this.getAllData){
    		arr = this.getChecked();
		}else{
			arr = this.getChecked();//this.getAsyncChecked();
		}
    	if(this.hiddenField){
    		this.hiddenField.value = arr[0];
    	}		
		this.value=arr[0];
		this.setRawValue(arr[1]);
	},
	getAsyncChecked:function(startNode){
		startNode = startNode || this.root || this.innerTree.root;
        var r = [];
        var t = [];
        var submitAll = this.submitAll;
        var f = function(){
        	if(this.attributes.checked){
    			r.push(this.id);
    			t.push(this.attributes['text']);
    		}
        };
        startNode.cascade(f);
        return [r.join(this.valueSeparator),t.join(this.valueSeparator)];
	},
	getChecked : function(startNode){
        startNode = startNode || this.root || this.innerTree.root;
        var r = [];
        var t = [];
        var submitAll = this.submitAll;
        if(startNode==this.innerTree.root){
        	startNode.eachChild(function(n){
        		cascadeTreeData(n.attributes,function(){
		        	if(this.checked){  //(submitAll||(this.leaf==true))&&
		        		r.push(this.id.trim());
		        		t.push(this['text'].trim());
		        	}
		        });
        	});
        }else{
        	cascadeTreeData(startNode.attributes,function(){
	        	if(this.checked){//(submitAll||(this.leaf==true))&&
	        		r.push(this.id.trim());
	        		t.push(this['text'].trim());
	        	}
	        });
        }		        
        return [r.join(this.valueSeparator),t.join(this.valueSeparator)];
    },
   setValue : function(v){
        var text = v;
        this.value = v;
        if(this.hiddenField){
            this.hiddenField.value = Ext.value(v, '');
        }
        Ext.sunyard.form.ComboTree.superclass.setValue.call(this, text);
        var node = this.innerTree ? this.innerTree.getNodeById(v) : null;
        if(node){
            text = node.text;
            this.setRawValue(text);	        
        }else{
        	this.setValueEx(v);
        }
        return this;
    },
    setValue:function(v){
        var text = [];
        this.value = v;
        if(this.hiddenField){
            this.hiddenField.value = Ext.value(v, '');
        }
        this.baseParams = this.baseParams || {};
        this.baseParams['firstQuery'] = this.value;
        Ext.sunyard.form.ComboTree.superclass.setValue.call(this, v);
        
		var _arrV = v ? v.split(this.valueSeparator) : [];
		if(this.rendered&&(this.innerTree!=undefined&&this.innerTree.rendered)){
			this.innerTree.root.eachChild(function(n){
				cascadeTreeData(n.attributes,function(){
					if(_arrV.indexOf(this.id)!=-1){
						this.checked = true;
						if(text.indexOf(this.text)==-1)
							text.push(this.text);
					}else{
						this.checked = false;
					}
				});
			});
			this.innerTree.root.cascade(function(){
				if(this.rendered)
					//this.getUI()._setCheck(this.attributes.checked);
					if(_arrV.indexOf(this.id)!=-1){
						this.getUI()._setCheck(true);
						if(text.indexOf(this.text)==-1)
							text.push(this.attributes.text);
					}else{
						this.getUI()._setCheck(false);
					}
					
			});
			this.setRawValue(text.join(this.valueSeparator));	
		}else{
        	this.setValueEx(v);
        }
        return this;
	}
});
var cascadeModelTreeData = function(tree,fn, scope, args){
    var ui=tree.ui;
    var treeData=tree.attributes;	
    if(fn.apply(scope || treeData, args || [treeData]) !== false){
        var cs = treeData.children;
        var node=tree.childNodes;
        if(node.length>=1){
            for(var i = 0, len = node.length; i < len; i++) {
            if(!node[i].hidden){
        	cascadeModelTreeData(node[i],fn,scope,args);
        	}
        }
        }
        else{
        if(cs)
        for(var i = 0, len = cs.length; i < len; i++) {
        	cascadeTreeData(cs[i],fn,scope,args);
        }
        }
    }
};
Ext.override(Ext.tree.TreeNode,{
	updateCheck:function(checked){
		this.attributes.checked = checked;
		var tree = this;
		cascadeModelTreeData(tree,function(){
		   // if(this.Expandable()){
		   
			this.checked = checked;
		//		}
		});
/*		(function(n){
			var fn = arguments.callee;
			if(n.children){
				for(var i =0 ; i < n.children.length; i ++){
					n.children[i].checked = checked;
					fn(n.children[i]);
				}
			}
		})(this.attributes);*/
		this.cascade(function(){
		    if(!this.hidden){
			this.attributes.checked = checked;
			if(this.rendered)
				this.getUI()._setCheck(checked);
			}
		});
	}
});
Ext.sunyard.ModelTree = Ext.extend(Ext.tree.TreePanel,{
	filterPlugin:true,
	expandAllPlugin:true,
	collapseAllPlugin:true,
	refreshPlugin:true,
	filterFieldWidth:75,
	initComponent:function(){
		Ext.sunyard.ModelTree.superclass.initComponent.call(this);
		this.addEvents("aftercheckchange");
		this.on('checkchange',this.onCheckChange,this);
		if(this.plugins){
	        if(!Ext.isArray(this.plugins)){
	        	this.plugins = [this.plugins];
	        }
	    }else{
	    	this.plugins = [];
	    }
		if(this.filterPlugin){
			if(Ext.isBoolean(this.filterPlugin)){
				this.plugins.splice(0,0,new Ext.sunyard.filter.TreeFilterPlugin({
					filterFieldWidth:this.filterFieldWidth,
					ignoreFolder:false
				}));
			}else{
				this.plugins.splice(0,0,this.filterPlugin);
			}
		}
		if(this.expandAllPlugin){
			if(Ext.isBoolean(this.expandAllPlugin)){
				this.plugins.push(new Ext.sunyard.filter.TreeExpendAllPlugin());
			}else{
				this.plugins.push(this.expandAllPlugin);
			}
		}
		if(this.collapseAllPlugin){
			if(Ext.isBoolean(this.collapseAllPlugin)){
				this.plugins.push(new Ext.sunyard.filter.TreeCollapseAllPlugin());
			}else{
				this.plugins.push(this.collapseAllPlugin);
			}
		}
		if(this.refreshPlugin){
			if(Ext.isBoolean(this.refreshPlugin)){
				this.plugins.push(new Ext.sunyard.filter.TreeRefreshPlugin());
			}else{
				this.plugins.push(this.refreshPlugin);
			}
		}
	},
	onCheckChange:function(node, checked){
		node.updateCheck(checked);
    	(function(parentNode){
    		var fn = arguments.callee;
    		if(parentNode.getDepth()>0){
        		var parentChecked = false;
        		parentNode.eachChild(function(child){
        			parentChecked = parentChecked || child.getUI().isChecked();
        		});
        		if(parentNode.getUI().isChecked()!==parentChecked){
					parentNode.getUI()._setCheck(parentChecked);
					fn(parentNode.parentNode);
        		}
    		}else{
    			return;
    		}
    	})(node.parentNode);
    	this.fireEvent("aftercheckchange",node,checked,this);
	}
});
Ext.sunyard.form.TreeModels = Ext.extend(Ext.form.Field,{
	valueSeparator:',',
	defaultAutoCreate : {tag: "div"},
	rootVisible:false,
	width:300,
	height:400,
	delayTime:500,
	submitAll:true,
	getAllData:false,
	allowBlank:true,
	blankText:'该项为必输项',
	initComponent:function(){
		Ext.sunyard.form.TreeField.superclass.initComponent.call(this);
//		this.valueTask = new Ext.util.DelayedTask(this.onTreeToField, this);
		this.valueTask = new Ext.util.DelayedTask(this.validate, this);
//		if(this.ownerCt)
		this.on('resize',function(){
			this.innerTree.setWidth(this.el.getWidth());
		},this);
	},
	onRender : function(ct, position){
		Ext.sunyard.form.TreeField.superclass.onRender.call(this,ct,position);
		this.initTree();
		this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.name||this.hiddenName,
            id: (this.hiddenId || Ext.id())}, 'before', true);
	},
	afterRender : function(){
        Ext.sunyard.form.TreeField.superclass.afterRender.call(this);
    },
	initTree:function(){
		if(!this.innerTree){
			this.treeCfg = this.treeCfg || {};
	    	this.treeCfg = Ext.applyIf(this.treeCfg,{
	        	renderTo:this.el,
	            autoScroll:true,
	            bodyStyle:'background-color:white;border:1px solid #B5B8C8',            
			    rootVisible:this.rootVisible,
			    height:this.height,
			    width:this.width,
			    lines:false,
			    animCollapse:false,
			    animate: false,
			    border:true,
			    filterFieldWidth:this.filterFieldWidth||100,
			    loader:this.loader||new Ext.tree.TreeLoader({
	                dataUrl: this.dataUrl,
	                requestMethod: this.requestMethod,
	                listeners:{
	                	"beforeload":function(o){
	            			Ext.apply(o.baseParams,this.baseParams||{});
	            		},
	            		scope:this
	                }
	            }),
			    //构造根节点
			    root: this.root || new Ext.tree.AsyncTreeNode({
				    id: this.rootNode||'root',
					expanded: false
			    })
			});
	    	this.innerTree = new Ext.sunyard.ModelTree(this.treeCfg);
		}
/*    	this.innerTree = new Ext.sunyard.TbarTree({
        	renderTo:this.el,
            autoScroll:true,
            bodyStyle:'background-color:white;border:1px solid #B5B8C8',            
		    rootVisible:this.rootVisible,
		    height:this.height,
		    width:this.width,
		    lines:false,
		    animCollapse:false,
		    animate: false,
		    border:true,
		    filterFieldWidth:this.filterFieldWidth||100,
		    loader:this.loader||new Ext.tree.TreeLoader({
                dataUrl: this.dataUrl,
                requestMethod: this.requestMethod,
                listeners:{
                	"beforeload":function(o){
            			Ext.apply(o.baseParams,this.baseParams||{});
            		},
            		scope:this
                }
            }),
		    //构造根节点
		    root: this.root || new Ext.tree.AsyncTreeNode({
			    id: this.rootNode||'root',
				expanded: false
		    })
		});*/
		this.mon(this.innerTree,{
			scope:this,
			aftercheckchange:this.onAfterCheckChange,
			click:this.onClick
		});
    },
    setBaseParams:function(params){
    	this.baseParams = params || {};
    	if(this.innerTree){
    		var loader = this.innerTree.getLoader();
			if(loader) loader.baseParams = this.baseParams || {};
    	}    	
    },
    onAfterCheckChange:function(node,checked,tree){
		this.valueTask.delay(this.delayTime);
	},
	onClick:function(node,e){
		e.stopEvent();
	},
	getAsyncChecked:function(a, startNode){
		startNode = startNode || this.root || this.innerTree.root;
        var r = [];
        var submitAll = this.submitAll;
        var f = function(){
        	if(this.attributes.checked){//(submitAll||this.isLeaf())&&
    			r.push(!a ? this : a=='id' ? this.id : this.attributes[a]);
    		}
        };
        startNode.cascade(f);
        return r;
	},
	getChecked : function(a, startNode){
        startNode = startNode || this.root || this.innerTree.root;
        var r = [];
        var submitAll = this.submitAll;
        if(startNode==this.innerTree.root){
        	startNode.eachChild(function(n){
        		cascadeTreeData(n.attributes,function(){
		        	if(this.checked){//(submitAll||(this.leaf==true))&&
		        		r.push(a=='id' ? this.id : this[a]);
		        	}
		        });
        	});
        }else{
        	cascadeTreeData(startNode.attributes,function(){
	        	if(this.checked){//(submitAll||(this.leaf==true))&&
	        		r.push(a=='id' ? this.id : this[a]);
	        	}
	        });
        }		        
        return r;
    },
    onResize : function(w, h){
		Ext.sunyard.form.TreeField.superclass.onResize.call(this, w, h);
        if(Ext.isNumber(w)){
            this.innerTree.setWidth(w);
        }
        if(Ext.isNumber(h)){
            this.innerTree.setHeight(h);
        }
    },
    onTreeToField:function(){
		if(this.rendered&&this.innerTree.rendered) {
			if(this.getAllData){
				this.hiddenField.value = this.getChecked("id").join(this.valueSeparator);
			}else{
				this.hiddenField.value = this.getAsyncChecked("id").join(this.valueSeparator);
			}
        }
//        this.validate();
	},
	validate:function(){
		if(this.rendered&&this.innerTree.rendered) {
			if(this.getAllData){
				this.hiddenField.value = this.getChecked("id").join(this.valueSeparator);
			}else{
				this.hiddenField.value = this.getAsyncChecked("id").join(this.valueSeparator);
			}
        }
		return Ext.sunyard.form.TreeField.superclass.validate.call(this);
	},
	initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(!Ext.isEmpty(this.hiddenField.value) && this.hiddenField.value != this.emptyText){
            this.setValue(this.hiddenField.value);
        }
        this.originalValue = this.getValue();
    },
    setValue:function(v){
		this.value = v;
		var _arrV = v ? v.split(',') : [];
		if(this.rendered&&this.innerTree.rendered){
			this.innerTree.root.eachChild(function(n){
				cascadeTreeData(n.attributes,function(){
					if(_arrV.indexOf(this.id)!=-1){
						this.checked = true;
					}else{
						this.checked = false;
					}
				});
			});
			this.innerTree.root.cascade(function(){
				if(this.rendered)
					//this.getUI()._setCheck(this.attributes.checked);
					this.getUI()._setCheck(_arrV.indexOf(this.id)!=-1);
			});
			this.hiddenField.value = (Ext.isEmpty(v) ? '' : v);
		}
	},
	getValue:function(){
		if(this.rendered&&this.innerTree.rendered) {
			if(this.getAllData){
				return this.getChecked("id").join(this.valueSeparator);
			}else{
				return this.getAsyncChecked("id").join(this.valueSeparator);
			}
        }else{
	        return this.value;
	    }
	},
	getRawValue:function(){
		return this.getValue();
	},
	getErrors: function(value) {
        var errors = Ext.sunyard.form.TreeField.superclass.getErrors.apply(this, arguments);        
        value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());                
        if (Ext.isFunction(this.validator)) {
            var msg = this.validator(value);
            if (msg !== true) {
                errors.push(msg);
            }
        }        
        if (value.length < 1 || value === this.emptyText) {
            if (this.allowBlank) {
                return errors;
            } else {
                errors.push(this.blankText);
            }
        }        
        if (!this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if it's blank
            errors.push(this.blankText);
        }        
        return errors;
    },
    destroy:function(){
    	if(this.innerTree) this.innerTree.destroy();
    	Ext.sunyard.form.TreeField.superclass.destroy.call(this);
    },
    reloadTree:function(){
    	if(this.innerTree){
			this.innerTree.root.reload();
		}
    }
});

Ext.reg('s_treemodels',Ext.sunyard.form.TreeModels);