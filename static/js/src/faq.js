var cache = []
String.prototype.replaceAll=function(find, replace_to){
	return this.replace(new RegExp(find, "g"), replace_to);
};
function toggleSpoiler(elem){
	var spoiler = elem.parentNode.getElementsByClassName('fspoilertext')[0];
	if(spoiler.className.indexOf("fspoileropen")==-1){
		spoiler.className += " fspoileropen ";
	}else{
		spoiler.className = spoiler.className.replaceAll("fspoileropen","")
	}
}
function replaceAssignedAccessKey() {
	var elem = document.getElementById('accesskey-detector'),
		result, els
	if(!elem.accessKeyLabel) return;
	result = elem.accessKeyLabel.substr(0, elem.accessKeyLabel.length - 2)
	if(!result) return;
	els = document.getElementsByClassName('accesskey')
	for(var i = 0; i < els.length; i++){
		els[i].textContent = result
	}
	document.getElementById('accesskey-info').remove()
}

window.addEventListener('DOMContentLoaded', replaceAssignedAccessKey)