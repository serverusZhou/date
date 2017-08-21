/*
*约吧倒计时插件
*/
define(['jquery'],function($){
	var CountDown=function(settings){
		this.setting = settings;
		var countDownHtml='<div class="num" id="day">0</div>\
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

		return new CountDown.prototype.init(settings,countDownHtml);
	}
	CountDown.prototype={
		init:function(settings,countDownHtml){
			var self = this;
			var id =  settings.id;
			var wholeTime =  settings.time;
			var path = location.href;
			$("#"+id).html(countDownHtml);
			var rightTime = wholeTime;
			var conutInte = setInterval(function(){
				if(rightTime === false || path != location.href)
				   clearInterval(conutInte);
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
			var formatedTime = new Date(time);
			return {
				"day":formatedTime.getDay(),
				"hour2":Math.floor(formatedTime.getHours()/10),
				"hour1":formatedTime.getHours()%10,
				"minute2":Math.floor(formatedTime.getMinutes()/10),
				"minute1":formatedTime.getMinutes()%10,
				"second2":Math.floor(formatedTime.getSeconds()/10),
				"second1":formatedTime.getSeconds()%10,
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