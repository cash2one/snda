/*
	@author:wurui.wr
	@date:2011-5-26
	@discription: code for the more list of top menu
*/
/*==============================================
	javascript library -- common plugin

	@author:wur

	@date:2010.11.9

	@version:1.0

	@discription:通用组件

	@remark: ;

	@update&new feature:

================================================*/


 var keyCode = {
        BACKSPACE: 8,
        CAPS_LOCK: 20,
        COMMA: 188,
        CONTROL: 17,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        INSERT: 45,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38
    };


/*==================================================================
	Tiny library
*/
//Class Dom's constructor
function Dom(tag){
	return this.init(tag);
}
Dom.prototype={
	show:function(){this.style.display="";return this;},
	hide:function(){this.style.display="none";return this;},
	remove:function(){this.parentNode.removeChild(this);return this;},

	addClass:function(cname){
		this.className=this.className?(this.className+" "+cname):cname;
		return this;
	},
	removeClass:function(cname){
		if(cname===undefined){
			this.className="";
			
		}else{
			this.className=this.className.replace(new RegExp("\\s?"+cname+"\\b"),"");
		}
		return this;
	},
	isShow:function(){
		return this.style.display!="none";
	},
	
	bind:function(type,handler){//bind event to element
		if(this.addEventListener){
			this.addEventListerner(type,handler,false)
		}else if(this.attachEvent){
			this.attachEvent("on"+type,handler);
		}
		return this;
	},
	unbind:function(type,handler){
		if(this.removeEventListener){
			this.removeEventListener(type,handler,false);

		}else if(this.detachEvent){
			this.detachEvent("on"+type,handler);
		}
		return this;
	},
	getAttrs:function(){//获得当前元素所有属性
		if(this.outerHTML){
			var reg=new RegExp("<"+this.tagName+"\\s?");
			var s=this.outerHTML.split(">")[0].replace(reg,"").toLowerCase().split(" ");

			var ret=[];
			for(var i=0;i<s.length;i++){

				ret[i]={};
				ret[i].name=s[i].split("=")[0];
				ret[i].value=s[i].split("=")[1];
			}
			return ret;

		}else if(this.attributes){
			return this.attributes;
		}
	},

	init:function(tag){
		var dom=(typeof tag=="object")?tag:document.createElement(tag);
		for(var k in this){
			if(k!="init"){
				dom[k]=this[k];
			}
		}
		return dom;
	}
};
function contains(a, b){return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);};
(function(win){
	var _showing;
	function showBubble(elem){
		var bubble=elem;
		while(bubble=bubble.nextSibling){
			if(bubble.nodeType==1&&bubble.className==="bubble_container")break;
		}
		if(bubble){
			bubble.style.display="inline";
			_showing=bubble;
		}
	}
	function triggerHideBubble(e,elem){
		var e=e||win.event,to=e.toElement||e.relatedTarget,tar=e.srcElement||e.target;
		if(elem==tar){
			if(!contains(elem,to)){hideBubble()}
		}
		
	}
	function hideBubble(){
		if(_showing)_showing.style.display="none";
	}
	win.showBubble=showBubble;
	win.hideBubble=hideBubble;
	win.triggerHideBubble=triggerHideBubble;

})(window);


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
			if(typeof _self.onTabChange=="function")_self.onTabChange.call(_self,_currentindex);
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


/*==================================================================
//Class Select's constructor
	version:1.2.1
	update:2010.11.23 键盘方向阻止默认行为
		2010.11.23 设置前后值一样、初始化设置值时皆不触发onchange事件

Depends on style:
<style>
ul,li{margin:0;padding:0;list-style:none;}
.sel{ background:url(sel.png) no-repeat right center;  border:solid 1px #7F9DB9; cursor:default; font-family:宋体; font-size:13px; }
.hover{ background:url(sel-hover.png) no-repeat right center; }
.opt{ background-color:#FFFFFF; border:solid 1px #7F9DB9; cursor:default; font-family:宋体; font-size:13px; }
.opt li{ display:block; width:100%; }
.opt li.now{ background-color:#316AC5; color:#FFF; }
</style>

Depends on Class Dom;
*/
function iSelect(src){
	
	this._init(src);
}
//depends on Class Dom;
iSelect.prototype={
	_selectingValue:null,//正选择的值，用于click,blur
	_selectedOption:null,//当前选项
	_index:0,
	_now:null,

	onChange:function(){},

	_init:function(src){
		if(src&&src.tagName&&src.tagName=="SELECT"){
			
			var options=src.options;

			var div=new Dom("span");
			div.style.display="inline-block";

			if(src.name){//如果有name属性，用一个hidden代替之
				var hideField=new Dom("input");
				hideField.type="hidden";
				hideField.name=src.name;
				hideField.value=src.value;
				this.hideField=hideField;

				div.appendChild(hideField);
			};


			var sel=this._createSelect(src);
			
			div.appendChild(sel);


			var ul=new Dom("ul");
	
			for(var i=0;i<options.length;i++){
				ul.appendChild(this._createOption(options[i].innerHTML,options[i].value,options[i].selected));
			}

			ul.style.width=(src.offsetWidth-2)+"px";
			ul.style.position="absolute";
			ul.hide();
			ul.className="opt"
			div.appendChild(ul);

			this.src=src;
			this.sel=sel;
			this.opt=ul;

			this._setValue(this._selectedOption.innerHTML,1);//设置初始值

			src.parentNode.replaceChild(div,src);
			

		}
	},
	_createSelect:function(src){

		var sel=new Dom("div");
		sel.tabIndex=0;
		sel.style.height=sel.style.lineHeight=(src.offsetHeight-2)+"px";
		sel.style.width=(src.offsetWidth-5)+"px";
		sel.style.paddingLeft=3+"px";
		sel.className="sel";
		
		if(src.getAttribute("onchange")!=null){
			this.onChange=new Function(src.getAttribute("onchange"));
			//alert(this.onChange+"   on");
		}

		var that=this;

		sel.onmouseover=function(){
			sel.addClass("hover");
		};
		sel.onmouseout=function(){
			sel.removeClass("hover");
		};

		sel.onclick=function(e){

			if(that.opt.isShow()){
				
				that._hideOption();
			}else{
				that._popupOption();
			}

		};


		sel.onblur=function(e){
			that._hideOption();
			that._setValue();
			
		};

		//键盘操作 方向键 IE下只有keydown keyup好用
		sel.onkeydown=function(e){
			e=e||window.event;
			switch(e.keyCode){
				case keyCode.UP:
				that._setStep(-1);
				if(e.preventDefault){
					e.preventDefault();
				}else{
					e.returnValue=false;
				}
				break;
				
				case keyCode.DOWN:
				that._setStep(1);
				if(e.preventDefault){
					e.preventDefault();
				}else{
					e.returnValue=false;
				}
				break;

				case keyCode.ENTER:
				if(that.opt.isShow()){
					that._hideOption();
					that._setStep(0);
				}
				break;

				case keyCode.ESCAPE:
				that._hideOption();
				break;
			}
			
		};
		return sel;
	},
	_createOption:function(txt,val,isNow){
		var that=this;
		var li=new Dom("li");

		li.setAttribute("index",this._index++);
		
		li.innerHTML=txt;

		if(val===undefined){
			val=txt;//
		}

		li.setAttribute("value",val)

		li.onmousedown=function(e){
			that._selectingValue=this.innerHTML;
			that._selectedOption=this;

		};
		li.onmouseover=function(){
			if(that._now){
				that._now.removeClass("now");	
			}
			that._now=li.addClass("now");;
		};
		if(isNow){
			this._selectedOption=li;

		}
		return li;
	},
	_setValue:function(val,_notrigger){
		if(this._selectingValue){
			var that=this;
			if(this.sel.innerHTML!=this._selectingValue){
				this.sel.innerHTML=this._selectingValue;
				if(!_notrigger)this.onChange();
			}
			setTimeout(function(){that.sel.focus();},1);
			this._selectingValue=null;	
		}else if(val){
			if(this.sel.innerHTML!=val){
				this.sel.innerHTML=val;
				if(!_notrigger)this.onChange();
			}
			
		}else{
			
		}
		if(this.hideField){
			this.hideField.value=this.val();
		}
		
	},
	//设置当前选项 step:-1或1,-1向上移动,1向下移动
	_setStep:function(step){
		if(step<0){
			if(this._now&&this._now.previousSibling){
				this._now.removeClass("now");
				this._now=this._now.previousSibling.addClass("now");
			}else if(!this._now){
				this._now=this.opt.lastChild.addClass("now");
			}
		}else if(step>0){

			if(this._now&&this._now.nextSibling){
				this._now.removeClass("now");
				this._now=this._now.nextSibling.addClass("now");
				
			}else if(!this._now){
				this._now=this.opt.firstChild.addClass("now");
			}
		}else if(step==0){
			
		}
		this._selectedOption=this._now;
		this._setValue(this._now.innerHTML);
		
		
	},
		//参数opt--object
	_setNow:function(opt){//将option对象设置为当前选中
		this._selectedOption=opt;
		this.sel.innerHTML=opt.innerHTML;
		if(this.hideField){
			this.hideField.value=opt.getAttribute("value");
		}
		this.onChange();
		return this;

	},
	_popupOption:function(){//弹出选项
		if(this._now){
			this._now.removeClass("now");
		}
		this._now=this._selectedOption.addClass("now");
		this.opt.show();
	},
	_hideOption:function(){//隐藏选项
		this.opt.hide();
	},
	val:function(){
		if(arguments[0]){//set
			var val=arguments[0];
			var obj=this._selectedOption;
			if(obj.getAttribute("value")!=val){

				var prev=obj,next=obj;
				while(next=next.nextSibling){
					if(next.getAttribute("value")==val){

						return this._setNow(next);
						 
					}
				}

				while(prev=prev.previousSibling){
					if(prev.getAttribute("value")==val){
						
						return this._setNow(prev);
					}
				}
				
			}
			
			return this;
		}else{//get
			return this._selectedOption.getAttribute("value");
		}
	},
	selectedIndex:function(){
		if(arguments[0]===undefined){//get
			return this._selectedOption.getAttribute("index");
		}else if(!isNaN(arguments[0])){//set

			var index=arguments[0];
			var obj=this._selectedOption;
			if(obj.getAttribute("index")!=index){

				var prev=obj,next=obj;

				while(next=next.nextSibling){
					if(next.getAttribute("index")==index){

						return this._setNow(next);
						 
					}
				}

				while(prev=prev.previousSibling){
					if(prev.getAttribute("index")==index){
						
						return this._setNow(prev);
					}
				}
				
			}
			
			return this;
		}
	}

};

//广告轮播
/*
	@author:wurui
	@date:2010.12.22

	构造方法：AdSlider(tabbox,contentbox,currentIndex)　——参数：tabbox - 用于切换的菜单容器(HTMLElement),contentbox - 内容容器(HTMLElement),currentIndex-当前选择的索引，默认为0
	公共属性：goNext() - 向后翻滚
			goPrev() - 向前翻滚
			goIndex(index) - 翻滚到指定的索引,参数:index - 指定的索引(Number)
			pause() - 暂停
			autoGo(delay) - 开始自动播放，参数：delay - 自动切换的时间间隔，默认为 3*1000(ms)

*/
function AdSlider(tabbox,contentbox,currentIndex){
	//private properties
	var
	_currentIndex=currentIndex||0,
	_tabArr=[],
	_contentArr=[],

	_isautoscrolling=false,
	_count=0,
	_timer=null,
	_delay=3*1000,
	_showIndex=function(idx){
		idx=(idx<0?0:idx)>=_count?_count-1:idx;
		if(_tabArr[idx]){
			_tabArr[_currentIndex].className=_tabArr[_currentIndex].className.replace(/s?selected\b/,"");
			_tabArr[idx].className+=" selected";
		}
		if(_contentArr[idx]){
			_contentArr[_currentIndex].style.display="none";
			_contentArr[idx].style.display="block";
			_currentIndex=idx;
		}
	},
	_goNext=function(){var nextIndex=_currentIndex-0+1>=_count?0:_currentIndex-0+1; _showIndex(nextIndex);},
	_goPrev=function(){var prevIndex=_currentIndex-1<0?_count-1:_currentIndex-1;_showIndex(prevIndex);},
	_goIndex=function(index){
		if(_isautoscrolling){ _pause(); }
		if(_currentIndex!=index)_showIndex(index);
	},
	_pause=function(){
		if(_timer){
			clearTimeout(_timer);
			_timer=null;
			_isautoscrolling=false;
		}
	},
	_playNextSlider=function(){
		if(_timer){
			_goNext();
		}
		_timer=setTimeout(_playNextSlider,_delay);
		
	};
	if(tabbox){
		for(var i=0,nodes=tabbox.childNodes,len=nodes.length;i<len;i++){
			var node=nodes[i];
			if(node.nodeType==1){
				_tabArr[_tabArr.length]=node;
			}
		}
	}
	if(contentbox){
		for(var i=0,nodes=contentbox.childNodes,len=nodes.length;i<len;i++){
			var node=nodes[i];
			if(node.nodeType==1){
				_contentArr[_contentArr.length]=node;
				_count++;
			}
		} 
	}
	//public properties
	this.goNext=_goNext;
	this.goPrev=_goPrev;
	this.goIndex=_goIndex;
	this.pause=_pause;
	this.autoGo=function(delay){
		if(!_isautoscrolling){
			_delay=delay||_delay;
			_playNextSlider();
			_isautoscrolling=true;
		}
	};
}