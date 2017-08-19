/**
 * White By Arvin
 */
require.config({
	paths:{
			 "weixin": "../plugins/jweixin-1.0.0",
		  },
});
define(['weixin','config','sha1'], function(weixin,config,sha1){
	/*
	 **分享微信調用
	 **@explain
	 **configs：{jsapi_ticket，noncestr，timestamp，href，appid}
	*/
	function wxshare(configs){
		if(!weixin){
			weixin=wx;
		}
		//拼接簽名字符串
		var jsapi_ticket="jsapi_ticket="+configs.jsapi_ticket+"&noncestr="+configs.noncestr+"&timestamp="+configs.timestamp+"&url="+configs.href;
		//生成sha1簽名
		var signature=hex_sha1(jsapi_ticket);
		weixin.config({
			debug: config.wxDebug,
			appId: configs.appid, // 必填，公众号的唯一标识
			timestamp:parseInt(configs.timestamp), // 必填，生成签名的时间戳
			nonceStr: configs.noncestr, // 必填，生成签名的随机串
			signature: signature,// 必填，签名，见附录1
			jsApiList: ['onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});

		weixin.ready(function() {
			/*
			*分享给微信好友
			*/
			weixin.onMenuShareAppMessage({
				title:configs.title, // 分享标题
				desc:configs.describe,//分享描述
				link:configs.href,
				imgUrl:configs.imgUrl
			});
		});
	}
	return wxshare
})