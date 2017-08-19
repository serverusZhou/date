/***********************
	公共函数
***********************/	


//连接接口，并返回数据
function returnjsondata(type,url,data){
	var returnData="";
	$.ajax({
		type:type,
		async: false,
		url:url,
		data:data,
		dataType: "json",
		headers:{'creator':"312"},
		success:function(data){	
			returnData=data;
		},
		error:function(){
			alert("连接超时，请稍候再连！！");
		}
	});	
	if(returnData!=""){
		return returnData;
	}
}

//获取页面传递的参数
function getQueryString(name) {
	location.href.replace(/%27/g,"'");
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(r[2]);
	}
	return null;
}

//日期时间戳
function timeStamp2(time){
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    return year + "-" + month + "-" + date;
}

//日期时间戳转换
function timeStamp2String(time){
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
}

/*公用工具类函数*/
function sclip (str,length) {
	if(str.length >= length) {
	 str=str.substring(0,length);
	}else {
	 str=str;
	}
	return str;
}
//添加微信分享（放在这儿迫不得已）
document.write('<script src="https://test.juziwl.com/data/platform1/static/single/js/jweixin-1.0.0.js"></script>');
document.write('<script src="https://test.juziwl.com/data/platform1/static/single/js/sha1.js"></script>');