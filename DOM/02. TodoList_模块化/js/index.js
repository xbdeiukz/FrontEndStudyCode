;(function () {
	var showInput = document.getElementsByClassName("j-show-input")[0],
		inputWrap = document.getElementsByClassName("input-wrap")[0],
		textInput = document.getElementById("text-input"),
		addBtn = inputWrap.getElementsByClassName("j-add-btn")[0],
		listWrap = document.getElementsByClassName("list-wrap")[0],
		oList = document.getElementsByClassName("todo-list")[0],
		oItems,
		isShowing = false,
		itemIndex,
		btnState = "isAdd";

	addEvent(showInput, "click", function () {
		if (isShowing) {
			inputToggle("close");
			originBgc();
		} else {
			inputToggle("open");
		}
	});

	addEvent(addBtn, "click", function () {
		oItems = document.getElementsByClassName("todo-item");
		var itemLen = oItems.length,
			iptVal = textInput.value,
			iptLen = iptVal.length,
			itemText,
			oLi,
			editBtn,
			removeBtn;

		if (!iptLen) {
			return;
		}

		if (btnState === "isAdd") {
			for (var i = 0; i < itemLen; i++) {
				itemText =
					oItems[i].getElementsByClassName("item-content")[0].innerText;
				if (iptVal === itemText) {
					textInput.value = "";
					alert("不可重复创建！");
					return;
				}
			}

			oLi = document.createElement("li");
			oLi.className = "todo-item";
			oLi.innerHTML = itemTpl(iptVal);
			oList.appendChild(oLi);
			textInput.value = "";
			inputToggle("close");

			editBtn = oLi.getElementsByClassName("edit-btn")[0];
			removeBtn = oLi.getElementsByClassName("remove-btn")[0];

			addEvent(editBtn, "click", function () {
				var oItem = this.parentNode.parentNode;
				oItems = document.getElementsByClassName("todo-item");

				if (!isShowing) {
					inputToggle("open");
				}

				textInput.value = oItem.elemChildren()[0].innerText;
				addBtn.innerText = "修改计划";
				btnState = "modify";

				originBgc();
				oItem.style.backgroundColor = "green";
				oItem.style.color = "#fff";
				itemIndex = Array.prototype.indexOf.call(oItems, oItem);
			});

			addEvent(removeBtn, "click", function () {
				var _self = this;
				originBgc();
				if (textInput.value) {
					textInput.value = "";
					addBtn.innerText = "添加计划";
				}
				this.parentNode.parentNode.style.backgroundColor = "green";
				this.parentNode.parentNode.style.color = "#fff";
				
				setTimeout(function () {
					var bool = window.confirm("确定删除计划吗！");
					if (bool) {
						_self.parentNode.parentNode.remove();
					}
					inputToggle("close");
					originBgc();
				}, 10);
			});
		} else {
			for (var i = 0; i < itemLen; i++) {
				var text =
					oItems[i].getElementsByClassName("item-content")[0].innerText;
				if (iptVal === text) {
					textInput.value = "";
					alert("计划已存在！");
					inputToggle("close");
					return;
				}
			}
			oItems[itemIndex].elemChildren()[0].innerText = textInput.value;
			textInput.value = "";
			addBtn.innerText = "添加计划";
			btnState = "isAdd";
			inputToggle("close");
		}
	});

	// 也可以把 edit-btn 和 remove-btn 的事件通过事件委托注册：
	// addEvent(oList, 'click', function (e) {
	// 	var e = e || window.event,
	// 		target = e.target || e.srcElement,
	// 		oItem = target.parentNode.parentNode,
	// 		indexOf = String.prototype.indexOf;
	// 		className = target.className;

	// 	if (indexOf.call(className, 'edit-btn') !== -1) {
	// 		if (!isShowing) {
	// 			inputToggle('open');
	// 		}
	// 		oItems = document.getElementsByClassName('todo-item');
	// 		itemIndex = Array.prototype.indexOf.call(oItems, oItem);
	// 		textInput.value = oItem.elemChildren()[0].innerText;
	// 		addBtn.innerText = '修改计划';
	// 		btnState = 'modify';
	// 	}
	// });

	function inputToggle(action) {
		if (action === "open") {
			inputWrap.style.display = "block";
			listWrap.style.top = "84px";
			listWrap.style.height = "416px";
		} else if (action === "close") {
			inputWrap.style.display = "none";
			listWrap.style.top = "44px";
			listWrap.style.height = "456px";
			addBtn.innerText = "添加计划";
			textInput.value = "";
			btnState = "isAdd";
		}
		isShowing = !isShowing;
	}

	function originBgc() {
		var oItems = document.getElementsByClassName("todo-item"),
			len = oItems.length;
		for (var i = 0; i < len; i++) {
			oItems[i].style.backgroundColor = "";
			oItems[i].style.color = "";
		}
	}

	function itemTpl(text) {
		// 最笨，但效率最高的方法；
		return (
			'<p class="item-content">' +
			text +
			"</p>" +
			'<div class="btn-group">' +
			'<a href="javascript:;" class="edit-btn fa fa-edit"></a>' +
			'<a href="javascript:;" class="remove-btn fa fa-times"></a>' +
			"</div>"
		);
	}
})();
