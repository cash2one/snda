/*
json=[
	{ selector:"div.bg",png:"pointer_right.png"},
	...
	
]
*/
function fixBgPNG(json){
	
	var path="";
	for(var i=0,scripts=document.getElementsByTagName("script"),len=scripts.length;i<len;i++){

		if(/(^|\/)png\.js(\?.+)?$/i.test(scripts[i].src)){
			path= scripts[i].src.replace(/png.js(\?.+)?$/i,"");
			break;
		}
	}
	
	setTimeout(function(){
		var 
		s="",
		style=document.createElement("style");
		
		document.appendChild(style);

		for(var i=0;i<json.length;i++){
			s+=json[i].selector
			s+="{background-image:none;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,sizingMethod=scale,src='"+path+json[i].png+".png');}";	
		}
		style.styleSheet.cssText=s;
	},1)
}