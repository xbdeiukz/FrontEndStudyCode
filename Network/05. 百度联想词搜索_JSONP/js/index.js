;(function(doc, Comment) {
	var oOpenBtn = doc.getElementsByClassName('J_openBtn')[0],
			oCloseBtn = doc.getElementsByClassName('J_closeBtn')[0],
			oStarList = doc.getElementsByClassName('J_stars')[0],
			oEditTxt = doc.getElementsByClassName('J_editTxt')[0],
			oSubmitBtn = doc.getElementsByClassName('J_submitBtn')[0],
			oRadioTabList = doc.getElementsByClassName('J_radioTabs')[0],
			oPageBtnBox = doc.getElementsByClassName('J_btnBox')[0],
			userId = 14;

	var init = function() {
		bindEvent();
		Comment.getComments({
			fieldId: 0,
			pageNum: 0
		});
	};

	function bindEvent() {
		oOpenBtn.addEventListener('click', Comment.openBoard, false);
		oCloseBtn.addEventListener('click', Comment.closeBoard.bind(Comment), false);
		oStarList.addEventListener('mouseover', Comment.starsHover, false);
		oEditTxt.addEventListener('input', Comment.textInput.bind(Comment), false);
		oSubmitBtn.addEventListener('click', Comment.submitComment.bind(Comment, userId), false);
		oRadioTabList.addEventListener('click', Comment.radioTabClick.bind(Comment), false),
		oPageBtnBox.addEventListener('click', Comment.pageBtnClick.bind(Comment), false);
	}

	init();
})(document, initCommentModule);