<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<title>{%KU_NAME} Navigation</title>
	<link rel="stylesheet" id="styleman" type="text/css" href="/static/style.php?menu=1">
	<link rel="shortcut icon" href="/favicon.ico" />
	<script type="text/javascript" src="/static/js/min/menu.min.js"></script>
	<base target="main" />
</head>
<body>
	<h1>{%KU_NAME}</h1>
	<ul>
		<li>
			<a href="/" target="_top">Убрать фрейм</a>
		</li>
	</ul>
	{if empty($boards)}
		<ul>
			<li>Список борд пуст</li>
		</ul>
	{else}
		{foreach name=sections item=sect from=$boards}
			{if %KU_MENUTYPE eq 'normal'}
				<h2>
			{else}
				<h2 style="display: inline;"><br />
			{/if}
			{$sect.name}</h2>
			{if %KU_MENUTYPE eq 'normal'}
				<div id="{$sect.abbreviation}"{if $sect.hidden eq 1} style="display: none;"{/if}>
			{/if}
			<ul>
			{if count($sect.boards) > 0}
				{foreach name=brds item=brd from=$sect.boards}
					<li>
						<a href="/{$brd.name}/" id="sm_{$brd.name}" class="boardlink{if $brd.trial eq 1} trial{/if}{if $brd.popular eq 1} pop{/if}">
							/{$brd.name}/ - {$brd.desc}
						</a>
					</li>
				{/foreach}
			{else}
				<li>{t}No visible boards{/t}</li>
			{/if}
			</ul>
			{if %KU_MENUTYPE eq 'normal'}
				</div>
			{/if}
		{/foreach}
	{/if}
</body>
</html>
