<!DOCTYPE HTML>
<head>
	<title class="gt">Confirm post sending</title>
	<script type="text/javascript" src="/static/js/min/confirm.min.js"></script>
	<script type="text/javascript">document.addEventListener("DOMContentLoaded", function(){ loadSettings();translateUI(); });</script>
	<link rel="stylesheet" id="styleman" type="text/css" href="/static/style.php" />
	<noscript>
	<link rel="stylesheet" type="text/css" href="/static/style.php?noscript" />
	</noscript>
</head>
<body>
	<div id="content-container">
		<div class="navbar">
			<span class="board-links">
				[ <a target="_blank" href="/faq.html">FAQ</a> ] [ <a href="/settings.html" target="_blank">Настройки</a> ] [ <a href="/frame.html" target="_top">Фрейм</a> ]
			</span>
		</div>
		<span class="logo">
			<div id="logo-container">
				<a href="../" id="logo-link">
					<div id="logo-image-top" class="logo-image"></div>
				</a>
			</div>
			<div class="boardname">Подтвердите отправку поста</div>
		</span>
		<div class="postarea">
			<a id="postbox"></a>
			<form name="postform" id="postform" action="/board.php" method="post" enctype="multipart/form-data"
			{if $board.enablecaptcha eq 1}
			onsubmit="return checkcaptcha('postform');"
			{/if}
			>
			<div class="info" style="margin:0px auto;display:table;">
				<ul>
					{if $settings.file}
					<li class="gt">Select file you want to post.</li>
					{/if}
					{if $settings.timeout > 0}
					<li id="timeout-item"><span class="gt">You need to wait</span> <span id="timeout">{$settings.timeout}</span> <span class="gt">seconds</span>.</li>
					{/if}
					{if $settings.captcha}
					<li>
						Введите цифры с изображения:<br><img src="/captcha.php?token={$settings.captcha}"><br>
						<input name="captcha" autocomplete="off" autofocus>
					</li>
					{elseif $postdata.captcha}
						<input type="hidden" name="captcha" value="{$postdata.captcha}" />
					{/if}
					{if $settings.pow neq 0}
					<li class="js-only">
						Или вычислите POW (~2<sup>{$settings.pow+1}</sup>) <input id="powbutton" type="button" onclick="startPOWCalculation();" value="Start">
					</li>
					{elseif $settings.confirmation}
					<li class="gt">Please press "submit" to send your post.</li>
					{/if}
				</ul>
			</div>

			<input type="hidden" name="board" value="{$postdata.board}" />
			{if $settings.pow}
				<input type="hidden" name="powrequired" id="powrequired" value="{$settings.pow}" />
				<input type="hidden" name="powvalue" id="powvalue" value="" />
				<input type="hidden" name="powtimestamp" id="powtimestamp" value="" />
			{else}
				{if $postdata.powrequired}
					<input type="hidden" name="powrequired" id="powrequired" value="{$postdata.powrequired}" />
				{/if}
				{if $postdata.powvalue}
					<input type="hidden" name="powvalue" id="powvalue" value="{$postdata.powvalue}" />
				{/if}
				{if $postdata.powtimestamp}
					<input type="hidden" name="powtimestamp" id="powtimestamp" value="{$postdata.powtimestamp}" />
				{/if}
			{/if}
			<input type="hidden" name="confirmation" id="confirmation" value="{$settings.confirm_token}" />
			<input type="hidden" name="redirectto" id="redirectto"  value="{$postdata.redirectto}" />
			<input type="hidden" name="replythread" value="{$postdata.replythread}" />
			{if $board.maximagesize > 0}
			<input type="hidden" name="MAX_FILE_SIZE" value="{$board.maximagesize}" />
			{/if}
			<input type="text" name="email" size="28" maxlength="75" value="" style="display: none;" />
			<table class="postform">
				<tbody>
					<tr>
						<td class="postblock">
							E-mail</td>
							<td>
								<input type="text" value="{$postdata.em}" name="em" size="28" maxlength="75" accesskey="e" />
							</td>
						</tr>
						<tr>
							<td class="postblock">
								Тема
							</td>
							<td>
								<input type="text" name="subject" size="35" maxlength="75" accesskey="s" value="{$postdata.subject}"/>&nbsp;
								{strip}<input type="submit" value="
								{if $postdata.replythread eq 0}
								Отправить" accesskey="z" />&nbsp;(<span id="posttypeindicator" class="gt">New thread</span><a id="formpostlink"></a>)
								{else}
								Ответ" accesskey="z" />&nbsp;(<span id="posttypeindicator" class="gt">В тред</span><a id="formpostlink" href="/{$postdata.board}/res/{$postdata.replythread}.html">&nbsp;№{$postdata.replythread}</a>)
								{/if}{/strip}
							</td>
						</tr>
						<tr id="tagbuttons-tr">
							<td>
							</td>
							<td>
								<div id="tagbuttons">
									<span class="tagbutton" onclick="addTagToMsg('b');"><b>B</b></span>
									<span class="tagbutton" onclick="addTagToMsg('i');"><i>I</i></span>
									<span class="tagbutton" onclick="addTagToMsg('s');"><s>S</s></span>
									<span class="tagbutton" onclick="addTagToMsg('u');"><u>U</u></span>
									<span class="tagbutton" onclick="addTagToMsg('code');">C</span>
									<span class="tagbutton" onclick="addTagToMsg('spoiler');"`>Sp</span>
									<span class="tagbutton" onclick="togglePostPreview()">просмотр</span>
								</div>
							</td>
						</tr>
						<tr>
							<td class="postblock">
								Текст
							</td>
							<td>
								<textarea name="message" id="message" cols="48" rows="4" accesskey="m">{$postdata.message}</textarea>
							</td>
						</tr>
						{if $board.uploadtype eq 0 || $board.uploadtype eq 1}
						<tr>
							<td class="postblock">
								Файл
							</td>
							<td>
								<input id="fileupload" type="file" onchange="handleFileSelect(event)" name="imagefile" accesskey="u" />
								<a id="fileupload-clear" style="display:none;" onclick="clearFileSelect()">[x]</a>
								<div id="fileupload-list">
								</div>
								{if $postdata.nofile}
								[<input type="checkbox" name="nofile" id="nofile" accesskey="q" checked/><label for="nofile"> Без файла</label>]
								{/if}
								{if $replythread eq 0 && $board.enablenofile eq 1 }
								[<input type="checkbox" name="nofile" id="nofile" accesskey="q" /><label for="nofile"> Без файла</label>]
								{/if}
							</td>
						</tr>
						{/if}
						{if $board.uploadtype eq 0 || $board.uploadtype eq 1}
						{/if}
						{if ($board.uploadtype eq 1 || $board.uploadtype eq 2) && $board.embeds_allowed neq ''}
						<tr>
							<td class="postblock">
								{t}Embed{/t}
							</td>
							<td>
								<input type="text" name="embed" size="28" maxlength="75" accesskey="e" />&nbsp;<select name="embedtype">
								{foreach name=embed from=$embeds item=embed}
								{if in_array($embed.filetype,explode(',' $board.embeds_allowed))}
								<option value="{$embed.name|lower}">{$embed.name}</option>
								{/if}
								{/foreach}
							</select>
							<a class="rules" href="#postbox" onclick="window.open('{%KU_WEBPATH}/embedhelp.php','embedhelp','toolbar=0,location=0,status=0,menubar=0,scrollbars=0,resizable=0,width=300,height=210');return false;">Help</a>
						</td>
					</tr>
					{/if}
					<tr>
						<td class="postblock">
							Пароль
						</td>
						<td>
							<input type="password" autocomplete="off" name="postpassword" value="{$postdata.postpassword}" size="8" accesskey="p" />&nbsp;(для удаления постов и файлов)
						</td>
					</tr>
					<tr id="passwordbox"><td></td><td></td></tr>
					<tr>
						<td colspan="2" class="rules">
							<div class="fspoiler">
								<div class="fspoilertitle" onclick="toggleSpoiler(this);">&nbsp;</div>
								<div class="fspoilertext" id="form-rules">
									<ul style="margin-left: 0; margin-top: 0; margin-bottom: 0; padding-left: 0;">
										<li>Поддерживаемые форматы файлов:
											{if $board.filetypes_allowed neq ''}
											{foreach name=files item=filetype from=$board.filetypes_allowed}
											{$filetype.0|upper}{if $.foreach.files.last}{else}, {/if}
											{/foreach}
											{else}
											(пусто).
											{/if}
										</li>
										<li>Максимальный размер файла: {math "round(x/1024)" x=$board.maximagesize} KB.</li>
										<li>Изображения, большие {t 1=%KU_THUMBWIDTH 2=%KU_THUMBHEIGHT}%1x%2 будут уменьшены.</li>
										<li>
											{if $board.enablecatalog eq 1}<a href="{%KU_BOARDSFOLDER}{$board.name}/catalog.html">Каталог</a>,{/if}
											<a target="_blank" href="/faq.html#questions">FAQ и правила</a>
										</li>
									</ul>
									<div id="markup_settings">
										<input type="checkbox" name="markup_wakabamark" id="markup_wakabamark"
										{if $postdata.markup_wakabamark}
										checked
										{/if}><label for="markup_wakabamark">WakabaMark</label>
										<input type="checkbox" name="markup_bbcode" id="markup_bbcode" {if $postdata.markup_bbcode}
										checked
										{/if}><label for="markup_bbcode">BBCode</label>
										<input type="checkbox" name="markup_other" id="markup_other" {if $postdata.markup_other}
										checked
										{/if}><label for="markup_other"><span class="gt">Other</span></label>
									</div>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</form>
	</div>
</div>
</body>
</html>
