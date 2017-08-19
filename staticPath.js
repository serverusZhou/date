define(['./config'],function(config){
	function getAllPath(){
		var domain=config.domain+"/exiaoxplatf/v1/";
		//var filedomain=config.domain+"/data/platform/";
		var filedomain="http://test.juziwl.com/data/platform/";
		var adviseurl=domain+"getAdv/";
		var amazingurl=domain+"operation";
		var subscribe=domain+"subscribe";
		var getCommentList=domain+"comment/showCommentList";
		var wxshare="https://test.juziwl.com/zsh/users/wxshare"
		return function(){
			return {
				filedomain:filedomain,
				adviseurl:adviseurl,
				amazingurl:amazingurl,
				subscribe:subscribe,
				wxshare:wxshare,
				getCommentList:getCommentList,
			}
		}
	}
	return getAllPath()()
});