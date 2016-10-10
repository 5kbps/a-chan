<!DOCTYPE HTML>
<html>
<head>
	<title>{%KU_NAME}</title>
	<meta charset="utf-8"></meta>
	<link rel="shortcut icon" href="{%KU_WEBPATH}/favicon.ico" />
	<link rel="stylesheet" id="styleman" type="text/css" href="/static/style.php" />
	<script type="text/javascript" src="/static/js/sugar.js"></script>
	<script type="text/javascript" src="/static/js/func.js"></script>
	<script type="text/javascript" src="/static/js/config.js"></script>
	<script type="text/javascript" src="/static/js/gettext.js"></script>
	<script>document.addEventListener("DOMContentLoaded", function(){ loadSettings();translateUI(); });</script>
</head>
<body>
	<h1 class="gt">Ошибка!</h1>
	<br />
	<h2 class="gt">
		{$errormsg}
	</h2>
	{$errormsgext}
</body>
</html>
