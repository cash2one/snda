function addEventHandler(oTarget, sEventType, fnHandler) { 
    if (oTarget.addEventListener) { 
        oTarget.addEventListener(sEventType, fnHandler, false); 
    } else if (oTarget.attachEvent) { 
        oTarget.attachEvent("on" + sEventType, fnHandler); 
    } else { 
        oTarget["on" + sEventType] = fnHandler; 
    } 
}; 

function removeEventHandler(oTarget, sEventType, fnHandler) { 
	if (oTarget.removeEventListener) { 
		oTarget.removeEventListener(sEventType, fnHandler, false); 
	} else if (oTarget.detachEvent) { 
		oTarget.detachEvent("on" + sEventType, fnHandler); 
	} else { 
		oTarget["on" + sEventType] = null; 
	} 
}; 
/** ***********滚动 start************* */
function Marquee() {
    this.check_rollable = function() {
        this.width = this.direction == "y" ? parseInt(this.roll_element.clientHeight) : parseInt(this.roll_element.clientWidth);
        var td = this.roll_element.tBodies[0].rows[0].cells[0];
        var contentWidth = this.direction == "y" ? parseInt(td.clientHeight) : parseInt(td.clientWidth);
        if (contentWidth > this.roll_width) {
            this.rollable = true;
        } else {
            this.rollable = false
        }
        if (!this.rollable) {
            this.rollable_left = false;
            this.rollable_right = false;
            return;
        }
        if (this.loop) {
            this.rollable_left = true;
            this.rollable_right = true;
            if (this.width + this.left + this.moved_left < this.roll_width) this.add_element_to_right();
            else if ( - this.left - this.moved_left < 0) this.add_element_to_left();
        } else {
            this.rollable_left = false;
            this.rollable_right = false;
            if (this.width + this.left + this.moved_left > this.roll_width) {
                this.rollable_right = true;
            }
            if ( - this.left - this.moved_left > 0) {
                this.rollable_left = true;
            }
        }
        this.enable_btn();
    };
    this.inited = false;
    this.init = function(par) {
        //par = {"roll_timepiece":roll_timepiece,"roll_distance":roll_distance,"roll_width":roll_width,"roll_element":roll_element,"auto_time":auto_time}
        
        this.roll_timepiece = par.roll_timepiece;
        this.roll_distance = par.roll_distance;
        this.roll_width = par.roll_width;
        this.roll_element = par.roll_element;
        this.auto_time = par.auto_time;
        
        this.inited = true;
        if (this.loop) {
            var content = this.roll_element.tBodies[0].rows[0].cells[0].innerHTML;
            var newRow, newCell;
            newRow = this.roll_element.tBodies[0].insertRow( - 1);
            if (this.direction == "y") // 纵向
            newCell = newRow.insertCell( - 1);
            else // 横向
            newCell = this.roll_element.tBodies[0].rows[0].insertCell( - 1);
            newCell.innerHTML = content;

        }
        this.roll_element.style.marginTop = "0px";
        this.roll_element.style.marginLeft = "0px";
        this.check_rollable();
    };
    this.add_element_to_right = function() {
        if (!this.inited) {
            return false;
        } else {
            var oFragment = document.createDocumentFragment();
            if (this.direction == "y") {
                oFragment.appendChild(this.roll_element.tBodies[0].rows[1]);
                this.left += this.width / 2;
                this.roll_element.style.marginTop = this.left + "px";
                this.roll_element.tBodies[0].appendChild(oFragment);
            } else {
                oFragment.appendChild(this.roll_element.tBodies[0].rows[0].cells[0]);
                this.left += this.width / 2;
                this.roll_element.style.marginLeft = this.left + "px";
                this.roll_element.tBodies[0].rows[0].appendChild(oFragment);
            }
            return true;
        }
    };
    this.add_element_to_left = function() {
        if (!this.inited) {
            return false;
        } else {
            var oFragment = document.createDocumentFragment();
            if (this.direction == "y") {
                oFragment.appendChild(this.roll_element.tBodies[0].rows[0]);
                this.left -= this.width / 2;
                this.roll_element.style.marginTop = this.left + "px";
                this.roll_element.tBodies[0].appendChild(oFragment);
            } else {
                oFragment.appendChild(this.roll_element.tBodies[0].rows[0].cells[1]);
                this.left -= this.width / 2;
                this.roll_element.style.marginLeft = this.left + "px";
                this.roll_element.tBodies[0].rows[0].appendChild(oFragment);
            }
            return true;
        }
    }; // 自动翻页
    this.auto_play = function(auto) {
        if (!this.rollable_right) return;
        this.auto = auto;
        if (!auto) return false;
        (function(thisElement){
        if (thisElement.auto_timer > 0) window.clearTimeout(thisElement.auto_timer);
            thisElement.auto_timer = window.setTimeout(function() {thisElement.startPlay(thisElement.auto);},
            thisElement.auto_time);
        })(this);
    };
    this.startPlay = function(auto){
        if(this.paused) {this.auto_play(auto);}
        else {
            if (this.auto == "left") this.roll_left();
            else this.roll_right();
        }
    }
    // 向前翻页
    this.roll_left = function() {
        this.roll_direction = "to_left";
        this.check_rollable();
        if (!this.rollable_left) return;
        if (this.rolling) { (function(thisElement) {
                if (thisElement.wait_timer > 0) window.clearTimeout(thisElement.wait_timer);
                thisElement.wait_timer = window.setTimeout(function() {
                    thisElement.roll_left();
                },
                50);
            })(this);
        } else this.roll_pos();
    };
    this.roll_right = function() {
        this.roll_direction = "to_right";
        this.check_rollable();
        if (!this.rollable_right) return;
        if (this.rolling) { (function(thisElement) {
                if (thisElement.wait_timer > 0) window.clearTimeout(thisElement.wait_timer);
                thisElement.wait_timer = window.setTimeout(function() {
                    thisElement.roll_right();
                },
                50);
            })(this);
        } else this.roll_pos();
    }; // 属性
    this.roll_timepiece = 30; // 滚动单位时间间隔(越小越快)
    this.roll_distance = 101; // 滚动单位距离(越大越快)
    this.roll_width = 800; // 有效可视范围(横向)
    this.width = 1800; // 滚动内容实际宽度
    this.auto_time = 3000; // 自动滚动时间间隔(单位:毫秒)
    this.roll_element = null;
    this.btn_left = {};
    this.btn_right = {};
    this.btn_pause = {};
    this.roll_timer = null;
    this.wait_timer = null;
    this.auto_timer = null;
    this.width = this.roll_element == null ? 0 : (this.direction == "y" ? parseInt(this.roll_element.clientHeight) : parseInt(this.roll_element.clientWidth)); // 状态
    this.rollable = false;
    this.rollable_left = false;
    this.rollable_right = false;
    this.rolling = false;
    this.paused = false;
    this.loop = true;
    this.auto = false; // 回调函数
    this.end_left_func = null;
    this.end_right_func = null;
    this.direction = "x";
    this.roll_direction = "to_left";
    this.left = 0;
    this.moved_left = 0; // 滚动到指定位置
    this.roll_pos = function() {
        this.check_rollable();
        if (!this.rollable_left && !this.rollable_right) return false;
        var mleft = 0;
        this.rolling = true;
        if (this.roll_direction == "to_right") { // 再移一格就超过一屏
            if ( - this.moved_left > this.roll_width - this.roll_distance) {
                mleft = this.left - this.roll_width;
                this.roll_timer = -1;
                this.moved_left = 0;
                if (this.auto) this.auto_play(this.auto);
                this.rolling = false;
                this.left = mleft;
            } // 未超过一屏
            else { // 能再移一格
                if (this.width + this.left - this.roll_width + this.moved_left > this.roll_distance) {
                    this.moved_left -= this.roll_distance;
                    mleft = this.left + this.moved_left;
                    (function(thisElement) {
                        if (thisElement.roll_timer > 0) window.clearTimeout(thisElement.roll_timer);
                        thisElement.roll_timer = window.setTimeout(function() {
                            thisElement.roll_pos();
                        },
                        thisElement.roll_timepiece);
                    })(this);
                } else { // 是否是循环
                    if (!this.loop) {
                        mleft = this.roll_width - this.width;
                        this.roll_timer = -1;
                        this.moved_left = 0;
                        if (this.auto) this.auto_play(this.auto);
                        this.rolling = false;
                        this.left = mleft;
                        this.left_end();
                    } else {
                        this.add_element_to_right();
                        this.moved_left -= this.roll_distance;
                        mleft = this.left + this.moved_left; // 准备本屏下一次移动
                        (function(thisElement) {
                            if (thisElement.roll_timer > 0) window.clearTimeout(thisElement.roll_timer);
                            thisElement.roll_timer = window.setTimeout(function() {
                                thisElement.roll_pos();
                            },
                            thisElement.roll_timepiece);
                        })(this);
                    }
                }
            }
        };
        if (this.roll_direction == "to_left") { // 再移一格就超过一屏
            if (this.moved_left > this.roll_width - this.roll_distance) {
                mleft = this.left + this.roll_width;
                this.roll_timer = -1;
                this.moved_left = 0;
                if (this.auto) this.auto_play(this.auto);
                this.rolling = false;
                this.left = mleft;
            } // 未超过一屏
            else { // 能再移一格
                if (( - this.left) - this.moved_left > this.roll_distance) {
                    this.moved_left += this.roll_distance;
                    mleft = this.left + this.moved_left;
                    (function(thisElement) {
                        if (thisElement.roll_timer > 0) window.clearTimeout(thisElement.roll_timer);
                        thisElement.roll_timer = window.setTimeout(function() {
                            thisElement.roll_pos();
                        },
                        thisElement.roll_timepiece);
                    })(this);
                } else { // 是否是循环
                    if (!this.loop) {
                        mleft = 0;
                        this.roll_timer = -1;
                        this.moved_left = 0;
                        if (this.auto) this.auto_play(this.auto);
                        this.rolling = false;
                        this.left = mleft;
                        this.right_end();
                    } else {
                        this.add_element_to_left();
                        this.moved_left += this.roll_distance;
                        mleft = this.left + this.moved_left; // 准备本屏下一次移动
                        (function(thisElement) {
                            if (thisElement.roll_timer > 0) window.clearTimeout(thisElement.roll_timer);
                            thisElement.roll_timer = window.setTimeout(function() {
                                thisElement.roll_pos();
                            },
                            thisElement.roll_timepiece);
                        })(this);
                    }
                }
            }
        }
        if (this.direction == "y") this.roll_element.style.marginTop = mleft + "px";
        else this.roll_element.style.marginLeft = mleft + "px";
        this.check_rollable();
    };
    this.right_end = function() {
        if (typeof(this.end_right_func) == "function") this.end_right_func();
    };
    this.left_end = function() {
        if (typeof(this.end_left_func) == "function") this.end_left_func();
    };
    this.enable_btn = function() {};
    this.pause = function(){this.paused=true;};
    this.play = function(){this.paused=false;this.startPlay()};
}
/** ***********滚动 end************************** */
