/*
	*@explain歸總此頁面方法
*/

define(['jquery','staticPath','weixinShare','weixinPay','promise','artTemplate','config','watch','countDown','jquery.toJSON'],function($,apis,wxShare,weixinPay,promise,Template,config,watch,CountDown){
	var H5Funcs=function(pagesSetting){
		if(pagesSetting){
			this.pagesData = pagesSetting(this)();
			this.pageInit();
		}
	}
	/*
		*@explain初始化页面
	*/
	H5Funcs.prototype.pageInit=function(){
		var self = this;
		if(!self.enterPageFilter())//是否满足页面的过滤条件（微信浏览）
		   return
		self.wxShare(config.weChartConfig().activityShare.title,config.weChartConfig().activityShare.noncestr,config.weChartConfig().activityShare.img);//调用微信分享
		self.wxGetUserInfo().then(function(data,msg){
			if(msg == "success"){
				localStorage.setItem("fd_id",data.id);
				self.setUpPage();
				self.pageChange();
			}
		})
	}
	/*
		*@explain页面启动
	*/
	H5Funcs.prototype.setUpPage=function(){
		var self = this;
		var pageTitle = self.getPageName()||"home";
		var pageObj = config.pageMap[pageTitle];
		if(pageObj==undefined){
			self.renderPage(config.pageMap["404"].contentId,config.pageMap["404"].templateId,{},{});
			return
		}
		self.pagesData[pageTitle].init().then(function(){
			$("#main-body").animate({opacity:0},100,function(){
				self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
				self.watchAllData(self.pagesData[pageTitle].data,function(){
					self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
				})
				self.pagesData[pageTitle].after();
				$("#main-body").animate({opacity:1});
			})
		},function(){

		})
	}

	/*
		*@explain使用template进行页面渲染
	*/
	H5Funcs.prototype.renderPage=function(contentId,templateId,data,methods){
		var html = Template(templateId, data);
		document.getElementById(contentId).innerHTML = html;
		$.each($("#"+contentId).find("[fd-click]"),function(index,ele){
			$(ele).click(function(){
				var argus = $(ele).attr("fd-click").split("(")[1].split(")")[0].split(",");
				var func = $(ele).attr("fd-click").split("(")[0];
				var realArgusStr = [];
				if(argus != ""){
					$.each(argus,function(index,argu){
						if(argu.indexOf("'") > -1 ||argu.indexOf("\"") > -1)
							realArgusStr.push(argu);
						else
							realArgusStr.push("data."+argu);
					})
				}
				eval("methods."+func+"("+realArgusStr.toString()+")");
			})
		})
	}

	/*
		*@explain通过hashchange事件捕捉页面跳转
	*/
	H5Funcs.prototype.pageChange=function(){
		var self = this;
		window.onhashchange=function(){
			self.setUpPage();
		}
	}

	/*
		*@explain监控数据变化，并重新渲染
	*/
	H5Funcs.prototype.watchAllData = function(data,func){
		$.each(data,function(key,value){
			watch.watch(data,key,function(){
				func();
			})
		})
	}
	/*
		*@explain获取页面hash值
	*/
	H5Funcs.prototype.getPageName=function(){
		return location.hash.replace("#","").split("?")[0];
	}

	/*
		*@explain進行配置微信分享
	*/
	H5Funcs.prototype.wxShare=function(title,describe,imgUrl){
		$.ajax({
			type: "get",
			async: true,
			url:apis.wxshare,
			dataType: "json",
		}).then(function(response){
			wxShare({
				jsapi_ticket:response.ticket,
				noncestr:config.weChartConfig().noncestr,
				timestamp:config.weChartConfig().timestamp,
				appid:config.weChartConfig().appid,
				href:location.href.split('#')[0],
				title:title,
				describe:describe,
				imgUrl:imgUrl
			})
		},function(response){
			alert("調用分享失敗");
		})
	}

	/*
		*@explain進行微信支付
	*/
	H5Funcs.prototype.weixinPay=function(userid,mobile,Authorization){
		var self = this;
		var p=new promise.Promise();
		if(!mobile){
			alert("您需要输入手机号！");
			return
		}
		var requestData='{"user_id":"'+userid+'","mobile":"'+mobile+'"}';
		$.ajax({
			type: "put",
			async: true,
			url: self.formatUrl(apis.setMobile,{'order_id' : localStorage.getItem("orderId")}),
			data : requestData,
			dataType: "json",
			contentType: 'application/json',
			headers :{
				'Authorization' : Authorization
			}
		}).then(function(response){
			p.done(response,"success");
		},function(response){
			p.done("手机号设置失败","failed");
			alert("手机号设置失败");
		})
		weixinPay({
				noncestr:config.weChartConfig().noncestr,
				timestamp:config.weChartConfig().timestamp,
				appid:config.weChartConfig().appid
			}
		);
	}
	/*
		*@explain获取微信用户信息
	*/
	H5Funcs.prototype.wxGetUserInfo=function(title,describe,imgUrl){
		var p = new promise.Promise();
		var data = {"password": localStorage.getItem("code"),"username" : "WEIXIN_H5","grant_type" : "password"};
		$.ajax({
			type: "post",
			async: true,
			url:apis.wxUserinfoToken,
			data:data,
			dataType: "json",
			contentType:"application/x-www-form-urlencoded",
			headers :{
				Authorization : "Basic dGVzdGNsaWVudDp0ZXN0dGVzdA=="
			}
		}).then(function(response){
			localStorage.setItem("Authorization",response.access_token);
			$.ajax({
				type: "get",
				async: true,
				url:apis.wxUserInfo,
				data:data,
				dataType: "json",
				contentType:"application/x-www-form-urlencoded",
				headers :{
					Authorization : "Bearer "+response.access_token
				}
			}).then(function(res){
				p.done(res,"success");
			},function(){
				p.done("can not get user info","fail");
			})
		},function(response){
			p.done("can not get token","fail");
		})
		return p
	}

	/*
		*@explain進行配置微信支付
	*/

	 /*
		*@explain 获取浏览器类型
	*/
	H5Funcs.prototype.getAgentVersion=function(){
		var self=this;
	 	var u = navigator.userAgent,app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };

	 };
	 /*
		*@explain 进入页面的过滤
	*/
	H5Funcs.prototype.enterPageFilter = function(){
		var self = this;
		if(self.filterWecart()){
			if(self.filterActivityPageCheck())
				return true
			else
				return false
		}else{
			return  false
		}
	}
	/*
		*@explain 非微信浏览器过滤
	*/
	H5Funcs.prototype.filterWecart = function(){
		var self = this;
		var notWechatBowerHtml = "<p>抱歉：</p>\
								  <p>此页面需在微信中打开</p>";
		if(!self.getAgentVersion().weixin){
		   $("body").html(notWechatBowerHtml);
			return false
		}
		return true
	}

	/*
		*@explain 验证是否是验证跳转后的页面
	*/
	H5Funcs.prototype.filterWecartUserInfoCheck = function(){
		var self = this;
		if(self.getQueryString("code")){
			if(!localStorage.getItem("orderId")){
				return "pageerror"
			}
			return "authpage"
		}
		return "activitypage"
	}

	/*
		*@explain 判断是否是活动进入的页面
	*/
	H5Funcs.prototype.filterActivityPageCheck = function(){
		var self = this;

		var authCheck = self.filterWecartUserInfoCheck();
		var pageErrorHtml = "<p>抱歉：</p>\
							 <p>此页面参数有误，请获取正确的活动链接</p>";
		if(authCheck == "activitypage"){
			if(localStorage.getItem("enterStatus")=="1"){
				localStorage.setItem("enterStatus","0")
				return true
			}else{	
				if(!self.getQueryString("orderId")){
					$("body").html(pageErrorHtml);
					return false
				}
				localStorage.setItem("orderId",self.getQueryString("orderId"));
				localStorage.setItem("originalpath",location.href.split("#")[0]);
				location.href = config.weChartConfig().authPath;
				return false
			}
		}
		if(authCheck == "authpage"){
			localStorage.setItem("code",self.getQueryString("code"));
			localStorage.setItem("state",self.getQueryString("state"));
			localStorage.setItem("enterStatus","1");
			location.href = localStorage.getItem("originalpath");
			return false
		}
		if(authCheck == "pageerror"){
			$("body").html(pageErrorHtml);
			return false
		}

	}

	/*
		*@explain 判断是否是活动进入的页面
	*/

	//获取页面传递的参数
	H5Funcs.prototype.getQueryString=function(name){
		location.href.replace(/%27/g,"'");
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var para = window.location.href.split("?")[1];
		if(!para){
			return null;
		}
		var r = para.match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}

	//倒计时
	H5Funcs.prototype.setCountDown=function(time,id,type){
		new CountDown({
			"time":time,
			"id":id,
			"type":type
		});
	}

	//页面加载
	H5Funcs.prototype.pageLoading=function(){
		var loadHtml = '<div class="page_mask" id="page-loading">\
							<div style="text-align:center;">\
								<div class="spinner">\
									<div class="rect1"></div>\
									<div class="rect2"></div>\
									<div class="rect3"></div>\
									<div class="rect4"></div>\
									<div class="rect5"></div>\
								</div>\
							</div>\
						</div>'
		if(!($("#page-loading").length && $("#page-loading").length > 0))
			$("body").append(loadHtml);
	}
	//页面加载完成
	H5Funcs.prototype.pageLoadingEnd=function(){
		$("#page-loading").remove();
	}

	//页面加载完成
	H5Funcs.prototype.formatUrl=function(url,params){
		var jsonArray = url.split("$");
		var finalUrl = "";
		$.each(jsonArray,function(i,urlvalue){
			$.each(params,function(key,value){
				if(urlvalue == key){
					jsonArray[i]= value;
				}
			})
		})
		$.each(jsonArray,function(i,urlvalue){
			console.log(urlvalue);
			finalUrl+=urlvalue;
		})
		return finalUrl
	}

	//倒计时（秒）
	H5Funcs.prototype.getMinusOneSeconeTime=function(time){
		var timeStr =  (new Date(time)).getTime();
		var returnTime = new Date(timeStr-1000);
		return returnTime
	}

	//浏览器下拉刷新事件
	H5Funcs.prototype.stopBrowerdefaultEvent=function(func){
		var self = this;
		//document.body.addEventListener('touchmove', function(e) {
			//e.stopPropagation();
			//e.preventDefault();
		//});
		var isInProgress = true;
		var lastY;//最后一次y坐标点
		$(document.body).off('touchstart');
		$(document.body).off('touchmove');
		$(document.body).on('touchstart', function(event) {
			lastY = event.originalEvent.changedTouches[0].clientY;//点击屏幕时记录最后一次Y度坐标。
		});
		$(document.body).on('touchmove', function(event) {
			var y = event.originalEvent.changedTouches[0].clientY;
			var st = $(this).scrollTop(); //滚动条高度 
			if (y >= lastY && st <= 10) {//如果滚动条高度小于0，可以理解为到顶了，且是下拉情况下，阻止touchmove事件。
				lastY = y;
				if(typeof func == "function"){
					if(isInProgress){
						isInProgress = false;
						self.pageLoading();
						setTimeout(function(){
							isInProgress = true;
						},1000)
						func();
					}
				}
				event.preventDefault();
			}
			lastY = y; 
		});
	}
	//时间格式化
	H5Funcs.prototype.timeStamp2String = function(time){
		var datetime = new Date();
		datetime.setTime(time);
		console.log("datetime",datetime);
		var year = datetime.getFullYear();
		var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
		var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
		var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
		var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
		var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
		return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
	}

	//弹框alert
	H5Funcs.prototype.alert=function(time){
		var alerts={
				confirmHtml:function(){
					html='<div class="page_mask"> id="exalert"';
					html+='<div class="exalert">';
					html+='<div class="exalertmsg">'+msg;
					html+='</div>';
					html+='</div>';
					html+='</div>';
					return html
				},
				init:function(){
					alerts.destory();
					$("body").before(alerts.confirmHtml());
					setTimeout(function(){
						alerts.destory();
						if(linkurl){
							location.href=linkurl;
						}
					},1500);
				},
				destory:function(){
						$(".exalert").remove();
				}
		}
		alerts.init();
	}


	return H5Funcs
})
	