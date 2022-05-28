// 方式一：
// ; (function (doc) {
// 	var oItems = doc.getElementsByClassName('list-item'),
// 		curIdx = 0;

// 	function bindEvent() {
// 		for (var i = 0; i < oItems.length; i++) {
// 			addEvent(oItems[i], 'mouseover', function () {
// 				oItems[curIdx].className = 'list-item';
// 				curIdx = Array.prototype.indexOf.call(oItems, this);
// 				oItems[curIdx].className += ' active';
// 			});
// 		}
// 	}

// 	function init() {
// 		bindEvent();
// 	}

// 	init();
// })(document);


// 方式二（事件委托）：
; (function (doc) {
	var oList = doc.getElementsByClassName('list')[0],
		oItems = oList.getElementsByClassName('list-item');
	curIdx = 0,
		thisIdx = 0;

	function bindEvent() {
		addEvent(oList, 'mouseover', handler);
		// removeEvent(oList, 'mouseout', handler);

		// 或（mouseover/out短触发；mousemove长触发）：
		// addEvent(oList, 'mouseover', function() {
		// 	addEvent(document, 'mousemove', handler);
		// });
		// addEvent(oList, 'mouseout', function() {
		// 	removeEvent(document, 'mousemove', handler);
		// });
	}

	function handler(e) {
		var e = e || window.event,
			tar = e.target || e.srcElement,
			tarItem = getTarItem(tar, 'li');
			thisIdx = Array.prototype.indexOf.call(oItems, tarItem);

		if (thisIdx !== curIdx) {
			oItems[curIdx].className = 'list-item';
			oItems[thisIdx].className += ' active';
			curIdx = thisIdx;
		}
	}


	function getTarItem(target, itemTag) {
		while (target.tagName.toLowerCase() !== itemTag) {
			target = target.parentNode;
		}
		return target;
	}

	function init() {
		bindEvent();
	}

	init();
})(document);