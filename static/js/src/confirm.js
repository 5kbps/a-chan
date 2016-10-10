function confirmationTimer(){
	var el = byID('timeout')
	var val = getInt(el.textContent)
	if(val == 1){
		var el = byID('timeout-item')
		el.textContent = _('You are now able to post.')
		clearInterval(cache.timeout)
	}else{
		el.textContent = val - 1
	}
}

function startConfirmationTimer(){
	if(!!byID('timeout')){
		cache.timeout = setInterval(confirmationTimer, 1000);
	}
}

function stringifyPost(timestamp){
	if(!timestamp){
		var timestamp = byID('powtimestamp').value
	}
	return byID('message').value.replace(/\n/g,'\r\n')+timestamp//+byID('confirmation').value
}

cache.powThreadsCount = 2
cache.powWorkers = []

function terminateWorkers(){
	for(var i in cache.powWorkers){
		 cache.powWorkers[i].terminate()
	}
}

function startPOWCalculation(){
	var value = byID('powrequired').value*1;
	var timestamp = Date.now()
	var post_content = stringifyPost(timestamp)
	cache.pow_status = 2
	byID('powtimestamp').value = timestamp
	byID('powbutton').value = 'Wait...'
	if (!!window.Worker){
		for(var i = 0; i < cache.powThreadsCount; i++){
			cache.powWorkers[i] = new Worker(config.cpuboiler_path);
			function startWork(worker){
				cache.powWorkers[i].postMessage({'cmd': 'start', 'timestamp': timestamp,'post_content':post_content,'value':value});
			}
			startWork(cache.powWorkers[i])
			cache.powWorkers[i].addEventListener('message', function(e) {
				byID('powvalue').value = e.data
				byID('powbutton').value = _('Done!')
				cache.pow_status = 3
			}, false);
		}
	}else{
		alert(_('You are using old browser (Web Workers are not supported)!'))
		// pow_shift = 0
		// while( true ){
		// 	pow_shift++
		// 	pid1 = md5(post_content+pow_shift)
		// 	pid2 = md5(pow_shift+post_content)
		// 	tid1 = parseInt(pid1, 16).toString(2)
		// 	tid2 = parseInt(pid2, 16).toString(2)
		// 	if(tid1.substr(0,value)==tid2.substr(0,value)){
		// 		break
		// 	}
		// }
		// if(pow_shift){
		// 	id("post_pow_shift").value = pow_shift
		// 	console.log("pid="+hex2base36( pid1 )+"("+pid1+")"+":"+pow_shift)
		// }
		// if(toSubmit){
		// 	prepareForm()
		// 	id('post_form').submit()
		// }
	}

}

document.addEventListener("DOMContentLoaded", startConfirmationTimer);
