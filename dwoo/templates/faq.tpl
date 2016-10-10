<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="content-type" content="text/html; charset=UTF-8">
	<title>FAQ</title>
	<link rel="stylesheet" id="styleman" href="/static/style.php">
	{literal}
	<style>
		body { margin: 0 auto; padding: 8px; max-width: 1000px; }
		input { font-family: monospace; width: 100%; }
		.fspoilertext{  display: none; }
		.fspoileropen{  display: block; }
		.middletd{	width: 40px; opacity: 0.4; padding-left: 20px;}
		.mtd { font-family: monospace; }
		.accesskey { text-decoration: underline; }
	</style>
	<script type="text/javascript" src="/static/js/min/faq.min.js"></script>
	{/literal}
</head>
<body>
	<h2> <a id="rules" href="#rules">Правила</a></h2>
	<ol>
		<li><a id="rule1"></a>Rule 1 here</li>
		<li><a id="rule2"></a>...</li>
	</ol>
<h2><a id="moderation" href="#moderation">Принципы модерирования</a></h2>
	<ol>
		<li>.</li>
	</ol>
<h2><a id="contacts" href="#contacts">Контакты</a></h2>
<p>
	
</p>
<h2><a id="markup" href="#markup">Разметка</a></h2>
<p>
	Поддерживаются несколько типов разметки. В форме постинга можно выбрать нужные способы форматирования.
	Перед отправкой поста можно проверить правильность разметки с помощью предпросмотра.
</p>
<h4>
	WakabaMark
</h4>
<table>
	<tr>
		<td class="mtd">
			*Текст*
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<i>Текст</i>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			**Текст**
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<b>Текст</b>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			~~Текст~~
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<s>Текст</s>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			`Текст`
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<code>Текст</code>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			%%Текст%%
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<span class="spoiler">Текст</span>
		</td>
	</tr>
</table>
<h4>BBCode</h4>
<table>
	<tr>
		<td class="mtd">
			[i]Текст[/i]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<i>Текст</i>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			[b]Текст[/b]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<b>Текст</b>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			[s]Текст[/s]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<s>Текст</s>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			[u]Текст[/u]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<span style="text-decoration:underline;">Текст</span>
		</td>
	</tr>
	<tr>
		<td>
			[spoiler]Текст[/spoiler]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<span class="spoiler">Текст</span>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			[red]Текст[/red]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<span class="admin-sign">Текст</span>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			[А-чан](http://a-chan.org/)
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<a href="http://a-chan.org/">А-чан</a>
		</td>
	</tr>
	<tr>
		<td>
			[hidden=Заголовок]Скрытый<br>
			многострочный текст[/hidden]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<div class="fspoiler">
				<span class="fspoilertitle" style="cursor:pointer;" onclick="toggleSpoiler(this);">Заголовок</span>
				<div class="fspoilertext">Скрытый<br>
					многострочный текст</div>
				</div>
			</td>
		</tr>
	</table>
	<h4> <span class="gt">Other</span></h4>
	<p>
		Символы должны быть отделены от других слов пробелами.
	</p>
	<table>
		<tr>
			<td class="mtd">
				--
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				&#8212;
			</td>
		</tr>
		<tr>
			<td class="mtd">
				->
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				&#8594;
			</td>
		</tr>
		<tr>
			<td class="mtd">
				&lt;-
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				&#8592;
			</td>
		</tr>
		<tr>
			<td class="mtd">
				=&gt;
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				&#8658;
			</td>
		</tr>
		<tr>
			<td class="mtd">
				&lt;=
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				&#8656;
			</td>
		</tr>
		<tr>
			<td class="mtd">
				&lt;=&gt;
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				&#8660;
			</td>
		</tr>
		<tr>
			<td class="mtd">
				(c)
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				&#169;
			</td>
		</tr>
		<tr>
			<td class="mtd">
				&lt;&lt;Текст&gt;&gt;
			</td>
			<td class="middletd">
				→
			</td>
			<td>
				«Текст»
			</td>
		</tr>
	</table>
	<h2><a id="links" href="#links">Ссылки и цитирование</a></h2>
	<p>
		Инлайновые <a href="https://en.wikipedia.org/wiki/Percent-encoding" target="_blank">URL-encoded</a> ссылки распознаются автоматически.
	</p>
	<p>
		Цитирование постов:
		<table>
			<tr>
				<td class="mtd">
					&gt;&gt;2259
				</td>
				<td class="middletd">
					→
				</td>
				<td>
					<a href="/d/res/2295.html">&gt;&gt;2259</a>
				</td>
			</tr>
			<tr>
				<td class="mtd">
					&gt;&gt;/d/2259
				</td>
				<td class="middletd">
					→
				</td>
				<td>
					<a href="/d/res/2295.html">&gt;&gt;/d/2259</a>
				</td>
			</tr>
		</table>
	</p>
	<p>
		Прямые ссылки на конкретный пост или тред А-чана заменяются на относительные вида <a href="/d/res/2295.html">&gt;&gt;/d/2259</a> вне зависимости от используемого домена.
	</p>
	<h2><a id="code" href="#code">Подсветка кода</a></h2>
	<p>
		Используется тег [code]:<br><br>
	</p>
	<table>
	<tr>
		<td class="mtd">
			[code]Текст[/code]
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<span class="code-inline text">Текст</span>
		</td>
	</tr>
		<tr>
		<td class="mtd">
			<pre>
[code]
   if (n%2 == 0)
	  printf("Even\n");
   else
	  printf("Odd\n");
[/code]
			</pre>
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<div class="code-block c">&nbsp; &nbsp;<span class="kw1">if</span> <span class="br0">(</span>n<span class="sy0">%</span><span class="nu19">2</span> <span class="sy0">==</span> <span class="nu0">0</span><span class="br0">)</span><br>
			&nbsp; &nbsp; &nbsp; <span class="kw3">printf</span><span class="br0">(</span><span class="st0">"Even<span class="es1">\n</span>"</span><span class="br0">)</span><span class="sy0">;</span><br>
			&nbsp; &nbsp;<span class="kw1">else</span><br>
			&nbsp; &nbsp; &nbsp; <span class="kw3">printf</span><span class="br0">(</span><span class="st0">"Odd<span class="es1">\n</span>"</span><span class="br0">)</span><span class="sy0">;</span></div>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			<pre>
[code haskell]
a :: Int -> Int
a = (+ 1)
[/code]
			</pre>
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<span class="code-language-name">Haskell</span>
			<div class="code-block haskell">a <span class="sy0">::</span> <span class="kw4">Int</span> <span class="sy0">-&gt;</span> <span class="kw4">Int</span><br>a <span class="sy0">=</span> <span class="br0">(</span><span class="sy0">+</span> <span class="nu0">1</span><span class="br0">)</span></div>
		</td>
	</tr>
	<tr>
		<td class="mtd">
			<pre>
[code text]
К этому тексту
    не применяется никакое
  форматирование.
[/code]
			</pre>
		</td>
		<td class="middletd">
			→
		</td>
		<td>
			<span class="code-language-name">Plain text</span><div class="code-block text">К этому тексту <br /> &nbsp; &nbsp; не применяется никакое<br /> &nbsp; форматирование.</div>
		</td>
	</tr>
	</table>
	<p>
	Внутри [code] не работает другая разметка. Невозможно встраивание [code] в другие теги.
	</p>
	<p style="line-height: 1.3em;">
		Полный список поддерживаемых языков программирования и их сокращенных названий:
		{foreach name=lngs item=lng from=$langs}
			<span class="code-inline text">{$lng}</span>{if $.foreach.lngs.last}{else},{/if}
		{/foreach}
	</p>
	<h2><a id="hotkeys" href="#hotkeys">Горячие клавиши</a></h2>
	<table>
		<tr>
			<td>
				<h5>Действие</h5>
			</td>
			<td>
				<h5>Комбинация клавиш</h5>
			</td>
		</tr>
		<tr>
			<td>Следующий пост</td>
			<td>
				<span class="code-inline">j</span>,
				<span class="code-inline">Num 2</span>
			</td>
		</tr>
		<tr>
			<td>Предыдущий пост</td>
			<td>
				<span class="code-inline">k</span>,
				<span class="code-inline">Num 8</span>
			</td>
		</tr>
		<tr>
			<td>Открыть тред</td>
			<td>
				<span class="code-inline">l</span>,
				<span class="code-inline">Num 6</span>
			</td>
		</tr>
		<tr>
			<td>Выход из треда</td>
			<td>
				<span class="code-inline">h</span>,
				<span class="code-inline">Num 4</span>
			</td>
		</tr>
		<tr></tr>
		<tr></tr>
		<tr></tr>
		<tr></tr>
		<tr>
			<td>Ответить на пост</td>
			<td>
				<span class="code-inline">r</span>,
				<span class="code-inline">Num 9</span>
			</td>
		</tr>
		<tr>
			<td>Выйти из поля ввода</td>
			<td>
				<span class="code-inline">Esc</span>
			</td>
		</tr>
		<tr>
			<td>Скрыть уведомления</td>
			<td>
				<span class="code-inline">i</span>,
				<span class="code-inline">Num 0</span>
			</td>
		</tr>
		<tr></tr>
		<tr></tr>
		<tr></tr>
		<tr></tr>
		<tr></tr>
		<tr>
			<td>Отправить пост</td>
			<td>
				<span class="code-inline"><span class="accesskey">AccessKey</span>+z</span>
			</td>
		</tr>
		<tr>
			<td>Перейти в поле "Текст"</td>
			<td>
				<span class="code-inline"><span class="accesskey">AccessKey</span>+m</span>
			</td>
		</tr>
		<tr>
			<td>Перейти в поле "E-mail"</td>
			<td>
				<span class="code-inline"><span class="accesskey">AccessKey</span>+e</span>
			</td>
		</tr>
		<tr>
			<td>Перейти в поле "Тема"</td>
			<td>
				<span class="code-inline"><span class="accesskey">AccessKey</span>+s</span>
			</td>
		</tr>		<tr>
			<td>Перейти в поле "Файл"</td>
			<td>
				<span class="code-inline"><span class="accesskey">AccessKey</span>+u</span>
			</td>
		</tr>
		<tr>
			<td>Перейти в поле "Пароль"</td>
			<td>
				<span class="code-inline"><span class="accesskey">AccessKey</span>+p</span>
			</td>
		</tr>
	</table>
	<br>
	<div id="accesskey-info">
		<span class="code-inline"><span class="accesskey">AccessKey</span></span> зависит от используемого браузера и ОС:
		<input accesskey="q" id="accesskey-detector" style="display: none;">
		<table>
			<tbody>
				<tr>
					<td><h5>Browser</h5></td>
					<td><h5>Windows</h5></td>
					<td><h5>Linux</h5></td>
					<td><h5>Mac</h5></td>
				</tr>
				<tr>
					<td>Internet Explorer</td>
					<td><span class="code-inline">Alt</span></td>
					<td>-</td>
					<td></td>
				</tr>
				<tr>
					<td>Chrome</td>
					<td><span class="code-inline">Alt</span></td>
					<td><span class="code-inline">Alt</span></td>
					<td><span class="code-inline">Ctrl+Alt</span></td>
				</tr>
				<tr>
					<td>Firefox</td>
					<td><span class="code-inline">Alt+Shift</span></td>
					<td><span class="code-inline">Alt+Shift</span></td>
					<td><span class="code-inline">Ctrl+Alt</span></td>
				</tr>
				<tr>
					<td>Safari</td>
					<td><span class="code-inline">Alt</span></td>
					<td>-</td>
					<td><span class="code-inline">Ctrl+Alt</span></td>
				</tr>
				<tr>
					<td>Opera</td>
					<td colspan="3"><span class="code-inline">Alt</span> (15 или новее)  <br><span class="code-inline">Shift+Esc</span> (12.1 или старше) </td>
				</tr>
			</tbody>
		</table>
	</div>
	<h2><a id="captcha" href="#captcha">Капча и POW</a></h2>
	<p>
		Для предотвращения вайпов используется капча или механизм <a href="https://en.wikipedia.org/wiki/Proof-of-work_system" target="_blank">proof-of-work</a> - на выбор пользователя.<br>
		Защита включается только при достижении определенной скорости постинга. {* (На данный момент: <span class="code-inline">{$posts_max}</span> постов за <span class="code-inline">{$posting_time_limit}</span>с.) *}
	</p>
	<p>
		Во время подсчёта POW резко повышается использование процессора.
	</p>
	<p>
		Капчу можно вводить в кириллической раскладке. На данный момент время жизни капчи составляет <span class="code-inline text">{$conf.ANTIWIPE_CAPTCHA_MAX_AGE}</span> секунд.
	</p>
	<h2><a id="tor" href="#tor">Зеркало в Tor</a></h2>
	<table>
		<tr>
			<td>Домен:</td>
			<td></td>
		</tr>
		<tr>
			<td colspan="2">
				Пожалуйста, всегда используйте это зеркало при заходе через Tor!
			</td>
		</tr>
	</table>
	<br><br><br><br>
</body>
</html>
