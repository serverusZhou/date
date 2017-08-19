/*
*h5頁面分頁插件
*/
define(['jquery'],function($){
	var H5Pagenation=function(callback){
		return new H5Pagenation.prototype.init(callback);
	}
	H5Pagenation.prototype={
		init:function(callback){
			self=this;
			$(window).scroll(function(){
				if($(window).scrollTop()+$(window).height()==$(document).height()){
					if(H5Pagenation.check.isAsk){
						H5Pagenation.check.isAsk=0;
						callback(H5Pagenation.check.pageNum+1).then(function(data,errMsg){
							if(errMsg=="success"){
								//防止不停請求
								++H5Pagenation.check.pageNum;
								H5Pagenation.check.isAsk=1;
							}else if(errMsg=="apiError"){
								//防止接口異常導致的加載失敗，3秒鈡后可以重新加載
								setTimeout(function(){
									H5Pagenation.check.isAsk=1;
								},3000)
							}
						})
					}
				}
			})
			return self
		}
	}
	H5Pagenation.prototype.init.prototype=H5Pagenation.prototype;

	H5Pagenation.check={pageNum:0,isAsk:1}

	return H5Pagenation
})