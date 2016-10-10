function isPostOnScreen(postNum){
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
        list = []
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
            var sevent = config['is_mobile']?'onclick':'onmouseenter'
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
    var rlText = newTextNode('Ответы: ')
    rl.appendChild(rlText)
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
        if(byID(config.loaded_post_class+otherPosts[i])){
            byID(config.loaded_post_class+otherPosts[i]).remove()
        }
    }
}

function highlightPost(postNum){
    var elem = postElementByNum(postNum)
    elem.className += ' highlighted'
    setTimeout(function(){
        elem.className = elem.className.replaceAll('highlighted','').trim()
    }, config['highlight_timeout'])
}

function showPost(elem){
    var postBoard       = elem.className.split('|')[1],   // board of post
    postNum    = elem.className.split('|')[3]*1, // Number of post
    threadNum  = elem.className.split('|')[2]*1, // Number of thread
    parentPost = elem.parentNode.parentNode
    if(cache.posts[postBoard+'/'+postNum]){
        var html = cache.posts[postBoard+'/'+postNum]
        if(!isPostOnScreen(postNum)){
            addPost(elem, html, postNum, threadNum, parentPost, postBoard)
        }else{
            removeOtherPosts(elem)
            highlightPost(postNum)
        }
    }else{
        if(!!postNum && typeof postNum == 'number'){
            if(!isPostOnScreen(postNum) || isLinkInLoadedPost(elem)){
                var reqURL = config['protocol'] + '://' +
                config['domain']   + '/'   +
                'read.php?b=' + postBoard +
                '&t='      + threadNum    +
                '&p='      + postNum      +
                '&single'
                var cacheId = threadNum+' '+postNum+' '+postBoard
                if(!cache.requests[cacheId]){
                    var xmlHttp = new XMLHttpRequest()
                    xmlHttp.open('GET', reqURL, true)
                    xmlHttp.send(null)
                    cache.requests[cacheId] = xmlHttp
                }else{
                    var xmlHttp = cache.requests[cacheId]
                }
                xmlHttp.onreadystatechange = function(){
                    if (this.readyState == 4){
                        if(this.status == 200){
                            addPost(elem, this.responseText, postNum, threadNum, parentPost, postBoard)
                            cache.posts[postBoard+'/'+postNum] = this.responseText
                        }else{
                            showMessage('Error: post not found.')
                            // something went wrong...
                        }
                        delete cache.requests[cacheId]
                    }
                }
            }else{
                removeOtherPosts(elem)
                highlightPost(postNum)
            }
        }
    }
}


function doHighlightLink(elem){
    elem.id='underlined'
}

function highlightLinkByPostNum(postNum,linkList){
    CycleThrough(linkList,function(item){
        var link = linkList[item]
        if(link.className && link.className.split('|').length == 4){
            var num = link.className.split('|')[3]
            if(num == postNum){
                doHighlightLink(link)
            }
        }
    })
}

function addPost(elem,html,postNum,threadNum,parentPost,postBoard){
    if(!postBoard)
    postBoard = config.board
    if(!html.trim()){
        html = '<span class="'+config.reply_like_class+'">'+_('Post not found!')+'</span>'
    }
    removeOtherPosts(elem)
    cache.posts[postNum] = html
    var post = newElement('div')
    post.className = config.loaded_post_class
    post.id = config.loaded_post_class+postNum
    post.innerHTML = html
    document.body.appendChild(post)
    post.pushStyleArray({
        'position'  :'absolute',
        'z-index'  :'20',
    })
    if(post.byClass('thread')[0]){
        post.byClass('thread')[0].className = 'reply'
    }
    var refContainerElem = byID('refcontainer-'+((getSetting('reflist_on_top')?'top':'bottom'))+'-'+postNum)
    if(!!refContainerElem){
        var refCopy = refContainerElem.cloneNode()
        byID('refcontainer-'+((getSetting('reflist_on_top')?'top':'bottom'))+'-'+postNum)
        var toReplace = post.byClass('refcontainer-'+((getSetting('reflist_on_top')?'top':'bottom')))[0]
        if(!!toReplace)
        toReplace.parentNode.replaceChild(refCopy,toReplace)
    }
    addShowPostEvents(post.byTag('a'))
    addRefs()
    highlightLinkByPostNum(getPostNum(elem), post.byTag('a'))
    formatTime()
    YouTube.init()
    translateUI()
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
    (postCoords.x<0)?postCoords.x=0:'';
    (postCoords.x+postPosition.w > windowSize.x)?(postCoords.x=windowSize.x-postPosition.w):''
    if(!orient){
        post.style['left'] = postCoords.x + scrollX + 'px'
        post.style['top']  = postCoords.y + scrollY + 'px'
    }else{
        post.style['left'] = postCoords.x + scrollX + 'px'
        var po =  getOffset(document.body).h - scrollY - linkPosition.bottom + linkPosition.h
        post.style['bottom'] = po+'px'
    }
}

function hidePosts(){
    while(byClass(config.loaded_post_class)[0]){
        byClass(config.loaded_post_class)[0].remove()
    }
}

function getPostNum(el){
    while(true){
        if(el == null) return '0';
        if(el.className=='posttext' || !el.parentNode){
            if(el.id)
            return el.id.split('-')[1]
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
            var refNum = link.className.split('|')[3]
            var refBoard = link.className.split('|')[1]
            var postNum = getPostNum(link)
            var threadNum = link.className.split('|')[2]
            //if(refNum == '0' || postNum == '0') return;
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

    // links.map(function(link){
    //     if((link.className.indexOf('ref')+1) &&
    //     link.className.split('|').length == 4 &&
    //     link.parentNode.className.indexOf('refcontainer') == -1){
    //         var refNum = link.className.split('|')[3]
    //         var refBoard = link.className.split('|')[1]
    //         var postNum = getPostNum(link)
    //         var threadNum = link.className.split('|')[2]
    //         //if(refNum == '0' || postNum == '0') return;
    //         if(refNum!=postNum){
    //             if(typeof Ref.map[postNum] == 'undefined'){
    //                 Ref.map[postNum] = []
    //             }
    //             Ref.map[postNum].push({
    //                 refNum:    refNum,
    //                 refBoard:  refBoard,
    //                 threadNum: threadNum,
    //                 link:      link,
    //             })
    //         }else{
    //             if(!link.byClass('selfindicator').length){
    //                 var si = newElement('span')
    //                 si.className='selfindicator'
    //                 si.innerHTML = config.reflink_self_postfix
    //                 link.appendChild(si)
    //             }
    //         }
    //     }
    // })
}

function addRefs(){
    var _replies = _('Replies:')
    if(getSetting('reflinks')){
        updateRefMap()
        var postNums = Ref.map.getKeys()
        for(var i = 0; i < postNums.length; i++){
            var postNum = postNums[i]
            var refArrays = Ref.map[postNum]
            for(var j = 0; j < refArrays.length; j++){
                var refArray = refArrays[j]
                var refNum = refArray.refNum
                var refBoard = refArray.refBoard
                // skip if post is not on the same board.
                // unfortunately I've failed trying to make this
                // work every time in that case.
                if(refBoard != config.board) continue;
                var threadNum = refArray.threadNum
                var link = refArray.link
                var refersToOp = refNum == threadNum
                var refersToSelf = refNum == postNum
                var refList = byID('refcontainer-'+((getSetting('reflist_on_top')?'top':'bottom'))+'-'+refNum)
                if(!!refList && !isInReflist(refList,postNum) && postNum != 0){
                    if(!refList.childNodes.length){
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
                    reflink.href = config.protocol + '://'+config.domain+'/'+refBoard+'/res/'+threadNum+'.html#'+postNum
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
    var postNumbers = getAllPostNumbers()
    CycleThrough(postNumbers,function(i){
        var postNum = postNumbers[i]
        var post = byID('reply'+postNum)
        if(!!post){
            cache.posts[postNum] = [byID('reply'+postNum)].getProperties('parentNode',3)[0].outerHTML
        }
    })
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
        checkStyle()
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
    if(!!byID('delform'))
    byID('delform').addEventListener('click',function(){
        hidePosts()
    })
}

function expandthread(c, d) {
    if (byID('replies' + c + d)) {
        var e = byID('replies' + c + d)
        showMessage(_('Loading...'))
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open( "GET", '/expand.php?board=' + d + '&threadid=' + c, true )
        xmlHttp.send( null )
        xmlHttp.onreadystatechange = function(){
            if (this.readyState == 4){
                if(this.status == 200) {
                    showMessage(_('Processing response...'))
                    var b = this.responseText || _("Something went wrong!")
                    e.innerHTML = b
                    loadSettings()
                    addRefs()
                    YouTube.init()
                    addShowPostEvents(document.links)
                    formatTime()
                    doSpoilers()
                    hideHidden()
                    showMessage(_('Thread expanded'),2)
                }else{
                    showMessage(_('Something went wrong!'))
                }
            }
        }
    }
    return false;
}

function watchBoard(){
    loadSettings()
    var list = byClass('refcontainer-top')
    var max = getSetting('last_posts')[config.board]
    var oldmax = max*1
    max = (!max)?0:max
    CycleThrough(list,function(item){
        var postNum = list[item].id.split('-')[2]
        if(postNum*1 > max*1){
            max = postNum
        }
    })
    if(max*1>oldmax*1){
        Settings.last_posts[config.board] = max
        saveSettings()
        showMessage(_('New posts:')+' '+(max*1-oldmax*1))
    }
}

function checkForNewPosts(forceCheck){
    for(var i = 0; i < 4; i++){
        rollLogo()
    }
    if(cache.checkForNewPosts && !forceCheck){
        return
    }
    cache.checkForNewPosts = true
    setTimeout(function(){
        cache.checkForNewPosts = false
    },config.min_update_interval)
    var req = new XMLHttpRequest();
    req.open("GET", config['protocol']+'://'+config['domain']+'/api.php?action=lastpost&board=all&nocache='+Math.random(), true );
    req.send(null);
    req.onreadystatechange = function(){
        if (this.readyState == 4){
            if (this.status == 200 ) {
                loadSettings()
                var response = JSON.parse(this.responseText);
                var ignored = getSetting('ignored_boards').split(',')
                for(var board in response){
                    if(response.hasOwnProperty(board) && !ignored.inArray(board)){
                        var post_count = response[board],
                        last_posts = getSetting('last_posts')
                        if(!last_posts[board] || last_posts[board] > post_count){
                            last_posts[board] = post_count
                            Settings.last_posts[board] = post_count*1
                        }
                        var old_post_count = Settings.last_posts[board]*1,
                        new_post_count = post_count*1,
                        difference = new_post_count - old_post_count
                        // update cache
                        cache.new_posts[board] = difference
                        if(difference > 0){
                            // create elements
                            var tspan1 = newElement('span');
                            tspan1.innerHTML = '+'+(new_post_count - old_post_count);
                            tspan1.className = 'sm_counter';
                            tspan1.id = 'sm_counter1_'+board;
                            tspan1.onclick = function(){
                                purgeNewPostNotification(this);
                            }
                            var tspan2 = newElement('span');
                            tspan2.innerHTML = '+'+(new_post_count - old_post_count);
                            tspan2.className = 'sm_counter';
                            tspan2.id = 'sm_counter2_'+board;
                            tspan2.onclick = function(){
                                purgeNewPostNotification(this);
                            }
                            if(byID(tspan1.id)==null){
                                // add elements
                                insertAfter(tspan1, byClass('sm_'+board)[0]);
                                insertAfter(tspan2, byClass('sm_'+board)[1]);
                            }else{
                                // update html if elements exist
                                byID('sm_counter1_'+board).innerHTML = tspan1.innerHTML;
                                byID('sm_counter2_'+board).innerHTML = tspan2.innerHTML;
                            }
                        }else{
                            // remove if outdated
                            if(byID('sm_counter1_'+board) && byID('sm_counter1_'+board)){
                                byID('sm_counter1_'+board).remove();
                                byID('sm_counter2_'+board).remove();
                            }
                        }
                    }
                }
                faviconCounter()
                saveSettings()
                updateTitle()
            }
        }
    }
}

function watchPosts(){
    while(byClass(config.new_post_class).length){
        byClass(config.new_post_class)[0].className = byClass(config.new_post_class)[0].className.replaceAll(config.new_post_class,'')
    }
    updateTitle()
}

function purgeNewPostNotification(elem){
    var board = elem.id.split('_')[2];
    var lastpost = (elem.textContent.split('+')[1]*1) + 1*Settings.last_posts[board]
    Settings.last_posts[board] = lastpost*1
    saveSettings()
    cache.new_posts[board] = 0
    byID('sm_counter1_'+board).remove();
    byID('sm_counter2_'+board).remove();
    faviconCounter()
    updateTitle()
}

function togglePostPreview(){
    var message = byID('message').value;
    if(message!=''){
        var markup_wakabamark = byID('markup_wakabamark').checked?'&wakabamark=1':''
        var markup_bbcode     = byID('markup_bbcode').checked?'&bbcode=1':''
        var markup_other      = byID('markup_other').checked?'&other=1':''
        var prevRequest = new XMLHttpRequest();
        prevRequest.open( "POST",  config['protocol']+'://'+config['domain']+'/api.php', true );
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
                var postPreview = byID('postPreview'),
                    message     = byID('message')
                if(postPreview==null){
                    var d = document.createElement('div');
                    var text = this.responseText;
                    d.innerHTML = text//.replaceAll('<br>','<br>\n');
                    d.className="postPreview";
                    d.id="postPreview";
                    d.onclick = function(){
                        this.remove()
                        message.style['display'] = 'block';
                        message.focus();
                    }
                    message.parentNode.appendChild(d);
                    message.style['display']='none';
                    addShowPostEvents()
                }else{
                    postPreview.remove()
                    message.style['display'] = 'block';
                    message.focus();
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
