/*
*項目配置文件
*/
define(function(){
	function config(){
		/*
		*页面配置
		*/
		var pageMap={
			"home":{
				"contentId":"main-body",
				"templateId":"home",
			},
			"wechatPay":{
				"contentId":"main-body",
				"templateId":"wechatpay"
			},
			"404":{
				"contentId":"main-body",
				"templateId":"notfound",
			}
		}

		var weChartConfig = {
			appId : "wx72e523b991255618",
			secret : "103329cf0f68ece7f8717afc969eb7d3",
			accessToken : "zRmz6aaPgQG2eJbb4iL_AcgbC85-Axx1934udg6fxjdbq1brEUQRKjQfx7D8du41g70yUGp3bKFvCcfbRacD-MWNGHVGLcacTvtwrcyPeYJqWnxmySrXxRMXsQGu1rmOHHEbAGAPPM",
			path : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72e523b991255618&redirect_uri=http%3a%2f%2fbgtest.natapp1.cc%2f&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
		}
		
		/*
		*判斷是否開啓微信調試模式
		*/
		var wxDebug=true;
		/*
		*項目域名地址
		*/
		var domain="http://192.168.0.199:8080";

		/*
		*判断是否只可以在微信登录
		*/
		var onlyWeChat = true;

		return function(){
			return {
				wxDebug : wxDebug,
				domain : domain,
				pageMap : pageMap,
				onlyWeChat : onlyWeChat,
				weChartConfig : weChartConfig
			}
		}
	}
	return config()()
});