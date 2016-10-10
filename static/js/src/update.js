function startAutoUpdateTick(){
	if(config.thread){
		if(getSetting('autoupdate')){
			cache.updateInterval = setInterval(function(){
				updateThread()
			},getSetting('updateinterval')*1000)
		}
	}else{
		cache.updateInterval = setInterval(function(){
			checkForNewPosts()
		},getSetting('updateinterval')*1000)
	}
}

function getLastPostNumber(){
	var list = byClass('post-number')
	var max = 0
	for(var i = 0; i < list.length; i++){
		var num = getInt(list[i].id)
		if(num > max){
			max = num
		}
	}
	return max;
}

function updateThread(){
	var xmlHttp, lastpost, board, thread, reqURL
	if(config.thread){
		if(cache.updateThread){
			return
		}
		cache.updateThread = true
		setTimeout(function(){
			cache.updateThread = false
		},config.min_update_interval)
		// if not on board page
		// set request variables
		board = config.board
		thread = config.thread
		lastpost = getLastPostNumber()
		// construct request url
		reqURL = document.location.protocol + '//' + document.location.host + '/' + config.api_path + '?action=readthread&board='+board+
		'&thread='+thread+'&lastpost='+lastpost
		// xmlHttp routine...
		var xmlHttp = null;
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", reqURL, true );
		xmlHttp.send( null );
		showMessage(_('Loading...'), 0);
		xmlHttp.onreadystatechange = function(){
			if(xmlHttp.readyState == 4){
				if(xmlHttp.status == 200){
					processUpdateThreadResult(xmlHttp.responseText)
				}else if(xmlHttp.status == 404){
					showMessage(_('Error: thread not found (404)'), 0)
				}else if(xmlHttp.status == 202){
					// ok, we're just busy
					showMessage(_('No new posts'))
				}else{
					// status code is not 200, 202 or 404
					setTimeout(function(){
						showMessage(_('Error: server sent corrupted data.'), 0)
					}, 1000)
				}
			}
		}
	}
}

function processUpdateThreadResult(result){
	var response = JSON.parse(result),
		newposts = response.count,
		html     = response.html
	appendPostsToThread(html)
	if(!newposts){
		showMessage(_('No new posts'))
		return
	}else{
		addNewPostIndicators(newposts)
	}
	showMessage(_('New posts:')+' '+getNewPostCount())
	loadSettings()
	addRefs()
	formatTime()
	YouTube.init()
	translateUI()
	watchBoard()
	addShowPostEvents()
	checkForNewPosts(true)
	hideHidden()
}

function addNewPostIndicators(num){
	var list = byClass('reply')
	var i = list.length - 1
	while(i >= list.length - num){
		var el = list[i]
		el.className += ' '+config.new_post_class
		i--
	}
}

function getNewPostCount(){
	return byClass(config.new_post_class).length
}
function appendPostsToThread(postsHTML){
	byID(config.delform_id).appendChild(create(postsHTML))
}

function create(htmlStr) {
	var frag = document.createDocumentFragment(),
	temp = document.createElement('div');
	temp.innerHTML = htmlStr
	var nums = []
	while (temp.firstChild) {
		var f = temp.firstChild
		if(f.tagName && f.tagName.toLowerCase() == 'div'){
			var num = getInt(f.getElementsByClassName('reply')[0].id)
			if(getLastPostNumber() < num){
				frag.appendChild(temp.firstChild);
				nums.push(num)
			}else{
				return frag
			}
		}else{
			temp.firstChild.remove()
		}
	}
	return frag;
}

function checkForNewPosts(forceCheck){
	function processCheckForNewPostsResult(result, update){
		loadSettings()
		var response = JSON.parse(result)
		if(update){
			localStorage.last_check = Date.now()
			localStorage.last_check_content = result
		}
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
					tspan1.className = 'board-link-counter';
					tspan1.id = 'counter-top-'+board;
					tspan1.onclick = function(){
						purgeNewPostNotification(this);
					}
					var tspan2 = newElement('span');
					tspan2.innerHTML = '+'+(new_post_count - old_post_count);
					tspan2.className = 'board-link-counter';
					tspan2.id = 'counter-bottom-'+board;
					tspan2.onclick = function(){
						purgeNewPostNotification(this);
					}

					if(byID(tspan1.id)==null){
						// add elements
						insertAfter(tspan1, byClass('board-link-'+board)[0]);
						insertAfter(tspan2, byClass('board-link-'+board)[1]);
					}else{
						// update html if elements exist
						byID('counter-top-'+board).innerHTML = tspan1.innerHTML;
						byID('counter-bottom-'+board).innerHTML = tspan2.innerHTML;
					}
				}else{
					// remove if outdated
					if(byID('counter-top-'+board) && byID('counter-top-'+board)){
						byID('counter-top-'+board).remove();
						byID('counter-bottom-'+board).remove();
					}
				}
			}
		}
		faviconCounter()
		saveSettings()
		updateTitle()
	}
	for(var i = 0; i < 4; i++){
		rollLogo()
	}
	if(localStorage.last_check*1 < Date.now() - config.min_update_interval && !forceCheck){
		if (cache.last_check < 
			localStorage.last_check*1){
			cache.last_check = localStorage.last_check
			processCheckForNewPostsResult(localStorage.last_check_content)
			return;
		}
	}
	var req = new XMLHttpRequest();
	req.open("GET", document.location.protocol + '//' + document.location.host + '/api.php?action=lastpost&board=all&nocache='+Math.random(), true );
	req.send(null);
	req.onreadystatechange = function(){
		if (this.readyState == 4){
			if (this.status == 200 ) {
				processCheckForNewPostsResult(this.responseText, true)
			}
		}
	}
}

