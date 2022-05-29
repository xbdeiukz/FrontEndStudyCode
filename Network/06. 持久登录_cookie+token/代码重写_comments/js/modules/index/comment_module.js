var initCommentModule = (function (doc, initPages) {
	var oCommentEditBoard = doc.getElementsByClassName('J_commentEditBoard')[0],
		oStars = doc.getElementsByClassName('J_hoverStar'),
		oStarTip = doc.getElementsByClassName('J_starTip')[0],
		oTxtCount = doc.getElementsByClassName('J_txtCount')[0],
		oSubmitBtn = doc.getElementsByClassName('J_submitBtn')[0],
		oEditTxt = doc.getElementsByClassName('J_editTxt')[0],
		oRadioTabs = doc.getElementsByClassName('tab-radio'),
		oStatisticsNum = doc.getElementsByClassName('J_statisticsNum')[0],
		oLoading = doc.getElementsByClassName('J_loading')[0],
		oCommentList = doc.getElementsByClassName('J_commentList')[0],
		oWarningTip = doc.getElementById('J_warningTip').innerHTML,
		commentTpl = doc.getElementById('J_itemTpl').innerHTML,
		addCommentTpl = doc.getElementById('J_addCommentTpl').innerHTML,
		oPageBtnBox = doc.getElementsByClassName('J_btnBox')[0],
		starNum = 5,
		timer = null,
		delayTime = 300,
		fieldId = 0,
		pageCount = 0,
		curPage = 1;

	var APIs = {
		submitComment: 'http://localhost/api_for_study/index.php/Comment/submitComment',
		getComments: 'http://localhost/api_for_study/index.php/Comment/getComments'
	}

	return {
		openBoard: function () {
			oCommentEditBoard.style.display = 'block';
		},

		closeBoard: function () {
			// oCommentEditBoard.style.display = 'none';
			this.restoreBoardStatus();
		},

		starsHover: function (event) {
			var e = event || window.event,
				tar = e.target || e.srcElement,
				tarTag = tar.tagName.toLowerCase();

			if (tarTag === 'i') {
				var tarIdx = [].indexOf.call(oStars, tar),
					len = oStars.length;

				for (var i = 0; i < len; i++) {
					i <= tarIdx ? oStars[i].className += ' active'
						: oStars[i].className = 'fa fa-star J_hoverStar';
				}

				oStarTip.innerText = oStars[tarIdx].getAttribute('data-title');
				starNum = tar.getAttribute('data-count');
			}
		},

		textInput: function () {
			var val = trimSpace(oEditTxt.value),
				len = val.length;

			oTxtCount.innerText = len;

			if (len >= 15 && len <= 1000) {
				this.setSubmitBtnStatus({
					isDisabled: false,
					isLoading: false
				});
			} else {
				this.setSubmitBtnStatus({
					isDisabled: true,
					isLoading: false
				});
			}
		},

		submitComment: function (userId) {
			var _self = this,
				val = oEditTxt.value,
				len = trimSpace(val).length;

			if (len >= 15 && len <= 1000) {
				xhr.ajax({
					url: APIs.submitComment,
					type: 'POST',
					data: {
						userId: userId,
						starNum: starNum,
						comment: val
					},
					success: function (resData) {
						// console.log('submitRes', resData);
						var errorCode = resData.error_code,
							numArr = resData.num,
							data = resData.res,
							oFisrtCommentItem = oCommentList.getElementsByClassName('comment-item')[0];

						_self.setSubmitBtnStatus({
							isLoading: true,
							isDisabled: true
						});

						timer = setTimeout(function () {
							_self.setSubmitBtnStatus({
								isLoading: false,
								isDisabled: false
							});
							clearTimeout(timer);
							if (errorCode === '10010') {
								alert('您已对该课程做过评价！');
								_self.restoreBoardStatus();
								return;
							}
							_self.restoreBoardStatus();
							_self.setTabCommentNum(numArr);

							if (data.is_add_comment == '0') {	// '0'表示评论
								var newCommentItem = _self.renderCommentItem(data);
								if (oFisrtCommentItem) {
									oCommentList.insertBefore(newCommentItem, oFisrtCommentItem);
								} else {
									oCommentList.innerHTML = '',
										oCommentList.appendChild(newCommentItem);
								}
							} else if (data.is_add_comment == '1') {	// '1'表示追加评论
								_self.appendAddComment(data);
							}
						}, delayTime);
					},
					error: function () {
						alert('提交评论失败，请重试！');
					}
				});
			}
		},

		restoreBoardStatus: function () {
			var len = oStars.length;
			for (var i = 0; i < len; i++) {
				var starItem = oStars[i];
				if (starItem.className.indexOf('active') === -1) {
					starItem.className += ' active';
				}
			}
			oStarTip.innerHTML = oStars[len - 1].getAttribute('data-title');
			starNum = oStars[len - 1].getAttribute('data-count');
			oEditTxt.value = '';
			oTxtCount.innerText = 0;
			this.setSubmitBtnStatus({
				isLoading: false,
				isDisabled: true
			});
			oCommentEditBoard.style.display = 'none';
		},

		setSubmitBtnStatus: function (opt) {
			var isDisabled = opt.isDisabled,
				isLoading = opt.isLoading;

			if (isLoading) {
				oSubmitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
			} else {
				oSubmitBtn.innerHTML = '提交评论';
			}

			if (isDisabled) {
				oSubmitBtn.setAttribute('disabled', 'disabled');
				oSubmitBtn.className = "comment-btn submit J_submitBtn disabled";
			} else {
				oSubmitBtn.removeAttribute('disabled');
				oSubmitBtn.className = "comment-btn submit J_submitBtn";
			}
		},

		setTabCommentNum: function (arr) {
			var oRadioCount = null;
			arr.forEach(function (item, idx) {
				oRadioCount = oRadioTabs[idx].getElementsByClassName('radio-count')[0];
				oRadioCount.innerHTML = item;
			});
			oStatisticsNum.innerText = parseInt(arr[0]) ? Math.ceil(arr[1] / arr[0] * 100) + '%' : '-';
		},

		radioTabClick: function (event) {
			var e = event || window.event,
				tar = e.target || e.srcElement,
				className = tar.className;

			if (className == 'radio-txt' || className == 'radio-icon') {
				var len = oRadioTabs.length,
					oTarItem = tar.parentNode;

				for (var i = 0; i < len; i++) {
					oRadioTabs[i].className = 'tab-radio';
				}
				oTarItem.className += ' cur';

				fieldId = oTarItem.getAttribute('data-id');
				curPage = 1;
				this.getComments({
					fieldId: fieldId,
					pageNum: curPage - 1
				});
			}
		},

		getComments: function (opt) {
			var _self = this,
				fieldId = opt.fieldId,
				pageNum = opt.pageNum;

			xhr.ajax({
				url: APIs.getComments,
				type: 'POST',
				data: {
					field: fieldId,
					page: pageNum
				},
				success: function (resData) {
					var numArr = resData.num,
						data = resData.res,
						len = data.length;

					pageCount = resData.pages;

					// console.log('getRes', resData);

					oLoading.style.display = 'block';
					timer = setTimeout(function () {
						_self.setTabCommentNum(numArr);
						oLoading.style.display = 'none';
						clearTimeout(timer);
						oCommentList.innerHTML = '';

						if (len <= 0) {
							_self.setWarningTip('暂无评论');
							return;
						}

						oCommentList.appendChild(_self.renderCommentList(data));

						if (pageCount > 1) {
							initPages(pageCount, curPage);
						} else {
							oPageBtnBox.innerHTML = '';
						}
					}, delayTime);
				},
				error: function () {
					_self.setWarningTip('获取评论列表失败');
				}
			});
		},

		renderCommentList: function (data) {
			var oFrag = document.createDocumentFragment(),
				_self = this;

			data.forEach(function (item) {
				oFrag.appendChild(_self.renderCommentItem(item));
			});

			return oFrag;
		},

		renderCommentItem: function (data) {
			var oDiv = document.createElement('div'),
				count = 0,
				_self = this,
				starNum = data.star_num,
				dataId = data.id,
				addComment = data.add_comment;

			oDiv.className = 'comment-item';
			oDiv.setAttribute('data-id', dataId);
			oDiv.innerHTML = commentTpl.replace(/{{(.*?)}}/igm, function (node, key) {
				key === 'isActive' && count++;
				return {
					avatar: data.avatar,
					nickname: data.nickname,
					comment: data.comment,
					isActive: starNum >= count ? 'active' : '',
					uptime: _self.getTimeInfo(data.uptime)
				}[key];
			});

			if (addComment) {
				oDiv.innerHTML += addCommentTpl.replace(/{{(.*?)}}/igm, function (node, key) {
					return {
						comment: addComment.comment,
						uptime: _self.getTimeInfo(addComment.uptime)
					}[key];
				});
			}
			return oDiv;
		},

		appendAddComment: function (data) {
			var oComnentItems = oCommentList.getElementsByClassName('comment-item'),
				len = oComnentItems.length,
				_self = this;

			for (var i = 0; i < len; i++) {
				var commentItem = oComnentItems[i],
					dataId = commentItem.getAttribute('data-id');

				if (dataId === data.add_id) {
					commentItem.innerHTML += addCommentTpl.replace(/{{(.*?)}}/igm, function (node, key) {
						return {
							comment: data.comment,
							uptime: _self.getTimeInfo(data.uptime)
						}[key];
					});
				}
			}
		},

		getTimeInfo: function (timeStamp, type) {
			var len = timeStamp.toString().length;

			if (len < 13) {
				timeStamp *= 1000;	// 时间戳如果为秒，则转换为毫秒；
			}

			var oDt = new Date(timeStamp),
				y = formatTime(oDt.getFullYear()),
				m = formatTime(oDt.getMonth() + 1),
				d = formatTime(oDt.getDate()),
				h = formatTime(oDt.getHours()),
				i = formatTime(oDt.getMinutes()),
				s = formatTime(oDt.getSeconds());

			switch (type) {
				case 'date':
					return y + '-' + m + '-' + d;
				case 'time':
					return h + '-' + i + '-' + s;
				default:
					return y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
			}

			function formatTime(num) {
				return num < 10 ? '0' + num : num;
			}

		},

		setWarningTip: function (text) {
			oCommentList.innerHTML = oWarningTip.replace(/{{.*?}}/gim, text);
		},

		pageBtnClick: function (event) {
			var e = event || window.event,
				tar = e.target || e.srcElement,
				type = tar.getAttribute('data-page-type');

			if (type) {
				switch (type) {
					case 'button':
						curPage = parseInt(tar.getAttribute('data-page'));
						break;
					case 'prev':
						curPage--;
						break;
					case 'next':
						curPage++;
						break;
				}

				this.getComments({
					fieldId: fieldId,
					pageNum: curPage - 1
				});
			}
		}
	}
})(document, initPages);

function initPages(pageCount, curPage) {
	var oPageWrap = document.getElementsByClassName('J_btnBox')[0];

	setPages(pageCount, curPage);

	function setPages(pageCount, curPage) {	// pageCount：总页数；curPage：当前页码；
		var pagesStr = pageItemTpl('prev');

		if (pageCount > 7) {
			if (curPage < 3) {
				setPageBtns(1, 3);
				pagesStr += pageItemTpl('ellipsis');
				setPageBtns(pageCount - 1, pageCount);
			} else if (curPage >= 3 && curPage < 5) {
				setPageBtns(1, curPage + 1);
				pagesStr += pageItemTpl('ellipsis');
				setPageBtns(pageCount - 1, pageCount);
			} else if (curPage >= 5 && curPage < pageCount - 3) {
				setPageBtns(1, 2);
				pagesStr += pageItemTpl('ellipsis');
				setPageBtns(curPage - 1, curPage + 1);
				pagesStr += pageItemTpl('ellipsis');
				setPageBtns(pageCount - 1, pageCount);
			} else if (curPage >= pageCount - 3 && curPage <= pageCount - 1) {
				setPageBtns(1, 2);
				pagesStr += pageItemTpl('ellipsis');
				setPageBtns(curPage - 1, pageCount);
			} else if (curPage == pageCount) {
				setPageBtns(1, 2);
				pagesStr += pageItemTpl('ellipsis');
				setPageBtns(pageCount - 2, pageCount);
			}
		} else {
			setPageBtns(1, pageCount);
		}

		pagesStr += pageItemTpl('next');
		oPageWrap.innerHTML = pagesStr;


		function setPageBtns(start, end) {	// 大于等于start，小于等于end；（页码）
			for (var i = start; i <= end; i++) {
				pagesStr += pageItemTpl('button', i);
			}
		}

		function pageItemTpl(itemType, pageNum) { // pageNum：页码；
			switch (itemType) {
				case 'button':
					if (pageNum == curPage) {
						return '<span class="page-btn page-btn-cur">' + pageNum + '</span>';
					} else {
						return '<a href="javascript:;" class="page-btn" data-page-type="button" data-page="' + pageNum + '">' + pageNum + '</a>';
					}
				case 'prev':
					if (curPage == 1) {
						return '<span class="dir-btn prev-btn disabled"><i class="fa fa-angle-left"></i></span>';
					} else {
						return '<a href="javascript:;" class="dir-btn prev-btn" data-page-type="prev"><i class="fa fa-angle-left" data-page-type="prev"></i></a>';
					}
				case 'next':
					if (curPage == pageCount) {
						return '<span class="dir-btn next-btn disabled"><i class="fa fa-angle-right"></i></span>';
					} else {
						return '<a href="javascript:;" class="dir-btn next-btn" data-page-type="next"><i class="fa fa-angle-right" data-page-type="next"></i></a>';
					}
				case 'ellipsis':
					return '<span>...</span>';
			}
		}
	}
};