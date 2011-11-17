$(function(){

/*//设置表单focus和blur效果
$("#sectionInput :text").bind("focus",function(){
	$(this).addClass("input-focus");
});
$("#sectionInput :text").bind("blur",function(){
	$(this).removeClass("input-focus");
})
//模拟 placeholder 
$("#sectionInput .placeHolder").bind("focus",function(){
	if($(this).val()==$(this).attr("placeholder")){
		$(this).val("").removeClass("font-gray");
	}
})
$("#sectionInput .placeHolder").bind("blur",function(){
	var val=$(this).attr("placeholder");
	if($(this).val()==""){
		$(this).val(val).addClass("font-gray");
	}
})*/

//设置支付密码提示信息
$("#setPayPassword").bind("focus",function(){
	$("#tipBoxStyle01").css("display","inline-block");
})
$("#setPayPassword").bind("blur",function(){
	$("#tipBoxStyle01").css("display","none");
})


//设置一分钟倒计时
$("#timeChange").bind("click",function(){
		$("#input-time").show();
		if($(this).is(":disabled")){
			return false;	
		}else{
			$(this).val("(60) 秒后重新获取").attr("disabled",true).addClass("button-style-disable-02");
			//$(this).prev().find(".ui-btn-text").text("(61)重新获取")
			timechange();
		}
		
	})	
//循环倒计时
function timechange(){
	var val=$("#timeChange").val();
	var v=val.substring(1,3);
	var vNum=parseInt(v);
	vNum=vNum-1;
	$("#timeChange").val("("+vNum+") 秒后重新获取");
	//$("#time_change").prev().find(".ui-btn-text").text("("+vNum+")重新获取")
	var setT=setTimeout(arguments.callee,1000);
	if(vNum==0){
		clearTimeout(setT);
		$("#timeChange").val("免费获取手机验证码").attr("disabled",false).removeClass("button-style-disable-02");
		//$("#time_change").prev().find(".ui-btn-text").text("获取短信验证码")
	}
}
	
})