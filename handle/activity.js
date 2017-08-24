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
	/*
		*@explain页面启动
	*/
	new Service().wxShare("就差个标题xxxx","活动很好，就差一个标题xxx","");
})

