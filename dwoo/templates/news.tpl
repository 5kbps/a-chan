<!DOCTYPE html>
<html>
<head>
	<title>{$dwoo.const.KU_NAME}</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="description" content="Asylum. Autism. Anonymity.">
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="stylesheet" id="styleman" type="text/css" href="/static/style.php">
	<script type="text/javascript" src="/static/js/min/main.min.js"></script>
</head>
<body>
	<br><br><br>
	<div style="text-align:center;">
		<div id="logo-main" class="logo-image"></div>
		<p style="font-weight: normal; font-size: medium;">
			Asylum. Autism. Anonymity.
		</p>
		<div style="font-size: 1.5em;">
			{foreach $boards section}
			[{foreach $section board}
			<a href="/{$board.name}/" title="{$board.desc}">/{$board.name}/</a>
			{/foreach}]&nbsp;
			{/foreach}
		</div>
	</div>
</body>
</html>
