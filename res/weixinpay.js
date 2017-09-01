/**
 * White By Arvin
 */
define(['weixin','config','sha1','md5'], function(weixin,config,sha1,md5){
	/*
	 **分享微信調用
	 **@explain
	 **configs：{jsapi_ticket，noncestr，timestamp，href，appid}
	*/
	function wxpay(configs){
		if(!weixin){
			weixin=wx;
        }
        // var timeStamp = parseInt((new Date()).getTime());
        // configs.appid="wx72e523b991255618";
        // timeStamp="1503972392";
        // configs.noncestr="f26b5191cdef4de9a59d3993af0240d5";
        // configs.package="prepay_id=wx201708291006322f1c195cb60343401189";
        // configs.pay_sign="AFD5F27CDE0F21FFA1C06D808D9FCE01";
        // //拼接paySign
        // var paySignString="appId="+configs.appid+"&timeStamp="+timeStamp+"&nonceStr="+configs.noncestr+"&package=prepay_id="+configs.prepay_id+"prepay_id="+configs.prepay_id;
		// //生成sha1簽名
        // var paySign=md5(paySignString);
		WeixinJSBridge.invoke(
        'getBrandWCPayRequest', 
        {
        "appId":configs.appid,     //公众号名称，由商户传入     
        "timeStamp":configs.timeStamp,//时间戳，自1970年以来的秒数 
        "nonceStr":configs.noncestr, //随机串
        "package":configs.package,
        "signType":"MD5",         //微信签名方式：  
        "paySign": configs.pay_sign //微信签名
       },
       function(res){
           if(typeof configs.finalFunc == "function"){
                  configs.finalFunc();
            }
           if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                if(typeof configs.func == "function"){
                    configs.func();
                }
           }  // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
       }
   );
	}
	return wxpay
})