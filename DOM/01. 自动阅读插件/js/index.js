var oBackTop = document.getElementsByClassName('back-to-top')[0],
		oHeader = document.getElementsByClassName('list-hd')[0];

addEvent(window, 'scroll', function () {
	if (docScrollOffset().top > 0) {
		oBackTop.style.display = 'block';
	} else {
		oBackTop.style.display = 'none';
	}
})

addEvent(oBackTop, 'click', function() {
	window.scroll(0,0);
})

addEvent(oHeader, 'click', function() {
	window.scrollTo(0,0);
})



function docScrollOffset() {
	if (window.pageXOffset) {
		return {
			top: window.pageXOffset,
			left: window.pageYOffset
		}
	} else {
		return {
			top: document.documentElement.scrollTop + document.body.scrollTop,
			left: document.documentElement.scrollLeft + document.body.scrollLeft
		}
	}
}

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

function addEvent(elem, type, fn) {
	if (document.addEventListener) {
		elem.addEventListener(type, fn, false);
	} else if (document.attachEvent) {
		elem.attachEvent('on' + type, function () {
			fn.call(elem);
		})
	} else {
		elem['on' + type] = fn;
	}
}