/*
*	小说自动阅读器插件
*	配置项：
*	1.backTopBtn：回调顶部按钮；
*	2.playBtn：播放暂停按钮（自动滚动与暂停）
*/

; (function () {
	var wHeight = docViewportSize().height,
		sHeight = docScrollSize().height,
		isPlaying = false,
		timer;

	function AutoReader(opt) {
		this.backTopBtn = opt.backTopBtn;
		this.playBtn = opt.playBtn;
		if (!this.backTopBtn || !this.playBtn) {
			alert('缺少配置项！功能无法实现！');
			return;
		}

		var _self = this;

		addEvent(window, 'scroll', function () {
			_self.btnDisplayToggle();
		});

		addEvent(this.backTopBtn, 'click', function () {
			window.scroll(0, 0);
			clearInterval(timer);
			isPlaying = false;
			_self.playBtn.className = 'play-control manual-scroll';
		});

		addEvent(this.playBtn, 'click', function () {
			_self.setAutoPlay.call(this);
		})
	}

	AutoReader.prototype = {
		btnDisplayToggle: function () {
			var scrollTop = docScrollOffset().top;
			this.backTopBtn.style.display = scrollTop ? 'block' : 'none';
		},
		setAutoPlay: function () {
			var sTop = docScrollOffset().top,
				_self = this;
			
			if (sTop + wHeight >= sHeight) {
				return;
			}
			
			if (!isPlaying) {
				isPlaying = true;
				this.className = 'play-control auto-scroll';
				timer = setInterval(function () {
					window.scrollBy(0, 1);
					sTop = docScrollOffset().top;
					if (sTop + wHeight >= sHeight) {
						clearInterval(timer);
						isPlaying = false;
						_self.className = 'play-control manual-scroll';
					}
				}, 10);
			} else {
				isPlaying = false;
				clearInterval(timer);
				this.className = 'play-control manual-scroll';
			}
		}
	}

	window.AutoReader = AutoReader;
}())