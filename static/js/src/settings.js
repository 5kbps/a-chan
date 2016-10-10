function defaultSettings(){
    for(var i = 0; i < DefaultSettings; i++){
        var item = DefaultSettings[i]
        if(byID(item)){
            var el = byID(item)
            if(el.type == 'checkbox'){
                el.checked = !!DefaultSettings[item]
            }else{
                byID(item).value = DefaultSettings[item]
            }
            if(byID(item+'-value')){
                byID(item+'-value').textContent = DefaultSettings[item]+''
            }
        }
    }
    var wp = byID('watchboards-p')
    wp.innerHTML = ''
    var ignored = getSetting('ignored_boards').split(',')
    for(var i = 0; i < config.boards.length; i++){
        var board = config.boards[i]
        var l = newElement('label')
        l.for = 'wb-'+board
        l.className = 'wb-item'
        var t = newTextNode('/'+board+'/')
        var c = newElement('input')
        c.type = 'checkbox'
        c.id = 'wb-'+board
        c.className = 'wb-box'
        c.checked = true
        l.appendChild(c)
        l.appendChild(t)
        wp.appendChild(l)
    }
    byID('reflinks_position').value = 'bottom'
    byID('center_posts').checked = DefaultSettings.center_posts
    applySettings()
    showMessage(_('Default values were applied'))
}

function applySettings(){
    Settings.autoupdate   = byID('autoupdate').checked
    Settings.updateinterval = byID('updateinterval').value
    Settings.time_formatting= byID('time_formatting').checked
    Settings.time_format   = byID('time_format').value
    Settings.reflinks    = byID('reflinks').checked
    Settings.reflist_on_top = byID('reflinks_position').value == 'top'
    Settings.youtube    = byID('youtube').checked
    Settings.youtube_info  = byID('youtube_info').checked
    Settings.max_youtube  = byID('max_youtube').value
    Settings.expandspoilers  = byID('expandspoilers').checked
    Settings.tab_notification=byID('tab_notification').checked
    var wb = byClass('wb-box')
    var ignored = []
    CycleThrough(wb,function(item){
        var box = wb[item]
        var board = box.id.split('-')[1]
        if(!box.checked){
            ignored.push(board)
        }
    })
    Settings.ignored_boards = ignored.join(',')
    checkBoxToCookie(byID('center_posts'))
    showMessage(_('Saved'))
    saveSettings()
    timeFormatPreview()
}

function toggleHelp(elem){
    var el = byID('help-'+elem.id.split('-')[1])
    el.style.display = (el.style.display=='none')?'block':'none'
}

function timeFormatPreview(){
    var date = (new Date(Date.now()))
    byID('time-preview').innerHTML = formatDate(date,byID('time_format').value)
}

function checkBoxToCookie(elem){
    var cookie_name = elem.id
    setCookie(cookie_name, elem.checked, {
        expires:8640000,
        path:'/',
    })

}

function init(){
    loadSettings()
    config.boards = ['a','b','cu','sp','d','vg']
    translateUI()
    for(var i = 0; i < byClass('help').length; i++){
        byClass('help')[i].style.display= 'none'
    }
    for(var i = 0; i < byClass('help-toggle').length; i++){
        byClass('help-toggle')[i].onclick = function(){
            toggleHelp(this)
        }
    }
    // update
    byID('autoupdate').checked = getSetting('autoupdate')
    // interval
    byID('updateinterval-value').textContent = getSetting('updateinterval')
    byID('max_youtube-value').textContent = getSetting('max_youtube')
    byID('updateinterval').value = getSetting('updateinterval')
    //watchboards
    var wp = byID('watchboards-p')
    var ignored = getSetting('ignored_boards').split(',')
    for(var i = 0; i < config.boards.length; i++){
        var board = config.boards[i]
        var l = newElement('label')
        l.for = 'wb-'+board
        l.className = 'wb-item'
        var t = newTextNode('/'+board+'/')
        var c = newElement('input')
        c.type = 'checkbox'
        c.id = 'wb-'+board
        c.className = 'wb-box'
        c.checked = !ignored.hasValue(board)
        l.appendChild(c)
        l.appendChild(t)
        wp.appendChild(l)
    }
    // time_formatting
    byID('time_formatting').checked = getSetting('time_formatting')
    // time_format
    byID('time_format').value = getSetting('time_format')
    // reflinks
    byID('reflinks').checked = getSetting('reflinks')
    // reflinks position
    byID('reflinks_position').value = (getSetting('reflist_on_top'))?'top':'bottom'
    // youtube
    byID('youtube').checked = getSetting('youtube')
    // youtube_info
    byID('youtube_info').checked = getSetting('youtube_info')
    // youtube
    byID('max_youtube').value = getSetting('max_youtube')
    // expandspoilers
    byID('expandspoilers').checked = getSetting('expandspoilers')
    // tab_notification
    byID('tab_notification').checked = getSetting('tab_notification')
    // style
    byID('style').value = getStyle()
    // center_posts
    byID('center_posts').checked = (getCookie('center_posts') == 'true')
    timeFormatPreview()
}

function handleRange(elem){
    byID(elem.id+'-value').textContent=elem.value
}
