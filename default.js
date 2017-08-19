//set frame
$.extend({
	myAjax:function(type,async,url,data,sessionOutCode,isJson,headers,loginUrl,func,clickname){
		var returnData="";
		var contentType="application/x-www-form-urlencoded";
		if(isJson=="json"){
			contentType="application/json;charset=utf-8";
			if(type=="post"||type=="POST"){
				data=$.toJSON(data);
			}
			
		}
		$.ajax({
			type: type,
			async: async,
			url:url,
			data:data,
			dataType: "json",
			contentType:contentType,
			headers:headers,
			success:function(data){
				if(data.code==sessionOutCode){
					parent.location.href=loginUrl;
				}else{
					if(typeof(func)!="function"){
						return data ;
					}else{
						func(data);
					}
				}
				$(clickname).trigger('ableclick');
			},
			error:function(){
				$.exAlert("网络超时，请稍后再连！！！");
				$(clickname).trigger('ableclick');
			}
		})
	},
	exConfirm:function(positionX,positionY,msg,func){
		var confirms={
				position:{posX:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
							posY:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
						},
				confirmHtml:function(){
					var html='<div class="exconfirmbackcover1">';
						html+='<div class="exconfirmdiv1">';
						html+='<div class="exconfirm1"   style="top:'+positionX+'px;left:'+positionY+'">';
						html+='<div class="exconfirmmsg1">'+msg;
						html+='</div>';
						html+='<div class="exmanage1">';
						html+='<div class="exbtn exsure">确定';
						html+='</div>';
						html+='<div class="exbtn excancel">取消';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						return html
				},
				init:function(){
					confirms.destory();
					$("body").before(confirms.confirmHtml());
					$(".excancel").bind("click",function(){
						confirms.destory();
					})
					$(".exsure").bind("click",function(){
						confirms.destory();
						func();
					})
				},
				destory:function(){
					$(".exconfirmbackcover1").remove();
				}
				
		};
		confirms.init();
		
	},
	
	exConfirm1:function(positionX,positionY,msg,func){
		var confirms1={
				position:{posX:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
							posY:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
						},
				confirmHtml1:function(){
					var html='<div class="exconfirmbackcover">';
						html+='<div class="exconfirmdiv">';
						html+='<div class="exconfirm"   style="top:'+positionX+'px;left:'+positionY+'">';
						html+='<div class="exconfirmmsg"><h4>' +msg+'</h4><textarea id="refuseReason" maxlength="200"></textarea>';
						html+='</div>';
						html+='<div style="height:36px;line-height:36px;text-align:center;margin:30px 0 30px;">签名：<input type="text" maxlength="12" id="aduitSign" style="width:300px;border-radius:5px;margin:1px 10px;height:34px;border:1px solid #337ab7;padding-left:10px;" placeholder="输入签核人姓名" /></div>';
						html+='<div class="exmanage">';
						html+='<div class="exbtn exsure">确定';
						html+='</div>';
						html+='<div class="exbtn excancel">取消';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						return html
				},
				init:function(){
					confirms1.destory();
					$("body").before(confirms1.confirmHtml1());
					$(".excancel").bind("click",function(){
						confirms1.destory();
					})
					$(".exsure").bind("click",function(){
						if($("#refuseReason").val()==""||$("#refuseReason").val()==null){
							$.exAlert("请填写拒绝理由");
							return ;
						}
						if($("#aduitSign").val()==""||$("#aduitSign").val()==null){
							$.exAlert("请先输入签核人姓名");
							return ;
						}
						reason=$("#refuseReason").val();
						aduitSignName=$("#aduitSign").val();
						confirms1.destory();
						func();
					})
				},
				destory:function(){
					$(".exconfirmbackcover").remove();
				}
				
		};
		confirms1.init();
		
	},
	
	exConfirm2:function(positionX,positionY,msg,func){
		var confirms2={
				position:{posX:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
							posY:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
						},
				confirmHtml2:function(){
					var html='<div class="exconfirmbackcover">';
						html+='<div class="exconfirmdiv">';
						html+='<div class="exconfirm"   style="top:'+positionX+'px;left:'+positionY+'">';
						html+='<div class="exconfirmmsg"><h4>' +msg+'</h4><ul id="exconfirmli"></ul>';
						html+='</div>';
						html+='<div class="exmanage">';
						html+='<div class="exbtn exsure">确定';
						html+='</div>';
						html+='<div class="exbtn excancel">取消';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						return html
				},
				init:function(){
					confirms2.destory();
					$("body").before(confirms2.confirmHtml2());
					$(".excancel").bind("click",function(){
						confirms2.destory();
					})
					$(".exsure").bind("click",function(){
						if($("#refuseReason").val()==""||$("#refuseReason").val()==null){
							$.exAlert("请填写拒绝理由");
							return ;
						}
						reason=$("#refuseReason").val();
						confirms2.destory();
						func();
					})
				},
				destory:function(){
					$(".exconfirmbackcover").remove();
				}		
		};
		confirms2.init();
	},
	exConfirm3:function(positionX,positionY,msg,func){
		var confirms3={
				position:{posX:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
							posY:function(){
								var posX=0;
								if(positionX!=""&&!isNaN(positionX)){
									posX=positionX;
								}else{
									posX=0;
								}
								return posX
								},
						},
				confirmHtml3:function(){
					var html='<div class="exconfirmbackcover">';
						html+='<div class="exconfirmdiv">';
						html+='<div class="exconfirm"   style="top:'+positionX+'px;left:'+positionY+'">';
						html+='<div class="exconfirmmsg"><h4>' +msg+'</h4><ul id="exconfirmli"></ul>';
						html+='</div>';
						html+='<div style="height:36px;line-height:36px;text-align:center;margin:50px 0 50px;">签名：<input type="text" maxlength="12" id="aduitSign" style="width:300px;border-radius:5px;margin:1px 10px;height:34px;border:1px solid #337ab7;padding-left:10px;" placeholder="输入签核人姓名" /></div>';
						html+='<div class="exmanage">';
						html+='<div class="exbtn exsure">确定';
						html+='</div>';
						html+='<div class="exbtn excancel">取消';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						html+='</div>';
						return html
				},
				init:function(){
					confirms3.destory();
					$("body").before(confirms3.confirmHtml3());
					$(".excancel").bind("click",function(){
						confirms3.destory();
					})
					$(".exsure").bind("click",function(){
						if($("#aduitSign").val()==""||$("#aduitSign").val()==null){
							$.exAlert("请先输入签核人姓名");
							return ;
						}
						aduitSignName=$("#aduitSign").val();
						confirms3.destory();
						func();
					})
				},
				destory:function(){
					$(".exconfirmbackcover").remove();
				}		
		};
		confirms3.init();
	},
	
	exAlert:function(msg,linkurl,isclick){//isclick提示时页面是否可以有其他操作
		var alerts={
				confirmHtml:function(){
					var html="";
					if(isclick){
						html+='<div class="exalert">';
						html+='<div class="exalertmsg">'+msg;
						html+='</div>';
						html+='</div>';
					}else{
						html='<div class="exalertbackcover">';
						html+='<div class="exalert">';
						html+='<div class="exalertmsg">'+msg;
						html+='</div>';
						html+='</div>';
						html+='</div>';
					}
					return html
				},
				init:function(){
					alerts.destory();
					$("body").before(alerts.confirmHtml());
					setTimeout(function(){
						alerts.destory();
						if(linkurl){
							location.href=linkurl;
						}
					},1500);
				},
				destory:function(){
						$(".exalert").remove();
						$(".exalertbackcover").remove();
				}
		}
		alerts.init();
	},
	ParametersMethod:function(GOS,key,value){
		if(typeof(parameterFunc)=="undefined"){
			parameterFunc="";
		}
		var method={
			paramterClosure:function(){
				var array=new Array();
				return function(key,value){
					if(value!=""&&value!=null){
						array[key]=value;
						return "ok"
					}else{
						if(array[key]!=""&&array[key]!=null){
							return array[key]
						}else{
							return "no match <"+key+"> parameter"
						}
						
					}
				}
			},
			setParameter:function(key,value){
				if(parameterFunc==""){
					parameterFunc=new method.paramterClosure();
				}
				return parameterFunc(key,value);
			},
			getParameter:function(key){
				if(typeof(parameterFunc)!="function"){
					return "no setting parameter"
				}
				return parameterFunc(key);
			},

		}
		if(GOS=="get"){
			return method.getParameter(key);
		}else if(GOS=="set"){
			return method.setParameter(key,value);
		}
	},
	getParameter:function(key){
		return($.ParametersMethod("get",key));
	},
	setParameter:function(key,value){
		$.ParametersMethod("set",key,value);
	},
	setParameters:function(obj){
		$.each(obj,function(i,val){
			$.ParametersMethod("set",i,val);
		})
	},
	testNum:function(num,digit){
		if(typeof(num)=="number"){
			num=num.toString();
		}
		if(isNaN(num)){
			return false
		}
		var dot = num.indexOf(".");
	    if(dot != -1){
	        var dotCnt = num.substring(dot+1,num.length);
	        if(dotCnt.length > digit){
	        	return false
	        }
	    }
	},
	sclip:function(str,length,isHasDots){
			var str1="";
			if(str.length >= length) {
				if(isHasDots){
					str1=str.substring(0,length)+"...";
				}else{
					str1=str.substring(0,length);
				}
			}else {
				str1=str;
			}
			return str1;
	},
	sclipLast:function(str,length){
		var str1="";
		if(str.length >= length) {
			str1="..."+str.substring(str.length-length-1,str.length-1);
		}else {
			str1=str;
		}
			return str1;
	},
	getQueryString:function(name){
		location.href.replace(/%27/g,"'");
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	},
	testMail:function(email){
		var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		if(!myreg.test(email))
		 {
			return false;
		}else{
			return true;
		}
	},
	testPsdCheck:function($password,$psdcheck){
		if($password.val()!=$psdcheck.val()){
				return false
		}else if($password.val()==""){
			return false
		}else{
			return true
		}	
	},
	testphone:function(phone){
			var reg =/^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/;
			if(reg.test(phone)){
				return true
			}else{
				return false 
			}
	},
	getWholeNumber:function(num,degit){
		if(typeof(num)=="number"){
			num=num.toString();
		}
		var dot = num.split(".");
		if(dot[1]!=""&&dot[1]!=null)
			return dot[0]+"."+dot[1].substr(0,2);
		else
			return dot[0];
	}
}
)

$.fn.extend({
	bindClick:function(func,ifAsync){ //ifAsync为true时，表示同步,false时，表示异步--当为异步时，异步方法中要加入$("body").trigger('ableclick',true);（$.myAjax()方法中已包含）
		if(!ifAsync){
			var obj=this;
			var classname=$(obj).attr("class");
			$("body").on("ableclick"+classname,function(){
				$("body").off("ableclick");
				$(obj).bindClick(func,ifAsync);
			})
			var objEvt = $._data($(obj)[0], "events");
			if (objEvt && objEvt["click"]) {
			}
			else {
				$(this).bind("click",function(){
					$(this).unbind("click");
					func("ableclick"+classname);
				})
			}
		}else{
			$(this).bind("click",function(){
				$(this).unbind("click");
				func();
				$(this).bindClick(func,ifAsync);
			})
		}
	},
	showHasContent:function($body){//页面下方显示还有内容
		if($(this).selector!=""){
			$.exAlert("showHasContent方法只适用于window对象！");
			return
		}
		var setContent={
			setHtml:function(){
				var html='<div class="zgshowHasContent">';
					html+='</div>';
					return html
			},
			init:function(){
				$body.after(setContent.setHtml);
				$(window).scroll(function SHC(){
					var bodyheight=$("body").height();
					var scrolltop=$("body").scrollTop();
					var clientheight=document.documentElement.clientHeight;
					if((bodyheight-scrolltop)>clientheight){
						$(".zgshowHasContent").show();
					}else{
						$(".zgshowHasContent").hide();
					}
				});
			},
			destory:function(){
				$(window).unbind('scroll',SHC);
			}
		}
		setContent.init();
	},
	showBigPic:function($body){//点击图片放大
		var setShowBigPic={
			setHtml:function(imgUrl){
				var html='<div class="zgshowPicCover">';
					html+='</div>';
					html+='<div class="zgshowPic">';
					html+='<img src="'+imgUrl+'"/>'
					html+='</div>';
					return html
			},
			init:function(obj){
				$(obj).find("img").bind("click",function(){
					var bigUrl=$(this).attr("data-bigPicUrl");
					if(bigUrl==""||bigUrl==null){
						$body.append(setShowBigPic.setHtml($(this).attr("src")));
					}else{
						$body.append(setShowBigPic.setHtml(bigUrl));
					}
					$(".zgshowPicCover").click(function(){
						setShowBigPic.destory();
					})
				})
			},
			destory:function(){$('.zgshowPicCover').remove();$('.zgshowPic').remove();}
		}
		setShowBigPic.init(this);
	},
	checkNum:function(length,digit){
		var inputLength=0;
		var oldvalue="";
		$(this).on("input",function(){
			var value=$(this).val();
			if(value.indexOf(" ")>-1){
				$(this).val(value.replace(/\s/g,""));
			}
			if(digit==0){
				$(this).val(value.replace(".",""));
			}
			if(value.substr(0,1)=="0"&&value.length>1&&value.substr(1,1)!="."){
				$(this).val(value.substr(1,value.length-1));
			}
			value=$(this).val();
			if($.testNum(value,digit)==false){
				$(this).val(oldvalue);
				return
			}
			if(value.length>length){
				$(this).val(value.substr(0,length));
			}
			inputLength=value.length;
			oldvalue=value;
		})
	},
	checkNumNoZero:function(length,digit){
		var inputLength=0;
		var oldvalue="";
		$(this).on("input",function(){
			var value=$(this).val();
			if(value.indexOf(" ")>-1){
					$(this).val(value.replace(/\s/g,""));
			}
			if(digit==0){
				$(this).val(value.replace(".",""));
			}
			if(value.substr(0,1)=="0"&&value.length>1&&value.substr(1,1)!="."){
				$(this).val(value.substr(1,value.length-1));
			}
			value=$(this).val();
			if($.testNum(value,digit)==false){
				$(this).val(oldvalue);
				return
			}
			if(value.length>length){
				$(this).val(value.substr(0,length));
			}
			inputLength=value.length;
			oldvalue=value;
		})
		$(this).on("blur",function(){
			if($(this).val()=="0"){
				$(this).val("");
			}
		})
	},
	checkText:function(length,isAllowBlank){
		var errorHtml="<i class='textErrorTip' style='color:red;'>不能为空</i>";
		var succHtml="<i class='textSuccTip'></i>";
		if(isAllowBlank==false){
			$(this).on("keyup mouseup mousedown",function(){
				var value=$(this).val();
				if(value.indexOf(" ")>-1){
					$(this).val(value.replace(/\s/g,""));
				}
				if(value.length>length){
					$(this).val(value.substr(0,length));
				}
				inputLength=value.length;
			})
		}
		$(this).on("blur",function(){
			var value=$(this).val();
			if(value.replace(/\s/g,"")==""){
				$(this).val("");
			}
			if(value.length>length){
				$(this).val(value.substr(0,length));
			}
			if($(this).val().length==0){
				$(this).next(".textSuccTip").remove();
				if($(this).next(".textErrorTip").length==0){
					$(this).after(errorHtml);
				}
			}else{
				if($(this).next(".textSuccTip").length==0){
					$(this).next(".textErrorTip").remove();
					$(this).after(succHtml);
				}
			}
		})
	},
	testMail:function(){
		var errorHtml="<i class='emailErrorTip'></i>";
		var succHtml="<i class='emailSuccTip'></i>";
		$(this).bind("blur",function(){
			if($.testMail($(this).val())==false){
				$(this).next(".emailSuccTip").remove();
				if($(this).next(".emailErrorTip").length==0){
					$(this).after(errorHtml);
				}
			}else{
				if($(this).next(".emailSuccTip").length==0){
					$(this).next(".emailErrorTip").remove();
					$(this).after(succHtml);
				}
			}
		})
	},
	testPhone:function(){
		$(this).checkNum(20,0);
		var errorHtml="<i class='phoneErrorTip'></i>";
		var succHtml="<i class='phoneSuccTip'></i>";
		var reg =/^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/;
		$(this).bind("blur",function(){
			if(reg.test($(this).val())==false){
				$(this).next(".phoneSuccTip").remove();
				if($(this).next(".phoneErrorTip").length==0){
					$(this).after(errorHtml);
				}
			}else{
				if($(this).next(".phoneSuccTip").length==0){
					$(this).next(".phoneErrorTip").remove();
					$(this).after(succHtml);
				} 
			}
		})
	},
	testpsd:function($password,$psdcheck){
		var errorHtml="<i class='psdErrorTip' style='color:red;'>不能为空</i>";
		var succHtml="<i class='psdSuccTip'></i>";
		$(this).bind("blur",function(){
			if($(this).val()==""){
				$(this).next(".psdSuccTip").remove();
				$(this).next(".psdErrorTip").remove();
				if($(this).next(".psdErrorTip").length==0){
					$(this).after(errorHtml);
				}
			}else if($(this).val().length<6){
				$(this).next(".psdSuccTip").remove();
				$(this).next(".psdErrorTip").remove();
				$(this).after("<i class='psdErrorTip' style='color:red;'>不少于6个字</i>");
			}else{
				if($(this).next(".psdSuccTip").length==0){
					$(this).next(".psdSuccTip").remove();
					$(this).next(".psdErrorTip").remove();
					$(this).after(succHtml);
					return 
				}
				if($(this).val()==$psdcheck.val()){
					$psdcheck.next(".psdErrorTip").remove();
					$psdcheck.next(".psdSuccTip").remove();
					$psdcheck.after(succHtml);
				}
			}	
		})
	},
	testPsdCheck:function($password,$psdcheck){
		var errorHtml="<i class='psdErrorTip' style='color:red;'>密码不一致</i>";
		var succHtml="<i class='psdSuccTip'></i>";
		$psdcheck.bind("blur",function(){
			if($(this).val()!=$password.val()){
				errorHtml="<i class='psdErrorTip' style='color:red;'>密码不一致</i>";
				$(this).next(".psdSuccTip").remove();
				if($(this).next(".psdErrorTip").length==0){
					$(this).after(errorHtml);
				}
			}else if($(this).val()==""){
				errorHtml="<i class='psdErrorTip' style='color:red;'>不能为空</i>";
				$(this).next(".psdSuccTip").remove();
				if($password.next(".psdErrorTip").length==0){
					$password.after(errorHtml);
				}
			}else{
				if($(this).next(".psdSuccTip").length==0){
					$(this).next(".psdErrorTip").remove();
					$(this).after(succHtml);
				}
			}	
		})
	},
	/*zgupload:function(object){
		var zgupload={
			init:function(obj){
				$(obj).bind("change",function(){
					if(!zgupload.checkType(object.type,$(this).val(),obj)){
						return
					}
					if(!zgupload.checkSize(object.maxSize,this.files[0],obj,object.nameLength)){
						return
					}
					zgupload.ajaxFileUpload(object.url,this.files[0],object.fileElementName,obj);
				})
			},
			showProgress:function(percent){
				if(0<=percent && percent<=1){
					zgupload.showProgressStyle(percent);
				}
			},
			checkType:function(type,value,obj){
				if(type=="image"){
					var exp = /.jpg$|.gif$|.png$|.jpeg$|.bmp$/;
					if(exp.exec(value.toLowerCase())==null){
						$.exAlert("图片格式不正确");
						$(obj).val("");
						return false;
					}
				}
				if(type=="file"){
					var exp = /.xlsx$|.ppt$|.pptx$|.txt$|.docx|.doc|.xls|.pdf/;
					if(exp.exec(value.toLowerCase())==null){
						$.exAlert("文件格式不正确");
						$(obj).val("");
						return false;
					}
				}
				return true
			},
			checkSize:function(maxSize,file,obj,nameLength){
				var fileSize = Math.round(file.size * 100 / 1024) / 100;
				var length=file.name.length;
				if(maxSize<fileSize){
					$.exAlert("文件过大");
					$(obj).val("");
					return false;
				}
				if(length>nameLength){
					$.exAlert("文件名过长");
					$(obj).val("");
					return false;
				}
				return true
				
			},
			ajaxFileUpload:function(url,file,fileElementName){
				$("input[name='"+fileElementName+"']").wrap('<form enctype="multipart/form-data" method="post" name="fileinfo"></form>');
				var fd = new FormData(document.forms.namedItem("fileinfo"));  
				fd.append(fileElementName, "This is some extra data");
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function(){ 
					if(xhr.readyState==1){
						$("input[name='"+fileElementName+"']").unwrap();
					}
					if(xhr.readyState==4 && xhr.status==200){
						eval( "data = " + xhr.responseText );
						if(data.code=="000000"){
							object.func(data,obj);
							//$("#licence-card").attr("src",data.data.bigUrl);
						}else{
							$.exAlert(data.errorMsg);
						}
						zgupload.hideProgressStyle();
					}  
				};
				xhr.upload.onprogress = function(evt){  
					var loaded = evt.loaded;
					var tot = evt.total;
					var per = Math.floor(100*loaded/tot);  //已经上传的百分比  
					zgupload.showProgress(per/100);
				}  
				xhr.open("post",url);  
				xhr.send(fd)
			},
			showProgressStyle:function(percent){//默认的显示进度条样式
				$(".progrss").css("background-size",percent*100+"%"+" 100%");
			},
			hideProgressStyle:function(){//默认的隐藏进度条样式
				$(".progrss").css("background-size","0 0");
			}
		}
		zgupload.init(this);
	},*/
	jumpemail:function(emailurl){
		var hash={
			'qq.com': 'http://mail.qq.com',
			'gmail.com': 'http://mail.google.com',
			'sina.com': 'http://mail.sina.com.cn',
			'163.com': 'http://mail.163.com',
			'126.com': 'http://mail.126.com',
			'yeah.net': 'http://www.yeah.net/',
			'sohu.com': 'http://mail.sohu.com/',
			'tom.com': 'http://mail.tom.com/',
			'sogou.com': 'http://mail.sogou.com/',
			'139.com': 'http://mail.10086.cn/',
			'hotmail.com': 'http://www.hotmail.com',
			'live.com': 'http://login.live.com/',
			'live.cn': 'http://login.live.cn/',
			'live.com.cn': 'http://login.live.com.cn',
			'189.com': 'http://webmail16.189.cn/webmail/',
			'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
			'yahoo.cn': 'http://mail.cn.yahoo.com/',
			'eyou.com': 'http://www.eyou.com/',
			'21cn.com': 'http://mail.21cn.com/',
			'188.com': 'http://www.188.com/',
			'foxmail.com': 'http://www.foxmail.com',
			'sina.cn': 'http://mail.sina.com.cn'
		};
		var url = emailurl.split('@')[1];
		if(hash[url]==""||hash[url]==null){
			//msgTip("0","不是常用邮箱，请自行登录");
			$(this).attr("href","javascript:msgTip(\'0\',\'您所用邮箱不是常用邮箱，无法直接登录\')");
		}else{
			$(this).attr("href", hash[url]);
		}
	},
	zgupload:function(object){
		var zgupload={
			init:function(obj){
				$(obj).bind("change",function(){
					if($(this).val()){
						if(!zgupload.checkType(object.type,$(this).val(),obj)){
							return
						}
						if(this.files){
							if(!zgupload.checkSize(object.maxSize,this.files[0],obj,object.nameLength)){
								return
							}
							zgupload.ajaxFileUpload(object.url,this.files[0],object.fileElementName,this);
						}else{
							zgupload.ajaxFileUpload(object.url,this,object.fileElementName,this);
						}
						
					}
				})
			},
			showProgress:function(percent){
				if(0<=percent && percent<=1){
					zgupload.showProgressStyle(percent);
				}
			},
			checkType:function(type,value,obj){
				if(type=="image"){
					var exp = /.jpg$|.gif$|.png$|.jpeg$|.bmp$/;
					if(exp.exec(value.toLowerCase())==null){
						$.exAlert("图片格式不正确");
						$(obj).val("");
						return false;
					}
				}
				if(type=="file"){
					var exp = /.xlsx$|.ppt$|.pptx$|.txt$|.docx|.doc|.xls|.pdf/;
					if(exp.exec(value.toLowerCase())==null){
						$.exAlert("文件格式不正确");
						$(obj).val("");
						return false;
					}
				}
				return true
			},
			checkSize:function(maxSize,file,obj,nameLength){
				var fileSize = Math.round(file.size * 100 / 1024) / 100;
				var length=file.name.length;
				if(maxSize<fileSize){
					$.exAlert("文件过大");
					$(obj).val("");
					return false;
				}
				if(length>nameLength){
					$.exAlert("文件名过长");
					$(obj).val("");
					return false;
				}
				return true
				
			},
			ajaxFileUpload:function(url,file,fileElementName,obj){
				$(obj).parent().find("img").show();
				$(obj).wrap('<form enctype="multipart/form-data" method="post" name="fileinfo"></form>');
				try{
					var fd = new FormData(document.forms.namedItem("fileinfo"));  
					fd.append(fileElementName, "This is some extra data");
					var xhr = new XMLHttpRequest();
					xhr.onreadystatechange = function(){ 
						if($(obj).parent().is("form")){
							$(obj).unwrap();
						}
						if(xhr.readyState==4 && xhr.status==200){
							eval( "data = " + xhr.responseText );
							if(data.code=="000000"){
								$(obj).parent().find("img").hide();	
								object.func(data,obj);
								//$("#licence-card").attr("src",data.data.bigUrl);
							}else{
								$(obj).parent().find("img").hide();
								$.exAlert(data.errorMsg);
							}
							zgupload.hideProgressStyle();
						}else if(xhr.status>400){
							$(obj).parent().find("img").hide();
							$.exAlert("服务器淘气了");
						}
					};
					xhr.upload.onprogress = function(evt){  
						var loaded = evt.loaded;
						var tot = evt.total;
						var per = Math.floor(100*loaded/tot);  //已经上传的百分比  
						zgupload.showProgress(per/100);
					}  
					xhr.open("post",url);  
					xhr.send(fd)
				} catch(e) 
				{	try{
						var frameId = 'jUploadFrame';
			            var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
						if(window.ActiveXObject)
						{
			                if(typeof uri== 'boolean'){
								iframeHtml += ' src="' + 'javascript:false' + '"';

			                }
			                else if(typeof uri== 'string'){
								iframeHtml += ' src="' + uri + '"';

			                }	
						}
						iframeHtml += ' />';
						jQuery(iframeHtml).appendTo(document.body);
						var form = $(obj).parent();
						form.attr('action',	url);
						form.attr('method', 'POST');
						form.attr('target', frameId);
						form.submit();
						$("#"+frameId).load(function(){
							if($(obj).parent().is("form")){
								$(obj).unwrap();
							}
							eval("var data="+document.getElementById(frameId).contentWindow.document.body.innerText);
							if(data.code=="000000"){
								$(obj).parent().find("img").hide();	
								object.func(data,obj);
								//$("#licence-card").attr("src",data.data.bigUrl);
							}else{
								$(obj).parent().find("img").hide();
								$.exAlert(data.errorMsg);
							}
							$("#"+frameId).remove();
						});
					}catch(e){
						$.exAlert("服务器淘气了");
						$("#"+frameId).remove();
					}		
		        }
			},
			showProgressStyle:function(percent){//默认的显示进度条样式
				$(".progrss").css("background-size",percent*100+"%"+" 100%");
			},
			hideProgressStyle:function(){//默认的隐藏进度条样式
				$(".progrss").css("background-size","0 0");
			}
		}
		zgupload.init(this);
	},
	showProgress:function(percdent){
		var innerHtml="";
		if(percdent=="100%")
			innerHtml='<div style="height:100%;width:'+percdent+';background-color:red;border-radius:3px;"></div>';
		else
			innerHtml='<div style="height:100%;width:'+percdent+';background-color:green;border-radius:3px;"></div>';
		$(this).html(innerHtml);
	}
});

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals.
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
		} catch(e) {
			return;
		}

		try {
			// If we can't parse the cookie, ignore it, it's unusable.
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== undefined) {
			// Must not alter options, thus extending a fresh object...
			$.cookie(key, '', $.extend({}, options, { expires: -1 }));
			return true;
		}
		return false;
	};

}));


