{if $replythread > 0}
	<title>/{$board.name}/ - Тред №<!sm_threadid> - {$board.desc}</title>
{else}
	<title>/{$board.name}/ - {$board.desc}</title>
{/if}
<link rel="stylesheet" id="styleman" type="text/css" href="/static/style.php" />
<noscript>
<link rel="stylesheet" type="text/css" href="/static/style.php?noscript" />
</noscript>
<script type="text/javascript" src="/static/js/min/boardpage.min.js"></script>
<script type="text/javascript">
	config.boardNames = {literal}{}{/literal}
	config.boards = []
	{foreach name=sections item=sect from=$boardlist}
	{foreach name=brds item=brd from=$sect}
	config.boardNames['{$brd.name}'] = "{$brd.desc}";
	config.boards.push('{$brd.name}');
	{/foreach}
	{/foreach}
	config.ku_boardspath = '{%KU_BOARDSPATH}';
	config.ku_cgipath = '{%KU_CGIPATH}';
	{if $replythread > 0}
	config.ispage = false;
	config.thread = <!sm_threadid>;
	{else}
	config.ispage = true;
	config.thread = 0;
	{/if}
	config.board = '{$board.name}';
</script>
</head>
<body>
	<div id="posts-container"></div>
	<div id="content-container">
		<div class="navigation">
			<span class="board-list">
				{if %KU_GENERATEBOARDLIST}
					{foreach name=sections item=sect from=$boardlist}
						[
						{foreach name=brds item=brd from=$sect}
							<a title="{$brd.desc}" class="board-link-{$brd.name}" href="{%KU_BOARDSFOLDER}{$brd.name}/">{$brd.name}</a>{if $.foreach.brds.last}{else} / {/if}
						{/foreach}
						]
					{/foreach}
				{else}
					{if is_file($boardlist)}
						{include $boardlist}
					{/if}
				{/if}
			</span>
			<span class="board-links">
				[ <a target="_blank" href="/faq">FAQ</a> ] [ <a href="/settings" target="_blank">Настройки</a> ] [ <a href="/frame" target="_top">Фрейм</a> ]
			</span>
		</div>
		<div class="logo">
			<div id="logo-container">
				<a href="../" id="logo-link">
					<div id="logo-image-top" class="logo-image"></div>
				</a>
			</div>
			<div class="boardname">/{$board.name}/ - {$board.desc}</div>
			{if $board.name eq 'cu'}
				<div style="text-align:center;font-size:16px;margin-bottom:10px;">
					<a href="/bo">/bo/</a> ◦ <a href="/mov">/mov/</a> ◦ <a href="/mu">/mu/</a>
				</div>
			{/if}
		</div>
