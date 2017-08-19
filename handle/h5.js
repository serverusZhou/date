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
			 "staticPath":"../staticPath",
			 "config":"../config",
			 "sha1":"../plugins/sha1",
			 "watch":"../plugins/watch.min",
			 "countDown":"../res/yuebaCountDown",
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
						
					}
				}
			},
			"wechatPay" : {

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
		service.setCountDown();
	}
	/*
		*@explain页面启动
	*/
	var service=new Service(pagesSetting);
})

