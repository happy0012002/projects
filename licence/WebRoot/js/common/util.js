var j$ = jQuery.noConflict();
/*
多选框移动start
*/
function srcToDest(srcid,destid,flag){
	var optionsObjects=document.getElementById(srcid);
	var optionsSubObjects=document.getElementById(destid);
	for(var i=0;i<optionsObjects.length;i++){
		if(optionsObjects.options[i].selected==true){
			var optionsvalue=optionsObjects.options[i].value;
			var optionstext=optionsObjects.options[i].text;
			addoptions(destid,optionstext,optionsvalue,flag);
			//addoptions(srcid1,optionstext,optionsvalue);
		}
	}
}

function addoptions(objectid,textvalue,optionsvalue,flag){
	var optionsSubObjects=document.getElementById(objectid);
	var hasexist=0;
	for(var i=0;i<optionsSubObjects.length;i++){
		var optionsvalue_sub=optionsSubObjects.options[i].value;
		if(optionsvalue_sub==optionsvalue)
		  hasexist+=1;
	}
	if(hasexist==0){
		optionsSubObjects.add(new Option(textvalue,optionsvalue))
	}
}

function destToSrc(destid){
	var optionsObjects=document.getElementById(destid);
	for(var i=optionsObjects.options.length-1;i>=0;i--){
	    if(optionsObjects.options[i].selected==true){
		   optionsObjects.options.remove(i);
		}
	}
}
/*
多选框移动end
*/	