<?php

$ident_code = md5(md5($_POST['username']) . 'JS++');
$password = md5(md5($_POST['password']) . 'JS++');
$token = get_random(32);


setcookie('auth', $ident_code . ':' . $token, time() + 30 * 24 * 60 * 60, '/');

echo json_encode(
  [
    'ident_code' => $ident_code,
    'password' => $password,
    'token' => $token,
    'auth' => $ident_code . ':' . $token
  ]
);

function get_random($len) {
	$chars_array = array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", );
	$charsLen = count($chars_array) - 1;
	$outputstr = "";
	for ($i = 0; $i < $len; $i++) {
		$outputstr .= $chars_array[mt_rand(0, $charsLen)];
	}
	return $outputstr;
}