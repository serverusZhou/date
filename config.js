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

		// var weChartConfig = {
		// 	appid : "wx72e523b991255618",
		// 	secret : "103329cf0f68ece7f8717afc969eb7d3",
		// 	noncestr : "Wm3WZYTPz0wzccnW",
		// 	timestamp : "1414587457",
		// 	authPath : "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72e523b991255618&redirect_uri=http%3a%2f%2fbgtest.natapp1.cc%2f&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect"
		// }

		var regularExpression = {
			phoneRegular : "^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$",
		}

		var weChartConfig = function(){
			var appid = "wx72e523b991255618";
			var secret = "103329cf0f68ece7f8717afc969eb7d3";
			var noncestr = "Wm3WZYTPz0wzccnW";
			var timestamp = "1414587457";
			//var redirect_uri ="http%3a%2f%2fwww.qa.fandanfanli.com%2fyueba%2f";//qa
			var redirect_uri ="http%3a%2f%2fwww.fandanfanli.com%2fyueba%2f";
			var authPath = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+appid+"&redirect_uri="+redirect_uri+"&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
			var advShare = {
				title : "超划算！我在饭蛋约你一起吃",
				noncestr : "立即加入AA拼单，无限惊喜等你来分享，手慢无！",
				img : "http://ownerweb.services.fandanfanli.com/assets/img/icon_logo.png"
			}
			var activityShare = {
				title : "超划算！我在饭蛋($restaurant_name$)约你一起吃",
				noncestr : "立即加入AA拼单，无限惊喜等你来分享，手慢无！",
				img : "http://ownerweb.services.fandanfanli.com/assets/img/icon_logo.png"
			}
			return {
				appid : appid,
				secret : secret,
				noncestr : noncestr,
				timestamp : timestamp,
				authPath : authPath,
				advShare : advShare,
				activityShare : activityShare
			}
		}
		
		/*
		*判斷是否開啓微信調試模式
		*/
		var wxDebug=false;
		/*
		*項目域名地址
		*/
		var domain="http://www.fandanfanli.com";

		/*
		*接口域名
		*/
		var authApiDomain="http://oauth.beta.services.fandanfanli.com";
		var orderApiDomain="http://order.beta.services.fandanfanli.com";
		var paymentApiDomain="http://payment.beta.services.fandanfanli.com";

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
				weChartConfig : weChartConfig,
				authApiDomain : authApiDomain,
				orderApiDomain : orderApiDomain,
				paymentApiDomain : paymentApiDomain
			}
		}
	}
	return config()()
});