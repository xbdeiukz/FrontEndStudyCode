// 所需配置项：
// 1. 外层盒子（oWrap）；2.列数(column)；3.间隔(gap)；4.图片标题高度（可选）

; (function (doc) {
	var Waterfall = function (wrapper, opt) {
		this.oWrap = doc.getElementsByClassName(wrapper)[0];
		this.imgAPI = opt.imgAPI;
		this.column = opt.column;
		this.gap = opt.gap;
		this.titleHeight = opt.titleHeight || 0,
			this.itemWidth = (this.oWrap.offsetWidth - (this.column - 1) * this.gap) / this.column;
		this.pageNum = 0;
		this.pageCount = 0;
		this.heightArr = [];
	}

	Waterfall.prototype = {
		init: function () {
			this.bindEvent();
			this.getImgData(this.pageNum);
		},

		bindEvent: function () {
			window.addEventListener('scroll', this.scrollToBottom.bind(this));
		},

		scrollToBottom: function () {
			if (getScrollOffset().top + getViewportSize().height >= getScrollSize().height) {
				if (this.pageNum < this.pageCount) {
					this.pageNum++;
					if (this.pageNum != this.pageCount) {
						this.getImgData(this.pageNum);
					} else {
						alert('没有更多图片！');
					}
				}
			}
		},

		getImgData: function (pageNum) {
			var _self = this;

			xhr.ajax({
				url: this.imgAPI,
				type: 'POST',
				dataType: 'JSON',
				data: {
					pageNum: pageNum,
				},
				success: function (data) {
					if (data != 'NO DATA') {	// pageNum小于3时，才能返回数据；
						var pageData = JSON.parse(data.pageData);

						_self.pageCount = parseInt(data.pageSize);
						_self.renderList(pageData);
					}
				}
			});
		},

		renderList: function (data) {
			// console.log(data);
			var oFrag = doc.createDocumentFragment(),
				imgArr = [];
			data.forEach(function (item, index) {
				var oItem = doc.createElement('div'),
					oImg = new Image(),
					oTitle = doc.createElement('div'),
					itemWidth = this.itemWidth,
					itemHeight = itemWidth * item.height / item.width + this.titleHeight;

				oImg.src = item.img;
				oTitle.innerHTML = '<p>图片标题</p>';
				oTitle.className = 'wf-title';
				oItem.className = 'wf-item';
				oItem.style.width = itemWidth + 'px';
				oItem.style.height = itemHeight + 'px';

				oItem.appendChild(oImg);
				oItem.appendChild(oTitle);
				oFrag.appendChild(oItem);
				this.setImgPos(oItem, itemHeight, index);

				imgArr.push(oImg);
			}, this);	// 回调函数内部this默认指向window；可通过forEach的第二个参数改变this指向；
			this.oWrap.appendChild(oFrag);

			setTimeout(function () {	// 图片淡入
				var len = imgArr.length;
				for (var i = 0; i < len; i++) {
					imgArr[i].style.opacity = '1';
				}
			});
		},

		setImgPos: function (elem, elemHeight, index) {
			var posIdx = -1;

			if (index < this.column && this.pageNum == 0) {
				elem.style.top = '0';
				elem.style.left = index * (this.itemWidth + this.gap) + 'px';
				this.heightArr.push(elemHeight + this.gap);
			} else {
				posIdx = this.getIdxOfMin(this.heightArr);
				elem.style.top = this.heightArr[posIdx] + 'px';
				elem.style.left = posIdx * (this.itemWidth + this.gap) + 'px';
				this.heightArr[posIdx] += elemHeight + this.gap;
			}
		},

		getIdxOfMin: function (numArr) {
			var min = Math.min.apply(null, numArr);
			return numArr.indexOf(min);
		}
	}

	window.Waterfall = Waterfall;
})(document);