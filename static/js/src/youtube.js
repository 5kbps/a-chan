var YouTube = {
	init:function(){
		if(getSetting('youtube')){
			var maxPreviewsInPost = getSetting('max_youtube')
			var list = document.links
			CycleThrough(list,function(item){
				var link	= list[item]
				var postNum = getPostNumByElem(link)
				if(postNum){
					var vid 	= YouTube.getVideoId(link.href)
					if(vid){
						if(link.className != 'youtube-link'){
							link.className = 'youtube-link'
							link.target='_blank'
							var con = YouTube.addContainer(link,vid)
							var added 	= (!!cache.youtube[postNum])?cache.youtube[postNum]:0
							cache.youtube[postNum] = added+1
							var preview = added < maxPreviewsInPost
							if(preview){
								YouTube.addPreview(con,vid)
							}else{
								YouTube.addOpenButton(con,vid)
							}
							if(getSetting('youtube_info')){
								YouTube.getInfo(vid,con)
							}
						}
					}
				}
			})
		}
	},
	getVideoId:function(url){
		var host = url.split('/')[2]
		if(!['youtube.com','youtu.be','www.youtube.com','www.youtu.be'].hasValue(host)) return '';
		var parr = url.split(/(&|\?)/)
		var vre = /v=[a-zA-Z0-9_-]{11}/
		for(var i = 0; i < parr.length; i++){
			if(/^v=[a-zA-Z0-9_-]{11}$/.test(parr[i])){
				return parr[i].substr(2)
			}
		}
		return ''
	},
	addContainer:function(link,vid){
		var c = newElement('div')
		c.className = 'youtube-container'
		c.id = vid
		var d = newElement('span')
		d.className = 'youtube-controls'
		var e = newElement('div')
		e.className = 'youtube-frame-container'
		var f = newElement('div')
		f.className = 'youtube-preview-container'
		var g = newElement('span')
		g.className = 'youtube-info'
		link.parentNode.appendChild(c)
		insertAfter(c,link)
		c.appendChild(link)
		c.appendChild(d)
		c.appendChild(e)
		c.appendChild(f)
		c.appendChild(g)
		return c
	},
	addPreview:function(con,vid){
		if(!con.byClass('youtube-preview-container')[0].childNodes[0]){
			var img = newElement('img')
			img.className = 'youtube-preview'
			img.src = 'https://img.youtube.com/vi/'+vid+'/0.jpg';
			img.onclick = function(){
				YouTube.expand(con,vid);
				return false
			}
			con.byClass('youtube-preview-container')[0].appendChild(img)
			con.byClass('youtube-controls')[0].innerHTML =''
		}
	},
	addOpenButton:function(con,vid){
		if(!con.byClass('youtube-controls')[0].childNodes[0]){
			var a = newElement('span')
			a.textContent = _('Open')
			a.className = 'youtube-control youtube-open'
			a.onclick = function(){
				YouTube.addPreview(con,vid)
				return false
			}
			con.byClass('youtube-controls')[0].appendChild(a)
		}
	},
	parseDuration:function(d){
		var r = []
		var b =''
		for(var i = 0; i < d.length; i++){
			var c = d[i]
			if("0123456789".indexOf(c)!=-1){
				b+=c
			}else{
				if(b!=''){
					r.push(b)
					b=''
				}
			}
		}
		for(var i = 0; i < r.length; i++){
			r[i] = normalizeIntLength(r[i],2)
		}
		return r.join(':')
	},
	expand:function(con,vid){
		con.byClass('youtube-controls')[0].innerHTML = ''
		var a = newElement('span')
		a.textContent = _('Close')
		a.className = 'youtube-control youtube-close'
		a.onclick = function(){
			YouTube.close(con,vid)
			return false
		}
		con.byClass('youtube-controls')[0].appendChild(a)

		con.byClass('youtube-preview-container')[0].innerHTML = ''

		var b = document.createElement('iframe')
		b.width = 560
		b.height = 315
		b.className = 'youtube-frame'
		b.src = '//www.youtube.com/embed/'+vid
		b.frameborder=0
		b.allowfullscreen = true
		con.byClass('youtube-frame-container')[0].appendChild(b)
	},
	close:function(con,vid){
		con.byClass('youtube-frame-container')[0].innerHTML =''
		YouTube.addPreview(con,vid)
		con.byClass('youtube-controls')[0].innerHTML =''
	},
	getInfo:function(vid,con){
		var addInfo = function(vid,conf,title,duration){
			var a = con.byClass('youtube-info')[0]
			var b = newElement('span')
			b.className = 'youtube-title'
			var c = newElement('span')
			c.className = 'youtube-duration'
			a.appendChild(c)
			a.appendChild(b)
			b.textContent = title
			c.textContent = duration
		}
		if(!cache.youtube[vid]){
			var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics%2CcontentDetails&id='+vid+'&key=AIzaSyAjVszM7AORWRv8za3XgsmN4Sow85mibIE'
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open( "GET", url, true );
			xmlHttp.send( null );
			xmlHttp.onreadystatechange = function(){
				if(xmlHttp.readyState == 4){
					if(xmlHttp.status == 200){
						var jsn = JSON.parse(this.responseText)
						if(!jsn.items || !jsn.items[0]) return;
						var s = jsn.items[0].snippet
						var duration = YouTube.parseDuration(jsn.items[0].contentDetails.duration)
						var title = s.title
						addInfo(vid,con,title,duration)
						cache.youtube[vid] = {
							title:title,
							duration:duration,
						}
					}
				}
			}
		}else{
			addInfo(vid, con, cache.youtube[vid].title, cache.youtube[vid].duration)
		}
	}
}
