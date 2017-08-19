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
				"templateId":"home"
			},
			"wechatPay":{
				"contentId":"main-body",
				"templateId":"wechatpay"
			}
		}
		/*
		*判斷是否開啓微信調試模式
		*/
		var wxDebug=true;
		/*
		*項目域名地址
		*/
		var domain="http://192.168.0.199:8080";
		return function(){
			return {
				wxDebug:wxDebug,
				domain:domain,
				pageMap:pageMap
			}
		}
	}
	return config()()
});