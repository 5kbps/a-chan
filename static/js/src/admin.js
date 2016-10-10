function isAdmin(){
	if (getCookie("kumod") == "allboards") {
		return true
	} else if (getCookie("kumod") != "") {
		var c = getCookie("kumod").split('|')
		var d = document.getElementById("postform").board.value
		for (var f in c) {
			if (c[f] == d) {
				return true
			}
		}
	}
	return false
}

function addAdminStyle(){
	document.head.innerHTML += '<style src="/static/css/admin.css"></style>'
}

function colorize(sth){
	return '#' + md5(sth).substr(0,6)
}

function togglePassword() {
	var a = (navigator.userAgent.indexOf('Safari') != -1);
	var b = (navigator.userAgent.indexOf('Opera') != -1);
	var c = (navigator.appName == 'Netscape');
	var d = document.getElementById("passwordbox");
	if (d) {
		var e;
		if ((a) || (b) || (c)) e = d.innerHTML;
		else e = d.text;
		e = e.toLowerCase();
		var f = '<td></td><td></td>';
		if (e == f) {
			var f = '<td class="postblock">Mod</td><td><input type="text" name="modpassword" size="28" maxlength="75">&nbsp;<acronym title="Display staff status (Mod/Admin)">D</acronym>:&nbsp;<input type="checkbox" name="displaystaffstatus" checked>&nbsp;<acronym title="Lock">L</acronym>:&nbsp;<input type="checkbox" name="lockonpost">&nbsp;&nbsp;<acronym title="Sticky">S</acronym>:&nbsp;<input type="checkbox" name="stickyonpost">&nbsp;&nbsp;<acronym title="Raw HTML">RH</acronym>:&nbsp;<input type="checkbox" name="rawhtml">&nbsp;&nbsp;<acronym title="Name">N</acronym>:&nbsp;<input type="checkbox" name="usestaffname"></td>'
		}
		if ((a) || (b) || (c)) d.innerHTML = f;
		else d.text = f
	}
	return false
}

function modActions(){
	if(!isAdmin()) return;
	banLinks()
	addAdminStyle()
	addPostSubjectEditors()
}
var modRequests = []

function ipHash(ipstr){
	if(ipstr.split('.').length == 4 && !ipstr.indexOf(':')+1) { // because ipv6
		var s = ipstr.split('.'),
			r = getInt(s[0]),
			g = getInt(s[3]),
			b = getInt(s[2]),
			a = ''+(0.5 + getInt(s[1])/510),
			c = (r+g+b > 127*3)?'black':'white';
		return 'background-color:rgba('+r+','+g+','+b+','+a.substr(0,4)+');color:'+c+';'
	}
	return 'background-color:rgba(255,255,255,1);color:black;'
}

function searchIP(ip){
	var xmlHttp = new XMLHttpRequest()
	xmlHttp.open("GET", "/manage_page.php?action=ipsearch&board=all&nocss=1&ip="+ip)
	xmlHttp.send( null )
	xmlHttp.onreadystatechange = function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(byID('ipsearch-preview')){
					byID('ipsearch-preview').remove()
				}
				var d = newElement('div')
				d.style.position = 'fixed'
				d.style.top = 0
				d.style.bottom = 0
				d.style.right = 0
				d.style.width = '50%'
				d.style.overflow = 'auto'
				d.className = 'reply-like'
				d.id = 'ipsearch-preview'
				d.innerHTML = this.responseText
				document.body.appendChild(d)
				d.ondblclick = function(){
					d.remove()
				}
			}
		}
	}
}

function searchSession(session){
	var xmlHttp = new XMLHttpRequest()
	xmlHttp.open("GET", "/manage_page.php?action=sessionsearch&nocss=1&session="+session)
	xmlHttp.send( null )
	xmlHttp.onreadystatechange = function(){
		if(this.readyState == 4){
			if(this.status == 200){
				if(byID('ipsearch-preview')){
					byID('ipsearch-preview').remove()
				}
				var d = newElement('div')
				d.style.position = 'fixed'
				d.style.top = 0
				d.style.bottom = 0
				d.style.right = 0
				d.style.width = '50%'
				d.style.overflow = 'auto'
				d.className = 'reply-like'
				d.id = 'ipsearch-preview'
				d.innerHTML = this.responseText
				document.body.appendChild(d)
				d.ondblclick = function(){
					d.remove()
				}
			}
		}
	}
}

function banLinks() {
	// let's just leave this crap as is...
	if (!isAdmin()) return;
	togglePassword();
	var b = document.getElementById("fileonly");
	if (b) {
		b = b.parentNode;
		b.innerHTML = '[<input type="checkbox" name="fileonly" id="fileonly" value="on" /><label for="fileonly">File Only</label>] <input name="moddelete" onclick="return confirm(_(\'Are you sure you want to delete these posts?\'))" value="' + _('Delete') + '" type="submit" /> <input name="modban" value="' + _('Ban') + '" onclick="this.form.action=\'/manage_page.php?action=bans\';" type="submit" />'
	}
	var postList = getAllPostNumbers(),
		xmlHttp = new XMLHttpRequest()
	xmlHttp.open("GET", "/manage_page.php?action=getips&boarddir=" +config.board + "&ids=" + postList.join(','))
	xmlHttp.send( null )
	xmlHttp.onreadystatechange = function(){
		if(this.readyState == 4){
			if(this.status == 200){
				var arr = JSON.parse(this.responseText)
				for(postNum in arr){
					var ip = arr[postNum]['ip'];
					var session = arr[postNum]['session'];
					var span = document.getElementById('dnb-'+config.board+'-'+postNum);
					if(!!span){
						var ht = ''
						if(session){
							ht += "[ <span onclick=\"searchSession('"+session+"');\" onmouseleave=\"this.innerHTML='"+session.substr(0,5)+"';\" onmouseenter=\"this.innerHTML='"+session+"';\" class=\"admin-usersession\" style=\"background-color:"+colorize(session)+"\">"+session.substr(0,5)+"</span> "
							ht += '<a href="/manage_page.php?action=bans&session='+session+'" target="_blank" title="Ban session"> BS </a> ] '
						}
						ht += "[<span class=\"post-ip-hash\" style=\""+ipHash(ip)+"\" onclick=\"searchIP('"+ip+"')\">" + ip + "</span>"
						ht += " <a href=\"/manage_page.php?action=deletepostsbyip&ip=" + ip + "\" title=\"" + _('Delete all posts by this IP') + "\">D</a> / <a href=\"/manage_page.php?action=ipsearch&ip=" + ip + "\" title=\"" + _('Search for posts with this IP') + "\">S</a>] " + span.innerHTML;
						span.innerHTML = ht
					}
				}
			}
		}
	}
	var c = byClass('dnb'), d, e, elem, board, postNum, f, pth
	for (var i = 0; i < c.length; i++) {
		elem = c[i]
		if (elem.id) {
			board = elem.id.split('-')[1]
			postNum = elem.id.split('-')[2]
			e = elem.id.split('-')
			elem.innerHTML = ""
			f = ""
			pth = (e[3] == 'y')?'thread':'post'
			f += '['
			// Delete
			f += '<a href="/manage_page.php?action=delposts&boarddir=' + e[1] + '&del';
			f += pth + 'id=' + e[2] + '" title="' + _('Delete') + '" onclick="return \
			confirm(_(\'Are you sure you want to delete this post/thread?\'));">D<\/a>'
			f += '&nbsp;'
			// DnB
			f += '<a href="/manage_page.php?action=delposts&boarddir=' + e[1] + '&del'
			f += pth + 'id=' + e[2] + '&postid=' + e[2] + '" title="' +
			 _('Delete &amp; Ban') + '" onclick="return confirm(_(\'Are you sure you \
			 want to delete and ban the poster of this post/thread?\'));">&amp;<\/a>'
			f += '&nbsp;'
			// Ban
			f += '<a href="/manage_page.php?action=bans&banboard=' + e[1] +
			'&banpost=' + e[2] + '" title="' + _('Ban') + '">B<\/a>'
			f += '] ['
			// SD
			f += '<a href="/manage_page.php?action=softdelposts&boarddir=' + e[1] + '&del'
			f += pth + 'id=' + e[2] + '&postid=' + e[2] + '" title="' + _('Soft del')
			+ '" onclick="return confirm(_(\'Are you sure you want to delete and ban\
			 the poster of this post/thread?\'));">SD<\/a>]'
			f += ' ['
			// ED
			f += '<a href="/manage_page.php?action=editpost&boarddir=' + config.board
			+ '&postid='+e[2]+'">ED</a>]'
			f += '&nbsp;['
			f += '<a href="/manage_page.php?action=bans&banboard=' + e[1] +
			'&banpost=' + e[2] + '&instant=y" title="' + _('Instant Permanent Ban') +
			'" onclick="instantban(\'' + e[1] + '\',' + e[2] + '); return false;">P<\/a>'
			f += '&#93;&nbsp;&#91;'
			f += '<a href="/manage_page.php?action=delposts&boarddir=' + e[1] + '&del'
			f += pth + 'id=' + e[2] + '&postid=' + e[2] + '&cp=y" title="'
			+ _('Child Pornography') + '" onclick="return confirm(_(\'Are you sure\
			 that this is child pornography?\'));">CP<\/a> / ';
			f += '<a href="javascript:add2Spam('+e[2]+')">2SPM</a> ]'
			c[i].innerHTML = f
		}
	}
}

function add2Spam(postNum) {
	var id = 'post-text-'+postNum
	var text = byID(id).textContent,
		urls = extractDomains(text),
		urlList = '\n'+urls.join('\n'),
		promptText = 'Are you sure you want to add the following urls to spamlist? '+urlList,
		answer = confirm(promptText), xmlHttp
	if (answer) {
		xmlHttp = new XMLHttpRequest()
		xmlHttp.open("GET", "/manage_page.php?action=addtospamlist&domains=" + encodeURIComponent(urlList))
		xmlHttp.send( null )
		xmlHttp.onreadystatechange = function(){
			if(this.readyState == 4){
				if(this.status == 200){
					this.textContent = 'added'
				}
			}
		}
	}
}

function extractDomains(text) {
	var r = []
	var urlRegex = /(https?:\/\/[^\s]+)/g;
	text.replace(urlRegex, function(url) {
		r.push(url)
		return '';
	})
	for(var i = 0; i < r.length; i++) {
		r[i] = function (data) {
			var a = document.createElement('a');
			a.href = data;
			return a.hostname;
		}(r[i])
	}
	r = [...new Set(r)];
	return r
}

setTimeout(modActions, 10)
