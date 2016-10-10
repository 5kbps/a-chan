var bugtracker = {
	statuses : [
		['Not a bug', 'not-a-bug'],
		['Bug', 'bug'],
		['Unrelated','unrelated'],
		['Fixed','fixed'],
		['Closed', 'closed'],
		['Duplicate', 'duplicate']
	],
	getPromptText: function() {
		var r = ''
		for(var i = 0; i < bugtracker.statuses.length; i++){
			var status = bugtracker.statuses[i]
			r += '\n'+i+': '+status[0]
		}
		return r
	},
	constructStatusHTML: function(status) {
		return '<span class="review-status rs-'+status[1]+'">'+status[0]+'</span>'
	}
}

function getPostSubjectButtonsHTML() {
	var r = '<span class="add-rs" onclick="addRS(this)">+</span>\
			 <span class="rem-rs" onclick="remRS(this)">-</span>'
	return r
}

function addRS(elem){
	var result = prompt('Which review would you add? ' + bugtracker.getPromptText())
	if (!!bugtracker.statuses[result]) {
		var status = bugtracker.statuses[result]
		var postNum = getInt(elem.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('post-number')[0].id)
		var reqURL = '/manage_page.php?action=addreviewstatus&boarddir='+
			config.board+'&id='+postNum+'&status_html='+bugtracker.constructStatusHTML(status)
		console.log(reqURL)
		var xmlHttp = new XMLHttpRequest()
		xmlHttp.open('GET', reqURL, true)
		xmlHttp.send(null)
		xmlHttp.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					elem.parentNode.parentNode.getElementsByClassName('post-subject')[0].innerHTML = this.responseText
				}else if(this.status == 500) {
					alert(this.status +':' +this.responseText+'\n'+reqURL)
				}
			}
		}

	}else{
		alert('Unrecognised input')
	}
}

function addPostSubjectEditors() {
	var list = byClass('post-subject')
	for (var i = 0; i < list.length; i++) {
		var ps = list[i]
		var m = document.createElement('span')
		m.innerHTML = getPostSubjectButtonsHTML()
		ps.parentNode.appendChild(m)
		//ps.insertAfter(m)
	}
}
