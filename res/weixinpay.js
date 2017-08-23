/**
 * White By Arvin
 */
define(['weixin','config','sha1'], function(weixin,config,sha1){
	/*
	 **分享微信調用
	 **@explain
	 **configs：{jsapi_ticket，noncestr，timestamp，href，appid}
	*/
	function wxpay(configs){
		if(!weixin){
			weixin=wx;
		}
		WeixinJSBridge.invoke(
        'getBrandWCPayRequest', 
        {
        "appId":configs.appid,     //公众号名称，由商户传入     
        "timeStamp":parseInt(configs.timestamp),//时间戳，自1970年以来的秒数     
        "nonceStr":configs.noncestr, //随机串     
        "package":"prepay_id=u802345jgfjsdfgsdg888",
        "signType":"MD5",         //微信签名方式：     
        "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
       },
       function(res){     
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
       }
   ); 
	}
	return wxpay
})