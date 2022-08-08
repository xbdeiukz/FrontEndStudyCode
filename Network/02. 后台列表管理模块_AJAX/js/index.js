; (function (doc) {
	var oNav = doc.getElementsByClassName('J_nav')[0],
		oNavItems = oNav.getElementsByClassName('nav-item'),
		oSearchRow = doc.getElementsByClassName('J_searchRow')[0],
		oTipRow = doc.getElementsByClassName('J_tipRow')[0],
		oCourseList = doc.getElementsByClassName('J_courseList')[0],
		oSearchInput = doc.getElementById('J_searchInput'),
		oPageBtnRow = doc.getElementsByClassName('J_pageBtnRow')[0],
		oPageBtnList = doc.getElementsByClassName('J_pageBtnList')[0],
		oBtnItems = oPageBtnList.getElementsByClassName('btn-item'),
		oCourseModifyInputs = doc.getElementsByClassName('course-name-input'),
		oCourseSpans = doc.getElementsByClassName('course-name'),
		listItemTpl = doc.getElementById('J_listItemTpl').innerHTML,
		pageBtnItemTpl = doc.getElementById('J_pageBtnItemTpl').innerHTML,
		oNavItemsLen = oNavItems.length;

	var field = 'manage',	// 请求数据的字段参数参数默认为'manage';
		pageNum = 0,	// 请求数据的页码参数，默认为0;
		curId = 0,
		curIdx = -1;

	var APIs = {
		getCourseList: 'http://localhost/api_for_study/index.php/List/getCourseListForManage',
		getSearchList: 'http://localhost/api_for_study/index.php/List/getSearchListForManage',
		doListItem: 'http://localhost/api_for_study/index.php/List/doListItemForManage',
		updateCourseName: 'http://localhost/api_for_study/index.php/List/updateCourseNameForManage'
	}

	var init = function () {
		bindEvent();
		getCourseList({
			field: field,
			pageNum: pageNum
		});
	}

	function bindEvent() {
		oNav.addEventListener('click', navClick);
		oSearchInput.addEventListener('input', throttle(courseSearch, 1000));
		oPageBtnList.addEventListener('click', pageBtnClick);
		oCourseList.addEventListener('click', courseItemClick);
	}

	function navClick(event) {
		var e = event || window.event,
			tar = e.target || e.srcElement,
			className = tar.className;

		// e.stopPropagation();

		if (className == 'nav-lk') {
			var oParent = tar.parentNode;

			field = oParent.getAttribute('data-field');

			for (var i = 0; i < oNavItemsLen; i++) {
				oNavItems[i].className = 'nav-item';
			}
			oParent.className += ' active';

			if (field === 'search') {
				showSearchInput(true);
				oSearchInput.focus();
				showTipRow(true);
				return;
			}

			pageNum = 0;
			showSearchInput(false);
			getCourseList({
				field: field,
				pageNum: pageNum
			})
		}
	}

	function pageBtnClick(event) {
		var e = event || window.event,
			tar = e.target || e.srcElement,
			className = tar.className;

		// e.stopPropagation();

		if (className === 'page-btn') {
			var oParent = tar.parentNode;

			pageNum = [].indexOf.call(oBtnItems, oParent);

			getCourseList({
				field: field,
				pageNum: pageNum
			});
		}
	}

	function courseItemClick(event) {
		var e = event || window.event,
			tar = e.target || e.srcElement,
			className = tar.className,
			itemId = tar.getAttribute('data-id');

		e.stopPropagation();

		switch (className) {
			case 'list-btn delete':
				confirm('确认删除吗？') && doListItem({
					type: 'delete',
					pageNum: pageNum,
					itemId: itemId
				});
				break;
			case 'list-btn regain':
				confirm('确认恢复吗？') && doListItem({
					type: 'regain',
					pageNum: pageNum,
					itemId: itemId
				});
				break;
			case 'course-name':
				showModifyInput(tar);
				break;
			default:
				break;
		}
	}

	function showModifyInput(target) {
		var oParent = target.parentNode,
			thisModifyInput = oParent.getElementsByClassName('course-name-input')[0],
			valLen = thisModifyInput.value.length;

		curId = thisModifyInput.getAttribute('data-id');
		curIdx = [].indexOf.call(oCourseModifyInputs, thisModifyInput);
		// console.log(curIdx, curId);

		hideAllModifyInputs();
		thisModifyInput.className += ' show';
		thisModifyInput.focus();
		thisModifyInput.setSelectionRange(0, valLen);

		document.addEventListener('keyup', updateCourseName);
		document.addEventListener('click', updateCourseName);
		oCourseList.addEventListener('click', updateCourseName);
	}

	function hideAllModifyInputs() {
		var len = oCourseModifyInputs.length,
			item;

		for (var i = 0; i < len; i++) {
			item = oCourseModifyInputs[i];
			item.className = 'course-name-input';
			item.blur();
		}
	}

	function updateCourseName(event) {
		var e = event || window.event,
				tar = e.target || e.srcElement,
			eventType = e.type,
			className = tar.className;

		if (eventType == 'keyup') {
			if (e.keyCode === 13) {
				submitNewCourseName({
					curId: curId,
					curIdx: curIdx
				});
			}
			return;
		}

		if (className.indexOf('course-name-input') == -1) {
			submitNewCourseName({
				curId: curId,
				curIdx: curIdx
			});
		}
	}

	function courseSearch() {
		var val = trimSpace(this.value),
			valLen = val.length;

		console.log(val);

		if (valLen > 0) {
			getSearchList({
				keyword: val
			});
		} else {
			showTipRow(true);
		}
	}

	function submitNewCourseName(opt) {
		console.log('submit');
		var curId = opt.curId,
			curIdx = opt.curIdx,
			newVal = oCourseModifyInputs[curIdx].value;

		if (newVal !== oCourseSpans[curIdx].innerHTML) {
			xhr.ajax({
				url: APIs.updateCourseName,
				type: 'POST',
				data: {
					itemId: curId,
					newVal: newVal
				},
				success: function (data) {
					if (data == 'success') {
						oCourseSpans[curIdx].innerHTML = newVal;
					} else {
						alert('修改课程名称失败，请重试！');
					}

					curId = 0;
					curIdx = -1;
				},
				error: function () {
					alert('修改课程名称失败，请重试！');
				}
			});
		}

		hideAllModifyInputs();
		document.removeEventListener('click', updateCourseName);
		document.removeEventListener('keyup', updateCourseName);
		oCourseList.removeEventListener('click', updateCourseName);
	}

	function getSearchList(opt) {
		xhr.ajax({
			url: APIs.getSearchList,
			type: 'POST',
			dataType: 'JSON',
			data: {
				keyword: opt.keyword
			},
			success: function (data) {
				// console.log(data);
				var courseArr = data.res;

				render({
					field: 'search',
					data: courseArr
				});
			},
			error: function () {
				alert('搜索失败，请重试！');
			}
		});
	}

	function getCourseList(opt) {
		xhr.ajax({
			url: APIs.getCourseList,
			type: 'POST',
			dataType: 'JSON',
			data: {
				field: opt.field,
				pageNum: opt.pageNum
			},
			success: function (data) {
				// console.log(data);
				render({
					field: opt.field,
					pageNum: opt.pageNum,
					pageCount: data.pages,
					data: data.res
				});
			},
			error: function () {
				alert('列表获取失败，请重试！');
			}
		});
	}

	function doListItem(opt) {
		xhr.ajax({
			url: APIs.doListItem,
			type: 'POST',
			data: {
				type: opt.type,
				pageNum: opt.pageNum,
				itemId: opt.itemId
			},
			success: function (data) {
				console.log('doListItem', data);

				render({
					field: field,
					pageNum: 0,
					data: data.res,
					pageCount: data.pages,
				});

				// var pageNum = opt.pageNum == data.pages ?
				// opt.pageNum - 1 : opt.pageNum;

				// getCourseList({
				// 	field: field,
				// 	pageNum: pageNum
				// });
			},
			error: function () {
				alert('操作列表失败，请重试！');
			}
		});
	}

	function render(opt) {
		var field = opt.field,
			data = opt.data,
			pageCount = opt.pageCount,
			pageNum = opt.pageNum;

		if (data && data.length > 0) {
			oCourseList.innerHTML = renderCourses(field, data);
			showTipRow(false);
		} else {
			showTipRow(true);
		}

		if (pageCount > 1 && field != 'search') {
			oPageBtnList.innerHTML = renderPageBtns(pageCount, pageNum);
		} else {
			showPageBtnRow(false);
		}
	}

	function renderCourses(field, courseArr) {
		var listStr = '';
		courseArr.forEach(function (item) {
			listStr += listItemTpl.replace(/{{(.*?)}}/igm, function (node, key) {
				return {
					id: item.id,
					course: item.course,
					hour: item.hour,
					teacher: item.teacher,
					filed: item.field,
					type: field == 'trash' ? 'regain' : 'delete',
					typeText: field == 'trash' ? '恢复' : '删除'
				}[key];
			});
		});
		return listStr;
	}

	function renderPageBtns(pageCount, pageNum) {
		var pagesStr = '';

		showPageBtnRow(true);

		for (var i = 0; i < pageCount; i++) {
			pagesStr += pageBtnItemTpl.replace(/{{(.*?)}}/g, function (node, key) {
				return {
					pageNum: i + 1,
					isCur: i == pageNum ? 'cur' : ''
				}[key];
			});
		}

		return pagesStr;
	}

	function showSearchInput(bool) {
		if (bool) {
			oSearchRow.className += ' show';
		} else {
			oSearchRow.className = 'search-row J_searchRow';
		}
	}

	function showTipRow(bool) {
		if (bool) {
			oTipRow.className = 'tip-row J_tipRow';
			oCourseList.innerHTML = '';
			oPageBtnRow.className = 'page-btn-row J_pageBtnRow';
		} else {
			oTipRow.className += ' hide';
		}
	}

	function showPageBtnRow(bool) {
		if (bool) {
			oPageBtnRow.className = 'page-btn-row J_pageBtnRow show';
		} else {
			oPageBtnRow.className = 'page-btn-row J_pageBtnRow';
		}
	}

	function trimSpace(str) {
		return str.replace(/\s+/g, '');
	}

	init();
})(document);