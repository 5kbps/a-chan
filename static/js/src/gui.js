function showMessage(text,timeout){
    var md
    if(byID('message-div')){
        md = byID('message-div')
    }else{
        md = newElement('div')
        md.className = 'reply-like'
        md.id = 'message-div'
        md.onclick = function(){
            this.remove()
        }
    }
    document.body.appendChild(md)
    md.textContent = text
    if(!!timeout){
        setTimeout(function(){
            hideMessage()
        },timeout*1000)
    }
}

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function rkmSave(elem){
    // 2 remove
}

function insert(ref){ // to remove
    var sel
    if(getSelectionText()==''){
        sel = '';
    }else{
        sel = '> ';
    }
    document.getElementsByName('message')[0].value = document.getElementsByName('message')[0].value + ref + sel +getSelectionText();
}

function replaceSelectedText(el, text) {
    var sel = getInputSelection(el), val = el.value;
    el.value = val.slice(0, sel.start) + text + val.slice(sel.end);
}

function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
    textInputRange, len, endRange;
    if(typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    }else{
        range = document.selection.createRange();
        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }
    return {
        start: start,
        end: end
    };
}

function postReply(elem,postnum,opnum,skipTextEvents){
    if(!skipTextEvents){
        var message = byID('message')
        if(isHidden(postnum)){
            postShow(0,postnum)
        }
        var selection = getSelection()
        var selectionText = selection.toString().trim()
        var t = addCitation(byID('message').value, selectionText, postnum);
        message.value = t[0]
        if(message.style.display != 'none'){ // prevent  NS_ERROR_FAILURE in Firefox
            if(selectionText){
                setSelectionRange(message, t[1], t[1])
            }else{
                var message_length = message.value.length
                setSelectionRange(message, message_length, message_length)
            }
            // because keydown
            setTimeout(function(){
                message.focus()
            }, 10)
        }
    }
    // move form container
    var container = byID('postform-container-'+postnum)
    if(!!container){
        container.appendChild(byID('postform'))
        byName('replythread')[0].value = opnum
        byID('posttypeindicator').textContent = _('To thread')+' '
        byID('formpostlink').href = document.location.protocol + '//'+ document.location.host+'/'+config.board+'/res/'+opnum+'.html#'+postnum
        byID('formpostlink').textContent = opnum
        if(!config.thread){
            byID('clearreplyto').style.display = 'inline-block'
            byID('formpostlink').style.display = 'inline-block'
            byID('clearreplyto').innerHTML = config['clearreplyto_text']
        }
    }
}

function addTagSel(tag, txta){
    // http://CoursesWeb.net/javascript/
    var tag_type = ['[',']']
    var start = tag_type[0] + tag + tag_type[1]
    var end = tag_type[0] +'/'+ tag +	 tag_type[1]
    var IE = /*@cc_on!@*/false
    if (IE) {
        var r = document.selection.createRange()
        var tr = txta.createTextRange()
        var tr2 = tr.duplicate()
        tr2.moveToBookmark(r.getBookmark())
        tr.setEndPoint('EndToStart',tr2)
        var tag_seltxt = start + r.text + end
        var the_start = txta.value.replace(/[\r\n]/g,'.').indexOf(r.text.replace(/[\r\n]/g,'.'),tr.text.length)
        txta.value = txta.value.substring(0, the_start) + tag_seltxt + txta.value.substring(the_start + tag_seltxt.length, txta.value.length)
        var pos = txta.value.length - end.length
        tr.collapse(true)
        tr.moveEnd('character', pos)
        tr.moveStart('character', pos)
        tr.select();				 // selects the zone
    }else if (txta.selectionStart || txta.selectionStart == '0') {
        var startPos = txta.selectionStart
        var endPos = txta.selectionEnd
        var tag_seltxt = start + txta.value.substring(startPos, endPos) + end
        txta.value = txta.value.substring(0, startPos) + tag_seltxt + txta.value.substring(endPos, txta.value.length)
        txta.setSelectionRange((endPos+start.length),(endPos+start.length))
        txta.focus()
    }
    return tag_seltxt
}

function addTagToMsg( tag ) {
    addTagSel(tag, byID('message'))
}

function addCitation(oldtext, text, postnum){
    // what a crap!
    var r, cursorposition = 0
    if(text){
        text = '> '+(text.trim().replaceAll('\n','\n> ')).replaceAll('> \n','')
    }
    if(oldtext.indexOf('>>'+postnum) != -1){
        var textarr = oldtext.split(/>>/)
        for(var i = 1; i < textarr.length; i++){
            var f = textarr[i]
            if(f){
                // not empty string
                if(!f.indexOf(postnum) && text){
                    // ref number matches `postnum`
                    r = '>>'+f.trim()+'\n'+text.trim()+'\n'
                    text = ''
                    cursorposition += r.length
                    textarr[i] = r
                    continue
                }else{
                    r = '>>'+f
                }
                if(text)
                cursorposition += r.length
                textarr[i] = r
                continue
            }else{
                r = f
                if(text)
                cursorposition += r.length
                textarr[i] = r
                continue
            }
        }
        return [textarr.join(''), cursorposition]
    }else{
        oldtext = oldtext.trim()
        if(oldtext){
            oldtext += '\n'
        }
        var newtext = oldtext+'>>'+postnum+'\n'+text+(text?'\n':'')
        return [newtext, newtext.length]
    }
}

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    }
}

function hideMessage(){
    (byID('message-div'))?byID('message-div').remove():''
}

function formatDate(date, format, utc) {
    // from SO
    var MMMM = TimeFormats.MMMM
    var MMM = TimeFormats.MMM
    var dddd = TimeFormats.dddd
    var ddd = TimeFormats.ddd
    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};

function formatTime(){
    if(getSetting('time_formatting')){
        var format = getSetting('time_format')
        while(!!byClass('raw-timestamp')[0]){
            var el = byClass('raw-timestamp')[0],
                timestamp = el.value*1000,
                date = new Date(timestamp),
                result = formatDate(date,format),
                nel = el.nextSibling
            nel.innerHTML = result
            el.className = 'raw-timestamp-used'
        }
        hideFormattedTimestamp()
    }
}

function hideFormattedTimestamp(){
    if(!byID('formatted_timestamp_css')){
        var st = newElement('style')
        st.id = 'formatted_timestamp_css'
        st.innerHTML = '.formatted_timestamp{display:none;}'
        document.head.appendChild(st)
    }
}
function doSpoilers(){
    if(!getSetting('expandspoilers')){
        pushStyle('.fspoilertext{display:none;}')
    }
}

function toggleSpoiler(elem){
    var spoiler = elem.parentNode.byClass('fspoilertext')[0];
    if(spoiler.className.indexOf("fspoileropen")==-1){
        spoiler.className += " fspoileropen ";
    }else{
        spoiler.className = spoiler.className.replaceAll("fspoileropen","")
    }
}

function insertPasswords(){
    if(byName('postpassword').length < 2) return;
    byName('postpassword')[0].value = getSetting("password")
    byName('postpassword')[1].value = getSetting("password")
}

function insertPreferences(){
    if(!!byName('preference')[0]){
        byName('preference')[0].value = getSetting('preference')
    }
}

function clearreplyto(){
    if(!config.thread){
        byID('clearreplyto').style.display = 'none'
        byID('clearreplyto').innerHTML = ''
        byClass('postarea')[0].appendChild(byID('postform'))
        byID('posttypeindicator').textContent = _('New thread')
        byID('formpostlink').href = document.location.protocol + '//'+ document.location.host+'/'+config.board+'/'
        byID('formpostlink').textContent = ''
        byID('formpostlink').style.display = 'none'
        byName('replythread')[0].value = '0'
    }
}

function getAllPostNumbers(){
    var r = [],
    replies = byClass('post-number')
    for(var i = 0; i < replies.length; i++){
        r.push(getInt(replies[i].id))
    }
    return r
}

function clearFileSelect(){
    byID('fileupload-clear').style.display = 'none'
    byID('fileupload-list').innerHTML = ''
    byID('fileupload').value = ''
}

function handleFileSelect(evt) {
    byID('fileupload-list').innerHTML = ''
    byID('fileupload-clear').style.display = 'inline'
    var files = evt.target.files
    for (var i = 0, f; f = files[i]; i++) {
        if (!f.type.match('image.*')) {
            continue;
        }
        var reader = new FileReader()
        reader.onload = (function(theFile) {
            return function(e) {
                var span = newElement('span')
                span.innerHTML = ['<img class="preloadthumb" title="'+_('Preview selected image')+'" src="', e.target.result,
                '" title="', escape(theFile.name), '"/>'].join('');
                byID('fileupload-list').insertBefore(span, null);
            };
        })(f);
        reader.readAsDataURL(f);
    }
}

function imgExpand(elem,src,thumbsrc,event){
    if(!elem.hasClass('thumb-loading')){
        if(!elem.hasClass('thumb-expanded')){
            elem.className = 'thumb thumb-loading'
            elem.src = src
            elem.onload = function(){
                elem.className = 'thumb thumb-expanded'
                elem.onload = function(){}
            }
            elem.onabort = function(){
                alert('cancel')
            }
        }else{
            elem.className = 'thumb'
            elem.src = thumbsrc
        }
    }else{
        elem.src = thumbsrc
        elem.className = 'thumb'
    }
    event.preventDefault()
    return false
}

function webmExpand(elem){
    var webmURL = elem.parentNode.parentNode.href
    var hideBtn = newElement('span')
    hideBtn.className = 'webm-hide'
    hideBtn.textContent = _('Close')
    hideBtn.onclick = function(event){
        webmClose(event)
    }
    var video = newElement('video')
    video.className = 'webm-video'
    video.autoplay = true
    video.controls = true
    var source = newElement('source')
    source.type = 'video/webm'
    source.src = webmURL
    video.appendChild(source)
    elem.parentNode.parentNode.parentNode.insertAfter(hideBtn,
        elem.parentNode.parentNode)
    elem.parentNode.parentNode.parentNode.insertAfter(video,
        elem.parentNode.parentNode)
    elem.addClass('hidden-element')
}

function webmClose(evt){
    var elem = evt.target
    if(!!elem.parentNode.byClass('webm-video')[0])
        elem.parentNode.byClass('webm-video')[0].remove()
    if(!!elem.parentNode.byClass('webm-thumb')[0])
        elem.parentNode.byClass('webm-thumb')[0].removeClass('hidden-element')
    elem.remove()
    if (!evt) var evt = window.event
    evt.cancelBubble = true
    if (evt.stopPropagation) evt.stopPropagation()
    evt.preventDefault()
}

function rollLogo(){
    if(!cache.rollLogo){
        cache.rollLogo = 0
    }
    cache.rollLogo++;
    var l = byID('logo-image-top')
    var t = 'rotate('+cache.rollLogo*360+ 'deg)'
    l.pushStyleArray({
        '-moz-transform':t,
        '-webkit-transform':t,
        '-ms-transform':t,
        '-o-transform':t,
        'transform':t,
    })
}

function scrollToEnd(){
    window.scroll(0,document.body.clientWidth)
}

function updateTitle(){
    if (config.ispage) return;
    var subject, text, title, counter, boardname, boarddir
    title	  = getSetting('title_format')
    // recently added posts
    counter = byClass(config.new_post_class).length
    
    // if zero make it blank
    counter = (counter && counter > 0)?'('+counter+') ':''
    boarddir = config.board
    boardname = decodeHTML((config.boardNames[boarddir]?' - '+config.boardNames[boarddir]:''))
    if(!config.thread){
        subject = ''
        text	= ''
    }else{
        try{
            subject = ' - '+ellipsis((!!byClass('filetitle-thread')) ? byClass('filetitle-thread')[0].textContent.trim():'',30)
            text	= ' - '+ellipsis((!!byClass('posttext')) ? byClass('posttext')[0].textContent.trim():'',30)
        }catch(e){
            subject = ''
            text = ' - '+_('Thread №') + config.thread
        }
    }
    title = counter + '/' + boarddir + '/ ' + subject + text + boardname
    document.title = title
}

function faviconCounter(){
    if(getSetting('tab_notification')){
        var n = byClass(config.board_link_counter_class).length
        byID('favicon').href = (!!n)?'/favicon*.ico?':'/favicon.ico?';
    }
}

function highlightPostInURL(){
    var list = byClass(config.outlined_post_class)
    for(var i = 0; i < list.length; i++){
        var post = list[i]
        post.removeClass(config.outlined_post_class)
    }
    var num = 1 * document.location.href.split('#')[1]
    if(!isNaN(num)){
        if(!!byID('reply'+num)){
            byID('reply'+num).addClass(config.outlined_post_class)
        }
    }
}
