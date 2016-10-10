function checkPostingWithCallback(successCallback) {
	var replythread = byName('replythread')[0].value;
	var req = new XMLHttpRequest();
	req.open("GET", '/api.php?action=check_posting&board='+config.board+'&replythread='+replythread+'&nocache='+Math.random(), true);
	req.send(null);
	req.onreadystatechange = function(){
		if (this.readyState == 4){
			if (this.status == 200) {
				processPostingCheckResult(this.responseText, successCallback)
			}
		}
	}
}

function checkPostingAndSend(){
	checkPostingWithCallback(sendForm)
}

function validatePostForm(){
	return true;
}

function onlyCheckPosting(){
	checkPostingWithCallback(function(){})
}

function processPostingCheckResult(resultText, successCallback){
	console.log(resultText)
	var result = JSON.parse(resultText)
	config.captcha_min_length = result.captcha_min_length
	if(result.timeout != 0){
		startTimeout(result.timeout)
	}
	if(result.token != ''){
		addCaptcha(result.token)
		clearTimeout(cache.ttl_captcha_timer)
		cache.ttl_captcha_timer = setTimeout(captchaExpired, result.ttl*1000)
	}else{
		if(isCaptchaAdded() || isPOWAdded()){
			checkPassed()
			if(config.pow_allowed){
				showMessage(_('Больше не нужно вводить капчу или вычислять POW.'))
			}else{
				showMessage(_('Больше не нужно вводить капчу.'))
			}
		}else{
			successCallback()
		}
	}
	if(result.powvalue){
		byID('powrequired').value = result.powvalue
		addPOW(result.powvalue)
	}
}

function submitAttempt(event){
	if(isCaptchaAdded() || isPOWAdded() || isCaptchaChecked()){
		if(isCaptchaEntered() || isCaptchaChecked() || isPOWCalculated()){
			sendForm()
			return;
		}else{
			if(config.pow_allowed){
				alert(_('Пожалуйста, введите капчу или вычислите POW.'))
			}else{
				alert(_('Пожалуйста, введите капчу.'))
			}
			event.preventDefault()
			return false;
		}
	}
	checkPostingAndSend()
	event.preventDefault()
	return false;
}


function sendForm(){
	console.log('sendForm')
	byID('postform').submit()
}

function startTimeout(timeout){
	alert(_('Необходимо подождать ') + timeout + _('с.'))
	cache.timeout_status = 1
	setTimeout(function(){
		cache.timeout_status = 2
	}, timeout*1000)
}

function isCaptchaAdded(){
	return !! byID('captcha-image')
}

function isCaptchaEntered(){
	return isCaptchaAdded() && 
		byID('captcha-text').value.length >= config.captcha_min_length
}

function isCaptchaChecked(){
	return cache.captcha_status == 5
}

function checkCaptcha(){
	var code = byID('captcha-text').value
	var req = new XMLHttpRequest();
	req.open("GET", '/captcha.php?action=check&token='+cache.captcha_token+'&code='+code, true);
	req.send(null);
	cache.captcha_status = 4
	req.onreadystatechange = function(){
		if (this.readyState == 4){
			if (this.status == 200) {
				console.log(this.responseText)
				var result = JSON.parse(this.responseText)
				if(result.status == 'OK'){
					showMessage(_('Капча введена верно.'))
					clearTimeout(cache.ttl_captcha_timer)
					cache.ttl_captcha_timer = setTimeout(captchaExpired, result.ttl*1000)
					cache.captcha_status = 5
					checkPassed()
				}else{
					showMessage(_('Капча не прошла проверку.'))
					onlyCheckPosting()
				}
			}
		}
	}
}

function addCaptcha(captcha_token) {
	var img = newElement('img'),
		inp = newElement('input'),
		chk = newElement('span'),
		imgSrc = '/captcha.php?action=get_image&token='+captcha_token
	cache.captcha_token = captcha_token
	cache.captcha_status = 1
	img.src = imgSrc
	img.id  = 'captcha-image'
	img.onclick = onlyCheckPosting
	inp.type = 'text'
	inp.name = 'captcha'
	inp.id = 'captcha-text'
	inp.accessKey = 'c'
	inp.onkeyup = function(){
		if(this.value.length >= cache.captcha_min_length){
			cache.captcha_status = 3
		}else{
			cache.captcha_status = 1
		}
	}
	chk.id = 'captcha-check'
	chk.className = 'button-like'
	chk.onclick = checkCaptcha
	chk.textContent = _('check')

	byID('captcha-container').removeClass('hidden-element')

	byID('captcha-image-container').innerHTML = ''
	byID('captcha-input-container').innerHTML = ''
	byID('captcha-check-container').innerHTML = ''
	byID('pow-container').innerHTML = ''
	
	byID('captcha-image-container').appendChild(img)
	byID('captcha-input-container').appendChild(inp)
	byID('captcha-check-container').appendChild(chk)
	inp.focus()
}



function checkPassed(){
	byID('captchatoken').value = cache.captcha_token
	byID('captcha-or-container').addClass('hidden-element')
	byID('captcha-input-container').innerHTML = ''
	byID('captcha-image-container').innerHTML = _('Проверка пройдена.')
	byID('captcha-check-container').innerHTML = ''
	byID('pow-container').innerHTML = ''
}

function captchaExpired(){
	if(!isPOWCalculated()){
		alert('Капча устарела!')
		cache.captcha_status = 2
		onlyCheckPosting()
	}
}

function removeCaptcha(){
	if(isCaptchaAdded()){
		checkPassed()
	}
}

function isPOWAdded(){
	return !!byID('powbutton')
}

function isPOWCalculated(){
	return !!byID('powvalue').value
}

function getPowSeconds(powvalue){
	return Math.round(Math.pow(2, powvalue)/1000)
}
function addPOW(powvalue){
	var b = newElement('input')
	var i = newElement('div')
	b.type = 'button'
	b.id = 'powbutton'
	b.value = _('Вычислить POW')
	b.onclick = startPOWCalculation
	i.innerHTML = '(2<sup>'+(powvalue+1)+'</sup> '+_('хешей')+' ≈ '+getPowSeconds(powvalue)+' '+_('с.')+')'
	byID('pow-container').appendChild(b)
	byID('pow-container').appendChild(i)
	cache.pow_status = 1
}

function removePOW(){

}
