/*
	*@explain歸總此頁面方法
*/

define(['jquery','staticPath','weixinShare','promise','artTemplate','config','watch','countDown'],function($,apis,wxShare,promise,Template,config,watch,CountDown){
	var H5Funcs=function(pagesSetting){
		this.pagesData = pagesSetting(this)();
		this.pageInit();
	}
	/*
		*@explain初始化页面
	*/
	H5Funcs.prototype.pageInit=function(){
		var self = this;
		self.setUpPage();
		self.pageChange();
	}
	/*
		*@explain页面启动
	*/
	H5Funcs.prototype.setUpPage=function(){
		var self = this;
		var pageTitle = self.getPageName()||"home";
		var pageObj = config.pageMap[pageTitle];
		if(pageObj==undefined){
			return
		}
		self.pagesData[pageTitle].init().then(function(){
			self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
			self.watchAllData(self.pagesData[pageTitle].data,function(){
				self.renderPage(pageObj.contentId,pageObj.templateId,self.pagesData[pageTitle].data,self.pagesData[pageTitle].methods);
			})
			self.pagesData[pageTitle].after();
		},function(){
			alert("错啦！");
		})
	}

	/*
		*@explain使用template进行页面渲染
	*/
	H5Funcs.prototype.renderPage=function(contentId,templateId,data,methods){
		var html = Template(templateId, data);
		document.getElementById(contentId).innerHTML = html;
		$.each($("#"+contentId).find("[fd-click]"),function(index,ele){
			$(ele).click(function(){
				var argus = $(ele).attr("fd-click").split("(")[1].split(")")[0].split(",");
				var func = $(ele).attr("fd-click").split("(")[0];
				var realArgusStr = [];
				$.each(argus,function(index,argu){
					if(argu.indexOf("'") > -1 ||argu.indexOf("\"") > -1)
						realArgusStr.push(argu);
					else
						realArgusStr.push("data."+argu);
				})
				eval("methods."+func+"("+realArgusStr.toString()+")");
			})
		})
	}

	/*
		*@explain通过hashchange事件捕捉页面跳转
	*/
	H5Funcs.prototype.pageChange=function(){
		var self = this;
		window.onhashchange=function(){
			self.setUpPage();
		}
	}

	/*
		*@explain监控数据变化，并重新渲染
	*/
	H5Funcs.prototype.watchAllData = function(data,func){
		$.each(data,function(key,value){
			watch.watch(data,key,function(){
				func();
			})
		})
	}
	/*
		*@explain获取页面hash值
	*/
	H5Funcs.prototype.getPageName=function(){
		return location.hash.replace("#","").split("?")[0];
	}

	/*
		*@explain進行配置微信分享
	*/
	H5Funcs.prototype.wxShare=function(title,describe,imgUrl){
		$.ajax({
			type: "get",
			async: true,
			url:apis.wxshare,
			dataType: "json",
		}).then(function(response){
			wxShare({
				jsapi_ticket:response.data.jsapi_ticket,
				noncestr:response.data.noncestr,
				timestamp:response.data.timestamp,
				appid:response.data.appid,
				href:location.href.split('#')[0],
				title:title,
				describe:describe,
				imgUrl:imgUrl
			})
		},function(response){
			alert("調用分享失敗");
		})
	}
	/*
	*保存評論内容
	*/
	H5Funcs.prototype.saveCommentInfo=function(articleId,content,creator,Uid,AccessToken){
		var data = {"articleId":articleId,"content":content,"creator":creator};
		$.ajax({
			type: "post",
			async: false,
			url:domainApi+"comment/saveCommentInfo",
			data:$.toJSON(data),
			dataType: "json",
			contentType:"application/json;charset=utf-8",
			headers:{'Uid':Uid,'AccessToken':AccessToken},
		}).then(function(response){

		},function(){
			alert("評論失敗");
		})
	}

	 /*
		*@explain 獲取瀏覽器類型
	*/
	H5Funcs.prototype.getAgentVersion=function(){
		var self=this;
	 	var u = navigator.userAgent,app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };

	 };

	//获取页面传递的参数
	H5Funcs.prototype.getQueryString=function(name){
		location.href.replace(/%27/g,"'");
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var para = window.location.href.split("?")[1];
		var r = para.match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}

	//倒计时
	H5Funcs.prototype.setCountDown=function(){
		new CountDown({
			"time":"1990-09-05",
			"id":"time-count-down",
		});
	}

	//倒计时（秒）
	H5Funcs.prototype.getMinusOneSeconeTime=function(time){
		var timeStr =  (new Date(time)).getTime();
		var returnTime = new Date(timeStr-1000);
		return returnTime
	}


	return H5Funcs
})
	