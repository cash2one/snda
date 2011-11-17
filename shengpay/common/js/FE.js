/*========================================

	@author:wur
	@date:2011-6
	前端效果代码

-------------------------------------------*/

/*
//tab切换效果
	@author:wurui
	@date:2010.12.30

	构造方法：Tab(tabbox,contentbox,eventname,currentIndex)　
				——参数：tabbox - 用于切换的菜单容器(HTMLElement),
						contentbox - 内容容器(HTMLElement),
						eventname - 触发切换动作的事件名，默认为"click"
						currentIndex-当前选择的索引，默认为0
	样式要求：tab样式名符合 XXXtab_item,选中样式为：XXXtab_item_selected
	@update:
			2011.1.24 初始时候重置tab的样式
			2011.1.30 添加事件onTabChange
			2011.6.29 onTabChange多传了两个参数

*/
function Tab(tabbox,contentbox,eventname,currentIndex){
	var 
	_self=this,
	_arrtab=[],
	_arrcontent=[],
	_currentindex=currentIndex||0,
	_evtname=eventname||"click",

	_removeSelectedClass=function(elem){
		elem.className=elem.className.replace(/(tab_item)_selected\b/,"$1");
	},
	_addSelectedClass=function(elem){
		elem.className=elem.className.replace(/tab_item\b/,"tab_item_selected");
	},
	_showIndex=function(idx){
		if(idx!=_currentindex){
			
			_removeSelectedClass(_arrtab[_currentindex]);
			if(_arrcontent[_currentindex])_arrcontent[_currentindex].style.display="none";

			_currentindex=idx;

			_addSelectedClass(_arrtab[_currentindex]);
			if(_arrcontent[_currentindex])_arrcontent[_currentindex].style.display="";
			if(typeof _self.onTabChange=="function")_self.onTabChange.call(_self,_currentindex,_arrtab[_currentindex],_arrcontent[_currentindex]||undefined);
		}
	},
	_evthanlder=function(e){
		var tar=e.srcElement||e.target;
		
		if(tar.getAttribute("customtabindex")!=null){
			_showIndex(tar.getAttribute("customtabindex"));
		}else{//可能是tab子节点触发，向上找三层
			var i=3;
			tar=tar.parentNode;
			while(tar&&tar.nodeType==1&&i>0){

				if(tar.getAttribute("customtabindex")!=null){
					_showIndex(tar.getAttribute("customtabindex"));
					break;
				}
					
				tar=tar.parentNode;
				i--;
			}
		}
	};
	
	if(tabbox){
		for(var i=0,nodes=tabbox.childNodes,node=nodes[i],len=nodes.length;i<len;i++,node=nodes[i]){
			if(node.nodeType==1){
				node.setAttribute("customtabindex",_arrtab.length);
				_removeSelectedClass(node);
				if(_arrtab.length==_currentindex){
					_addSelectedClass(node);
				}
				_arrtab[_arrtab.length]=node;
			}
		}
	}
	if(contentbox){
		for(var i=0,nodes=contentbox.childNodes,node=nodes[i],len=nodes.length;i<len;i++,node=nodes[i]){
			if(node.nodeType==1){
				if(_arrcontent.length!=_currentindex){
					node.style.display="none";
				}else{
					node.style.display="";
				}
				_arrcontent.push(node);
			}
		}
	}
	
	if(tabbox.attachEvent){
		tabbox.attachEvent("on"+_evtname,_evthanlder);
	}else if(tabbox.addEventListener){
		tabbox.addEventListener(_evtname,_evthanlder,false);
	}else{
		tabbox["on"+_evtname]=_evthanlder;
	}
	
}

/*
	表单验证
	依赖jquery
*/


$.fn.showTip=function(str,type){

	if(!type){
		if(str){
			this.addClass("error").siblings("._tip").html(str).removeClass("tip_ok tip_info").addClass("tip_error");
		}else{
			this.removeClass("error").siblings("._tip").html("&nbsp;&nbsp;&nbsp;&nbsp;").removeClass("tip_error tip_info").addClass("tip_ok");
		}
		
	}else if(str){
		
		this.siblings("._tip").html(str).removeClass("tip_ok tip_error").addClass("tip_info");
	}
	return this;
};
$("input:text,input:password").live("focus",function(){
	$(this).removeClass("error").addClass("active").showTip(this.getAttribute("tip"),1);

}).live("blur",function(){
	$(this).removeClass("active");
});