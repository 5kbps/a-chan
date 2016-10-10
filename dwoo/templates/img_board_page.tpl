<form id="del-form" action="/board.php" method="post">
<input type="hidden" name="board" value="{$board.name}" />
{foreach name=thread item=postsa from=$posts}
	{foreach key=postkey item=post from=$postsa}
		{if $post.parentid eq 0}
		<div class="thread-wrapper" id="thread-wrapper-{$post.id}">
			<div id="thread{$post.id}{$board.name}" class="thread">
		{else}
			<div class="post-wrapper reply-to-{$post.parentid}">
				<div class="reply" id="reply{$post.id}">
		{/if}
		<a class="post-number" href="#{$post.id}" id="{$post.id}"></a>
		<label class="post-info" for="checkbox-{$post.id}">
			<input type="checkbox" class="checkbox-elem" id="checkbox-{$post.id}" name="post[]" value="{$post.id}" />
			{strip}
				<span class="post-name">
					{$board.anonymous}
				</span>
			{/strip}
			{if $post.subject neq ''}
				<span class="post-subject">{$post.subject}</span>
			{/if}
			<span class="formatted_timestamp">
				{$post.timestamp_formatted}
			</span>
			<input type="hidden" class="raw-timestamp" id="raw-timestamp-{$post.id}" value="{$post.timestamp}"><span class="formated-time" id="formated-time-{$post.id}"></span>
		</label>
		<span class="reflink">
			<a href="/{$board.name}/res/{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if}.html#{$post.id}">No.&nbsp;{$post.id}</a>
		</span>
		<span class="post-controls">
			{if $post.parentid eq 0}
				{if %KU_EXPAND && $post.replies && ($post.replies + %KU_REPLIES) < 600}
					<span class="thread-expand" id="threadexpand{$post.id}" onmousedown="expandthread('{$post.id}','{$board.name}');"></span>
				{/if}
			{/if}
			<span class="post-hide post-hide-{$post.id}" onmousedown="postHide(this,{$post.id},'{$board.name}');"></span>
			<span class="post-show post-show-{$post.id}" onmousedown="postShow(this,{$post.id},'{$board.name}');"></span>
			<span class="post-reply post-reply-{$post.id}" onmousedown="postReply(this,{$post.id},{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if});"></span>
		</span>
		<span class="refcontainer-top" id="refcontainer-top-{$post.id}"></span>
		<span class="dnb" id="dnb-{$board.name}-{$post.id}"></span>
		{if $post.parentid eq 0}
			<span class="replybutton">[<a id="replybutton-{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if}" href="{%KU_BOARDSFOLDER}{$board.name}/res/{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if}.html">Ответ</a>]</span>
		{/if}
		{if ($post.file neq '' || $post.file_type neq '' ) && (( $post.videobox eq '' && $post.file neq '') && $post.file neq 'removed')}
			<br />
			<span class="filesize">
				{t}File{/t}
				<a target="_blank" href="/{$board.name}/src/{$post.file}.{$post.file_type}">
				{if isset($post.id3.comments_html)}
					{if $post.id3.comments_html.artist.0 neq ''}
					{$post.id3.comments_html.artist.0}
						{if $post.id3.comments_html.title.0 neq ''}
							-
						{/if}
					{/if}
					{if $post.id3.comments_html.title.0 neq ''}
						{$post.id3.comments_html.title.0}
					{/if}
					</a>
				{else}
					{$post.file}.{$post.file_type}</a>
				{/if}
				- ({strip}{$post.file_size_formatted}
				{if $post.id3.comments_html.bitrate neq 0 || $post.id3.audio.sample_rate neq 0}
					{if $post.id3.audio.bitrate neq 0}
						- {round($post.id3.audio.bitrate / 1000)} kbps
						{if $post.id3.audio.sample_rate neq 0}
							-
						{/if}
					{/if}
					{if $post.id3.audio.sample_rate neq 0}
						{$post.id3.audio.sample_rate / 1000} kHz
					{/if}
				{/if}
				{if $post.image_w > 0 && $post.image_h > 0}
					, {$post.image_w}x{$post.image_h}
				{/if}
				{if $post.id3.playtime_string neq ''}
					{t}Length{/t}: {$post.id3.playtime_string}
				{/if}{/strip})
			</span>
		{/if}
		{if $post.file eq 'removed'}
			<div class="nothumb">
				Файл удалён
			</div>
		{else}
			{if $post.videobox eq '' && $post.file neq '' && ( $post.file_type eq 'jpg' || $post.file_type eq 'gif' || $post.file_type eq 'png')}
				<a target="_blank" class="file-link" href="/{$board.name}/src/{$post.file}.{$post.file_type}">
					<span id="thumb{$post.id}">
						<img src="/{$board.name}/thumb/{$post.file}s.{$post.file_type}" alt="{$post.id}" class="thumb"  id="tid{$post.file}" onclick="imgExpand(this,'/{$board.name}/src/{$post.file}.{$post.file_type}','/{$board.name}/thumb/{$post.file}s.{$post.file_type}',event)" oncontextmenu="rkmSave(this);" height="{$post.thumb_h}" width="{$post.thumb_w}" />
					</span>
				</a>
			{elseif $post.file_type eq 'webm' }
				<a target="_blank" class="file-link" href="/{$board.name}/src/{$post.file}.{$post.file_type}">
					<span id="thumb{$post.id}">
						<img src="/{$board.name}/thumb/{$post.file}webm.jpg" alt="{$post.id}" class="thumb webm-thumb" onclick="webmExpand(this); return false;" />
					</span>
				</a>
			{elseif $post.nonstandard_file neq ''}
				<a target="_blank" class="file-link" href="/{$board.name}/src/{$post.file}.{$post.file_type}">
					<span id="thumb{$post.id}">
						<img src="{$post.nonstandard_file}" alt="{$post.id}" class="thumb"  id="tid{$post.file}" onclick="imgExpand(this,'/{$board.name}/src/{$post.file}.{$post.file_type}','/{$board.name}/thumb/{$post.file}s.{$post.file_type}',event)" oncontextmenu="rkmSave(this);" height="{$post.thumb_h}" width="{$post.thumb_w}" />
					</span>
				</a>
			{/if}
		{/if}
		<span class="post-text" id="post-text-{$post.id}">
			{$post.message}
		</span>
		<span class="refcontainer-bottom" id="refcontainer-bottom-{$post.id}"></span>
		<div class="postform-container postform-container-{$post.id}" id="postform-container-{$post.id}"></div>
		{if $post.parentid eq 0}
				</div>
			</div>
			{if $post.replies}
				<span class="omitted-posts" id="omitted-posts-{$post.id}">
					{$post.replies}
					{if $post.replies eq 1}
						пост
					{else}
						постов
					{/if}
					{if $post.images > 0}
						{t}and{/t} {$post.images}
						{if $post.images eq 1}
							изображение
						{elseif  $post.images eq 2}
							изображения
						{else}
							изображений
						{/if}
					{/if}
					{t}пропущены{/t}. 
					<a target="_blank" href="/{$board.name}/res/{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if}.html">Ответ</a>
					или <a href="/{$board.name}/res/{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if}.html" onclick="expandthread('{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if}','{$board.name}');return false;">раскрыть тред</a>
				</span>
			{/if}
		{else}
				</div>
			</div>
		{/if}
	{/foreach}
{/foreach}
{if not $isread}
	<div class="userdelete">
		Удалить пост
		[<input type="checkbox" name="fileonly" id="fileonly" value="on" /><label for="fileonly">Только файл</label>]
		<br/>Пароль:
		<input type="password" name="postpassword" size="8" /> <input name="deletepost" value="{t}Delete{/t}" type="submit"/>
	</div>
{/if}
</form>