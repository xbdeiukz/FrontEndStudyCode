var loginAction = (function (doc) {
	var oModal = doc.getElementsByClassName('js_modal')[0],
		oLoginBox = oModal.getElementsByClassName('login-box')[0],
		oErrorTip = oLoginBox.getElementsByClassName('js_errorTip')[0],
		oUsername = doc.getElementById('js_username'),
		oPassword = doc.getElementById('js_password'),
		oPersistedLogin = doc.getElementById('js_persistedLogin'),
		ologinStatus = doc.getElementsByClassName('js_loginStatus')[0],
		userTpl = doc.getElementById('js_userTpl').innerHTML,
		loginTpl = doc.getElementById('js_loginTpl').innerHTML;

	var APIs = {
		login: 'http://localhost/api_for_study/index.php/User/login',
		checkAuth: 'http://localhost/api_for_study/index.php/User/checkAuth'
	},
		tips = {
			'1001': '用户名长度：6-20位',
			'1002': '密码长度：6-20位',
			'1003': '该用户不存在！',
			'1004': '密码错误！',
			'1005': '登录失败，请重试！',
			'1006': 'token不合法（不存在或与ident_code不匹配）',
			'200': '登录成功！'
		};

	return {
		showLoginBoard: function (isShowding) {
			if (isShowding) {
				oModal.className += ' show login';
			} else {
				oErrorTip.innerHTML = '';
				oUsername.value = '';
				oPassword.value = '';
				oModal.className = 'modal-container js_modal';
			}
		},

		loginCheck: function (event) {
			var e = event || window.event;
			e.preventDefault();

			var username = trimSpace(oUsername.value),
				password = trimSpace(oPassword.value),
				isPersistedLogin = oPersistedLogin.checked,
				uLen = username.length,
				pLen = password.length;

			if (uLen < 6 || uLen > 20) {
				oErrorTip.innerHTML = '用户名长度：6-20位';
				return;
			}

			if (pLen < 6 || pLen > 20) {
				oErrorTip.innerHTML = '密码长度：6-20位';
				return;
			}

			console.log("loginCheck: 数据合法，提交后端验证！");

			this.loginSubmit({
				username: username,
				password: password,
				isPersistedLogin: isPersistedLogin
			});
		},

		loginSubmit: function (opt) {
			xhr.ajax({
				url: APIs.login,
				type: 'POST',
				dataType: 'JSON',
				data: {
					username: opt.username,
					password: opt.password,
					isPersistedLogin: opt.isPersistedLogin
				},
				success: function (data) {
					var errorCode = data.error_code,
						errorInfo = '';
					switch (errorCode) {
						case '1001':
							errorInfo = tips['1001'];
							break;
						case '1002':
							errorInfo = tips['1002'];
							break;
						case '1003':
							errorInfo = tips['1003'];
							break;
						case '1004':
							errorInfo = tips['1004'];
							break;
						case '1005':
							errorInfo = tips['1005'];
							break;
						case '200':
							location.reload();
							break;
						default:
							break;
					}
					oErrorTip.innerHTML = errorInfo;
				}
			});
		},

		checkAuth: function () {	// checkAuth可定义在index.js中
			var _self = this;

			cookieManage.get('auth', function (auth) {
				// console.log('auth', auth);
				if (auth) {
					xhr.ajax({
						url: APIs.checkAuth,
						type: 'POST',
						dataType: 'JSON',
						data: {
							auth: auth
						},
						success: function (data) {
							var errorCode = data.error_code;

							switch (errorCode) {
								case '1006':
									oErrorTip.innerHTML = tips['1006'];
									_self.renderUserArea(false);
									break;
								case '1007':
									oErrorTip.innerHTML = tips['1007'];
									_self.renderUserArea(false);
									break;
								case '200':
									_self.renderUserArea(true);
									break;
								default:
									break;
							}
						}
					});
				}
			});
		},

		renderUserArea: function (isLogin) {	// renderUserArea可定义在index.js中
			if (isLogin) {
				cookieManage.get('nickname', function (nickname) {
					ologinStatus.innerHTML = userTpl.replace(/{{(.*?)}}/g, function (node, key) {
						return {
							nickname: nickname
						}[key];
					});
				});
			} else {
				ologinStatus.innerHTML = loginTpl;
			}
		}
	}
})(document);



var regAction = (function (doc) {
	var oModal = doc.getElementsByClassName('js_modal')[0],
		oRegBox = oModal.getElementsByClassName('reg-box')[0],
		oErrorTip = oRegBox.getElementsByClassName('js_errorTip')[0],
		oRegNumber = doc.getElementById('js_rnumber'),
		oRegPassword = doc.getElementById('js_rpassword'),
		oRegTelCode = doc.getElementById('js_rtelcode'),
		oRegPasscode = doc.getElementById('js_rpasscode'),
		oCodeImg = oModal.getElementsByClassName('js_codeImg')[0],
		oSendCodeBtn = oModal.getElementsByClassName('js_sendCodeBtn')[0],

		telCodeBtnDisabled = false,
		timer = null,
		duration = 60,
		sec = 60;

	var APIs = {
		sendTelCode: 'http://localhost/api_for_study/index.php/User/sendTelCode',
		register: 'http://localhost/api_for_study/index.php/User/register'
	}

	function countDown() {
		if (sec > 0) {
			if (sec === duration) {
				oSendCodeBtn.className += ' disabled';
				oSendCodeBtn.disabled = true;
				telCodeBtnDisabled = true;
			}
			sec--;
			oSendCodeBtn.innerText = '重新获取' + '(' + sec + 's' + ')';
		} else {
			clearInterval(timer);
			timer = null;
			sec = duration;
			oSendCodeBtn.className = 'input-btn js_sendCodeBtn';
			oSendCodeBtn.disabled = false;
			telCodeBtnDisabled = false;
			oSendCodeBtn.innerText = '获取验证码';
		}
	}

	function submitRegForm(opt, objRegAction) {
		xhr.ajax({
			url: APIs.register,
			type: 'POST',
			dataType: 'JSON',
			data: {
				pNumber: opt.pNumber,
				password: opt.password,
				telcode: opt.telcode,
				passcode: opt.passcode
			},
			success: function (data) {
				var errorCode = data.error_code,
					errorInfo = '';

				switch (errorCode) {
					case '1002':
						errorInfo = '密码长度：6-20位！';
					case '1008':
						errorInfo = '手机号格式不正确！';
						break;
					case '1009':
						errorInfo = '图片验证码不正确！';
						break;
					case '1010':
						errorInfo = '与接受验证码的手机号不一致！';
						break;
					case '1011':
						errorInfo = '短信验证码不正确！';
						break;
					case '1012':
						errorInfo = '密码长度不正确！';
						break;
					case '1014':
						errorInfo = '注册失败，请重试！';
						break;
					default:
						break;
				}

				oErrorTip.innerText = errorInfo;
				objRegAction.refreshImgVerifyCode();

				if (errorCode == '200') {
					oErrorTip.innerText = '注册成功！';
					setTimeout(function () {
						location.reload();
					}, 300);
				}
			}
		});
	}

	return {
		showRegBoard: function (isShowing) {
			if (isShowing) {
				oModal.className += ' show reg';
			} else {
				oRegNumber.value = '';
				oRegPassword.value = '';
				oRegTelCode.value = '';
				oErrorTip.innerHTML = '';
				oModal.className = 'modal-container js_modal';
			}
		},

		refreshImgVerifyCode: function () {
			var imgSrc = oCodeImg.src,
				index = imgSrc.indexOf('/verify?');

			if (index === -1) {
				imgSrc += '?rand=' + Date.now();
			} else {
				imgSrc = imgSrc.replace(/(\/verify?.*)$/, function () {
					return '/verify?' + Date.now();
				});
			}

			oCodeImg.src = imgSrc;
		},

		getTelVerifyCode: function (event) {
			var e = event || window.event;
			e.preventDefault();

			var pNumber = trimSpace(oRegNumber.value);

			if (pNumber.length !== 11) {
				oErrorTip.innerText = '手机号长度：11位';
				return;
			}

			if (!phoneNumberCheck(pNumber)) {
				oErrorTip.innerText = '手机号格式不正确！';
				return;
			}

			if (!telCodeBtnDisabled) {
				this.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

				xhr.ajax({
					url: APIs.sendTelCode,
					type: 'POST',
					dataType: 'JSON',
					data: {
						pNumber: pNumber
					},
					success: function (data) {
						var errorCode = data.error_code,
							errorInfo = '';

						switch (errorCode) {
							case '1008':
								errorInfo = '手机号格式不正确！';
								break;
							case '1012':
								errorInfo = '该手机号已注册，请登录！';
								oSendCodeBtn.innerText = '获取验证码';
								break;
							case '1013':
								errorInfo = '验证码发送失败！';
								oSendCodeBtn.innerText = '获取验证码';
								break;
							case '200':
								errorInfo = '验证码发送成功！';
								timer = setInterval(countDown, 1000);
								break;
							default:
								errorInfo = '验证码发送失败！';
								oSendCodeBtn.innerText = '获取验证码';
								break;
						}

						oErrorTip.innerText = errorInfo;
					}
				});
			}
		},

		register: function (event) {
			var e = event || window.event;
			e.preventDefault();

			var pNumber = trimSpace(oRegNumber.value),
				password = trimSpace(oRegPassword.value),
				telcode = trimSpace(oRegTelCode.value),
				passcode = trimSpace(oRegPasscode.value);
			
			if (pNumber.length !== 11) {
				oErrorTip.innerText = '手机号长度：11位';
				return;
			}

			if (!phoneNumberCheck(pNumber)) {
				oErrorTip.innerText = '手机号格式不正确！';
				return;
			}

			if (password.length < 6 || password.length > 20) {
				oErrorTip.innerText = '密码长度：6-20位';
				return;
			}

			if (telcode.length !== 6) {
				oErrorTip.innerText = '手机验证码长度：6位';
				return;
			}

			if (digitCheck(telcode)) {
				oErrorTip.innerText = '手机验证码必须为数字！';
				return;
			}

			if (passcode.length !== 4) {
				oErrorTip.innerText = '图片验证码长度：4位';
				return;
			}

			if (alphabetCheck(passcode)) {
				oErrorTip.innerText = '图片验证码必须为字母！'
				return;
			}

			oErrorTip.innerText = '';

			submitRegForm({
				pNumber: pNumber,
				password: password,
				telcode: telcode,
				passcode: passcode
			}, this);
		}
	}
})(document);