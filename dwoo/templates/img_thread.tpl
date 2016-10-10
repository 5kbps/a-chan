{if not $isexpand and not $isread}
	<form id="del-form" action="/board.php" method="post">
		<input type="hidden" name="board" value="{$board.name}" />
{/if}
{foreach key=postkey item=post from=$posts name=postsloop}
	{if $post.parentid eq 0}
		<div class="thread-wrapper" id="thread-wrapper-{$post.id}">
			<div id="thread{$post.id}{$board.name}" class="thread">
	{else} {* post parentid != 0 *}
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
						<span class="post-subject">
							{$post.subject}
						</span>
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
					<span class="post-hide post-hide-{$post.id}" onmousedown="postHide(this,{$post.id});"></span>
					<span class="post-show post-show-{$post.id}" onmousedown="postShow(this,{$post.id});"></span>
					<span class="post-reply post-reply-{$post.id}" onmousedown="postReply(this,{$post.id},{if $post.parentid eq 0}{$post.id}{else}{$post.parentid}{/if});"></span>
				</span>
				<span class="refcontainer-top" id="refcontainer-top-{$post.id}"></span>
				<span class="dnb" id="dnb-{$board.name}-{$post.id}"></span>
				{if ($post.file neq '' || $post.file_type neq '' ) && (( $post.videobox eq '' && $post.file neq '') && $post.file neq 'removed')}
					<br />
					<span class="filesize">
						Файл
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
					{if $post.videobox eq '' && $post.file neq '' && ( $post.file_type eq 'jpg' || $post.file_type eq 'gif' || $post.file_type eq 'png' ) }
								<a target="_blank" href="/{$board.name}/src/{$post.file}.{$post.file_type}"><!-- 4 -->
								<span id="thumb{$post.id}"><img src="/{$board.name}/thumb/{$post.file}s.{$post.file_type}" onclick="imgExpand(this,'/{$board.name}/src/{$post.file}.{$post.file_type}','/{$board.name}/thumb/{$post.file}s.{$post.file_type}',event)" oncontextmenu="rkmSave(this);" alt="{$post.id}" class="thumb"  id="tid{$post.file}" height="{$post.thumb_h}" width="{$post.thumb_w}" /></span>
								</a>
					{elseif $post.file_type eq 'webm'}
								<a target="_blank" href="/{$board.name}/src/{$post.file}.{$post.file_type}"><!-- 4 -->
								<span id="thumb{$post.id}"><img src="/{$board.name}/thumb/{$post.file}webm.jpg" alt="{$post.id}" class="thumb webm-thumb" onclick="webmExpand(this); return false;" /></span>
								</a>
					{elseif $post.nonstandard_file neq ''}
								<a target="_blank" href="/{$board.name}/src/{$post.file}.{$post.file_type}">
								<span id="thumb{$post.id}"><img src="{$post.nonstandard_file}" alt="{$post.id}" class="thumb"  id="tid{$post.file}" height="{$post.thumb_h}" width="{$post.thumb_w}" /></span>
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
	{else}
			</div>
		</div>
	{/if}
{/foreach}
{if not $isexpand and not $isread}
	<div class="userdelete">
		Удалить пост
		[<input type="checkbox" name="fileonly" id="fileonly" value="on" /><label for="fileonly">Только файл</label>]
		<br/>Пароль:
		<input type="password" name="postpassword" size="8" /> <input name="deletepost" value="Удалить" type="submit"/>
	</div>
	</form>
{/if}