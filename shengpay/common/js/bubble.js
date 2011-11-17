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

/*************气泡 start****************/
var OLD={};
(function(o){

var o=o||window;

var bubble_cur = null;
function showBubble(obj) {
    if ( !! bubble_cur) {
        try {
            if (bubble_cur.timer) window.clearTimeout(bubble_cur.timer);
            bubble_cur.hide();
        } catch(e) {}
    }
    bubble_cur = findBubble(obj);
    obj.bubble = bubble_cur;
    if (!bubble_cur.hide || !bubble_cur.show) {
        bubble_cur.hide = function() {
            bubble_cur.style.display = 'none';
            if ( !! obj.afterBubbleHide) obj.afterBubbleHide();
        };
        bubble_cur.show = function() {
            bubble_cur.style.display = 'inline';
            if ( !! obj.afterBubbleShow) obj.afterBubbleShow();
        };
    }
    bubble_cur.show();
}
function hideBubble(obj) {
    var bubble = findBubble(obj);
    try {
        if (bubble.timer) window.clearTimeout(bubble.timer);
        bubble_cur = bubble;
        bubble.timer = window.setTimeout(function() {
            bubble.hide();
        },
        300);
    } catch(e) {}
}
function cancelHideBubble(obj) {
    var bubble = findBubble(obj);
    try {
        if ( !! (bubble.timer)) window.clearTimeout(bubble.timer);
    } catch(e) {}
}
function findBubble(obj) {
    if (obj.parentNode.className == 'bubble_container') return obj.parentNode;
    try {
        var oElem = obj.nextSibling;
        for (var i = 0; i < 100; i++) {
            if (oElem.tagName == 'DIV' || oElem.tagName == 'div') {
                if (oElem.className == 'bubble_container') {
                    return oElem;
                } else return null;
            } else oElem = oElem.nextSibling;
            if (!oElem) return null;
        }
    } catch(e) {}
}
/*************气泡 end****************/

o.showBubble=showBubble;
o.hideBubble=hideBubble;
o.cancelHideBubble=cancelHideBubble;

})(OLD);

