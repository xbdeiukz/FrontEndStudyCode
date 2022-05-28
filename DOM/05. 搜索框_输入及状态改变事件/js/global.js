/******************************************************* [ECMAScript] */
// 数组去重：
Array.prototype.unique = function () {
	var newArr = [],
		obj = {};
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

// 获取DOM节点的第n级祖先元素：
function getElemParent(node, n) {
	var type = typeof n;
	if (type === 'undefined') {
		return node.parentNode;
	} else if (type !== 'number' || n < 1) {
		return 'undefined';
	} else {
		while (n) {
			node = node.parentNode;
			n--;
		}
		return node;
	}
}
// 或：
Element.prototype.elemParent = function (n) {
	var type = typeof n,
		node = this;

	if (type === 'undefined') {
		return this.parentNode;
	}
	else if (type !== 'number' || n < 1) {
		return undefined;
	} else {
		while (n) {
			node = node.parentNode;
			n--;
		}
		return node;
	}

}

// 元素拖拽函数封装：
function elemDrag(elem) {
	addEvent(elem, 'mousedown', function (e) {
		var e = e || window.event,
			dx = pagePos(e).x - parseInt(getStyle(elem, 'left')),
			dy = pagePos(e).y - parseInt(getStyle(elem, 'top'));

		addEvent(document, 'mousemove', mouseMove);
		addEvent(document, 'mouseup', mouseUp);
		stopEventBubble(e);
		preventEventDefault(e);

		function mouseMove(e) {
			var e = e || window.event;
			elem.style.top = pagePos(e).y - dy + 'px';
			elem.style.left = pagePos(e).x - dx + 'px';
		}
		function mouseUp(e) {
			var e = e || window.event;
			removeEvent(document, 'mousemove', mouseMove);
			removeEvent(document, 'mouseup', mouseUp);
		}
	})
}

// 元素拖拽终极版函数封装：
Element.prototype.dragNclick = function (oMenu, elemClick) {
	dragnclick.call(this);

	function dragnclick() {
		var _self = this,
			wWidth = docViewportSize().width,
			wHeight = docViewportSize().height,
			elemWidth = parseInt(getStyle(this, 'width')),
			elemHeight = parseInt(getStyle(this, 'height')),
			oMenuWidth = parseInt(getStyle(oMenu, 'width')),
			oMenuHeight = parseInt(getStyle(oMenu, 'height')),
			dbcStartTime = 0,
			dbcEndTime = 0,
			counter = 0;

		addEvent(this, 'mousedown', function (e) {
			var e = e || window.event,
				btnCode = e.button,
				originOffset = {
					top: parseInt(getStyle(this, 'top')),
					left: parseInt(getStyle(this, 'left'))
				},
				dx = pagePos(e).x - originOffset.left,
				dy = pagePos(e).y - originOffset.top,
				cStartTime = new Date().getTime(),
				cEndTime;

			if (btnCode === 0) {
				addEvent(document, 'mousemove', mouseMove);
				addEvent(document, 'mouseup', mouseUp);
				stopEventBubble(e);
				preventEventDefault(e);
			} else if (btnCode === 2) {
				var mTop = pagePos(e).y,
					mLeft = pagePos(e).x;

				if (wHeight - pagePos(e).y < oMenuHeight) {
					mTop = pagePos(e).y - oMenuHeight;
				}

				if (wWidth - pagePos(e).x < oMenuWidth) {
					mLeft = pagePos(e).x - oMenuWidth;
				}

				oMenu.style.display = 'block';
				oMenu.style.top = mTop + 'px';
				oMenu.style.left = mLeft + 'px';

				addEvent(document, 'contextmenu', function (e) {
					var e = e || window.event;
					preventEventDefault(e);
				});
			}

			addEvent(document, 'click', function () {
				oMenu.style.display = 'none';
			});


			function mouseMove(e) {
				var e = e || window.event,
					elemTop = pagePos(e).y - dy,
					elemLeft = pagePos(e).x - dx;

				if (elemTop < 0) {
					elemTop = 0;
				} else if (elemTop >= wHeight - elemHeight) {
					elemTop = wHeight - elemHeight - 1;
				}

				if (elemLeft < 0) {
					elemLeft = 0;
				} else if (elemLeft >= wWidth - elemWidth) {
					elemLeft = wWidth - elemWidth - 1;
				}

				_self.style.top = elemTop + 'px';
				_self.style.left = elemLeft + 'px';
			}

			function mouseUp(e) {
				var e = e || window.event;
				cEndTime = new Date().getTime();

				if (cEndTime - cStartTime < 100) {
					// elemClick();

					_self.style.top = originOffset.top + 'px';
					_self.style.left = originOffset.left + 'px';
					counter++;

					if (counter === 1) {
						dbcStartTime = new Date().getTime();
					}
					if (counter === 2) {
						dbcEndTime = new Date().getTime();
					}
					if (dbcStartTime && dbcEndTime && (dbcEndTime - dbcStartTime < 200)) {
						elemClick();
					}

					var timer = setTimeout(function () {
						dbcStartTime = 0;
						dbcEndTime = 0;
						counter = 0;
						clearTimeout(timer);
					}, 200);
				}

				removeEvent(document, 'mousemove', mouseMove);
				removeEvent(document, 'mouseup', mouseUp);
			}
		})
	}
}

// ***************** 兼容性 ********************
// 兼容性获取鼠标在文档中的位置坐标pagePosition（pageX/Y）：
function pagePos(e) {
	var sTop = docScrollOffset().top,
		sLeft = docScrollOffset().left,
		cTop = document.documentElement.clientTop || 0,
		cLeft = document.documentElement.clientLeft || 0;

	return {
		x: e.clientX + sLeft - cLeft,
		y: e.clientY + sTop - cTop
	}
}

// 兼容性取消默认事件：
function preventEventDefault(e) {
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
}

// 兼容性取消冒泡事件：
function stopEventBubble(e) {
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

// 兼容性取消DOM元素某事件的事件处理函数：
function removeEvent(elem, type, fn) {
	if (elem.removeEventListener) {
		elem.removeEventListener(type, fn, false);
	} else if (elem.detachEvent) {
		elem.detachEvent('on' + type, fn);
	} else {
		elem['on' + type] = null;
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

