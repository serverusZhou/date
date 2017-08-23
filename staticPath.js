define(['config'],function(config){
	function getAllPath(){
		var domain=config.domain+"/exiaoxplatf/v1/";
		//var filedomain=config.domain+"/data/platform/";
		var filedomain="http://test.juziwl.com/data/platform/";
		var adviseurl=domain+"getAdv/";
		var amazingurl=domain+"operation";
		var subscribe=domain+"subscribe";
		var getCommentList=domain+"comment/showCommentList";
		var wxshare="http://oauth.qa.services.fandanfanli.com/v1/weixin_jsapi_ticket";
		var wxUserinfo="http://192.168.1.108:3000/getWeChatUserInfo";
		return function(){
			return {
				filedomain:filedomain,
				adviseurl:adviseurl,
				amazingurl:amazingurl,
				subscribe:subscribe,
				wxshare:wxshare,
				getCommentList:getCommentList,
				wxUserinfo:wxUserinfo
			}
		}
	}
	return getAllPath()()
});