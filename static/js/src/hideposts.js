function isHidden(postnum){
	return !!byID('hs_'+postnum)
}

function addPostHideStyle(postnum){
	if(postnum && !isHidden(postnum)){
		var hideStyle = newElement('style')
		hideStyle.id = 'hs_'+postnum
		var h
		h  = '#reply'+postnum+' > .post-text,'
		h += '#reply'+postnum+' > .nothumb,'
		h += '#reply'+postnum+' > .refcontainer-top,'
		h += '#reply'+postnum+' > .refcontainer-bottom,'
		h += '#reply'+postnum+' > br,'
		h += '#omitted-posts-'+postnum+','
		h += '#threadexpand'+postnum+','
		h += '#reply'+postnum+' > .filesize { display:none;}'
		h += '#reply'+postnum+' > br:last-of-type { display:block;}'
		h += '#refcontainer-bottom-'+postnum+' {display:none;}'
		h += '#refcontainer-top-'+postnum+' {display:none;}'
		h += '#reply'+postnum+' > br:last-of-type { display:block;}'
		h += '#reply'+postnum+'  { padding-bottom: 0;}'
		h += '#thread'+postnum+config.board+' > * {display: none;}'
		h += '#thread'+postnum+config.board+' > .postinfo, '
		h += '#thread'+postnum+config.board+' > .postcontrols{display: inline;}'
		h += '#thumb'+postnum+'{display: none;}'
		h += '.post-hide-'+postnum+'{display:none;}'
		h += '.reply-to-'+postnum+'{display:none;}'
		h += '.post-reply-'+postnum+'{display:none;}'
		h += '.post-show-'+postnum+'{display:inline-block !important;}'
		h += '#loaded-post-'+postnum+' > * > .reply > .post-controls {display:inline-block !important;}'
		hideStyle.innerHTML = h
		document.head.appendChild(hideStyle)
	}
}

function postHide(elem, postnum){
	addPostHideStyle(postnum)
	if(!getSetting('hidden')[config.board]){
		Settings.hidden[config.board] = ''
	}
	var ht = getSetting('hidden')[config.board].split(',')
	var f = false
	for(var i = 0; i < ht.length; i++)
		if(ht[i]+''==postnum+''){ f = true; }
	(f)?ht: ht.push(postnum);
	Settings.hidden[config.board]=ht.join(',')
	saveSettings()
}

function postShow(elem,postnum){
	removePostHideStyle(postnum)
	if(!getSetting('hidden')[config.board]){
		Settings.hidden[config.board] = ''
	}
	var ht = getSetting('hidden')[config.board].split(',')
	var nt = []
	for(var i = 0; i < ht.length; i++)
		(ht[i]!=postnum+'')?nt.push(ht[i]):0;
	Settings.hidden[config.board] = nt.join(',')
	saveSettings()
}

function removePostHideStyle(postnum){
	byID('hs_'+postnum).remove()
}

function hideHidden(){
	if(getSetting('hidden')[config.board]){
		var ht = getSetting('hidden')[config.board].split(',')
		for(var i = 0; i < ht.length; i++){
			addPostHideStyle(ht[i])
		}
	}
}
