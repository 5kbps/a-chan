Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function anything2color(anything){
	var r = ''
	anything = anything+'      '
	for(var i = 0; i < 6; i++){
		r += {
			0:0,
			1:1,
			2:2,
			3:3,
			4:4,
			5:5,
			6:6,
			7:7,
			8:8,
			9:9,
			10:'A',
			11:'B',
			12:'C',
			14:'D',
			15:'E',
			16:'F'
		}[(anything.charCodeAt(i) % 16)]
	}
	return '#'+r
}

function escapeHtml(string) {
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	}
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	})
}

var config = {
	ignored: [],
	filtered: null
}

function ignoreType(typename){

}

function showOnlyType(typename){

}

function applyAllFilters(){
	for(var i = 0; i < config.ignored.length; i++){
		var ign = config.ignored[i]

	}
}

function toggleIgnoreFilter(typename){
	if(config.ignored.includes(typename)){
		removeIgnoreFilter(typename)
	}else{
		applyIgnoreFilter(typename)
	}
}

function isIgnoreFilterApplied(typename){
	return config.ignored.includes(typename)
}

function applyIgnoreFilter(typename){
	var s = document.createElement('style')
	s.innerHTML = '.globallog-type-'+typename+'{ display: none; }\
	#ignore-btn-'+typename+' { color: red; }'
	s.className = 'ignore-style'
	s.id ='ignore-style-'+typename
	document.head.appendChild(s)
	config.ignored.push(typename)
}

function removeIgnoreFilter(typename){
	var e = document.getElementById('ignore-style-'+typename)
	e.remove()
	config.ignored.remove(typename)
}

function parseRawMeta(){
	var list = document.getElementsByClassName('globallog-meta-raw')
	for(var i = 0; i < list.length; i++){
		var elem = list[i],
		meta, text = ''
		if(0 == elem.textContent.trim().length){
			elem.innerHTML = '<span class="clr-blue">no metadata</span>'
			continue
		}
		try{
			meta = JSON.parse(elem.textContent)
		} catch(e) {
			console.log(e)
			elem.innerHTML = '<span class="clr-red">decoding error</span>'
			continue
		}
		for(var sth in meta){
			if(meta.hasOwnProperty(sth)){
				if(sth != 'sess'){
					text += '<b>'+escapeHtml(sth)+'</b>:'+escapeHtml(meta[sth])+'<br>'
				}else{
					text += '<b>'+escapeHtml(sth)+'</b>:<span class="inline-sess"  style="background-color:'+anything2color(meta[sth])+';">'+escapeHtml(meta[sth])+'</span> '
					text += '<a target="_blank" href="/manage_page.php?action=bansession&session='+escapeHtml(meta[sth])+'">[ban]</a><br>'
				}
			}
		}
		elem.innerHTML = text
	}
}

function init(){
	parseRawMeta()
}

document.addEventListener("DOMContentLoaded", init)