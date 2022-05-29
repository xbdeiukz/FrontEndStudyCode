; (function (doc) {
	var oModOpenBtn = doc.getElementsByClassName('js-mod-open-btn')[0],
		oModCloseBtn = doc.getElementsByClassName('js-mod-close-btn')[0],
		oModWrap = doc.getElementsByClassName('js-upload-wrap')[0],
		oVideoInput = doc.getElementById('js-video-file'),
		oUploadDetail = oModWrap.getElementsByClassName('js-upload-detail')[0],
		oPercent = oUploadDetail.getElementsByClassName('js-percent')[0],
		oProgressBar = oUploadDetail.getElementsByClassName('js-progress-bar')[0]
		;

	var init = function () {
		bindEvent();
	}

	function bindEvent() {
		oModOpenBtn.addEventListener('click', showModal.bind(null, true));
		oModCloseBtn.addEventListener('click', showModal.bind(null, false));
		oVideoInput.addEventListener('change', fileCheckUpload);
	}

	function showModal(bool) {
		if (bool) {
			oModWrap.className += ' show';
		} else {
			oModWrap.className = 'upload-mod-wrap js-upload-wrap';
			restoreUploadModal();
		}
	}

	function fileCheckUpload() {
		var files = this.files,
			fileLen = files.lengh,
			file = this.files[0],
			fileName = file.name,
			fileSize = file.size,
			maxSize = 10737418240;	// 文件最大不超过1G

		console.log(file);

		if (fileLen < 1) {
			alert('未选择文件！');
			return;
		}

		if (fileLen > 1) {
			alert('一次只可上传一个视频！');
			return;
		}

		// if (!/\.(mp4)$/.test(fileName)) {
		// 	alert('只支持上传.mp4文件');
		// 	return;
		// }

		if (fileSize > maxSize) {
			alert('文件最大不能超过1G！');
		}

		doUpload(file);
	}

	function doUpload(file) {
		var fd = new FormData();

		fd.append('file', file);	// 此处的file字段由后端提供；

		var xhr = window.XMLHttpRequest ?
			new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

		xhr.open('post', 'server/upload.php');

		oUploadDetail.className = 'upload-detail js-upload-detail uploading';

		xhr.upload.onprogress = function (event) {
			var e = event || window.event,
				percent = (e.loaded / e.total * 100).toFixed(1) + '%';

			oPercent.innerHTML = percent;
			oProgressBar.style.width = percent;
		}

		xhr.onload = function () {
			oUploadDetail.className += ' finished';
			oPercent.innerHTML = '0.0%';
		}

		xhr.send(fd);
	}

	function restoreUploadModal() {
		if (oUploadDetail.className.indexOf('select') == -1) {
			location.reload()
		}
	}

	init();
})(document);