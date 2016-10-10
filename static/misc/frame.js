
var checkRequests;
var config = [];
config['domain'] = document.location.hostname;
config['protocol'] = document.location.href.split(':')[0];

var Boards = [];
for(var i = 0; i < document.getElementsByClassName('boardlink').length; i++){
	Boards.push(document.getElementsByClassName('boardlink')[i].id.split('_')[1]);
}
function remch(elem){
	elem.parentNode.removeChild(elem);
}


function insertAfter(elem, refElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
        return parent.insertBefore(elem, next);
    } else {
        return parent.appendChild(elem);
    }
}

function getParam(text){
	if(localStorage.getItem(text)){
		return localStorage.getItem(text);
	}else{
		return 60;
	}
}


function getWatchingBoards(){
	var watchingBoards = [];
	for(var i = 0; i < Boards.length; i++){
		if(getParam('wb_'+Boards[i])!='false' && getParam('watchBoards')=='true'){
			watchingBoards[watchingBoards.length] = Boards[i];
		}
	}
	return watchingBoards;
}


function setLP2result(elem){
	var tboard = elem.id.split('_')[2];
	var lastpost = (elem.textContent.split('+')[1]*1) + 1*localStorage.getItem('lp_'+tboard);
	localStorage.setItem('lp_'+tboard,lastpost);
	remch(document.getElementById('sm_counter1_'+tboard));
}

function checkForNewPosts(){
	checkRequest = new XMLHttpRequest();
	checkRequest.open("GET", config['protocol']+'://'+config['domain']+'/api.php?action=lastpost&board=all&nocache='+Math.random(), true );
	checkRequest.send(null);
	checkRequest.onreadystatechange = function(){
		if (this.readyState == 4 && this.status == 200 ) {
			var response = JSON.parse(this.responseText);
			for(board in response){
				var watching = false;
				for(cwb in getWatchingBoards()){
					if(getWatchingBoards()[cwb]==board){
						var watching = true;
					}
				}
				if(watching){
					var tboard = board;
					var oldpostcount = localStorage.getItem('lp_'+tboard);
					var newpostcount = response[board];

					if(oldpostcount != null && oldpostcount < newpostcount ){

						var tspan1 = document.createElement('span');
						tspan1.innerHTML = '+'+(newpostcount - oldpostcount);
						tspan1.className = 'sm_counter';
						tspan1.id = 'sm_counter1_'+tboard;
						tspan1.onclick = function(){
							setLP2result(this);
						}
						if(document.getElementById(tspan1.id)==null){
							insertAfter(tspan1, document.getElementById('sm_'+tboard));
						}else{
							document.getElementById('sm_counter1_'+tboard).innerHTML = tspan1.innerHTML;
						}
					}else if(oldpostcount >= newpostcount){
						if(document.getElementById('sm_counter1_'+tboard) && document.getElementById('sm_counter1_'+tboard)){
							remch(document.getElementById('sm_counter1_'+tboard));
							remch(document.getElementById('sm_counter2_'+tboard));
						}
					}
				}
			}
		}
	}
}
checkForNewPosts();
setInterval(checkForNewPosts, getParam( 'wb_interval')*1000);