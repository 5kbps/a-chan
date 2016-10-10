<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		<title>Вы забанены!</title>
		<noscript>
		<link rel="stylesheet" type="text/css" href="/static/style.php?noscript" />
		</noscript>
		<link rel="stylesheet" type="text/css" id="styleman" href="/static/style.php">
		<style>
			body { margin: 0 auto; padding: 8px; max-width: 1000px; }
			input{
				vertical-align: middle;
				display: inline-block;
				outline: 0;
			}
			.help-toggle{
				cursor: pointer;
			}
			.help{
				margin-left: 30px;
			}
			.wb-item{
				display: block;
			}
			input[type="checkbox"]{
				opacity: 1 !important;
			}
		</style>
	</head>
<body>
<div style="margin: 3em;">
	<h2>&nbsp;{t}Вы забанены{/t}!</h2>
	<img src="{%KU_BOARDSPATH}/youarebanned.jpg" title="donmai">
	<br>
	<br>
	<br>
	<br>
	{foreach name=bans item=ban from=$bans}
		{if not $.foreach.bans.first}
			{t}Также{/t},
		{/if}
		{if $ban.expired eq 1}
			{t}До этого вы были забанены в{/t}
		{else}
			{t}Вы забанены в{/t}
		{/if} 
		<strong>{if $ban.globalban eq 1}{t}All boards{/t}{else}/{implode('/</strong>, <strong>/', explode('|', $ban.boards))}/{/if}</strong> по следующей причине:<br /><br />
		<strong>{$ban.reason}</strong><br /><br />
		Бан был добавлен <strong>{$ban.at|date_format:"%B %e, %Y, %I:%M %P %Z"}</strong>, {t}and{/t}
		{if $ban.expired eq 1}
			{t}expired on{/t} <strong>{$ban.until|date_format:"%B %e, %Y, %I:%M %P"}</strong><br  />
			<strong style="color: green">(Бан уже истёк. Это сообщение только для уведомления.)</strong>
		{else}
			{if $ban.until > 0}истечёт <strong>{$ban.until|date_format:"%B %e, %Y, %I:%M %P"}</strong>{else}не имеет срока давности.</strong>{/if}
		{/if}
		<br /><br />
		{if %KU_APPEAL neq '' && $ban.expired eq 0}
			{if $ban.appealat eq 0}
				{t}You may <strong>not</strong> appeal this ban.{/t}
			{elseif $ban.appealat eq -1}
				{t}Your appeal is currently pending review.{/t}
				{t}For reference, your appeal message is{/t}:<br />
				<strong>{$ban.appeal}</strong>
			{elseif $ban.appealat eq -2}
				{t}Your appeal was reviewed and denied. You may <strong>not</strong> appeal this ban again.{/t}
				{t}For reference, your appeal message was{/t}:<br />
				<strong>{$ban.appeal}</strong>
			{else}
				{if $ban.appealat < $.now}
					{t}You may now appeal this ban.{/t}
					<br /><br />
					<form action="{%KU_BOARDSPATH}/banned.php" method="post">
						<input type="hidden" name="banid" value="{$ban.id}" />
						<label for="appealmessage">{t}Appeal Message{/t}:</label>
						<br />
						<textarea name="appealmessage" rows="10" cols="50"></textarea>
						<br /><input type="submit" value="{t}Send Appeal{/t}" />
					</form>
				{else}
					{t}You may appeal this ban in{/t} <strong>{$ban.appealin}</strong>.
				{/if}
			{/if}
			<br />
		{/if}
		{* 
		{if $.foreach.bans.last}
			<br />{t}Your IP address is{/t} <strong>{$.server.REMOTE_ADDR}</strong>.<br /><br />
		{/if} *}
		{if count($bans) > 1 && not $.foreach.bans.last}
			<hr />
		{/if}

	{/foreach}
	<p>Пожалуйста, прочитайте <a href="/faq#rules">правила</a>. Вы также можете воспользоваться <a href="/faq#tor">зеркалом в Tor.</a></p>
</div>
</body>
</html>
