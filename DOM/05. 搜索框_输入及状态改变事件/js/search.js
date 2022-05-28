window.onload = function () {
	init();
}

function init() {
	keySearch();
}

var keySearch = (function () {
	var searchKw = document.getElementById('J_search_kw'),
		autoKw = document.getElementById('J_auto_kw'),
		recomKw = JSON.parse(document.getElementById('J_recomKw').innerHTML),
		kwOrder = 0,
		timer = null;

	addEvent(searchKw, 'focus', function() {
		clearInterval(timer);
		showAutoKw(this.value);
		autoKw.style.color = '#ccc';
	});

	addEvent(searchKw, 'blur', function() {
		showAutoKw(this.value);
		autoKw.style.color = '#989898';
		if(!this.value) {
			timer = setInterval(changeAutoKw, 3000);
		} 
	});

	addEvent(searchKw, 'input', function() {
		showAutoKw(this.value);
	});

	addEvent(searchKw, 'propertychange', function() {
		showAutoKw(this.value);
	});

	function setAutoKws() {
		changeAutoKw();
		timer = setInterval(changeAutoKw, 3000);
	}

	function changeAutoKw() {
		var len = recomKw.length;
		autoKw.innerHTML = recomKw[kwOrder];
		kwOrder = kwOrder >= len - 1 ? 0 : ++kwOrder;
	}

	function showAutoKw(val) {
		if(val.length <= 0) {
			autoKw.className = 'auto-kw show';
		}else {
			autoKw.className = 'auto-kw hide';
		}
	}

	return function () {
		setAutoKws();
	}
})();