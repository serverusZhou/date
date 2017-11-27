require.config({
	paths:{
			 "jquery": "../plugins/jQuery-2.1.3.min",
			 "jquery.toJSON":"../plugins/jquery.json.min",
			 "jquery.fn.lazyload":"../plugins/lazyload",
			 "service": "http://"+location.host+"/yueba/handle/service.js?_T="+(new Date()).getTime(),
			 "artTemplate":"../plugins/template",
			 "pt": "../res/pt",
			 "promise":"../plugins/promise.min",
			 "weixinShare":"../res/weixinShare",
			 "weixinPay":"http://"+location.host+"/yueba/res/weixinpay.js?_T="+(new Date()).getTime(),
			 "staticPath":"../staticPath",
			 "config":"http://"+location.host+"/yueba/config.js?_T="+(new Date()).getTime(),
			 "sha1":"../plugins/sha1",
			 "watch":"../plugins/watch.min",
			 "countDown":"../res/yuebaCountDown",
			 "weixin": "../plugins/jweixin-1.0.0",
			 "md5": "../plugins/md5",
		  },
	shim:{
	    'jquery.toJSON':{
	        deps:['jquery']
	    },
	    "jquery.fn.lazyload":{
	    	deps:['jquery']
	    },
	}
});
require(['jquery','service','promise','staticPath','config','jquery.toJSON'], function($,Service,promise,apis,config){
	/**页面初始化参数 */
	var pagesSetting = function(service){
		var setting={
			"home" : {
				data : {},
				init : function(){
					return homePageInit(service,this.data);
				},
				after : function(isContinue){
					homeInitAfter(service,this.data,isContinue);
				},
				methods : {
					"downloadApp":function(){
						location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=agilie.fandine&g_f=991653";
					},
					"getAccept":function(){
						var requestData='{"user_id":"'+localStorage.getItem("fd_id")+'"}';
						$.ajax({
							type: "put",
							async: true,
							url: service.formatUrl(apis.acceptInvite,{'order_id' : localStorage.getItem("orderId")}),
							data : requestData,
							traditional: true,
							dataType: "json",
							headers :{
								'Authorization' : "Bearer "+ localStorage.getItem("Authorization")
							},
							contentType: 'application/json',
						}).then(function(response){
							//alert("接受邀请成功");
							location.href="#wechatPay";
						},function(response){
							if(response.errorCode="DATA_CONFLICTED"){
								eval("var responseBody = "+response.responseText);
								service.alert("提示信息",responseBody.messages.cn,function(){
									location.reload();
								});
							}else{
								service.alert("提示信息","接受邀请失败！！");
							}
						})
					},
					"goToWeChatPage" : function(accepTime1){
						var countTime = 5*60*1000;
						var checkTime = 0;
						if(accepTime1){
							var currentTime = (new Date()).getTime();
							var accepTime = (new Date(accepTime1)).getTime();
							checkTime = currentTime - accepTime;
						}
						if(checkTime > countTime){
							service.alert("提示信息","正在排队，请稍后",function(){
								var currentTime = (new Date()).getTime();
								var accepTime = (new Date(accepTime1)).getTime();
								checkTime = currentTime - accepTime;
								if( checkTime >  10*60*1000){
									location.reload();
								}
							});
							return
						}
						location.href="#wechatPay";
					},
					"showDetails":function(){
						if($("#is-show-details-btn").hasClass("opened")){
							$("#is-show-details-btn").attr("class","closed");
							$("#is-show-details-btn").html("展开详情");
							$("#order-details").fadeOut(300);
						}else{
							var timeAchole = $("#time-achole").offset().top-screen.width/375*10*4;
							$("#is-show-details-btn").attr("class","opened");
							$("#is-show-details-btn").html("收起详情");
							$("#order-details").fadeIn(100,function(){
								$("html,body").animate({scrollTop:timeAchole},400);
							});
						}
					}
				}
			},
			"wechatPay" : {
				data : {},
				init : function(){
					return wechatPayPageInit(service,this.data);
				},
				after : function(isContinue){
					wechatPayInitAfter(service,this.data,isContinue);
				},
				methods : {
					"pay":function(rightPersonMobile){
						service.weixinPay(localStorage.getItem("fd_id"),$("#mobile-num").val(),"Bearer "+ localStorage.getItem("Authorization"),rightPersonMobile);
					},
					"goBackToHome" : function(){
						history.back();
					}
				}
			}
		}
		return function(){
			return setting 
		}
	}
	//home页面启动函数
	var homePageInit = function(service,pageData){
		if(!$("#main-body").hasClass("has-download-app"))
			$("#main-body").addClass("has-download-app")
		var p=new promise.Promise();
		service.pageLoading();
		service.pageLoadingCircle();
		var data = {
			'order_id':localStorage.getItem("orderId"),
			'user_id' : localStorage.getItem("fd_id"),
			'is_server' : true,
			'is_online_payment' : true,
			'locale' : 'zh_CN'
		}
		$.ajax({
			type: "get",
			async: true,
			url: service.formatUrl(apis.orderApiDomain,{'order_id' : localStorage.getItem("orderId")}),
			data : data,
			dataType: "json",
			headers :{
				'Authorization' : "Bearer "+ localStorage.getItem("Authorization")
			}
		}).then(function(response){
			console.log('service.wxShare');
			console.log(config.weChartConfig().activityShare.title);
			console.log(service.formatUrl(config.weChartConfig().activityShare.title,{'restaurant_name':response.restaurant_name}));
			service.wxShare(service.formatUrl(config.weChartConfig().activityShare.title,{'restaurant_name':response.restaurant_name}),config.weChartConfig().activityShare.noncestr,config.weChartConfig().activityShare.img);//调用微信分享
			setPageData(response,pageData,service);
			p.done(response,"success");
			service.pageLoadingEnd();
			setTimeout(function(){
				service.pageLoadingCircleEnd();
			},1000)
		},function(response){
			p.done("获取订单信息失败","failed");
			service.alert("提示信息","获取订单信息失败");
		})
		return p
	}
	var homeInitAfter =  function(service,data,isContinue){
		if(!data.orderInfo.isOrderClosed && !data.orderInfo.isOrderFiled){
			service.setCountDown(data.remainTime,"time-count-down","colorful",isContinue,function(){
				service.alert("提示信息","拼单已结束！",function(){
					location.reload();
				})
			});
		}
	}

	var wechatPayPageInit = function (service,pageData){
		if($("#main-body").hasClass("has-download-app"))
			$("#main-body").removeClass("has-download-app");
		var p=new promise.Promise();
		service.pageLoading();
		service.pageLoadingCircle();
		var data = {
			'order_id':localStorage.getItem("orderId"),
			'user_id' : localStorage.getItem("fd_id"),
			'is_server' : true,
			'is_online_payment' : true,
			'locale' : 'zh_CN'
		}
		$.ajax({
			type: "get",
			async: true,
			url: service.formatUrl(apis.orderApiDomain,{'order_id' : localStorage.getItem("orderId")}),
			data : data,
			dataType: "json",
			headers :{
				'Authorization' : "Bearer "+ localStorage.getItem("Authorization")
			}
		}).then(function(response){
			setPageData(response,pageData,service);
			p.done(response,"success");
			service.pageLoadingEnd();
			setTimeout(function(){
				service.pageLoadingCircleEnd();
			},1000)
		},function(response){
			p.done("获取订单信息失败","failed");
		})
		return p
	}

	var wechatPayInitAfter =  function(service,data,isContinue){
		var countTime = 5*60*1000;
		if(data.orderInfo.accepTime){
			var currentTime = (new Date()).getTime();
			var accepTime = (new Date(data.orderInfo.accepTime)).getTime();
			countTime = countTime - (currentTime - accepTime);
		}
		service.setCountDown(countTime,"pay-time-count-down","common",isContinue,function(){
			service.alert("提示信息","您的订单已过期",function(){
				history.back();
			})
		});
	}

	//设置页面参数
	var setPageData = function(response,pageData,service){
			if(response.payment_aa)
				localStorage.setItem("out_trade_no",response.payment_aa.out_trade_no);
			else
				console.error("there is no payment_aa,so there is no out_trade_no");
			localStorage.setItem("restaurant_id",response.restaurant_id);
			//设置倒计时时间
			var endDate = (new Date(response.note.effective_date)).getTime();
			var now = (new Date()).getTime();
			pageData.remainTime = (endDate - now);
			var inititorMobile = "";
			$.each(response.customers,function(i,value){
				if(value.role == "INITIATOR")
					inititorMobile = value.mobile;
			})

			if(inititorMobile == "")
				console.error("邀请人信息不存在！！！");
			pageData.restaurantInfo = {
				'restaurant_name' : response.restaurant_name,
				'address1' : response.restaurant_addresses.address1,
				'city' : response.restaurant_addresses.city,
			}
			//是否已经付款
			var isAlreadyPaid = false;
			if(response.payment_aa)
				isAlreadyPaid=(response.payment_aa.status == "PAID");
			//是否是邀请人
			var isInititor = false;
			if(localStorage.getItem("fd_id") == response.user.user_id){
				isInititor = true;
			}
			//是否接受了邀请
			var isTakeInviter = false;
			var accepTime = "";
			var rightPersonMobile = "";
			$.each(response.customers,function(index,value){
				if(value.user_id == localStorage.getItem("fd_id")){
					isTakeInviter = true;
					accepTime = value.create_time;
					rightPersonMobile = value.mobile
				}
			})
			//是否已经全部被预订
			var isAllTakeinviters = false;
			if(response.note.customer_number == response.customers.length)
				isAllTakeinviters = true;
			var isOrderClosed = (response.status == "CLOSED");

			var isOrderFiled = (response.status == "FAILED")

			var isOrderPending = (response.status == "PENDING")

			if(isOrderClosed || isOrderFiled)
				$("#main-body").removeClass("has-footer");

			var rewardMoney = 0;
			if(response.user.user_id == localStorage.getItem("fd_id"))
				rewardMoney = response.payment_aa_reward.initiator_amount;
			else
				rewardMoney = response.payment_aa_reward.invitee_amount;

			var emptyCustomerObj = {avatar_path:"img/empty_circle.png"};
			pageData.headCuts = [];
			for(var iid = 0;iid < response.note.customer_number;iid++){
				pageData.headCuts.push(emptyCustomerObj);
			}
			$.each(response.customers,function(i,value){
				pageData.headCuts[i] = value;
			})
			var catalogueAll = [];
			$.each(response.order_items,function(i,value){
				catalogueAll.push(value.item_name+"x"+value.quantity);
			})
			pageData.orderInfo = {
				'rightPersonMobile' : rightPersonMobile,
				'isAlreadyPaid' :isAlreadyPaid,
				'accepTime' : accepTime,
				'isAllTakeinviters' : isAllTakeinviters,
				'isOrderClosed' : isOrderClosed,
				'isOrderFiled' : isOrderFiled,
				'isOrderPending' : isOrderPending,
				'isInititor' : isInititor,
				'isTakeInviter' : isTakeInviter,
				'rewardMoney' : rewardMoney,
				'payment_aa_invitee_amount' : response.payment_aa_invitee_amount,
				'customer_number' : response.note.customer_number,
				'alreadyPaidCustomerNumber' : response.customers_count,
				'alreadyPaidCustomers' :  response.customers,
				'effective_date' : service.timeStamp2String(endDate).substring(0,16),
				'catalogueAll' : catalogueAll.toString().replace(/,/g," , "),
				'inititorMobile' : (!isInititor && !isAlreadyPaid) ? inititorMobile.substring(2,5)+"****"+inititorMobile.substring(9,14) : inititorMobile.substring(2,14),
			}
	}

	/*
		*@explain页面启动
	*/
	new Service(pagesSetting);
})

