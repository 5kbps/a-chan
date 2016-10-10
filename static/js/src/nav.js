function isPostOnScreen( postNum ){
    var elem = byID('reply'+postNum)
    if(!!elem){
        var offset = getOffset(elem)
        var windowSize = getWindowSize()
        return (offset.y > 0 && offset.y + offset.h < windowSize.y)
    }
    return false
}

function addShowPostEvents(list){
    if(!list){
        updateRefMap()
        var list = []
        CycleThrough(Ref.map,function(item){
            var arr = Ref.map[item]
            CycleThrough(arr,function(item){
                list.push(arr[item].link)
            })
        })
    }
    for(var i = 0; i < list.length; i++){
        var link = list[i]
        if(!!(link.className.indexOf('ref')+1) &&
        !link.byClass('selfindicator').length){
            var sevent = config.is_mobile?'onclick':'onmouseenter'
            link[sevent] = function(){
                showPost(this)
            }
        }
    }
}

function addReflist(elem,postNum,isReply){
    var rl = newElement('span')
    rl.className = 'reflist'
    rl.id = 'reflist'+postNum
    if(isReply){
        elem.appendChild(rl)
    }else{
        elem.byClass('opreflist').appendChild(rl)
    }
    return rl
}

function postElementByNum(num){
    if(!!byID('reply'+num)){
        return byID('reply'+num)
    }else{
        if(!!byID('thread'+num+config['board']))
        return byID('thread'+num+config['board'])
    }
    return false
}

function isLinkInLoadedPost(elem){
    while(elem.parentNode){
        if(elem.className == config.loaded_post_class){
            return true
        }else{
            elem = elem.parentNode
        }
    }
    return false
}

function getOtherPosts(elem){
    var r = []
    var list = elem.parentNode.getElementsByTagName('a')
    for(var i = 0; i < list.length; i++){
        r.push(list[i].className.split('|')[3])
    }
    return r
}

function removeOtherPosts(elem){
    var otherPosts = getOtherPosts(elem)
    for(var i = 0; i < otherPosts.length; i++){
        if(byID(config.loaded_post_class+'-'+otherPosts[i])){
            byID(config.loaded_post_class+'-'+otherPosts[i]).remove()
        }
    }
}

function highlightPost(postNum){
    var elem = postElementByNum(postNum)
    elem.addClass(config.highlighted_post_class)
}

function showPost(elem){
    var postBoard       = elem.className.split('|')[1],   // board of post
    postNum    = elem.className.split('|')[3]*1, // Number of post
    threadNum  = elem.className.split('|')[2]*1, // Number of thread
    parentPost = elem.parentNode.parentNode
    if(isPostOnScreen(postNum) && !isLinkInLoadedPost(elem)){
        highlightPost(postNum)
        removeOtherPosts(elem)
        elem.onmouseleave = function(){
            setTimeout(function(){
                if(byClass(config.highlighted_post_class).length)
                    byClass(config.highlighted_post_class)[0].removeClass(
                        config.highlighted_post_class)
            }, config.highlighted_post_delay)
        }
        return;
    }
    if(!!cache.posts[postBoard+'/'+postNum]){
        addPost(elem, cache.posts[postBoard+'/'+postNum], postNum, 
            threadNum, parentPost, postBoard)
        return;
    }
    if(byID('reply'+postNum)){
        addPost(elem, byID('reply'+postNum).parentNode.outerHTML, 
            postNum, threadNum, parentPost, postBoard)
        return;
    }
    if(!postNum || typeof postNum != 'number') return;    
    var reqURL = document.location.protocol + '//' +
    document.location.host   + '/'   +
    'read.php?b=' + postBoard +
    '&t='      + threadNum    +
    '&p='      + postNum      +
    '&single'
    if(!cache.requests[threadNum+' '+postNum+' '+postBoard]){
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open('GET', reqURL, true)
        xmlHttp.send(null)
        cache.requests[threadNum + ' ' + postNum + ' ' + postBoard] = xmlHttp
    }else{
        var xmlHttp = cache.requests[threadNum + ' ' + postNum + ' ' + postBoard]
    }
    xmlHttp.onreadystatechange = function() {
        var html
        if (this.readyState == 4) {
            if (this.status == 200) {
                html = this.responseText
                if (!html.trim()) {
                    // post is empty
                    html = replyLike(_('Post not found!'))
                } else {
                    cache.posts[postBoard + '/' + postNum] = html
                }
            } else {
                html = replyLike(_('Error: no internet connection.'))
            }
            addPost(elem, html, postNum, threadNum, parentPost, postBoard)
            delete cache.requests[threadNum + ' ' + postNum + ' ' + postBoard]
        }
    }
}

function replyLike(html){
    return '<span class="'+config.reply_like_class+'">'+html+'</span>'

}

function highlightLinkByPostNum(postNum,linkList){
    CycleThrough(linkList,function(item){
        var link = linkList[item]
        if(link.className && link.className.split('|').length == 4){
            var num = link.className.split('|')[3]
            if(num == postNum){
                link.id = config.underlined_link_id
            }else{
                link.id = link.id.replaceAll(config.underlined_link_id, '')
            }
        }
    })
}

function addPost(elem,html,postNum,threadNum,parentPost,postBoard){
    if(!postBoard)
    var postBoard = config.board
    removeOtherPosts(elem)
    var post = newElement('div')
    post.className = config.loaded_post_class
    post.id = config.loaded_post_class+'-'+postNum
    post.innerHTML = html
    byID('posts-container').appendChild(post)
    post.pushStyleArray({
        'position'  :'absolute',
        'z-index'  :'20',
    })
    if(post.byClass('thread')[0]){
        post.byClass('thread')[0].className = 'reply'
    }
    var refContainerElem = byID('refcontainer-'+((getSetting('reflist_on_top')?'top':'bottom'))+'-'+postNum)
    if(!!refContainerElem){
        var refCopy = refContainerElem.cloneNode(1)
        byID('refcontainer-'+((getSetting('reflist_on_top')?'top':'bottom'))+'-'+postNum)
        var toReplace = post.byClass('refcontainer-'+((getSetting('reflist_on_top')?'top':'bottom')))[0]
        if(!!toReplace)
        toReplace.parentNode.replaceChild(refCopy,toReplace)
    }
    addShowPostEvents(post.byTag('a'))
    translateUI()
    addRefs()
    highlightLinkByPostNum(getPostNum(elem), post.byTag('a'))
    formatTime()
    YouTube.init()

    var windowSize = getWindowSize()
    var linkPosition = getOffset(elem)
    var postPosition = getOffset(post)
    var postCoords = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    }
    if(postPosition.w > windowSize.x){
        postCoords.w = windowSize.w
    }
    if(postPosition.h > windowSize.h){
        postCoords.h = windowSize.h
    }
    if(linkPosition.x > windowSize.x/2){
        postCoords.x = linkPosition.x + linkPosition.w/2 - postPosition.w
    }else{
        postCoords.x = linkPosition.x + linkPosition.w/2
    }
    var orient = 0
    if(linkPosition.y > windowSize.y/2){
        postCoords.y = linkPosition.y - postPosition.h
        var orient = 1
    }else{
        postCoords.y = linkPosition.y + linkPosition.h
    }
    (postCoords.x < 0)?postCoords.x=0:'';
    (postCoords.x+postPosition.w > windowSize.x)?(postCoords.x=windowSize.x-postPosition.w):''
    if(!orient){
        post.style['left'] = postCoords.x + scrollX + 'px'
        post.style['top']  = postCoords.y + scrollY + 'px'
    }else{
        post.style['left'] = postCoords.x + scrollX + 'px'
        var po =  getOffset(document.body).h - scrollY - linkPosition.bottom + linkPosition.h
        post.style['bottom'] = po+'px'
    }
    if(postCoords.x + postPosition.w > windowSize.y){
        post.style['right'] = '0'
    }
}

function hidePosts(){
    byID('posts-container').innerHTML =''
}

function getPostNum(el){
    while(true){
        if(el == null) return 0;
        if(el.className=='post-text' || !el.parentNode){
            if(el.id)
                return el.id.split('-')[2]
        }
        if(el.className == 'refcontainer-bottom' || el.className == 'refcontainer-top'){
            return el.id.split('-')[2]
        }
        el = el.parentNode
    }
}

function isInReflist(reflist, postNum){
    for(var i = 0; i < reflist.childNodes.length; i++){
        var elem = reflist.childNodes[i]
        if(elem.className && elem.className.split('|')[3] == postNum+''){
            return true
        }
    }
    return false
}

function updateRefMap(){
    Ref = {
        map:{},
        list:[],
    }
    var links = document.links
    for(var i = 0; i < links.length; i++){
        var link = links[i]
        if((link.className.indexOf('ref')+1) &&
        link.className.split('|').length == 4 &&
        link.parentNode.className.indexOf('refcontainer') == -1){
            var refNum = link.className.split('|')[3],
                refBoard = link.className.split('|')[1],
                postNum = getPostNum(link),
                threadNum = link.className.split('|')[2]
            if(postNum){
                if(refNum!=postNum){
                    if(typeof Ref.map[postNum] == 'undefined'){
                        Ref.map[postNum] = []
                    }
                    Ref.map[postNum].push({
                        refNum:    refNum,
                        refBoard:  refBoard,
                        threadNum: threadNum,
                        link:      link,
                    })
                }else{
                    if(!link.byClass('selfindicator').length){
                        var si = newElement('span')
                        si.className='selfindicator'
                        si.innerHTML = config.reflink_self_postfix
                        link.appendChild(si)
                    }
                }
            }
        }
    }
}

function addRefs(){
    var _replies = _('Replies:')
    if(getSetting('reflinks')){
        updateRefMap()
        var postNums = Ref.map.getKeys()
        for(var i = 0; i < postNums.length; i++){
            var postNum = postNums[i]
            if(!(postNum*1)) continue;
            var refArrays = Ref.map[postNum]
            for(var j = 0; j < refArrays.length; j++){
                var refArray = refArrays[j]
                var refNum = refArray.refNum
                var refBoard = refArray.refBoard
                // skip if post is not on the same board.
                // unfortunately I failed trying to make this
                // work every time in that case.
                if(refBoard != config.board) continue;
                var threadNum = refArray.threadNum,
                    link = refArray.link,
                    refersToOp = refNum == threadNum,
                    refersToSelf = refNum == postNum,
                    refListOnTop = getSetting('reflist_on_top')
                var refList = byID('refcontainer-'+((refListOnTop?'top':'bottom'))+'-'+refNum)
                if(!!refList && !isInReflist(refList,postNum)){
                    if(!refList.childNodes.length && !refListOnTop){
                        var rt = newElement('span')
                        rt.className = 'replies-str'
                        rt.textContent = _replies
                        refList.appendChild(rt)
                    }
                    var reflink = newElement('a')
                    var reftext = config['reflink_prefix']+postNum
                    var refTextNode = newTextNode(reftext)
                    reflink.appendChild(refTextNode)
                    reflink.className = 'ref|'+refBoard+'|'+threadNum+'|'+postNum
                    reflink.href = document.location.protocol + '//'+document.location.host+'/'+refBoard+'/res/'+threadNum+'.html#'+postNum
                    reflink.onmouseenter = function(){
                        showPost(this)
                    }
                    refList.appendChild(reflink)
                }
            }
        }
    }
}

function updatePostCache(){
    return
}

function addNavEvents(){
    document.body.addEventListener('click',function(){
        watchPosts()
        updateTitle()
    })
    window.addEventListener('focus',function(){
        checkForNewPosts()
        if(getSetting('autoupdate')){
            updateThread()
        }
    })
    document.body.addEventListener('mousemove',function(event){
        var ox = flags.mouseposition.x
        var oy = flags.mouseposition.y
        var rx = event.clientX
        var ry = event.clientY
        var delta = Math.sqrt(
            (ox-rx)*(ox-rx)+(oy-ry)*(oy-ry)
        )
        flags.mouseposition.x = rx
        flags.mouseposition.y = ry
        if(delta > config['hide_posts_mouse_move_delta']){
            hidePosts()
            watchPosts()
        }
    })
    if(!!byID(config.delform_id))
    byID(config.delform_id).addEventListener('click',function(){
        hidePosts()
    })
    if(!!byID('postform')){
        byID('postform').addEventListener('submit', function(event){
            submitAttempt(event)
        })
    }
}

function expandthread(thread, board) {
    showMessage(_('Loading...'))
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.open( "GET", '/expand.php?board=' + board + '&threadid=' + thread, true )
    xmlHttp.send( null )
    xmlHttp.onreadystatechange = function(){
        if (this.readyState == 4){
            if(this.status == 200) {
                showMessage(_('Processing response...'))
                // remember form state vefore expanding
                var rgx = new RegExp('reply-to-'+thread),
                    old_post_num = getInt(byName('postform')[0].parentNode.id)
                if(!!byID('postform').parentNode.parentNode.parentNode.className.match(rgx)){
                    saveScrollPosition()
                    clearreplyto()
                    restoreScrollPosition()
                }
                // kill old posts
                while(byClass('reply-to-'+thread).length){
                    byClass('reply-to-'+thread)[0].remove()
                }
                // append html
                var b = this.responseText || _("Something went wrong!")
                var f = document.createDocumentFragment()
                var temp = newElement('div')
                temp.innerHTML = b
                while(temp.firstChild){
                    f.appendChild(temp.firstChild)
                }
                if(byID('omitted-posts-'+thread)){
                    byID('omitted-posts-'+thread).remove()
                }
                // byID('thread-wrapper-'+thread).parentNode.appendChild(f)
                insertAfter(f, byID('thread-wrapper-'+thread))
                translateUI()
                loadSettings()
                addRefs()
                YouTube.init()
                addShowPostEvents(document.links)
                formatTime()
                doSpoilers()
                hideHidden()
                addShowPostEvents()
                showMessage(_('Thread expanded'),2)
                // restore form state
                if(old_post_num)
                    postReply(null, old_post_num, thread, true)
            }else if(this.status == 404){
                showMessage(_('Error: thread not found (404)'))
            }else{
                showMessage(_('Something went wrong!'))
            }
        }
    }
    return false;
}

function watchBoard(){
    loadSettings()
    var list = byClass('refcontainer-top')
    var max = getSetting('last_posts')[config.board]*1
    var oldmax = max
    max = (!max)?0:max
    for(var i =0; i < list.length; i++){
        var postNum = list[i].id.split('-')[2]*1
        if(postNum > max){
            max = postNum
        }
    }
    if(max > oldmax){
        Settings.last_posts[config.board] = max
        saveSettings()
        showMessage(_('New posts:')+' '+(max*1-oldmax*1))
    }
}

function watchPosts(){
    while(byClass(config.new_post_class).length){
        byClass(config.new_post_class)[0].className = byClass(config.new_post_class)[0].className.replaceAll(config.new_post_class,'')
    }
    updateTitle()
}

function purgeNewPostNotification(elem){
    var board = elem.id.split('-')[2];
    var lastpost = (elem.textContent.split('+')[1]*1) + 1*Settings.last_posts[board]
    Settings.last_posts[board] = lastpost*1
    saveSettings()
    cache.new_posts[board] = 0
    byID('counter-top-'+board).remove();
    byID('counter-bottom-'+board).remove();
    faviconCounter()
    updateTitle()
}

function purgeAllNewPostNotifications(){
    byClass('board-link-counter').map(purgeNewPostNotification)
}

function togglePostPreview(){
    var message = byID('message').value;
    if(message!=''){
        var markup_wakabamark = byID('markup_wakabamark').checked?'&wakabamark=1':''
        var markup_bbcode     = byID('markup_bbcode').checked?'&bbcode=1':''
        var markup_other      = byID('markup_other').checked?'&other=1':''
        var prevRequest = new XMLHttpRequest();
        prevRequest.open( "POST", document.location.protocol + '//' + document.location.host + '/api.php', true );
        prevRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
        var data = 'message='+encodeURIComponent(message)+
        markup_wakabamark+
        markup_bbcode+
        markup_other+
        '&board='+byName('board')[0].value+
        '&action=postpreview'
        prevRequest.send(data);
        prevRequest.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {
                if(byID('post-preview')==null){
                    var d = document.createElement('div')
                    var h = getOffset(byID('message')).h
                    var text = this.responseText;
                    d.innerHTML = text
                    d.className="post-preview";
                    d.id="post-preview";
                    d.style.height = h+'px'
                    d.onclick = function(){
                        this.remove()
                        byID('message').style['display'] = 'block';
                        byID('message').focus();
                    }
                    byID('message').parentNode.appendChild(d);
                    byID('message').style['display']='none';
                    addShowPostEvents()
                }else{
                    byID('post-preview').remove()
                    byID('message').style['display'] = 'block';
                    byID('message').focus();
                }
            }
        }
    }else{
        showMessage(_('Enter message first!'))
    }
}

function saveScrollPosition(){
    var l = byClass('reply')
    for(var i = 0; i < l.length; i++){
        var elem = l[i]
        var offset = getOffset(elem)
        if (offset.y > 0){
            cache.sse = elem
            cache.ssp = getOffset(elem).y
            break
        }
    }
}

function restoreScrollPosition(){
    if(!!cache.sse)
    window.scrollBy(0,getOffset(cache.sse).y - cache.ssp)
}

function askForBugReport(report){
    console.log(JSON.stringify(report))
}