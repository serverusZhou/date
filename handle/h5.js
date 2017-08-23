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
require(['jquery','service','promise'], function($,Service,promise){
	/**页面初始化参数 */
	var pagesSetting = function(service){
		var setting={
			"home" : {
				data : {
					perMoney : 0,
					totalPerson : 0,
					alreadyPaid : 0,
					rewardMoney : 0,
					headCuts : [
						{
							imgUrl:"../img/empty_circle.png",
						},
						{
							imgUrl:"../img/empty_circle.png",
						},
					],
					otherthing: 5
				},
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
							$("#is-show-details-btn").attr("class","opened");
							$("#is-show-details-btn").html("收起详情");
							$("#order-details").fadeIn(300);
						}
					}
				}
			},
			"wechatPay" : {
				data : {
					
				},
				init : function(){
					return wechatPayPageInit(service,this.data);
				},
				after : function(){
					wechatPayInitAfter(service,this.data);
				},
				methods : {
					"pay":function(){
						service.weixinPay();
					},
				}
			}
		}
		return function(){
			return setting
		}
	}
	//home页面启动函数
	var homePageInit = function(service,data){
		var p=new promise.Promise();
		p.done(data,"success");
		return p
	}
	var homeInitAfter =  function(service,data){
		service.setCountDown("1990-09-05","time-count-down","colorful");
	}

	var wechatPayPageInit = function (service,data){
		var p=new promise.Promise();
		p.done(data,"success");
		return p
	}

	var wechatPayInitAfter =  function(service,data){
		service.setCountDown("1990-09-05","pay-time-count-down","common");
	}

	/*
		*@explain页面启动
	*/
	new Service(pagesSetting);
})

