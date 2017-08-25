require.config({
	paths:{
			 "jquery": "../plugins/jQuery-2.1.3.min",
			 "jquery.toJSON":"../plugins/jquery.json.min",
			 "jquery.fn.lazyload":"../plugins/lazyload",
			 "service": "../handle/service",
			 "artTemplate":"../plugins/template",
			 "pt": "../res/pt",
			 "promise":"../plugins/promise.min",
			 "weixinShare":"../res/weixinShare",
			 "weixinPay":"../res/weixinpay",
			 "staticPath":"../staticPath",
			 "config":"../config",
			 "sha1":"../plugins/sha1",
			 "watch":"../plugins/watch.min",
			 "countDown":"../res/yuebaCountDown",
			 "weixin": "../plugins/jweixin-1.0.0",
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
require(['jquery','service','promise','staticPath','jquery.toJSON'], function($,Service,promise,apis){
	/**页面初始化参数 */
	var pagesSetting = function(service){
		var setting={
			"home" : {
				data : {},
				init : function(){
					return homePageInit(service,this.data);
				},
				after : function(){
					homeInitAfter(service,this.data);
				},
				methods : {
					"downloadApp":function(){
						
					},
					"goWeChatPayPage":function(){
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
				after : function(){
					wechatPayInitAfter(service,this.data);
				},
				methods : {
					"pay":function(){
						service.weixinPay(localStorage.getItem("fd_id"),$("#mobile-num").val(),"Bearer "+ localStorage.getItem("Authorization"));
					},
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
		},function(response){
			p.done("获取订单信息失败","failed");
			alert("获取订单信息失败");
		})
		return p
	}
	var homeInitAfter =  function(service,data){
		service.setCountDown(data.remainTime,"time-count-down","colorful");
	}

	var wechatPayPageInit = function (service,pageData){
		if($("#main-body").hasClass("has-download-app"))
			$("#main-body").removeClass("has-download-app");
		var p=new promise.Promise();
		service.pageLoading();
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
			}).then(function(){
				alert("接受邀请成功");
			},function(){
				alert("接受邀请失败");
				p.done("接受邀请失敗","failed");
			})
			p.done(response,"success");
			service.pageLoadingEnd();
		},function(response){
			p.done("获取订单信息失败","failed");
		})
		return p
	}

	var wechatPayInitAfter =  function(service,data){
		service.setCountDown("1990-09-05","pay-time-count-down","common");
	}

	//设置页面参数
	var setPageData = function(response,pageData,service){
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
			}
			//是否已经付款
			var isAlreadyPaid = false;
			if(response.payment_aa)
				isAlreadyPaid=(response.payment_aa.status == "PAID");

			//是否是邀请人
			var isInititor = false;
			if(localStorage.getItem("fd_id") == response.user.user_id){
				isInititor = false;
			}
			//是否接受了邀请
			var isTakeInviter = false;
			$.each(response.customers,function(index,value){
				if(value.user_id == localStorage.getItem("fd_id"))
					isTakeInviter = true;
			})

			//是否已经全部被预订
			var isAllTakeinviters = false;
			if(response.customers_count == response.customers.length)
				isAllTakeinviters = true;
			var isOrderClosed =(response.status == "closed");

			var rewardMoney = 0;
			if(response.user.user_id == localStorage.getItem("fd_id"))
				rewardMoney = response.payment_aa_reward.initiator_amount;
			else
				rewardMoney = response.payment_aa_reward.invitee_amount;

			var emptyCustomerObj = {avatar_path:"../img/empty_circle.png"};
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
				'isAllTakeinviters' : isAllTakeinviters,
				'isOrderClosed' : isOrderClosed,
				'isInititor' : isInititor,
				'isTakeInviter' : isTakeInviter,
				'rewardMoney' : rewardMoney,
				'payment_aa_invitee_amount' : response.payment_aa_invitee_amount,
				'customer_number' : response.note.customer_number,
				'alreadyPaidCustomerNumber' : response.customers_count,
				'effective_date' : service.timeStamp2String(endDate).substring(0,16),
				'catalogueAll' : catalogueAll.toString(),
				'inititorMobile' : inititorMobile.substring(2,5)+"****"+inititorMobile.substring(9,14),
			}
	}

	/*
		*@explain页面启动
	*/
	new Service(pagesSetting);
})

