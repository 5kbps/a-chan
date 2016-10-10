self.addEventListener('message', function(e) {
	var data = e.data;
	importScripts('/static/js/min/md5.min.js');
	switch (data.cmd) {
		case 'start':
			var post_content = data.post_content,
				value = data.value,
				nonce = 1,
				p1, p2, t1, t2
			while(true){
				p1 = md5(post_content+nonce)
				p2 = md5(nonce+post_content)
				t1 = parseInt(p1, 16).toString(2)
				t2 = parseInt(p2, 16).toString(2)
				if(t1.substr(0,value)==t2.substr(0,value)){
					break
				}
				nonce++
			}
			self.postMessage(nonce);
			break;
		case 'stop':
			self.close();
			break;
	};
}, false);
