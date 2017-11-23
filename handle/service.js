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
		//self.wxShare(config.weChartConfig().activityShare.title,config.weChartConfig().activityShare.noncestr,config.weChartConfig().activityShare.img);//调用微信分享
		self.wxGetUserInfo().then(function(data,msg){
			if(msg == "success"){
				localStorage.setItem("fd_id",data.id);
				localStorage.setItem("open_socialAccId",data.socialAccId);
				self.setUpPage();
				self.pageChange();
				// self.stopBrowerdefaultEvent(function(){
				// 	self.setUpPage();
				// 	self.pageChange();
				// })
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
		var isContinue = false;
		self.pagesData[pageTitle].init().then(function(){
			$("#main-body").animate({opacity:0},100,function(){
				self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
				// self.watchAllData(self.pagesData[pageTitle].data,function(){
				// 	self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
				// })
				self.pagesData[pageTitle].after(isContinue);
				$("#main-body").animate({opacity:1});
			})
		},function(){

		})
		self.stopBrowerdefaultEvent(function(){
			//如果在wechatPay页面，不让刷新，但是还有效果，哈哈
			if(pageTitle == "wechatPay"){
				self.pageLoadingEnd();
				setTimeout(function(){
					self.pageLoadingCircleEnd();
				},1000)
				return
			}
			self.pagesData[pageTitle].init().then(function(){
				self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
				// self.watchAllData(self.pagesData[pageTitle].data,function(){
				// 	self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
				// })
				isContinue = true;
				self.pagesData[pageTitle].after(isContinue);
			},function(){
				self.alert("刷新失败，请重试");
			})
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
			console.error("調用分享失敗");
		})
	}

	/*
		*@explain進行微信支付
	*/
	H5Funcs.prototype.weixinPay=function(userid,mobile,Authorization,rightPersonMobile){
		var self = this;
		var p=new promise.Promise();
		if(!(rightPersonMobile == mobile)){
			self.setMobile(userid,mobile,Authorization).then(function(data,msg){
				if(msg == "success"){
					self.getOrderPayInfo(localStorage.getItem("out_trade_no"),localStorage.getItem("open_socialAccId"),Authorization).then(function(payData,msg){
						if(msg == "success"){
							self.blankClick(function(){
								self.alert("提示信息","系统繁忙，请重试",function(){
									history.back();
								})
							})
							weixinPay({
								noncestr:payData.nonce_str,
								timeStamp:payData.timestamp,
								appid:payData.app_id,
								package:payData.pkg,
								pay_sign:payData.pay_sign,
								func : function(){
									$("#pay-suc").show();
								},
								finalFunc : function(){
									$("#fd-blank-click").remove();
								}
							})
						}else{
							self.alert("提示信息","获取支付信息接口出错！");
						}
					})
				}else{
					self.alert("提示信息",data);
				}
			})
		}else{
			self.getOrderPayInfo(localStorage.getItem("out_trade_no"),localStorage.getItem("open_socialAccId"),Authorization).then(function(payData,msg){
				if(msg == "success"){
					weixinPay({
						noncestr:payData.nonce_str,
						timeStamp:payData.timestamp,
						appid:payData.app_id,
						package:payData.pkg,
						pay_sign:payData.pay_sign,
						func : function(){
							$("#pay-suc").show();
						}
					})
				}else{
					self.alert("提示信息","获取支付信息接口出错！");
				}
			})
		}
	}

	//获取支付信息
	H5Funcs.prototype.getOrderPayInfo = function(out_trade_no,open_id,Authorization){
		var self = this;
		var p=new promise.Promise();
		var requestData='{"method":"WECHATPAY","type":"AA","out_trade_no":"'+out_trade_no+'","open_id":"'+open_id+'"}';
		$.ajax({
			type: "post",
			async: true,
			url: self.formatUrl(apis.getOrderInfo,{'order_id' : localStorage.getItem("orderId")}),
			data : requestData,
			dataType: "json",
			contentType: 'application/json',
			headers :{
				'Authorization' : Authorization
			}
		}).then(function(response){
			p.done(response,"success");
		},function(response){
			p.done("获取订单支付失败","failed");
		})
		return p
	}

	//保存手机号
	H5Funcs.prototype.setMobile = function(userid,mobile,Authorization){
		var self = this;
		var p=new promise.Promise();
		if(!(/^1[3|4|5|7|8][0-9]\d{4,12}$/.test(mobile))){
			p.done("请输入正确的手机号！","failed");
		}else{
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
			},function(error){
				console.log("error",error);
				p.done("网络连接不稳定，请重试","failed");
				self.alert("提示信息","网络连接不稳定，请重试");
				//p.done("拼单已结束，不能付款","failed");
				//self.alert("提示信息","拼单已结束，不能付款");
			})
		}
		return p
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
		var notWechatBowerHtml = '<div class="content-404">\
									<div class="error-pin"></div>\
									<div class="error-hanger">\
										<span class="tip">抱歉<br>此页面需在微信中打开</span>\
									</div>\
								</div>';
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
		var pageErrorHtml =  '<div class="content-404">\
      							<div class="error-pin"></div>\
      							<div class="error-hanger">\
									<span class="tip">此页面参数有误，请获取正确的活动链接</span>\
								</div>\
      						  </div>';
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
	H5Funcs.prototype.setCountDown=function(time,id,type,isContinue,func){
		new CountDown({
			"time":time,
			"id":id,
			"type":type,
			"isContinue" : isContinue,
			"func" : func
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
	//页面加载
	H5Funcs.prototype.pageLoadingCircle=function(){
		var p = new promise.Promise();
		// $(".loding-area").css({
		// 	"-webkit-transition": "all .3s",
		// 	"transition": "all .3s"
		// });
		//  $(".loding-area").css({
		// 	"-webkit-transform": "scaleY(2.1rem)",
		// 	"transform": "scaleY(2.1rem)"
		// });
		$(".loding-area").animate({height:"2.1rem"},500,function(){
			setTimeout(function(){
				p.done("anmiEnd","success");
			},300)
		})
		return p
	}
	//页面加载完成
	H5Funcs.prototype.pageLoadingCircleEnd=function(){
		$(".loding-area").animate({height:"0"},500)
		// $(".loding-area").css({
		// 	"-webkit-transform": "scaleY(0)",
		// 	"transform": "scaleY(0)"
		// });
	}



	//路径格式化
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
						self.pageLoadingCircle().then(function(){
							func();
						});
						setTimeout(function(){
							isInProgress = true;
						},1000)
					}
				}
				event.preventDefault();
			}
			lastY = y; 
		});
	}

	//浏览器下拉刷新事件
	H5Funcs.prototype.pullFlash = function(obj,offset,callback){
		 var start,
			 end,
			 isLock = false,//是否锁定整个操作
		     isCanDo = false,//是否移动滑块
             isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
			 hasTouch = 'ontouchstart' in window && !isTouchPad;
		obj = $(obj);
		var objparent = obj.parent();
		var fn =
            {
                //移动容器
                translate: function (diff) {
					console.log(diff);
                    obj.css({
                        "-webkit-transform": "translate(0," + diff + "px)",
                        "transform": "translate(0," + diff + "px)"
                    });
                },
                //设置效果时间
                setTranslition: function (time) {
                    obj.css({
                        "-webkit-transition": "all " + time + "s",
                        "transition": "all " + time + "s"
                    });
                },
                //返回到初始位置
                back: function () {
                    fn.translate(0 - offset);
                    //标识操作完成
                    isLock = false;
                }
			};
		 //滑动开始
        obj.bind("touchstart", function (e) {
			e.preventDefault();
            if (objparent.scrollTop() <= 0 && !isLock) {
                var even = typeof event == "undefined" ? e : event;
                //标识操作进行中
                isLock = true;
                isCanDo = true;
                //保存当前鼠标Y坐标
                start = hasTouch ? even.touches[0].pageY : even.pageY;
                //消除滑块动画时间
                fn.setTranslition(0);
            }
        });
        //滑动中
        obj.bind("touchmove", function (e) {
			e.preventDefault()
            if (objparent.scrollTop() <= 0 && isCanDo) {
                var even = typeof event == "undefined" ? e : event;
                //保存当前鼠标Y坐标
                end = hasTouch ? even.touches[0].pageY : even.pageY;
                if (start < end) {
                    even.preventDefault();
                    //消除滑块动画时间
                    fn.setTranslition(0);
                    //移动滑块
                    fn.translate(end - start - offset);
                }
			}
        });
        //滑动结束
        obj.bind("touchend", function (e) {
			e.preventDefault()
            if (isCanDo) {
                isCanDo = false;
                //判断滑动距离是否大于等于指定值
                if (end - start >= offset) {
                    //设置滑块回弹时间
                    fn.setTranslition(1);
                    //保留提示部分
                    fn.translate(0);
                    //执行回调函数
                    if (typeof callback == "function") {
                        callback.call(fn, e);
                    }
                } else {
                    //返回初始状态
                    fn.back();
                }
            }
        });
	}

	//时间格式化
	H5Funcs.prototype.timeStamp2String = function(time){
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

	//弹框alert
	H5Funcs.prototype.alert=function(title,conent,func){
		var alerts={
				confirmHtml:function(){
					html='<div class="page_mask" id="fd-alert">';
					html+='<div class="alert-wrap">';
					html+='<div class="alert-hd">';
					html+='<strong>'+title+'</strong>';
					html+='</div>';
					html+='<div class="alert-bd">';
					html+=conent;
					html+='</div>';
					html+='<div class="alert-ft" id="alert-sure">确定';
					html+='</div>';
					html+='</div>';
					html+='</div>';
					return html
				},
				init:function(){
					alerts.destory();
					$("body").before(alerts.confirmHtml());
					$("#alert-sure").unbind("click").bind("click",function(){
						$("#fd-alert").animate({opacity:0},100,function(){
							alerts.destory();
							if(typeof func == "function"){
								func();
							}
						})
					})
				},
				destory:function(){
						$("#fd-alert").remove();
				}
		}
		alerts.init();
	}

	//透明页面点击时间
	H5Funcs.prototype.blankClick=function(func){
		var alerts={
				confirmHtml:function(){
					html='<div class="page_mask" id="fd-blank-click">';
					html+='</div>';
					return html
				},
				init:function(){
					alerts.destory();
					$("body").before(alerts.confirmHtml());
					$("#fd-blank-click").unbind("click").bind("click",function(){
						alerts.destory();
						if(typeof func == "function"){
							func();
						}
					})
				},
				destory:function(){
						$("#fd-blank-click").remove();
				}
		}
		alerts.init();
	}


	return H5Funcs
})
	