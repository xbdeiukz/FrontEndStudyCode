; (function (node) {
	var TodoList = function () {
		var _self = this;

		this.defaultConfig = {
			plusBtn: '',
			inputWrap: '',
			addBtn: '',
			todoList: '',
			todoItem: ''
		}

		this.checkConfig();
		this.setConfig();

		this.isShowing = false;
		this.isModifying = false;
		this.curIndex = null;

		addEvent(this.plusBtn, 'click', function () {
			_self.inputToggle();
		});

		addEvent(this.addBtn, 'click', function () {
			_self.itemSubmit();
		});

		addEvent(this.todoList, 'click', function (e) {
			_self.itemClick(e);
		});

		addEvent(this.textInput, 'keyup', function(e) {
			var e = e || window.event;
			if(e.keyCode === 13) {
				_self.addBtn.click();
			}
		})
	}


	TodoList.prototype = {
		getConfig: function() {
			return JSON.parse(node.getAttribute('data-config'));
		},
		checkConfig: function () {
			var cfg = this.getConfig();
			for (var key in this.defaultConfig) {
				if (!cfg.hasOwnProperty(key)) {
					console.log(errorInfo(key));
				}
			}
		},
		setConfig: function () {
			var cfg = this.getConfig();

			this.plusBtn = node.getElementsByClassName(cfg.plusBtn)[0];
			this.inputWrap = node.getElementsByClassName(cfg.inputWrap)[0];
			this.textInput = this.inputWrap.getElementsByClassName('text-input')[0];
			this.addBtn = this.inputWrap.getElementsByClassName(cfg.addBtn)[0];
			this.todoList = node.getElementsByClassName(cfg.todoList)[0];
			this.itemClass = cfg.todoItem;
		},
		inputToggle: function () {
			if (this.isShowing) {
				inputSwitch.call(this, 'off');
			} else {
				inputSwitch.call(this, 'on');
			}
		},
		itemSubmit: function () {
			var iptVal = this.textInput.value,
				todoItems = node.getElementsByClassName(this.itemClass),
				itemLen = todoItems.length,
				text,
				oLi;

			if (!iptVal.length) {
				return;
			}

			for (var i = 0; i < itemLen; i++) {
				text = todoItems[i].elemChildren()[0].innerText;
				if (iptVal === text) {
					alert('项目已存在！');
					if (this.isModifying) {
						inputSwitch.call(this, 'off');
						return;
					} else {
						return;
					}
				}
			}

			if (this.isModifying) {
				todoItems[this.curIndex].elemChildren()[0].innerText = this.textInput.value;
				inputSwitch.call(this, 'off');
			} else {
				oLi = document.createElement('li');
				oLi.className = this.itemClass;
				oLi.innerHTML = itemTpl(iptVal);
				this.todoList.appendChild(oLi);
				this.textInput.value = '';
			}
		},
		itemClick: function (e) {
			var e = e || window.event,
				tar = e.target || e.srcElement,
				_self = this,
				className = tar.className,
				todoItems = this.todoList.elemChildren(),
				curItem = tar.elemParent(2);

			this.curIndex = Array.prototype.indexOf.call(todoItems, curItem);

			if (className.indexOf('edit-btn') !== -1) {
				setInputState.call(this, 'modify');
				inputSwitch.call(this, 'on');
				itemOriginStyle.call(this);
				curItem.className += ' active';
				this.textInput.value = todoItems[this.curIndex].innerText;
			} else if (className.indexOf('remove-btn') !== -1) {
				itemOriginStyle.call(this);
				curItem.className += ' active';
				setTimeout(function () {
					var bool = window.confirm('确定要删除吗？');
					if (bool) {
						tar.elemParent(2).remove();
					}
					inputSwitch.call(_self, 'off');
				}, 0);
			}
		}
	}


	function itemOriginStyle() {
		var todoItems = this.todoList.elemChildren(),
			len = todoItems.length;

		for (var i = 0; i < len; i++) {
			todoItems[i].className = this.itemClass;
		}
	}

	function itemTpl(text) {
		return (
			'<p class="item-content">' + text + '</p>' +
			'<div class="btn-group">' +
			'<a href="javascript:;" class="edit-btn fa fa-edit"></a>' +
			'<a href="javascript:;" class="remove-btn fa fa-times"></a>' +
			'</div>'
		)
	}

	function setInputState(action) {
		if (action === 'create') {
			this.textInput.value = '';
			this.textInput.placeholder = '请输入待办事项';
			this.addBtn.innerText = '添加计划';
			this.isModifying = false;
		} else if (action === 'modify') {
			this.textInput.placeholder = '请修改待办事项';
			this.addBtn.innerText = '修改计划';
			this.isModifying = true;
		}
	}

	function inputSwitch(state) {
		var listWrap  = this.todoList.parentNode;

		if (state === 'on') {
			this.inputWrap.style.display = 'block';
			listWrap.style.top = '84px';
			listWrap.style.height = '416px';
			if (!this.isShowing && this.isModifying) {
				if (this.curIndex === 1) {
					listWrap.scrollBy(0, 32);
				} else if (this.curIndex > 1) {
					listWrap.scrollBy(0, 40);
				}
			}
			this.isShowing = true;
		} else if (state === 'off') {
			this.inputWrap.style.display = 'none';
			listWrap.style.top = '44px';
			listWrap.style.height = '456px';
			if (listWrap.scrollHeight > listWrap.scrollTop + listWrap.clientHeight) {
				listWrap.scrollBy(0, -40);
			}
			setInputState.call(this, 'create');
			itemOriginStyle.call(this);
			this.isShowing = false;
		}
	}

	function errorInfo(key) {
		return new Error(
			'缺少配置项：' + key + '\n' +
			'必须配置以下参数：\n' +
			'1.显示隐藏输入框的按钮元素的类名：plusBtn\n' +
			'2.输入框区域的元素的类名：inputWrap\n' +
			'3.添加待办事项的按钮元素的类名：addBtn\n' +
			'4.待办事项列表元素的类名：todoList\n' +
			'5.待办事项元素的类名：todoItem'
		)
	}
	new TodoList();
})(document.getElementsByClassName('wrap')[0]);