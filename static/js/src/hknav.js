var hknav = {
    getPost: function() {
        if(!!cache.nav){

        }
    },
    j: function(){
        var number = getHighlightedPostNumber()
        if(!number){
            number = getFirstPostId()
            highlightPostByNumber(number)
        }else{
            highlightPostByNumber(
                getNextPostNumber(number)
            )
        }
    },
    k: function(){
        var number = getHighlightedPostNumber()
        if(!number){
            number = getLastPostId()
            highlightPostByNumber(number)
        }else{
            number = getPreviousPostNumber(number)
            if(number){
                highlightPostByNumber(number)
            }
        }
    },
    h: function(){
        if(!config.ispage){
            var a = newElement('a')
            a.href = '../'
            document.body.appendChild(a)
            a.click()
        }
    },
    l: function(){
        if(config.ispage){
            if(getHighlightedPostNumber()){
                var threadNum = getParentId(getHighlightedPostNumber())
                if(threadNum){
                    var replybutton = byID('replybutton-'+threadNum),
                        url = replybutton.href
                    url = url + '#' + getHighlightedPostNumber()
                    window.open(url, '_self')
                }
            }
        }else{

        }
    },
    reply: function(){
        if(!isFocusedInput()){
            if(getHighlightedPostNumber()){
                var postNum = getHighlightedPostNumber(),
                    threadNum = getParentId(postNum)
                postReply(null, postNum, threadNum, false)
            }
        }
    },
    esc: function(){
        var elem = document.activeElement,
            tag = elem.tagName
        if(['TEXTAREA', 'INPUT'].indexOf(tag) != -1){
            elem.blur()
        }
    },
    i: function(){
        purgeAllNewPostNotifications()
    }
}

function getParentId(postNum){
    var threadNum = getInt(byID(postNum).parentNode.parentNode.className)
    if(!threadNum){
        threadNum = postNum
    }
    return threadNum
}

function isFocusedInput(){
    var t = document.activeElement.tagName;
    return(t != 'BODY' && t != 'A')
}

function getHighlightedPostNumber() {
    return getInt(document.location.hash)
}

function highlightPostByNumber(number){
    if(!!byID(number)){
        byID(number).click()
    }
}

function getFirstPostId() {
    if(!byID('content-container')) return null;
    var list = byID('content-container').byClass('post-number')
    if(!list.length) return null;
    return getInt(list[0].id)
}

function getLastPostId() {
    if(!byID('content-container')) return null;
    var list = byID('content-container').byClass('post-number')
    if(!list.length) return null;
    return getInt(list[list.length - 1].id)
}

function getPreviousPostNumber(number){
    var list = byClass('post-number')
    for(var i = 0; i < list.length; i++) {
        if(getInt(list[i].id) == number) {
            if(i > 0){
                return getInt(list[i-1].id)
            }
        }
    }
    return null
}

function getNextPostNumber(number) {
    var list = byClass('post-number')
    for(var i = 0; i < list.length; i++) {
        if(getInt(list[i].id) == number) {
            if(i+1 < list.length) {
                return getInt(list[i+1].id)
            }else{
                return number
            }
        }
    }
    return null
}

window.addEventListener('keydown', function(event){
    if(!isFocusedInput()){
        if(!event.ctrlKey && !event.altKey && !event.shiftKey){
            var k = event.keyCode
            switch(k){
                case 73: hknav.i(); break;
                case 96: hknav.i(); break; // num 0
                case 74: hknav.j(); break;
                case 98: hknav.j(); break; // num 2
                case 75: hknav.k(); break;
                case 104: hknav.k(); break; // num 8
                case 76: hknav.l(); break;
                case 102: hknav.l(); break; // num 6
                case 72: hknav.h(); break;
                case 100: hknav.h(); break; // num 4
                case 82: hknav.reply(); event.preventDefault(); break;
                case 105: hknav.reply(); event.preventDefault(); break;
            }
        }
    }else{
        if(event.key == 'Escape'){
            hknav.esc()
        }
    }
})