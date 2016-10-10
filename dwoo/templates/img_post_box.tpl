<div class="postarea">
	<a id="postbox"></a>
	<form name="postform" id="postform" action="/board.php" method="post" enctype="multipart/form-data">
	<input type="hidden" name="board" value="{$board.name}" />
	<input type="hidden" name="confirmation" value="0" />
	<input type="hidden" name="preference" value="unknown" />
	<input type="hidden" name="powvalue" value="0" />
	<input type="hidden" name="js-check" id="js-check"  value="no-js" />
	{* POW *}
	<input type="hidden" name="powrequired" id="powrequired" value="" />
	<input type="hidden" name="powvalue" id="powvalue" value="" />
	<input type="hidden" name="powtimestamp" id="powtimestamp" value="" />
	<input type="hidden" name="captchatoken" id="captchatoken" value="" />
	{if %KU_QUICKREPLY && $replythread eq 0}
	<input type="hidden" name="redirectto" id="redirectto"  value="board" />
	{else}
	<input type="hidden" name="redirectto" id="redirectto"  value="thread" />
	{/if}
	<input type="hidden" name="replythread" value="<!sm_threadid>" />
	{if $board.maximagesize > 0}
	<input type="hidden" name="MAX_FILE_SIZE" value="{$board.maximagesize}" />
	{/if}
	<table class="postform">
		<tbody>
			<tbody>
				<tr>
					<td class="postblock">
						E-mail
					</td>
					<td>
						<input type="text" name="em" size="28" maxlength="75" accesskey="e" />
					</td>
				</tr>
				<tr>
					<td class="postblock">
						Тема
					</td>
					<td>
						{strip}
						<input type="text" name="subject" size="35" maxlength="40" accesskey="s" />&nbsp;
							{if %KU_QUICKREPLY && $replythread eq 0}
								<input id="postform-submit" type="submit" value="Отправить" accesskey="z" />&nbsp;
								(<span id="posttypeindicator">Новый тред</span><a id="formpostlink" style="display:none"></a>
								<span id="clearreplyto" onclick="clearreplyto(this)" style="display:none"></span>)
							{elseif %KU_QUICKREPLY && $replythread neq 0}
								<input id="postform-submit" type="submit" value="Ответ" accesskey="z" />&nbsp;
								(<span id="posttypeindicator">В тред</span> <a id="formpostlink" href="/{$board.name}/res/<!sm_threadid>.html"><!sm_threadid></a>
								<span id="clearreplyto" onclick="clearreplyto(this)" style="display:none"></span>)
							{else}
								<input id="postform-submit" type="submit" value="Отправить" accesskey="z" />&nbsp;
								(<span id="posttypeindicator">Новый тред</span><a id="formpostlink" style="display:none"></a>
								<span id="clearreplyto" onclick="clearreplyto(this)" style="display:none"></span>)
							{/if}
						{/strip}
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
						<textarea name="message" id="message" cols="48" rows="4" accesskey="m"></textarea>
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
						{if $replythread eq 0 && $board.enablenofile eq 1 }
						[<input type="checkbox" name="nofile" id="nofile" accesskey="q" /><label for="nofile">Без файла</label>]
						{/if}
					</td>
				</tr>
				{/if}
				<tr>
					<td class="postblock">
						Пароль
					</td>
					<td>
						<input type="password" autocomplete="off" name="postpassword" size="8" accesskey="p" />&nbsp;(для удаления постов и файлов)
					</td>
				</tr>
				<tr id="passwordbox"><td></td><td></td></tr>
				<tr class="hidden-element" id="captcha-container">
					<td class="postblock">
						Проверка
					</td>
					<td>
						<table id="captcha-table">
							<tr>
								<td colspan="2" id="captcha-image-container">
								</td>
								<td rowspan="2" id="captcha-or-container">или</td>
								<td rowspan="2" id="pow-container"></td>
							</tr>
							<tr>
								<td id="captcha-input-container">
								</td>
								<td id="captcha-check-container">
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<noscript>
					<td class="postblock">
						Проверка
					</td>
					<td>
							<image id="noscript-capthca-image" src="/captcha.php?action=show_image&board={$board.name}"></image><br>
							<input name="captcha" id="noscript-captcha-input">
					</td>
					</noscript>
				</tr>
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
										{if $board.enablecatalog eq 1}<a href="{%KU_BOARDSFOLDER}{$board.name}/catalog">Каталог</a>,{/if}
										<a target="_blank" href="/faq#questions">FAQ и правила</a>
									</li>
								</ul>
								<div id="markup_settings">
									<input type="checkbox" name="markup_wakabamark" id="markup_wakabamark" checked><label for="markup_wakabamark">WakabaMark</label>
									<input type="checkbox" name="markup_bbcode" id="markup_bbcode" checked><label for="markup_bbcode">BBCode</label>
									<input type="checkbox" name="markup_other" id="markup_other" checked><label for="markup_other">Другое</label>&nbsp; 
									<a target="_blank" href="/faq#markup">?</a>
								</div>
							</div>
							<script>
							var el  = document.getElementById('form-rules');
							if(el){
								el.style.display = 'none';
							}
							</script>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</form>
</div>