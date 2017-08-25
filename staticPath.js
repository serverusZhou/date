define(['config'],function(config){
	function getAllPath(){
		var wxshare = config.authApiDomain+"/v1/weixin_jsapi_ticket";//微信获取ticket
		var wxUserinfoToken = config.authApiDomain+"/oauth/token";//通过code获取token
		var wxUserInfo = config.authApiDomain+"/oauth/currentuser";//通过code获取token
		var orderApiDomain = config.orderApiDomain+"/v2/orders/$order_id$/simple_bill";//获取订单信息
		var acceptInvite = config.orderApiDomain+"/v2/orders/$order_id$/take_part_in_aa";//接受
		var setMobile = config.orderApiDomain+"/v2/orders/$order_id$/customer_mobile";//接受
		return function(){
			return {
				wxshare:wxshare,
				wxUserinfoToken:wxUserinfoToken,
				wxUserInfo:wxUserInfo,
				orderApiDomain : orderApiDomain,
				acceptInvite : acceptInvite,
				setMobile : setMobile
			}
		}
	}
	return getAllPath()()
});