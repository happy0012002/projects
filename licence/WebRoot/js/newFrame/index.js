
function ShowMain(url,type,topname,topprivid,secondname,secondprivid,thridname,thridprivid) {
    var temp;
    if (url != "") {
        showMenuHead(type,topname,topprivid,secondname,secondprivid,thridname,thridprivid);
        temp = document.getElementById("main_right");
        temp.src = url + GetUrlParm(url);
        temp.contentWindow.window.name = "main_right";
        frames["main_right"] = temp.contentWindow.window;
        if( $("#menu").css("display")=='block' ){
		//	$("#menu").slideUp(300);
			$("#content").css("left","45px");
			secondMenuName='';
		}
    }
}

function showMenuHead(type,topname,topprivid,secondname,secondprivid,thridname,thridprivid){

	if(type == '2'){//三级菜单
		if( $("#content-menuhead").css("display")=='none' ){
			$("#main_right_frame").css("top","80px");
			$("#content-menuhead").slideDown(300);
		}
		$("#content-menuhead").html('<span name="'+topprivid+'" class="topmenu"> <a href="javascript:contentMenuheadClick(\''+topprivid+'\',\'\');" >'+topname+'</a> > </span><span name="'+secondprivid+'" class="secondmenu"><a href="javascript:contentMenuheadClick(\''+topprivid+'\',\''+secondprivid+'\');" >'+secondname+'</a> > </span>	<span name="'+thridprivid+'" class="thridmenu"><a href="javascript:contentMenuheadClick(\''+topprivid+'\',\''+secondprivid+'\',\''+thridprivid+'\');" >'+thridname+'</a></span>');
	}else{
		if( $("#content-menuhead").css("display")=='block' ){
			$("#main_right_frame").css("top","50px");
			//$("#content-menuhead").slideUp(300);
		}
	}
}

function ShowSecondManu(operprivid,secondprivid) {
    var temp;
    if (operprivid != "") {
        temp = document.getElementById("second_menu");
        temp.src = "app/loginController/getSecondMenu?operprivid=" + operprivid+"&secondprivid="+secondprivid
        
        ;
        //temp.contentWindow.window.name = "second_menu";
        //frames["second_menu"] = temp.contentWindow.window;
    }
}

function GetUrlParm(url) {
    var urlparm = "?";
    if (url.indexOf('?') >= 0) {
        urlparm = "&";
    }
    urlparm = urlparm + "t=" + GetRandomNum();
    return urlparm;
}

function GetRandomNum() {
    var Range = 1000;
    var Rand = Math.random();
    return (Math.round(Rand * Range));
}
