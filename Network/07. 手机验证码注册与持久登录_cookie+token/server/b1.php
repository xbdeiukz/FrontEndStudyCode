<?php

echo '用户名：' . $_POST['username'] . '<br />'; 
echo '密码：' . $_POST['password'] . '<br />'; 
echo '介绍：' . $_POST['intro'] . '<br />'; 
echo '性别：' . $_POST['sex'] . '<br />'; 

for($i = 0; $i < count($_POST['hobby']); $i++){
	echo '爱好：' . $_POST['hobby'][$i] . '<br />'; 
}

echo '职业：' . $_POST['occupation'] . '<br />'; 