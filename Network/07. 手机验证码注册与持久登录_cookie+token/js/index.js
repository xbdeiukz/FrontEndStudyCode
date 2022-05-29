var main = (function (doc, loginAction, regAction) {
	var oOpenLoginBtn = doc.getElementsByClassName('js_openLoginBtn')[0],
		oOpenRegBtn = doc.getElementsByClassName('js_openRegBtn')[0],
		oLoginBox = doc.getElementsByClassName('login-box')[0],
		oRegBox = doc.getElementsByClassName('reg-box')[0],
		oCloseLoginBtn = oLoginBox.getElementsByClassName('js_closeBtn')[0],
		oLoginBtn = oLoginBox.getElementsByClassName('js_loginBtn')[0],
		oCloseRegBtn = oRegBox.getElementsByClassName('js_closeBtn')[0],
		oSendCodeBtn = oRegBox.getElementsByClassName('js_sendCodeBtn')[0],
		oCodeImg = oRegBox.getElementsByClassName('js_codeImg')[0],
		oRegBtn = oRegBox.getElementsByClassName('js_regBtn')[0];


	function bindEvent() {
		oOpenLoginBtn.addEventListener('click', loginAction.showLoginBoard.bind(null, true));
		oCloseLoginBtn.addEventListener('click', loginAction.showLoginBoard.bind(null, false));
		oLoginBtn.addEventListener('click', loginAction.loginCheck.bind(loginAction));

		oOpenRegBtn.addEventListener('click', regAction.showRegBoard.bind(null, true));
		oCloseRegBtn.addEventListener('click', regAction.showRegBoard.bind(null, false));
		oCodeImg.addEventListener('click', regAction.refreshImgVerifyCode);
		oSendCodeBtn.addEventListener('click', regAction.getTelVerifyCode);
		oRegBtn.addEventListener('click', regAction.register.bind(regAction));
	}


	return {
		init: function () {
			bindEvent();
			loginAction.checkAuth();
		},
		renderUserArea: loginAction.renderUserArea
	}

})(document, loginAction, regAction);