; (function (doc) {
	var searchInput = doc.getElementsByClassName('J_searchInput')[0],
		oWdList = doc.getElementsByClassName('J_wdList')[0],
		oListWrap = oWdList.parentNode,
		listTpl = doc.getElementById('J_listTpl').innerHTML;

	var init = function () {
		bindEvent();
	}

	function bindEvent() {
		searchInput.addEventListener('input', textInput, false);
		searchInput.addEventListener('keydown', search, false);
	}

	function search(e) {
		var e = e || window.event,
			keyCode = e.keyCode,
			keyWord = searchInput.value;

		if (keyCode === 13) {
			window.open('https://www.baidu.com/s?wd=' + keyWord);
		}
	}

	function textInput() {
		var val = trimSpace(this.value);

		if (val.length > 0) {
			getData(val, 'doData');	// JSONP获取数据，val为请求数据的参数，'doData'为处理数据的函数的函数名；
		} else {
			oWdList.innerHTML = '';
			oListWrap.style.display = 'none';
		}
	}

	function getData(value, callbackName) {
		var oScript = doc.createElement('script');
		oScript.src = 'https://www.baidu.com/sugrec?prod=pc&wd=' + value + '&cb=' + callbackName;

		doc.body.appendChild(oScript);
		doc.body.removeChild(oScript);
	}

	window.doData = function (data) {
		renderList(data);
	}

	function renderList(data) {
		// console.log(data);
		var list = '',
			data = data.g,
			len = data ? data.length : 0,
			val = trimSpace(searchInput.value);

		// console.log('data', data)

		if (len) {
			data.forEach(function (item) {
				var listItem;

				listItem = listTpl.replace(/{{(.*?)}}/igm, function(node, key) {
					return {
						wdLink: item.q,
						wd: setWordStyle(val, item.q)
					}[key];
				});

				list += listItem;
			});

			oWdList.innerHTML = list;
			oListWrap.style.display = 'block';
		} else {
			oWdList.innerHTML = '';
			oListWrap.style.display = 'none';
		}
	}

	function setWordStyle(word, sentence) {
		if (sentence.indexOf(word) === 0) {
			return word + '<span class="font-bold">' + sentence.replace(word, '') + '</span>';
		} else {
			return sentence;
		}
	}

	function trimSpace(str) {
		return str.replace(/\s+/g, '');
	}

	init();
})(document);