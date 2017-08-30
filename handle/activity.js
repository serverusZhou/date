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
require(['jquery','service','promise','config'], function($,Service,promise,config){
	/*
		*@explain页面启动
	*/
	var service = new Service();
	service.wxShare(config.weChartConfig().advShare.title,config.weChartConfig().advShare.noncestr,config.weChartConfig().advShare.img);
	// service.stopBrowerdefaultEvent();
	// service.stopBrowerdefaultEvent(function(){
	// 	console.log("下拉刷新");
	// });
	//service.alert("提示","消息已经成功发送！")
	service.pullFlash(".loding-area",50,function(e){
		 var that = this;
		 setTimeout(function () {
			that.back.call();
		}, 2000)
	})
	//topBowerDefault();
})

