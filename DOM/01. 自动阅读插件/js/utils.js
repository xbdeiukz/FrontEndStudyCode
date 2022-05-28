/******************************************************* [ECMAScript] */
// 数组去重：
Array.prototype.unique = function () {
	var newArr = [];
	var obj = {};
	for (var i = 0; i < this.length; i++) {
		if (!obj[this[i]]) {
			obj[this[i]] = true;
			newArr.push(this[i]);
		}
	}
	return newArr;
}





/************************************************************** [DOM] */
// 获取元素相对于body的偏移量 getElemDocPosition：
function getElemDocOffset(elem) {
	var parent = elem.offsetParent,
		offsetTop = elem.offsetTop,
		offsetLeft = elem.offsetLeft;

	while (parent) {
		offsetTop += parent.offsetTop;
		offsetLeft += parent.offsetLeft;
		parent = parent.offsetParent;
	}

	return {
		top: offsetTop,
		left: offsetLeft
	}
}

// ***************** 兼容性 ********************
// 兼容性取消默认事件：
function preventEventDefault(e) {
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
}

// 兼容性取消冒泡事件：
function cancelBubble(e) {
	e = e || window.event;
	if (e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}

// 兼容性给DOM元素某事件添加事件处理函数：
function addEvent(elem, type, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(type, fn, false);
	} else if (elem.attachEvent) {
		elem.attachEvent('on' + type, function () {
			fn.call(elem);
		});
	} else {
		elem['on' + type] = fn;
	}
}

// 兼容性获取元素的样式：
function getStyle(elem, prop) {
	var style;
	if (window.getComputedStyle) {
		style = window.getComputedStyle(elem, null);
		if (prop) {
			return style[prop];
		} else {
			return style;
		}
	} else {
		style = elem.currentStyle;
		if (prop) {
			return style[prop];
		} else {
			return style;
		}
	}
}

// 兼容性获取节点的子元素，返回一个类数组：
function getElemChildren(node) {
	var cNodes = node.childNodes,
		len = cNodes.length,
		objArr = {
			length: 0,
			splice: Array.prototype.splice,
			push: Array.prototype.push
		}

	for (var i = 0; i < len; i++) {
		if (cNodes[i].nodeType === 1) {
			objArr.push(cNodes[i]);
		}
	}
	return objArr;
}
// 或：
Element.prototype.elemChildren = function () {
  var cNodes = this.childNodes,
    len = cNodes.length,
    objArr = {
      length: 0,
      push: Array.prototype.push,
      splice: Array.prototype.splice
    }
  for (var i = 0; i < len; i++) {
    if (cNodes[i].nodeType === 1) {
      objArr.push(cNodes[i]);
    }
  }
  return objArr;
}

// 兼容性获取网页滚动距离 getScrollOffset：
function docScrollOffset() {
	if (window.pageXOffset) {
		return {
			top: window.pageYOffset,
			left: window.pageXOffset
		}
	} else {
		return {
			top: document.documentElement.scrollTop + document.body.scrollTop,
			left: document.documentElement.scrollLeft + document.body.scrollLeft
		}
	}
}

// 兼容性获取网页的宽高 getScrollSize：
function docScrollSize() {
	if (document.body.scrollWidth) {
		return {
			width: document.body.scrollWidth,
			height: document.body.scrollHeight
		}
	} else {
		return {
			width: document.documentElement.scrollWidth,
			height: document.documentElement.scrollHeight
		}
	}
}

// 兼容性获取浏览器视口宽高 getViewportSize：
function docViewportSize() {
	if (window.innerWidth) {
		return {
			width: window.innerWidth,
			height: window.innerHeight
		}
	} else {
		if (document.compatMode === 'BackCompat') {
			return {
				width: document.body.clientWidth,
				height: document.body.clientHeight
			}
		} else {
			return {
				width: document.documentElement.clientWidth,
				height: document.documentElement.clientHeight
			}
		}
	}
}

