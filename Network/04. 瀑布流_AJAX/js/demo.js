(function (doc) {
	var oItems = doc.getElementsByClassName('wf-item'),
		len = oItems.length,
		_hArr = [];

	var init = function () {
		bindEvent();
	}

	function bindEvent() {
		setImgPos();
	}

	function setImgPos() {
		for (var i = 0; i < len; i++) {
			var item = oItems[i];

			// (1200 - 40) / 5 = 232（图片宽度）
			// 图片间隔10
			item.style.width = 232 + 'px';

			if (i < 5) {
				item.style.top = '0';
				item.style.left = i * (232 + 10) + 'px';
				_hArr.push(item.offsetHeight + 10);
			} else {
				var idx = getIdxOfMin(_hArr);

				item.style.top = _hArr[idx] + 'px';
				item.style.left = idx * (232 + 10) + 'px';

				_hArr[idx] += item.offsetHeight + 10;
			}
		}
	}

	function getIdxOfMin(numArr) {
		var min = Math.min.apply(null, numArr);
		return numArr.indexOf(min);
	}

	window.onload = function () {
		init();
	}
})(document);