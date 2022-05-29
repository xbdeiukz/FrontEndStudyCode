<?php

if(strlen($_POST['username']) < 6 || strlen($_POST['username']) > 20){
	echo '用户名 6-20位';
	return;
}

if(strlen($_POST['password']) < 6 || strlen($_POST['password']) > 20){
	echo '密码 6-20位';
	return;
}

echo '后端校验：输入合法，进入数据正确性校验';