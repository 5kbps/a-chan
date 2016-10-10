{if $replythread eq 0}
	<div class="bp">
				{if $thispage eq 0}
					Назад
				{else}
					<a class="pagelist-link" href="/{$board.name}/{if ($thispage-1) neq 0}{$thispage-1}.html{/if}">
					Назад
					</a>
				{/if}
				&#91;{if $thispage neq 0}<a href="/{$board.name}/">{/if}0{if $thispage neq 0}</a>{/if}&#93;
				{section name=pages loop=$numpages}
				{strip}
					&#91;
					{if $.section.pages.iteration neq $thispage}<a class="pagelist-link" href="/{$board.name}/{$.section.pages.iteration}.html">
					{/if}
					{$.section.pages.iteration}
					{if $.section.pages.iteration neq $thispage}
					</a>
					{/if}
					&#93;
				{/strip}
				{/section}
				{if $thispage eq $numpages}
				{else}
					<a class="pagelist-link" href="/{$board.name}/{$thispage+1}.html">Дальше</a>
				{/if}
	</div>
{/if}
{if $boardlist}
	<div class="navbar navbar-bottom">
		<span class="boardList">
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
	</div>
{/if}
<br>