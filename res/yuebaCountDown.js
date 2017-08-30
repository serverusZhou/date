/*
*约吧倒计时插件
*/
define(['jquery'],function($){
	var CountDown=function(settings){
		this.setting = settings;
		var countDownColorFulHtml='<div class="num" id="day">0</div>\
									<span>天</span>\
									<div class="num" id="hour2">0</div>\
									<div class="num" id="hour1">0</div>\
									<span>时</span>\
									<div class="num" id="minute2">0</div>\
									<div class="num" id="minute1">0</div>\
									<span>分</span>\
									<div class="num" id="second2">0</div>\
									<div class="num" id="second1">0</div>\
									<span>秒</span>';


		var countDownCommonHtml='<div class="num" id="hour2">0</div>\
								<div class="num" id="hour1">0</div>\
								<span>:</span>\
								<div class="num" id="minute2">0</div>\
								<div class="num" id="minute1">0</div>\
								<span>:</span>\
								<div class="num" id="second2">0</div>\
								<div class="num" id="second1">0</div>';
		var returnHtml = (settings.type == "colorful") ? countDownColorFulHtml : countDownCommonHtml;
		return new CountDown.prototype.init(settings,returnHtml);
	}
	CountDown.prototype={
		init:function(settings,countDownHtml){
			console.log("settingssettings",settings);
			var self = this;
			var id =  settings.id;
			var wholeTime =  settings.time;
			var path = location.href;
			$("#"+id).html(countDownHtml);
			if(settings.isContinue)
				return
			var rightTime = wholeTime;
			var conutInte = setInterval(function(){
				if(rightTime === false || path != location.href){
					clearInterval(conutInte);
					if(rightTime === false){
						if(typeof settings.func == "function"){
							setTimeout(function(){
								settings.func();
							},1000)
						}
					}
				}
				else
				   rightTime = self.getMinusOneSeconeTime(rightTime);
			},1000)

			return self
		},
		getMinusOneSeconeTime:function(time){
			var self = this;
			var timeStr =  (new Date(time)).getTime();
			var returnTime = new Date(timeStr-1000);
			self.setHtml(self.getTimeMap(time),self.getTimeMap(returnTime),returnTime);
			if(returnTime < 1000)
				return false
			else
				return returnTime
		},
		getTimeMap:function(time){
			var remaintime = time;
			var days = Math.floor(time/(1000*60*60*24));
			remaintime -= days*(1000*60*60*24);
			var hours = Math.floor(remaintime/(1000*60*60));
			remaintime -= hours*(1000*60*60);
			var minutes = Math.floor(remaintime/(1000*60));
			remaintime -= minutes*(1000*60);
			var seconds = Math.floor(remaintime/(1000));

			return {
				"day":days,
				"hour2":Math.floor(hours/10),
				"hour1":hours%10,
				"minute2":Math.floor(minutes/10),
				"minute1":minutes%10,
				"second2":Math.floor(seconds/10),
				"second1":seconds%10,
			}
		},
		setHtml:function(oldTimeMap,rightTimeMap,returnTime){
			$.each(rightTimeMap,function(key,value){
				$("#"+key).html(value);
			})
		}
	}
	CountDown.prototype.init.prototype=CountDown.prototype;

	return CountDown
})