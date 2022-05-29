<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>result</title>
</head>
<body>
	<?php
		if (isset($_POST['code'])) {
			$code = $_POST['code'];
		} else {
			$code = 'document.write("欢迎使用在线代码编辑器！")';
		}
	?>

	<script>
		<?php
			echo $code;
		?>
	</script>
</body>
</html>