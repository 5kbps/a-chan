String.prototype.replaceAll=function(find, replace_to){
    return this.replace(new RegExp(find, "g"), replace_to);
};

function addTagToMsg( tag ) {
	sBegin = '[' +tag+']';
	sEnd   = '[/'+tag+']';
	if(tag==">"){
		sBegin = '> ';
		sEnd = '';
	}
    textarea = document.getElementById( 'message' );
    if( !textarea ) return;
    if( document.selection ) {
        textarea.focus();
        sel = document.selection.createRange();
        sel.text = sBegin + sel.text + sEnd;
    } else if( textarea.selectionStart || textarea.selectionStart == '0') {
        textarea.focus();
        var startPos = textarea.selectionStart;
        var endPos = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, startPos) + sBegin + textarea.value.substring(startPos, endPos) + sEnd + textarea.value.substring( endPos, textarea.value.length );
    } else {
        textarea.value += sBegin + sEnd;
    }
    return false;
}

function getOffsetRect(elem) {
	var box = elem.getBoundingClientRect()
	var body = document.body
	var docElem = document.documentElement
	var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
	var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
	var clientTop = docElem.clientTop || body.clientTop || 0
	var clientLeft = docElem.clientLeft || body.clientLeft || 0
	var top  = box.top +  scrollTop - clientTop
	var left = box.left + scrollLeft - clientLeft
	return { top: Math.round(top), left: Math.round(left) }
}
var config = [];
config['protocol'] = document.location.href.split(':')[0];
config['domain'] = document.location.hostname;
config['board'] = document.location.href.split('/')[3];
config['userstyle'] = '/static/styleman.php';
config['globalstyle'] = '/static/a-chan.css';
function remch(elem){
	elem.parentNode.removeChild(elem);
}

function log(t){
	//console.log(t);
}
// fixing some default kusaba x functions


function normalizeDate(){
	while(document.getElementsByClassName('formatted_timestamp')[0] !== undefined){
		var pstr = getParam('datetime');
		var curTimeStamp = document.getElementsByClassName('formatted_timestamp')[0];
		var time = curTimeStamp.innerHTML.trim();
		var year = time.split('/')[0];
		var month = time.split('/')[1];
		var date = time.split('/')[2].split('(')[0];
		var day = time.split('(')[1].split(')')[0];
		var mins = time.split(')')[1].trim();
		day = normalizeDayOfWeek(day);
		
		pstr = pstr.replace('date', date);
		pstr = pstr.replace('month', month);
		pstr = pstr.replace('year', year);
		pstr = pstr.replace('day', day);
		pstr = pstr.replace('time', mins);
		curTimeStamp.innerHTML = pstr;
		curTimeStamp.className = 'processed_timestamp';
	}
}
function normalizeDayOfWeek(day){
	switch (day) {
		case 'Sun':
			return 'Воскресенье';
			break
		case 'Mon':
			return 'Понедельник';
			break
		case 'Tue':
			return 'Вторник';
			break
		case 'Wed':
			return 'Среда';
			break
		case 'Thu':
			return 'Четверг';
			break
		case 'Fri':
			return 'Пятница';
			break
		case 'Sat':
			return 'Суббота';
			break
		default:
			return day;
	}
}
function addReverseLinks(){
	for(var i = 0; document.getElementById('delform').getElementsByTagName('a').length > i; i++){
		var a = document.getElementById('delform').getElementsByTagName('a')[i];
		if(a.textContent.charAt(0) == '>' && 
		 a.textContent.charAt(1) == '>' && 
		 isNaN(a.textContent.substr(2)) == false && 
		 a.className != 'reflink' && 
		 a.className != 'smlink'){
			var num = a.textContent.substr(2);
			var curnum = a.parentNode.parentNode.id.substr(5);
			if(curnum == num){
				a.innerHTML += ' [SELF]';
			}
			if(num +'' != $a['threadNum']){
				if(document.getElementById('reply'+num) != null ){
					var lp = document.getElementById('reply'+num);
					if(lp.getElementsByClassName('reflist').length == 0){
						lp.innerHTML += '<br><span class="reflist">Ответы: </span>';
					}
					lp.getElementsByClassName('reflist')[0].innerHTML += ' ' + '<a href="#'+a.textContent.substr(2)+'" class="smlink" onmouseover="showPost(this, event);">' + '>>' + curnum +'</a>';
					i++;
					a.className = 'reflink';
					var ou = a.outerHTML;
					ou = '<a' + ' onmouseover="showPost(this, event);" '+ ou.substr(2);
					a.outerHTML = ou;
				}else{
					a.innerHTML = '<s>'+a.innerHTML+'</s>';
				}
			}else{
				a.innerHTML += ' [OP]';
				a.className = 'opreflink';
				var ou = a.outerHTML;
				ou = '<a' + ' onmouseover="showOP(this,event);" '+ ou.substr(2);
				a.outerHTML = ou;
			}
		}
	}
}

function addReverseLinks0 () {
	for(var i = 0; document.getElementById('delform').getElementsByTagName('a').length > i; i++){
		var a = document.getElementById('delform').getElementsByTagName('a')[i];
		if(a.textContent.charAt(0) == '>' && 
		 a.textContent.charAt(1) == '>' && 
		 isNaN(a.textContent.substr(2)) == false && 
		 a.className != 'reflink' && 
		 a.className != 'smlink'){
			var num = a.textContent.substr(2);
			var curnum = a.parentNode.parentNode.id.substr(5);
			if(curnum == num){
				a.innerHTML += ' [SELF]';
			}
			if(a.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id.split('replies')[0].split(config['board'])[0]==a.textContent.substr(2)){
				a.innerHTML+=' [OP]';
			}
			if(document.getElementById('reply'+num) != null ){
				var lp = document.getElementById('reply'+num);
				if(lp.getElementsByClassName('reflist').length == 0){
					var reflist = document.createElement('div');
					reflist.className='reflist';
					reflist.innerHTML = 'Ответы: ';
					lp.appendChild(reflist);
				}else{
					reflist = lp.getElementsByClassName('reflist')[0];
				}
				reflist.innerHTML += '<a href="#'+a.textContent.substr(2)+'" class="smlink" onmouseover="showPost(this, event);">' + '>>' + curnum +'</a>';
				/*var link = document.createElement('a');
				link.href = '#'+a.textContent.substr(2);
				link.className = 'smlink';
				link.onmouseover = function(){
					showPost(this);
				}
				link.innerHTML = '>>' + curnum;
				reflist.appendChild(link);*/
				i++;
				a.className = 'reflink';
				var ou = a.outerHTML;
				ou = '<a' + ' onmouseover="showPost(this, event);" '+ ou.substr(2)+'</a>';
				a.outerHTML = ou;
			}else{
				a.onmouseover = function(){
					loadPost(this);
				}
			}
		}
	}
}

function addLoadedPostEvents(elem){
	for(var i = 0; i < elem.getElementsByTagName('a').length; i++){
		if(elem.getElementsByTagName('a')[i].textContent.split('>').length==3){
			var postNum = elem.textContent.split('>>')[1];
			if(document.getElementById('reply'+postNum)!=null){
				elem.getElementsByTagName('a')[i].onmouseover=function(event){
					showPost(this);
				}	
			}else{
				elem.getElementsByTagName('a')[i].onmouseover=function(event){
					loadPost(this);
				}
			}
		}
	}
}
function loadPost(elem){
	var postNum = elem.className.split('|')[3];
	var boardNum = elem.className.split('|')[1];
	var threadNum = elem.className.split('|')[2];
	if(postNum==undefined){
		postNum = elem.href.split("#")[1]
		boardNum = elem.href.split("/")[3]
		threadNum = elem.href.split("/")[5].split(".")[0]
	}
	if(document.getElementById('loadedPost'+postNum)===null){
		var reqUrl = 'http://'+config['domain']+'/read.php?b='+boardNum+'&t='+threadNum+'&p='+postNum+'&single';
		xmlHttp = new XMLHttpRequest();
	    xmlHttp.open( "GET", reqUrl, true );
		xmlHttp.send( null );
	    xmlHttp.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200) {
				var postNum = this.responseURL.split('&p=')[1].split('&')[0];
				var boardNum = this.responseURL.split('?b=')[1].split('&')[0];
				var threadNum = this.responseURL.split('&t=')[1].split('&')[0];
				var elem = document.getElementsByClassName('ref|'+boardNum+'|'+threadNum+'|'+postNum)[0];
				var px = config['mousemovedeltaX'];//getOffsetRect(elem).left  + elem.offsetWidth/2;
				var py = config['mousemovedeltaY'] + window.scrollY;//getOffsetRect(elem).top   + elem.offsetHeight;
				if(document.getElementById('loadedPost'+postNum)===null){
					var lp = document.createElement('div');
					lp.style['position'] = 'absolute';
					lp.style['top'] = py+'px';
					lp.style['left'] = px+'px';
					lp.className = 'lightPost loadedPost';
					lp.id='loadedPost'+postNum;
					lp.innerHTML = this.responseText;
					document.body.appendChild(lp);
					addLoadedPostEvents(lp);
				}	
			}
		}
	}
}
function showPost(elem,event){
	var num = elem.textContent.substr(2);
		//	hidePosts();
	var cln = 'lightPost';
	if( document.getElementById('lightPost'+num) != null){
		var torem = document.getElementById('lightPost'+num);
		torem.parentNode.removeChild(torem);
	}
		var post = document.getElementById('reply'+num);
		var curPost = elem.parentNode.parentNode.parentNode;
		var lightPost = post.cloneNode(true);
		lightPost.className = cln;
		lightPost.id = 'lightPost'+num;
		lightPost.style['position'] = 'absolute';
		var px = getOffsetRect(elem).left  + elem.offsetWidth/2;
		var py = getOffsetRect(elem).top   + elem.offsetHeight;
		var postBold = '>>' + elem.parentNode.parentNode.id.substr(5);
		var postBold2 = '>>' + elem.parentNode.parentNode.id.split('lightPost')[1];
		//console.log(elem);
		for(var i = 0; lightPost.getElementsByClassName('reflink').length > i; i++){
			if(lightPost.getElementsByClassName('reflink')[i].textContent == postBold ||  lightPost.getElementsByClassName('reflink')[i].textContent == postBold2){
				lightPost.getElementsByClassName('reflink')[i].className = 'reflink boldLink';
			}
		}
		document.body.appendChild(lightPost);

		var clWidth = lightPost.clientWidth;
		var clHeight =lightPost.clientHeight;
		var bodyWidth = document.body.clientWidth;
		var bodyHeight = document.body.clientHeight;

		if(px+clWidth > bodyWidth){
			px -= clWidth;
		}
		if(py+clHeight > bodyHeight){
			py -= clHeight;
		}
		if(clWidth>bodyWidth){
			lightPost.style['width'] = bodyWidth+'px';
		}
		if(px<0){
			px= document.body.clientX;
		}
		lightPost.style['left'] =  px + 'px';
		lightPost.style['top']  =  py + 'px';
//		lightPost.innerHTML = '<div class="reply">' + lightPost.innerHTML + '</div>';
		if(document.location.href.split('/').length == 6){
			addReverseLinks();
		}else{
			addReverseLinks0();
			addLoadedPostEvents(lightPost);
		}
}

function hidePosts(){
	removePopupMenus();
	for(var i = 0; document.getElementsByClassName('lightPost').length > i; i++){
		document.getElementsByClassName('lightPost')[i].parentNode.removeChild(document.getElementsByClassName('lightPost')[i]);
		i --;
	}
}
function showOP(elem,event){
	//в процессе
	
	if( document.getElementById('lightPost'+$a['threadNum']) != null){
		var torem = document.getElementById('lightPost'+$a['threadNum']);
		torem.parentNode.removeChild(torem);
	}
	var cln = 'lightPost';
	var thtml = document.getElementById('thread'+$a['threadNum']+$a['boardCode']).innerHTML.split('<a name="s"></a>')[1].split('<table>')[0];
	var lightPost = document.createElement('div');
			lightPost.innerHTML = thtml;
		document.body.appendChild(lightPost);
		lightPost.className = cln;
		lightPost.id = 'lightPost'+$a['threadNum'];
		lightPost.style['position'] = 'absolute';
		var px = getOffsetRect(elem).left  + elem.offsetWidth/2;
		var py = getOffsetRect(elem).top   + elem.offsetHeight;
		if(event.clientY > innerHeight - 100){
			py -= innerHeight - event.clientY;
		}
		var postBold = '>>' + elem.parentNode.parentNode.id.substr(5);
		for(var i = 0; lightPost.getElementsByClassName('reflink').length > i; i++){
			if(lightPost.getElementsByClassName('reflink')[i].textContent == postBold){
				lightPost.getElementsByClassName('reflink')[i].style['color'] = 'green';
			}
		}
		lightPost.style['left'] =  px+ 'px';
		lightPost.style['top']  =  py+ 'px';
		lightPost.innerHTML = '<div class="reply">' + lightPost.innerHTML + '</div>';
		if(document.location.href.split('/').length == 6){
			addReverseLinks();
		}else{
			addReverseLinks0();
		}
		
}



/////////////////////////
// Счетчик новых постов//
/////////////////////////

var Boards = [];
bs = document.getElementsByClassName('boardList')[0].getElementsByTagName('a');
for(var i = 0; i < bs.length; i++){
	Boards[i] = bs[i].innerHTML;
}
function getWatchingBoards(){
	var watchingBoards = [];
	for(var i = 0; i < Boards.length; i++){
		if(getParam('wb_'+Boards[i])!='false' && getParam('watchBoards')=='true'){
			watchingBoards[watchingBoards.length] = Boards[i];
		}
	}
	return watchingBoards;
}
function checkBoards(){
	reqIterator = 0;
	checkForNewPosts();
	for(var k = 0; document.getElementsByClassName('gc').length > k; k++){
		remch( document.getElementsByClassName('gc')[k]);
	}
}

function isBoardPage(){
 	return (document.location.href.split('/').length==5 );
}

function is0page(){
 	return (document.location.href.split('/').length==5 && (document.location.href.split(config['board']+'/')[1]=='' || document.location.href.split(config['board']+'/')[1].substr(0,1)=='#'));
}
function isThread(){
 	return (document.location.href.split('/').length==6);
}
function watchBoard(){
		var lastpost = 0;
		for(var i = 0; i < document.links.length; i++){
			if(document.links[i].parentNode.className=='reflink'){
				if(lastpost<document.links[i].href.split('#')[1]*1 && document.links[i].href.split('i').length==1){
					lastpost = document.links[i].href.split('#')[1]*1;
					//console.log(document.links[i]);
				}
			}
		}
		if(getParam('lp_'+config['board'])*1<lastpost){
			if(getParam('lp_'+config['board'])*1 != 0){
				showMessage('Новых постов: '+(lastpost-getParam('lp_'+config['board'])*1));
			}else{
				showMessage('Нет новых постов.', 10);
			}
			localStorage.setItem('lp_'+config['board'], lastpost);
		}
}
function showWBSettings(){
	if(document.getElementById('watchingboardssettings') == null){
		sett = document.createElement('div');
		sett.style['position'] = 'fixed';
		sett.style['top'] = '1px';
		sett.style['left'] = '1px';

		if(getParam('watchBoards')=='true'){
			var watchBoards = ' checked ';
		}else{
			var watchBoards = '';
		}

		var html = '<table width=600>';
		html+=	  '<tr><td colspan=2><b>Отслеживаемые доски</b></td>';
		html +=   '<tr><td colspan=2> <input type="checkbox" id="watchBoards" '+watchBoards+'>Включить отслеживание новых постов</td></tr>';
		for(var i = 0; i < Boards.length; i++){
			if(getParam('wb_'+Boards[i])=='false'){
				var tmp = '';
			}else{
				var tmp = 'checked';
			}
			html +=   '<tr><td title="Получать уведомления о новых постах на этой доске">Отслеживать /'+Boards[i]+'/ </td><td><input type="checkbox" id="wb_'+Boards[i]+'" '+tmp+'></td></tr>';
		}
		html +=   '<tr><td>Интервал проверки: </td><td><input id="wb_interval" title="Проверять наличие новых постов на отслеживаемых досках раз в n секунд (n <= 40)" value="'+getParam('wb_interval')+'"></td></tr>';
		html +=   '<tr><td> <span id="applySettings" onclick="applyWBSettings(this)">OK</span></td><td> <span id="closeSettings" onclick="remch(this.parentNode.parentNode.parentNode.parentNode.parentNode);">Закрыть</span></td></tr>';
		html += '</table>';
		sett.innerHTML = html;
		sett.style['border'] = '1px solid #da7';
		sett.className="reply";
		sett.style['padding'] = '7px';
		sett.id = 'watchingboardssettings';
		document.body.appendChild(sett);	
	}else{
		remch(document.getElementById('watchingboardssettings'));
	}
}


function applyWBSettings(elem){
	var noerror = 1;
	var message = ''
	if(!isNaN(document.getElementById('wb_interval').value) && document.getElementById('wb_interval').value != '' && document.getElementById('wb_interval').value > 40){
		localStorage.setItem('wb_interval', document.getElementById('wb_interval').value);
	}else{
		message += 'Интервал проверки новых постов должен быть числом, не меньшим 40!<br>';
		document.getElementById('wb_interval').value = defaultSettings('wb_interval');
		localStorage.setItem('wb_interval',60);
		noerror = 0;
	}
	localStorage.setItem('watchBoards',document.getElementById('watchBoards').checked);
	if(document.getElementById('watchBoards').checked==false){
		for(var i = 0; i < document.getElementsByClassName('sm_counter').length; i++){
			remch(document.getElementsByClassName('sm_counter')[i]);
		}
	}else{
		checkForNewPosts();
	}
	for(var i = 0; i < Boards.length; i++){
		localStorage.setItem('wb_'+Boards[i],document.getElementById('wb_'+Boards[i]).checked);
	}
	if(isNaN(document.getElementById('wb_interval').value)==false){
		if(document.getElementById('wb_interval').value<40){
			document.getElementById('wb_interval').value = 40;
		}
		localStorage.setItem('wb_interval',document.getElementById('wb_interval').value);
	}else{
		message+='Слишком маленький интервал (<40 сек.)';
	}
	if(noerror){
		showMessage('Настройки сохранены.', 0);
		remch(document.getElementById('watchingboardssettings'));
	}else{
		showMessage(message + 'Установлены значения по умолчанию.', 1);
	}
}

var checkRequests = [];

function checkForNewPosts(){
	for(var i = 0; i < getWatchingBoards().length; i++){
		rollLogo();
	}
	checkRequests[0] = new XMLHttpRequest();
	checkRequests[0].open("GET", config['protocol']+'://'+config['domain']+'/api.php?action=lastpost&board=all&nocache='+Math.random(), true );
	//console.log('Реквест /'+getWatchingBoards()[i]);
	checkRequests[0].send(null);
	checkRequests[0].onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200 ) {
			var response = JSON.parse(this.responseText);
			for(board in response){
				var watching = false;
				for(cwb in getWatchingBoards()){
					if(getWatchingBoards()[cwb]==board){
						var watching = true;
					}
				}
				if(watching){
					var tboard = board;
					var oldpostcount = localStorage.getItem('lp_'+tboard);
					var newpostcount = response[board];

					if(oldpostcount != null && oldpostcount < newpostcount ){
						var tspan1 = document.createElement('span');
						tspan1.innerHTML = '+'+(newpostcount - oldpostcount);
						tspan1.className = 'sm_counter';
						tspan1.id = 'sm_counter1_'+tboard;
						tspan1.onclick = function(){
							setLP2result(this);
						}

						var tspan2 = document.createElement('span');
						tspan2.innerHTML = '+'+(newpostcount - oldpostcount);
						tspan2.className = 'sm_counter';
						tspan2.id = 'sm_counter2_'+tboard;
						tspan2.onclick = function(){
							setLP2result(this);
						}

						if(document.getElementById(tspan1.id)==null){
							insertAfter(tspan1, document.getElementsByClassName('sm_'+tboard)[0]);
							insertAfter(tspan2, document.getElementsByClassName('sm_'+tboard)[1]);
						}else{
							document.getElementById('sm_counter1_'+tboard).innerHTML = tspan1.innerHTML;
							document.getElementById('sm_counter2_'+tboard).innerHTML = tspan2.innerHTML;
						}
					}else if(oldpostcount >= newpostcount){
						if(document.getElementById('sm_counter1_'+tboard) && document.getElementById('sm_counter1_'+tboard)){
							remch(document.getElementById('sm_counter1_'+tboard));
							remch(document.getElementById('sm_counter2_'+tboard));
						}
					}else{
						localStorage.setItem("lp_"+tboard,newpostcount);
					}
				}
			}
		}
	}
}
function setLP2result(elem){
	var tboard = elem.id.split('_')[2];
	var lastpost = (elem.textContent.split('+')[1]*1) + 1*localStorage.getItem('lp_'+tboard);
	localStorage.setItem('lp_'+tboard,lastpost);
	remch(document.getElementById('sm_counter1_'+tboard));
	remch(document.getElementById('sm_counter2_'+tboard));
}

/*#####################
# Сохранение треда в один файл 
#######################*/

function image2base64(image){
	var c = document.createElement('canvas');
	c.width = image.width;
	c.height = image.height;
	var ctx = c.getContext("2d");
	ctx.drawImage(image, 0,0);
	image.src= c.toDataURL();
	delete c;
}
function convert2base64(){
	for(var i = 0; i < document.getElementsByTagName('img').length; i++){
		var cel = document.getElementsByTagName('img')[i];
		if(cel.src.split('/')[2]==document.location.href.split('/')[2])
			image2base64(cel);
	}
	for(var i = 0; i < document.getElementsByTagName('image').length; i++){
		var cel = document.getElementsByTagName('image')[i];
		if(cel.src.split('/')[2]==document.location.href.split('/')[2])
			image2base64(cel);
	}
}

var userstyle='', globalstyle='';
function saveToFile(){
	showMessage('Сохранение одним файлом...');
	convert2base64();
	var stylereq1 = new XMLHttpRequest();	
	stylereq1.open("GET", config['userstyle'], true );
	stylereq1.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200 ) {
			userstyle = this.responseText;
			saveToFileDownload();
			
		}
	}
  	stylereq1.send(null);
	var stylereq2 = new XMLHttpRequest();
	stylereq2.open("GET", config['globalstyle'], true );
	stylereq2.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200 ) {
			globalstyle = this.responseText;
			saveToFileDownload();
		}
	}
  	stylereq2.send(null);
}

function saveToFileDownload(){
	if(userstyle && globalstyle){
		showMessage('');
		var	txt = ['<html><head>'+document.head.innerHTML +'<style>'+userstyle+'</style><style>'+globalstyle+'</style></head><body>'+document.body.innerHTML+'</body></html>'];
		var blob = new Blob(txt, {type : 'text/html'});
		window.saveAs(blob, document.title+'.html');
		showMessage('Готово',3);
	}
}

/*######################
### Анимация логотипа ##
######################*/
var logo_rotation = 0;
function rollLogo(){
	logo_rotation++;
	document.getElementById('new_logo').style['-moz-transform'] = 'rotate('+logo_rotation*360+'deg)'; 
	document.getElementById('new_logo').style['-webkit-transform'] = 'rotate('+logo_rotation*360+'deg)'; 
	document.getElementById('new_logo').style['-ms-transform'] = 'rotate('+logo_rotation*360+'deg)'; 
	document.getElementById('new_logo').style['-o-transform'] = 'rotate('+logo_rotation*360+'deg)'; 
	document.getElementById('new_logo').style['transform'] = 'rotate('+logo_rotation*360+'deg)'; 
}

function startWBInterval(){
	if(getParam('watchBoards') == 'true'){
		inter = getParam('wb_interval');
		if(inter == null || isNaN(inter)){
			inter = 60;
		}
		if(inter < 40){
			inter = 40;
			localStorage.setItem('wb_interval',inter);
			showMessage('Недопустимый интервал проверки новых постов, установлено значение 40');
		}
		config['bw_interval'] = setInterval(checkForNewPosts,inter*1000)
		checkForNewPosts();
	}
}
function insertAfter(elem, refElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(elem, next);
    } else {
        return parent.appendChild(elem);
    }
}

function showMessage(text, autohide){
	if(document.getElementById('mes') != null){
		clearTimeout(mesremove);
	}else{
		mes = document.createElement('div');
		mes.onclick = function(){ remch(this);};
		mes.id = 'mes';
	}
	mes.innerHTML = text;
	document.body.appendChild(mes);
	if(autohide){
		mesremove = setTimeout('mes.parentNode.removeChild(mes);', autohide*1000);	
	}
}

function addFeatures(){
	if(document.getElementById("style_sel") !== undefined){
		document.getElementById("style_sel").value = getCookie2('style');
	}
	if(getCookie2('style')===undefined){
		document.getElementById("style_sel").value = "Muon";
		var expires = new Date();
		var time = expires.getTime();
		var expireTime = time + 8640000000;//100 дней
		expires.setTime(expireTime);

		document.cookie = 'style' + "=" + escape("Muon") +
        ((expires) ? "; expires=" + expires : "") +
        ("; path=/");
	}
	if( getCookie2('style')=="undefined"){
		document.getElementById("style_sel").value = "Muon";
		var expires = new Date();
		var time = expires.getTime();
		var expireTime = time + 8640000000;//100 дней
		expires.setTime(expireTime);
		document.cookie = 'style' + "=" + escape("Muon") +
        ((expires) ? "; expires=" + expires : "") +
        ("; path=/");
	}
	document.getElementById('style_sel').onchange = function(){
		var expires = new Date();
		var time = expires.getTime();
		var expireTime = time + 8640000000;//100 дней
		expires.setTime(expireTime);

		document.cookie = 'style' + "=" + escape(this.value) +
        ((expires) ? "; expires=" + expires : "") +
        ("; path=/");
		document.location.reload();
	}
}

function getCookie2(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}


function defaultSettings(param){
	switch(param){
		case 'interval':
			return 145;
			break;
		case 'datetime':
			return 'date.month.20year (day) <b>time</b>'; 
			break;
		case 'title':
			return '/board/ - subject text'; 
			break;
		case 'autoupdate':
			return 0;
			break;
		case 'hour':
			return '+0';
			break;
		case 'messageTimeout':
			return 8000;
			break;
		case 'stitleformat':
			return '/board/ - subject text';
			break;
		case 'expandYT':
			return true;
			break;
		case 'noRef':
			return 'false';
			break;
		case 'onlyThumbs':
			return 'false';
			break;
		case 'watchBoards':
			return 'true';
			break;
		case 'wb_interval':
			return '60';
			break;
		case 'wb_a':
			return 'true';
			break;
		case 'wb_b':
			return 'true';
			break;
		case 'wb_d':
			return 'true';
			break;
		case 'wb_bo':
			return 'true';
			break;
		case 'wb_mov':
			return 'true';
			break;
		case 'wb_p2p':
			return 'true';
			break;
		case 'wb_sp':
			return 'true';
			break;
		case 'wb_mov':
			return 'true';
			break;
		case 'wb_mu':
			return 'true';
			break;
		case 'wb_vg':
			return 'true';
			break;
		default:
			return '0';
			break;
		}
}
function getParam(text){
	if(localStorage.getItem(text)){
		return localStorage.getItem(text);
	}else{
		localStorage.setItem(text, defaultSettings(text));
		return defaultSettings(text);
	}
}

function showSettings(){
	if(document.getElementById('settingspanel') == null){
		sett = document.createElement('div');
		sett.style['position'] = 'fixed';
		sett.style['top'] = '1px';
		sett.style['left'] = '1px';
		var html = '<table width=600>';
		html +=   '<tr><td colspan=2> <input type="checkbox" id="sautoupdate" checked>Автоматически обновлять тред</td></tr>';
		html += '<tr><td width=180>Интервал автообновления:</td><td width=410> <input id="sinterval" title="0 - отключить \n 45 - по умолчанию" value="'+ getParam('interval') + '"></td></tr>';
	//	html +=   '<tr><td colspan=2> <input type="checkbox" id="sscrolldown" checked>Прокручивать в конец при обновлении</td></tr>';
		html +=   '<tr><td>Формат времени: </td><td><input id="sdateformat" title="Переменные : \n date \n month \n year \n day \n time \n Можно использовать HTML-теги" value="'+getParam('datetime')+'"></td></tr>';
		html +=   '<tr><td>Формат заголовка: </td><td><input id="stitleformat" title="Переменные: \n board \n subject \n text" value="'+getParam('title')+'"></td></tr>';
		
		if(getParam('expandYT')=='true'){
			var expandYT = ' checked ';
		}else{
			var expandYT = '';
		}
		if(getParam('noRef')=='true'){
			var noRef = ' checked ';
		}else{
			var noRef = '';
		}		
		if(getParam('onlyThumbs')=='true'){
			var onlyThumbs = ' checked ';
		}else{
			var onlyThumbs = '';
		}		
		html +=   '<tr><td title="Кроссдоменно загружать картинки-превью для видео с youtube." colspan=2> <input type="checkbox" id="expandYT" '+expandYT+'>Показывать превью для youtube</td></tr>';
		html +=   '<tr><td title="Не показывать реверс-ссылки на посты (у меня куклоскрипт)" colspan=2> <input type="checkbox" id="noRef" '+noRef+'>Не показывать >>ответы </td></tr>';
		html +=   '<tr><td title="При сохранении треда в .zip оригиналы картинок не будут включены в архив" colspan=2> <input type="checkbox" id="onlyThumbs" '+onlyThumbs+'> При сохранении не загружать оригиналы</td></tr>';
		html +=   '<tr><td> <span id="applySettings" onclick="applySettings(this)">OK</span></td><td> <span id="closeSettings" onclick="remch(this.parentNode.parentNode.parentNode.parentNode.parentNode);">Закрыть</span></td></tr>';
		html += '</table>';
		sett.innerHTML = html;
		sett.style['border'] = '1px solid #da7';
		//sett.style['background'] = '#F0E0D6';
		sett.className="reply";
		sett.style['padding'] = '7px';
		sett.id = 'settingspanel';
		document.body.appendChild(sett);	
	}else{
		remch(document.getElementById('settingspanel'));
	}
}
function Cookie(name) {
    if (arguments.length == 1) {
        with(document.cookie) {
            var regexp=new RegExp("(^|;\\s+)"+name+"=(.*?)(;|$)");
            var hit=regexp.exec(document.cookie);
            if(hit&&hit.length>2) return Utf8.decode(unescape(replaceAll(hit[2],'+','%20')));
            else return '';
        }
    } else {
        var value = arguments[1];
        var days = arguments[2];
        if(days) {
            var date=new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var expires="; expires="+date.toGMTString();
        } else expires="";
        document.cookie=name+"="+value+expires+"; path=/";
    }
}

function applySettings(elem){
	var noerror = 1;
	var message = ''
	if(!isNaN(document.getElementById('sinterval').value) && document.getElementById('sinterval').value != '' && document.getElementById('sinterval').value > 0){
		localStorage.setItem('interval', document.getElementById('sinterval').value);
	}else{
		message += 'Интервал автообновления должен быть числом! <br>';
		document.getElementById('sinterval').value = defaultSettings('interval');
		noerror = 0;
	}
	// формат даты
	if(document.getElementById('sdateformat').value != ''){
		localStorage.setItem('datetime', document.getElementById('sdateformat').value);
	}else{
		message+= 'Ошибка обработки формата даты. <br>';
		document.getElementById('sdateformat').value = defaultSettings('datetime');
		noerror = 0;
	}
	
	if(document.getElementById('stitleformat').value != ''){
		localStorage.setItem('title', document.getElementById('stitleformat').value);
		doTitle();
	}else{
		message+= 'Неверно указан формат заголовка. <br>';
		document.getElementById('sdateformat').value = defaultSettings('stitleformat');
		noerror = 0;
	}
	localStorage.setItem('expandYT', document.getElementById('expandYT').checked);
	localStorage.setItem('noRef', document.getElementById('noRef').checked);
	localStorage.setItem('onlyThumbs', document.getElementById('onlyThumbs').checked);
	// // // //
	if(noerror){
		showMessage('Настройки сохранены, обновите страницу.', 0);
		remch(document.getElementById('settingspanel'));
	}else{
		showMessage(message + 'Установлены значения по умолчанию.', 1);
	}
}

function removeReplyMode(){
	remch(document.getElementsByClassName('replymode')[0]);
}
function autoUpdateTick(){
	if(getParam('interval') != '0'){
			showMessage('Обновление треда...', 3);
			updateThread();
	}
}
function updateThread(){
	var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", document.location.href.split('#')[0], true );
    xmlHttp.send( null );
    showMessage('Загрузка...', 0);
    xmlHttp.onreadystatechange = function(){
		  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			var xmlThreadLength = xmlHttp.responseText.split('class="reply" id=').length;
			var ThreadLength = document.getElementById('delform').getElementsByClassName('reply').length + 1 + document.getElementById('delform').getElementsByClassName('highlight').length;
			//console.log(ThreadLength + '  ' + xmlThreadLength);
			if(xmlThreadLength > ThreadLength){
				var tt = xmlHttp.responseText.split('<form id="delform" action="/board.php" method="post">')[1].split('</form>')[0].split('<table class="userdelete"')[0];
				tt = tt.split('<table>');
				for(var i = 0; i < tt.length; i++){
				  tt[i] = tt[i].split('</table>')[0];
				}
				var div2append = document.getElementById('thread'+$a['threadNum']+config['board']);
				for(var i = ThreadLength; i < tt.length; i++){
					var temptable = document.createElement('table');
					temptable.innerHTML = tt[i];
					temptable.className = 'justNowAddedPost';
					div2append.appendChild(temptable);
				}
				showMessage('Загружено '+ (document.getElementsByClassName('reply').length - ThreadLength + 1) + ' постов', 3);
				addReverseLinks();
				normalizeDate();
				doYT();
				makeExpandable();
				watchBoard();
				checkForNewPosts();
				document.body.scrollTop = document.body.scrollHeight;
			}else{
				showMessage('Нет новых постов', 10);
				extahtml = xmlHttp.responseText;
			}
		}
	}
}
function getRealStyle(elem, param){
	if(arguments.length != 2){
		return window.getComputedStyle ? getComputedStyle(elem, '') : elem.currentStyle;
	}else{
		var tmp = window.getComputedStyle ? getComputedStyle(elem, '') : elem.currentStyle;
		return tmp[param];
	}
}
var scrollspeed = 0;
function scrollToEnd(){
	window.scroll(0,document.body.clientWidth)
}
function startTicking(){
	if(getParam('interval') != '0'){
		ticker = setInterval(autoUpdateTick, getParam('interval')*1000);
	// Автообновление снова врублено.
	}
}

function toggleAutoUpdate(){
	if(getParam('interval') == '0'){
		localStorage.setItem('interval', 45);
	}else{
		localStorage.setItem('interval', 0);
	}
}

function makeExpandable(){
	for(var i = 0; i < document.getElementsByClassName('thumb').length ; i++){
		 document.getElementsByClassName('thumb')[i].onclick = function(){ expand(this); return false;};
	}
}

var imarr = [];
function expand(img){
	if(img.style['opacity'] != '0.3'){
		var tid = img.id.split('tid')[1];
		var reqimage = document.createElement('img');
		img.style['opacity'] = '0.3';
		reqimage.src = img.parentNode.parentNode.href;
		reqimage.className = 'normalsized';
		reqimage.id = 'nid'+tid;
		imarr[tid] = img.parentNode.id;
		reqimage.onload = function(){
			var tid = this.id.split('nid')[1];
			if(imarr[tid] !== undefined){
				document.getElementById(imarr[tid]).innerHTML = '';
				document.getElementById(imarr[tid]).appendChild(this);
				this.onclick = function(){
					unexpand(this);
					return false;
				}
			}
		}
	}else{
		imarr[img.id.split('tid')[1]] = undefined;
		img.style['opacity'] = '1';
	}
	return false;
}

function unexpand(img){
	if(img.style['opacity'] != '0.3'){
		var tid = img.id.split('nid')[1];
		var reqimage = document.createElement('img');
		var filename =  img.src; 
		img.style['opacity'] = '0.3';
		reqimage.src = filename.split(config['domain'])[1].replaceAll('/src/','/thumb/').replaceAll('.jpg','s.jpg').replaceAll('.png','s.png').replaceAll('.gif','s.gif');
		reqimage.className = 'thumb';
		reqimage.id = 'tid'+tid;
		imarr[tid] = img.parentNode.id;
		reqimage.onload = function(){
			var tid = this.id.split('tid')[1];
			document.getElementById(imarr[tid]).appendChild(this);
			remch(document.getElementById(imarr[tid]).getElementsByClassName('normalsized')[0]);
			this.onclick = function(){
				expand(this);
				return false;
			}
			return false;
		}
	}
	return false;	
}
function doTitle(){
	var title = getParam('title');
	if(typeof document.getElementsByClassName('filetitle')[0] != 'undefined'){
		var subject = document.getElementsByClassName('filetitle')[0].textContent;
		title = title.replace('subject', subject);
	}else{
		title = title.replace('subject', '');
	}
	if(document.getElementsByTagName('blockquote').length > 0){
		var te = document.createElement('div');
		te.innerHTML = document.getElementsByTagName('blockquote')[0].innerHTML.split('<br>')[0];
		var text = te.textContent.substr(0, 50);
		delete te;
		title = title.replace('text', text);
	}else{
		title = title.replace('text', '');		
	}
	title = title.replace('board', $a['boardCode']);
	document.title = title;
}


function getSel(){
     if (window.getSelection) {
        return window.getSelection();
    } else if (document.getSelection) {
        return document.getSelection();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
    return '';
}

function insert(ref){
	if(getSel()==''){
		sel = '';
	}else{
		sel = '> ';
	}
	document.getElementsByName('message')[0].value = document.getElementsByName('message')[0].value + ref + sel +getSel();
}

function doYT(){
	if(getParam('expandYT')=='true'){
		for(var i = 0; i < document.getElementById('delform').getElementsByTagName('a').length; i++){
		    if(document.getElementById('delform').getElementsByTagName('a')[i].href.split('.')[1]=='youtube' && document.getElementById('delform').getElementsByTagName('a')[i].href.split('/').length==4 && document.getElementById('delform').getElementsByTagName('a')[i].className!='ytbadded'){
				var vid=document.getElementById('delform').getElementsByTagName('a')[i].href.split('=')[1].split("&")[0].split("#")[0];
			    var img = document.createElement('img');
			    img.className = 'ytimg';
			    img.src = 'https://img.youtube.com/vi/'+vid+'/0.jpg';
			    img.onclick = function(){
			    	expandYT(this,this.src.split('/')[4]);
			    }
			    insertAfter(img,document.getElementById('delform').getElementsByTagName('a')[i]);
		        document.getElementById('delform').getElementsByTagName('a')[i].target = '_blank';
				document.getElementById('delform').getElementsByTagName('a')[i].className = 'ytbadded';			
			}
		}
	}
}
function expandYT(elem,vid){
	var div = document.createElement('div');
	div.innerHTML += '<div class="closeyt" onclick="closeYT(this);">Закрыть</div>';
	var tf = document.createElement('iframe');
	div.appendChild(tf);
	tf.width = 560;
	tf.height = 315;
	tf.className = 'ytv';
	tf.src = '//www.youtube.com/embed/'+vid;
	tf.frameborder=0;
	tf.allowfullscreen = true;
	insertAfter(div,elem);
	remch(elem);
	return false;
}

function closeYT(elem){
	var vid = elem.parentNode.getElementsByTagName('iframe')[0].src.split('/')[4];
  	var img = document.createElement('img');
  	img.src='https://img.youtube.com/vi/'+vid+'/0.jpg';
	img.className = 'ytimg';
	img.onclick = function(){
		expandYT(this,this.src.split('/')[4]);
	}
	elem.parentNode.appendChild(img);
	elem.parentNode.getElementsByTagName('iframe')[0].remove();
	elem.remove();
}

function webmExpand(elem){
	var webmURL = elem.parentNode.parentNode.href;
	var webmHTML = '<span class="webmhide" onclick="webmHide(this); return false;">Закрыть</span><br><video onclick="return false;" autoplay controls> <source src="'+webmURL+'" type="video/webm"></video>';
	elem.parentNode.innerHTML = webmHTML;
}
function webmHide(elem){
	var webmPreviewURL = elem.parentNode.parentNode.href;
	webmPreviewURL = webmPreviewURL.substr(0,webmPreviewURL.length-5);
	webmPreviewURL = webmPreviewURL.replace('/src/','/thumb/');
	webmPreviewURL +='webm.jpg';
	var webmPreviewHTML = '<img src="'+webmPreviewURL+'" class="webmthumb" onclick="webmExpand(this); return false;">';
	elem.parentNode.innerHTML = webmPreviewHTML;
}

function rkmSave(elem){
    elem.src = elem.parentNode.parentNode.href;
}

function handleFileSelect(evt) {
	document.getElementById('fileuploadlist').innerHTML = '';
	document.getElementById('clearfile').style['display'] = 'inline';
	var files = evt.target.files; // FileList object
	for (var i = 0, f; f = files[i]; i++) {
		if (!f.type.match('image.*')) {
		continue;
		}
      	var reader = new FileReader();
		reader.onload = (function(theFile) {
        return function(e) {
        	var span = document.createElement('span');
        	span.innerHTML = ['<img class="preloadthumb" title="Предпросмотр выбранного изображения" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('fileuploadlist').insertBefore(span, null);
        };
		})(f);
		reader.readAsDataURL(f);
    }
}
if(document.getElementById('fileupload')!=null){ 
	document.getElementById('fileupload').onchange = handleFileSelect;
}

//########################################
//### Передача параметров между вкладками
//### (снижает количество запросов на сервер)
//########################################
function genUniqueId(){
	//Генерирует ID вкладки, по которому она будет слушать изменения localStorage
	config['id'] = 'tabID'+Math.round(Math.random()*10000);
}

function checkListen(){
	if(config['id']===undefined){
		genUniqueId();
	}

}


//##################
// Подсветка только что добавленных постов

function watchPosts(){
	while(document.getElementsByClassName('justNowAddedPost').length){
		document.getElementsByClassName('justNowAddedPost')[0].className = '';
	}
}

function getPosition(element) {
      var r = element.getBoundingClientRect();
    return { x: r.left + window.pageXOffset, y: r.top + window.pageYOffset };
}

function removePopupMenus(){
  for(var i = 0; i < document.getElementsByClassName('popup').length; i++){
    remch(document.getElementsByClassName('popup')[i]);
  }
}
function hasImage(postCheckBox){
  return postCheckBox.parentNode.parentNode.getElementsByClassName('thumb').length + postCheckBox.parentNode.parentNode.getElementsByClassName('webmthumb').length + postCheckBox.parentNode.parentNode.getElementsByTagName('video').length + postCheckBox.parentNode.parentNode.getElementsByClassName('normalsized').length;
}
function getImageHref(popupitem){
  getImageHrefByCheckbox(popupitem.parentNode.parentNode.getElementsByTagName('input')[0]);
}
function getImageHrefByCheckbox(postCheckBox){
  if(postCheckBox.parentNode.parentNode.getElementsByClassName('thumb').length){
    return postCheckBox.parentNode.parentNode.getElementsByClassName('thumb')[0].parentNode.parentNode.href; 
  }else{
    if(postCheckBox.parentNode.parentNode.getElementsByClassName('normalsized').length){
      return postCheckBox.parentNode.parentNode.getElementsByClassName('normalsized')[0].parentNode.parentNode.href; 
    }else{
      if(postCheckBox.parentNode.parentNode.getElementsByClassName('webmthumb').length){
        return postCheckBox.parentNode.parentNode.getElementsByClassName('webmthumb')[0].parentNode.parentNode.href; 
      }else{
        if(postCheckBox.parentNode.parentNode.getElementsByTagName('video').length){
          return postCheckBox.parentNode.parentNode.getElementsByTagName('video')[0].parentNode.parentNode.href; 
        }else{
          return '';
        }
      }
    }
  }
}
function downloadImage(url, filename){
  if(url!=''){
    if(filename==undefined){
      filename = url.split('/')[url.split('/').length-1];
    }
    var a = document.createElement('a');
    a.href=url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    //alert(url);
    remch(a);
  }
}

function getCountOfCheckedCheckboxes(){
  var r = 0;
  for(var i = 0; i < document.getElementsByTagName('input').length;i++){
    var el = document.getElementsByTagName('input')[i];
    if(el.type=="checkbox" && (el.parentNode.parentNode.className == "reply" || el.parentNode.parentNode.id.split('thread').length>1)  && el.checked){
      r++;
    } 
  }
  return r;
}

function downloadCheckedImages(ext){
  var counter = 0;
  for(var i = 0; i < document.getElementsByTagName('input').length;i++){
    var el = document.getElementsByTagName('input')[i];
    if(el.type=="checkbox" && (el.parentNode.parentNode.className == "reply" || el.parentNode.parentNode.id.split('thread').length>1)  && el.checked){
      var fileext = getImageHrefByCheckbox(el).split('.')[getImageHrefByCheckbox(el).split('.').length-1]; 
      if(ext == undefined){
        if(fileext=='jpg'||fileext=='png'||fileext=='gif'||fileext=='mp3'||fileext=='webm'){
          downloadImage(getImageHrefByCheckbox(el));
          counter++;
        }else{
          if(fileext==ext){
            downloadImage(getImageHrefByCheckbox(el));
            counter++;
          }
        }
      }
    }
  }
  showMessage('Сохранено '+counter+' файлов.');
}

function uncheckCheckBoxes(){
  for(var i = 0; i < document.getElementsByTagName('input').length;i++){
    var el = document.getElementsByTagName('input')[i];
    if(el.type=="checkbox" && (el.parentNode.parentNode.className == "reply" || el.parentNode.parentNode.id.split('thread').length>1)  && el.checked){
      el.checked = false;
    }
  }
  showMessage('Ничего не выбрано.', 4);
}

function checkAllCheckBoxes(ext){
  var counter = 0;
  for(var i = 0; i < document.getElementsByTagName('input').length;i++){
    var el = document.getElementsByTagName('input')[i];
    if(ext == undefined){
      if(el.type=="checkbox" && (el.parentNode.parentNode.className == "reply" || el.parentNode.parentNode.id.split('thread').length>1) ){
        el.checked = true;
        if(getImageHrefByCheckbox(el).split('.').length>1){
        	counter++;
    	}
      }
    }else{
      if(el.type=="checkbox" && (el.parentNode.parentNode.className == "reply" || el.parentNode.parentNode.id.split('thread').length>1) ){
        if(getImageHrefByCheckbox(el).split('.')[getImageHrefByCheckbox(el).split('.').length-1]==ext ){
          el.checked = true;
          counter++;
        }else{
          el.checked = false;
        }
      }
    }
  }
  if(ext==undefined){
  	ext = '';
  }
  showMessage('Выбрано '+counter+' файлов '+ext);
}

function showPopup(elem,event){
	removePopupMenus();
	var position = getPosition(elem);
	position.h = window.getComputedStyle(elem)['height'].split('px')[0]*1;
	position.w = window.getComputedStyle(elem)['width'].split('px')[0]*1;
	var p = document.createElement('div');
	p.style['position'] = 'absolute';
	p.style['top'] = (position.y) + 'px';
	p.style['left'] = (position.x + position.w) + 'px';
	// p.style['width'] = '100px';
	p.className = 'popup';
	elem.parentNode.appendChild(p);
	elem.parentNode.onmouseleave = function(){
	removePopupMenus();
	}
	// Сохранение картинки
	if(hasImage(elem)){
	var savepic = document.createElement('div');
	savepic.className = 'popup-item';
	savepic.innerHTML = 'Сохранить этот файл';
	savepic.onclick = function(){
	  downloadImage(getImageHrefByCheckbox(this.parentNode.parentNode.getElementsByTagName('input')[0]));
	  removePopupMenus();
	  return false;
	}
	p.appendChild(savepic);
	}
	//Сохранение выбранных картинок
	if(getCountOfCheckedCheckboxes()>=2){
	var savepics = document.createElement('div');
	savepics.className = 'popup-item';
	savepics.innerHTML = 'Сохранить отмеченные файлы';
	savepics.onclick = function(){
	  downloadCheckedImages();
	  removePopupMenus();
	  return false;
	}
	p.appendChild(savepics);
	}
	// Сброс отметок
	if(getCountOfCheckedCheckboxes()>=1){
	var clearselection = document.createElement('div');
	clearselection.className = 'popup-item';
	clearselection.innerHTML = 'Очистить выбор';
	clearselection.onclick = function(){
	  uncheckCheckBoxes();
	  removePopupMenus();
	  return false;
	}
	p.appendChild(clearselection);
	}
	// Выбрать все
	var selectall = document.createElement('div');
	selectall.className = 'popup-item';
	selectall.innerHTML = 'Выбрать все';
	selectall.onclick = function(){
	checkAllCheckBoxes();
	removePopupMenus();
	return false;
	}
	p.appendChild(selectall); 
	// Выбрать:  
	var select = document.createElement('div');
	//select.className = 'subitem';
	select.innerHTML = 'Выбрать: ';
	select.onclick = function(){
	return false;
	}
	p.appendChild(select); 

	var jpg = document.createElement('span');
	jpg.innerHTML = 'jpg';
	jpg.className = 'subitem';
	jpg.onclick = function(){
	checkAllCheckBoxes('jpg');
	}
	select.appendChild(jpg);

	var png = document.createElement('span');
	png.innerHTML = 'png';
	png.className = 'subitem';
	png.onclick = function(){
	checkAllCheckBoxes('png');
	}
	select.appendChild(png);

	var gif = document.createElement('span');
	gif.innerHTML = 'gif';
	gif.className = 'subitem';
	gif.onclick = function(){
	checkAllCheckBoxes('gif');
	}
	select.appendChild(gif);

	var webm = document.createElement('span');
	webm.innerHTML = 'webm';
	webm.className = 'subitem';
	webm.onclick = function(){
	checkAllCheckBoxes('webm');
	}
	select.appendChild(webm);

}

function addCheckBoxActions(){
  for(var i = 0; i < document.getElementsByTagName('input').length;i++){
    var el = document.getElementsByTagName('input')[i];
    if(el.type=="checkbox" && (el.parentNode.parentNode.className == "reply" || el.parentNode.parentNode.id.split('thread').length>1) ){
      el.onmouseover = function(event){
        showPopup(this, event);
      }
    }  
  }
}

function togglePostPreview(){
    var prevRequest = new XMLHttpRequest();
    var message = document.getElementById('message').value;
    if(message!=''){
    	if(document.getElementById('nobb').checked){
    		var nobb="&nobb=1";
    	}else{
    		var nobb="";
    	}
        prevRequest.open( "GET",  config['protocol']+'://'+config['domain']+'/api.php?action=postpreview&message='+encodeURIComponent(message)+nobb, true );
        prevRequest.send( null );
        prevRequest.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                if(document.getElementById('postPreview')==null){
                    var d = document.createElement('div');
                    var text = this.responseText;
                    d.innerHTML = text;
                    d.className="postPreview";
                    d.id="postPreview";
                    d.onclick = function(){
                        remch(this);
                        document.getElementById('message').style['display'] = 'block';
                        document.getElementById('message').focus();
                    }
                    document.getElementById('message').parentNode.appendChild(d);
                    document.getElementById('message').style['display']='none';
                }else{
                    remch(document.getElementById('postPreview'));
                    document.getElementById('message').style['display'] = 'block';
                    document.getElementById('message').focus();
               }
            }
        }
    }
}


config['mousemovedelta'] = 100;
config['mousemovedeltaX'] = 0;
config['mousemovedeltaY'] = 0;
document.body.onmousemove = function(event){
	if(Math.sqrt((event.clientY-config['mousemovedeltaY'])*(event.clientY-config['mousemovedeltaY'])+(event.clientX-config['mousemovedeltaX'])*(event.clientX-config['mousemovedeltaX']))>config['mousemovedelta']){
		hidePosts();
		watchPosts();
	}
	config['mousemovedeltaX'] = event.clientX;
	config['mousemovedeltaY'] = event.clientY;
}


var $a = new Array();
	$a['domain'] = document.location.host;
	$a['boardCode'] = document.location.href.split('/')[3];

if(isBoardPage()==false){
	$a['threadNum'] = document.location.href.split('/')[5].split('.')[0];
	var mes, sett, ticker, mesremove;
	$a['opPost'] = document.getElementById('thread' + $a['threadNum'] + $a['boardCode']);
	$a['curZ'] = 1;
	if(getParam('noRef')=='false'){
		addReverseLinks();
	}
	startTicking();
	doTitle();
	window.onfocus = function(){
		updateThread();
		checkForNewPosts();
	}
}else{

	window.onfocus = function(){
		checkForNewPosts();
	}
	if(getParam('noRef')=='false'){
		addReverseLinks0();
	}
	$a['threadNum'] = 0;
}

	document.getElementById('delform').onclick = function(){
		hidePosts();
		watchPosts();
	}
	addFeatures();
	normalizeDate();
	makeExpandable();
	doYT();
	watchBoard();
	startWBInterval();	
	addCheckBoxActions();

if(document.getElementById('postprev')!=null){
	document.getElementById('postprev').onclick = function(){
		togglePostPreview();
	}
}
if(localStorage.getItem("password")!=null){
	for(var i = 0; i < document.getElementsByName('postpassword').length; i++){
	document.getElementsByName('postpassword')[i].value = localStorage.getItem("password");
	}
}else{
	var c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var newpass = '';
	for (var i = 0; i < 10; i++) {
		var d = Math.floor(Math.random() * c.length);
		newpass += c.substring(d, d + 1)
	}
	localStorage.setItem("password",newpass);
	document.getElementsByName('postpassword')[0].value = newpass;
	document.getElementsByName('postpassword')[1].value = newpass;
}