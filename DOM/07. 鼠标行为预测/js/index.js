window.onload = function () {
	init();
}

function init() {
	initMenu();
}


var initMenu = (function () {
	var oMenu = document.getElementsByClassName('menu-wrap')[0],
		oMainItems = oMenu.getElementsByClassName('main-item'),
		oSubMenu = oMenu.getElementsByClassName('sub-menu')[0],
		oSubItems = oMenu.getElementsByClassName('sub-item'),
		mainLen = oMainItems.length,
		isInSub = false,
		isFirst = true,
		timer = null,
		mousePoses = [];

	for (var i = 0; i < mainLen; i++) {
		addEvent(oMainItems[i], 'mouseenter', mainItemMouseEnter);
	}

	addEvent(oMenu, 'mouseenter', function () {
		addEvent(document, 'mousemove', menuMouseMove);
	});

	addEvent(oMenu, 'mouseleave', menuMouseLeave);

	addEvent(oSubMenu, 'mouseenter', function () {
		isInSub = true;
	});

	addEvent(oSubMenu, 'mouseleave', function () {
		isInSub = false;
	});

	function mainItemMouseEnter(e) {
		var e = e || window.event,
			tar = e.target || e.srcElement,
			thisIdx = Array.prototype.indexOf.call(oMainItems, tar),
			posLen = mousePoses.length,
			curPos = mousePoses[posLen - 1] || { x: 0, y: 0 },	// mouseenter首次触发时，mousePoses是个空数组（还没获取到坐标），则值为undefined
			prePos = mousePoses[posLen - 2] || { x: 0, y: 0 },
			delayOrNot = doTimeout(curPos, prePos);

		oSubMenu.className = 'sub-menu';

		if (timer) { // 开启一个新的延时器时，若上一个延时器还没执行，则取消上一个延时器
			clearTimeout(timer);
		}

		if (!isFirst) {
			if (delayOrNot) {
				timer = setTimeout(function () {
					if (isInSub) {	// 鼠标停止滑动时，如果指针在子菜单中，则鼠标经过的最后一个菜单项不高亮，其对应的子菜单不显示，否者高亮并显示
						return;
					}
					addActive(oMainItems, thisIdx);
					addActive(oSubItems, thisIdx);
					timer = null; 
				}, 300);
			} else {
				addActive(oMainItems, thisIdx);
				addActive(oSubItems, thisIdx);
			}
		} else {
			addActive(oMainItems, thisIdx);
			addActive(oSubItems, thisIdx);
			isFirst = false;
		}
	}

	function removeAllActive(items) {
		var len = items.length;
		for (var i = 0; i < len; i++) {
			var classStr = items[i].className,
				classArr = classStr.split(' '),
				index = classArr.indexOf('active');

			if (index !== -1) {
				classArr.splice(index, 1);
				classStr = classArr.join(' ');
				items[i].className = classStr;
			}
		}
	}

	function addActive(items, index) {
		removeAllActive(items);
		items[index].className += ' active';
	}

	function menuMouseMove(e) {
		var e = e || window.event;

		mousePoses.push({
			x: pagePos(e).x,
			y: pagePos(e).y
		});

		if (mousePoses.length > 2) {
			mousePoses.shift();
		}
	}

	function menuMouseLeave() {
		oSubMenu.className += ' hide';
		removeAllActive(oMainItems);
		removeAllActive(oSubItems);
		removeEvent(document, 'mousemove', menuMouseMove);
	}

	function doTimeout(curPos, prePos) {
		var subTopLeft = {
			x: getPixel(oMenu, 'width') + getPixel(oMenu, 'margin-left'),
			y: getPixel(oMenu, 'margin-top')
		},
			subBottomLeft = {
				x: getPixel(oMenu, 'width') + getPixel(oMenu, 'margin-left'),
				y: getPixel(oMenu, 'margin-top') + getPixel(oSubMenu, 'height')
			};

		return pointInTriangle(curPos, prePos, subTopLeft, subBottomLeft);
	}
});

