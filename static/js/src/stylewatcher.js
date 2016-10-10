function checkStyle(callback){
	if(!cache.appliedStyle){
		saveAppliedStyle()
		return;
	}
	if(cache.appliedStyle != getStyle()+' '+getCookie('center_posts')){
		changeStyle(getStyle())
		saveAppliedStyle()
		if(typeof callback == 'function'){
			callback()
		}
	}
}

function changeStyle(name){
	setCookie('style',name,{
		expires:8640000,
		path:'/',
	})
	setTimeout(function(){
		byID('styleman').href = document.location.protocol+'//'+document.location.host+config.style_path+'?'+Math.random()
	},10)
}

function getStyle(){
	if(!!getCookie('style')){
		return getCookie('style')
	}else{
		return config.default_style
	}
}

function saveAppliedStyle(){
	cache.appliedStyle = getStyle()+' '+getCookie('center_posts')
}

document.addEventListener("DOMContentLoaded", function(){
	window.addEventListener('focus', checkStyle)
})
