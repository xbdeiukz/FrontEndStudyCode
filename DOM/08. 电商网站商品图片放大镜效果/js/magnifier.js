window.onload = function () {
	init();
}

function init() {
	initMagnifier();
}

var initMagnifier = (function () {
	var oImgWrap = document.getElementsByClassName('img-wrap')[0],
		oMagWrap = document.getElementsByClassName('mag-wrap')[0],
		oMagImg = document.getElementsByClassName('mag-img')[0],
		imgWrapTop = oImgWrap.offsetTop,
		imgWrapLeft = oImgWrap.offsetLeft,
		magWidth = getStyle(oMagWrap, 'width', false),
		magHeight = getStyle(oMagWrap, 'height', false);

	addEvent(oImgWrap, 'mouseover', function (e) {
		var cfg = magCfg(e);

		oMagWrap.className += ' show';
		magMove(cfg.magTop, cfg.magLeft);
		addEvent(document, 'mousemove', mouseMove);
	});

	addEvent(oImgWrap, 'mouseout', mouseOut);

	function mouseMove(e) {
		var cfg = magCfg(e);
		magMove(cfg.magTop, cfg.magLeft, cfg.mouseX, cfg.mouseY);
	}

	function mouseOut(e) {
		removeEvent(document, 'mousemove', mouseMove);
	}

	function magMove(magTop, magLeft, mouseX, mouseY) {
		oMagWrap.style.top = magTop + 'px';
		oMagWrap.style.left = magLeft + 'px';
		oMagImg.style.top = - magTop + 'px';
		oMagImg.style.left = - magLeft + 'px';

		if (mouseX && mouseY) {
			if (mouseX < 0 || mouseX > getPixel(oImgWrap, 'width') ||
				mouseY < 0 || mouseY > getPixel(oImgWrap, 'height')) {
				oMagWrap.className = 'mag-wrap';
			}
		}
	}

	function magCfg(e) {
		var e = e || window.event;
		return {
			magTop: pagePos(e).y - imgWrapTop - magHeight / 2,
			magLeft: pagePos(e).x - imgWrapLeft - magWidth / 2,
			mouseX: pagePos(e).x - imgWrapLeft,
			mouseY: pagePos(e).y - imgWrapTop
		}
	}
});