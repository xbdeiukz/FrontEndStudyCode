var loginAction = (function (doc) {
	var oLoginModal = doc.getElementsByClassName("js_modal")[0],
		submitURL = doc.getElementById("js_loginForm").action,
		oUsername = doc.getElementById("js_username"),
		oPassword = doc.getElementById("js_password"),
		oErrorTip = doc.getElementsByClassName("js_errorTip")[0],
		oPersistedLogin = doc.getElementById("js_persistedLogin"),
		oLoginStatus = doc.getElementsByClassName('js_loginStatus')[0],
		loginTpl = doc.getElementById('js_loginTpl').innerHTML,
		userTpl = doc.getElementById('js_userTpl').innerHTML;

	return {
		showLoginBoard: function (isShowing) {
			if (isShowing) {
				oLoginModal.className += " show";
			} else {
				oErrorTip.innerHTML = '';
				oUsername.value = '';
				oPassword.value = '';
				oLoginModal.className = "modal-container js_modal";
			}
		},

		loginCheck: function (event) {	// 前端登录验证
			var e = event || window.event;
			e.preventDefault();

			var username = trimSpace(oUsername.value),
				password = trimSpace(oPassword.value),
				uLen = username.length,
				pLen = password.length,
				isPersistedLogin = oPersistedLogin.checked;

			if (uLen < 6 || uLen > 20) {
				oErrorTip.innerText = "用户名长度：6-10位";
				return;
			}

			if (pLen < 6 || pLen > 20) {
				oErrorTip.innerText = "密码长度：6-20位";
				return;
			}

			// console.log("loginCheck: 数据合法，提交后端验证！");

			this.submitForm(username, password, isPersistedLogin);
		},

		submitForm: function (username, password, isPersistedLogin) { // 提交数据登录，验证通过后会在本地设置cookie（auth）,然后重新加载页面。（重新加载页面后会验证cookie（auth）是否正确和是否过期，通过则保持登录）
			xhr.ajax({
				url: submitURL,
				type: "POST",
				dataType: "JSON",
				data: {
					username: username,
					password: password,
					isPersistedLogin: isPersistedLogin
				},
				success: function (data) {
					// console.log('submitFormRes', data);

					var errorCode = data.error_code,
						errorInfo = "";

					switch (errorCode) {
						case "1001":
							errorInfo = "用户名长度不正确！";
							break;
						case "1002":
							errorInfo = "密码长度不正确！";
							break;
						case "1003":
							errorInfo = "该用户名不存在！";
							break;
						case "1004":
							errorInfo = "密码错误！";
							break;
						case "1005":
							errorInfo = "登录失败，请重试！";
							break;
						case "200":
							location.reload();	// 重新加载页面，对auth进行验证（init中进行验证）
							break;
						default:
							break;
					}

					oErrorTip.innerHTML = errorInfo;
				},
			});
		},

		checkAuth: function () {	// 后端验证cookie（auth），通过则保持登录。
			var _self = this;

			cookieManage.get('auth', function (auth) {
				if (auth != undefined) {
					xhr.ajax({
						url: 'http://localhost/api_for_study/index.php/User/checkAuth',
						type: 'POST',
						dataType: 'JSON',
						data: {
							auth: auth
						},
						success: function (data) {
							var errorCode = data.error_code,
								errorInfo = '';

							switch (errorCode) {
								case '1006':
									errorInfo = '登录验证不通过，请重试！';
									_self.showLoginBoard(true);
									_self.render(false);
									break;
								case '1007':
									errorInfo = '登录超时，请重新登录！';
									_self.showLoginBoard(true);
									_self.render(false);
									break;
								case '200':
									errorInfo = '登录验证成功，已登录！';
									_self.render(true);
									break;
								default:
									break;
							}
						},
						error: function () {
							console.log('请重新登录！');
						}
					});
				}
			});
		},

		render: function (isLogin) {
			if (isLogin) {
				cookieManage.get('nickname', function (nickname) {
					oLoginStatus.innerHTML = userTpl.replace(/{{(.*?)}}/g, nickname);
				});
			} else {
				oLoginStatus.innerHTML = loginTpl;
			}
		}
	};
})(document);

; (function (doc, loginAction) {
	var oOpenBtn = doc.getElementsByClassName("js_openBtn")[0],
		oCloseBtn = doc.getElementsByClassName("js_closeBtn")[0];
	oLoginBtn = doc.getElementsByClassName("js_loginBtn")[0];

	var init = function () {
		bindEvent();
		loginAction.checkAuth();
	};

	function bindEvent() {
		oOpenBtn.addEventListener(
			"click",
			loginAction.showLoginBoard.bind(null, true)
		);
		oCloseBtn.addEventListener(
			"click",
			loginAction.showLoginBoard.bind(null, false)
		);
		oLoginBtn.addEventListener(
			"click",
			loginAction.loginCheck.bind(loginAction)
		);
	}

	init();
})(document, loginAction);