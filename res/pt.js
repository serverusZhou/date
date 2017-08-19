/**
 * White By Arvin
 * 擴展原型庫
*/
define([],function(){
	/*
	*截取字符串
	*/
	String.prototype.sclip=function(length){
		var str;
		if(this.length >= length) {
			str=this.substring(0,length);
		}else{
			str=this;
		}
		return str
	}
	
	/*
	*方法中添加對象
	*/
	Function.prototype.integratObject=function(object){
		var self=this;
		var integrat=function(){
			for(var key in object){
				this[key]=object[key]
			}
		}
		//將對象付給原型
		self.prototype=new integrat();
		return function(){
			var argus=[];
			if(arguments){
				for(var item in arguments){
					if(typeof arguments[item]=="object"||typeof arguments[item]=="function"){
						console.error("方法賦對象參數不能有對象或者方法");
						return null
					}
					argus.push("\""+arguments[item]+"\"");
				}
			}
			eval("var returnFunc=new self("+argus.toString()+")")
			return returnFunc
		}
	}
})