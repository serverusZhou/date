define(['config'],function(config){
	function getAllPath(){
		var wxshare = config.authApiDomain+"/v1/weixin_jsapi_ticket";//微信获取ticket
		var wxUserinfoToken = config.authApiDomain+"/oauth/token";//通过code获取token
		var wxUserInfo = config.authApiDomain+"/oauth/currentuser";//通过code获取token
		return function(){
			return {
				wxshare:wxshare,
				wxUserinfoToken:wxUserinfoToken,
				wxUserInfo:wxUserInfo
			}
		}
	}
	return getAllPath()()
});