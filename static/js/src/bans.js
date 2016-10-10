function setRule(n){
	if (!hasRule(n))
		addRule(n)
	else
		removeRule(n)
}

function constructRule(n) {
	return '<a href="/faq#rule'+n+'">#'+n+'</a>'
}

function addRule(n) {
	if (!hasRule(n)) {
		document.banform.reason.value += ' '+constructRule(n)
		document.banform.reason.value = document.banform.reason.value.trim()
	}
}

function hasRule(n) {
	if (typeof n == 'number') {
		n = constructRule(n)
	}
	return (document.banform.reason.value.indexOf(n) != -1)
}

function removeRule(n) {
	if (typeof n == 'number') {
		n = constructRule(n)
	}
	document.banform.reason.value = document.banform.reason.value.replace(n, '')
}
