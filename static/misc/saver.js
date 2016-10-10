String.prototype.replaceAll=function(find, replace_to){
    return this.replace(new RegExp(find, "g"), replace_to);
};
var domain = document.location.hostname;
var path = document.location.pathname;
var board = document.location.href.split('/')[3];
var zip,zarr=[],nn=[],ll=0,r = [];
nn[document.location.href] = 'index.html';

function fileList(){
	for(var i = 0; i < document.images.length; i++){
		r[r.length] = document.images[i].src;
	}
	for(var i = 0; i < document.head.getElementsByTagName('link').length; i++){
		r[r.length] = document.head.getElementsByTagName('link')[i].href;
	}
	if(getParam('onlyThumbs')!='true'){
		for(var i = 0; i < document.getElementsByClassName('filesize').length; i++){
			r[r.length] = document.getElementsByClassName('filesize')[i].getElementsByTagName('a')[0].href;
		}
	}
	for(var i = 0; i<r.length; i++){
		r[i] = r[i].split(domain)[1];
	}
	var board = document.location.href.split('/')[3];
	for(var i = 0; i < r.length; i++){
		if(r[i] !== undefined && (r[i].split('/')[2]=='thumb' || r[i].split('/')[2]=='src' || r[i].split('/')[2]=='css')){
			nn[r[i]] = '/'+r[i].split('/'+board+'/')[1];
			console.log(r[i]);
		}else{
			r[i] = null;
		}
	}
	var protocol = document.location.href.split(':')[0];
	r[r.length] = '/static/styleman.php';
	nn[r[r.length-1]] = '/static/style.css';
	r[r.length] = '/static/a-chan.css';
	nn[r[r.length-1]] = '/static/a-chan.css';
	r[r.length] = protocol+'://a-chan.org/static/a-chan5_5_2.js';
	nn[r[r.length-1]] = '/static/script.js';
	for(var i = 0; i < r.length; i++){
		if(r[i]!==null){
			console.log(r[i]+": --- > "+nn[r[i]])
			add2ZIP(r[i]);
			ll++;
		}
	}
}
//thumbArray();
/*
var zip = new JSZip();
zip.file("index.html", html);
var img = zip.folder("images");
var content = zip.generate({type:"blob"});
// see FileSaver.js
saveAs(content, "example.zip");
*/
function startSaving(){	
	var board = document.location.href.split('/')[3];
	hidePosts();
	showMessage('Подгрузка скрипта...');
	var zipjs = document.createElement('script');
	zipjs.src = '/static/jszip.js';
	zipjs.onload = function(){
		showMessage('Тред сохранен '+Date());
		var html = '<html>'+document.getElementsByTagName('html')[0].innerHTML.replaceAll('http://a-chan.org/'+board+'/','')
		html = html.replaceAll('https://a-chan.org/'+board+'/','');
		html = html.replaceAll('/static/styleman.php','static/style.css');
		html = html.replaceAll('/static/a-chan5_5_2.js','static/script.js');
		html = html.replaceAll('/'+board+'/','');
		html = html.replaceAll('/css/','css/')+'</html>';
		showMessage('Пожалуйста, подождите...');
		zip = new JSZip;
		zip.file("index.html", html);
		var css = zip.folder("css");
		var thumb = zip.folder("thumb");
		var stat = zip.folder("static");
		var src = zip.folder("src");
		var r = fileList();
	}
	document.body.appendChild(zipjs);
}
function add2ZIP(url){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = "arraybuffer";
	xhr.onreadystatechange = function(evt) {
	    if (xhr.readyState === 4) {
	        if (xhr.status === 200) {
	        	var board = document.location.href.split('/')[3];
	            zip.file(nn[url], xhr.response);
	            showMessage(nn[url]);
	            ll--;
	            if(ll==0){
	            	var content = zip.generate({type:"blob"});
					// see FileSaver.js
					saveAs(content, document.location.href.split('/')[document.location.href.split('/').length-1].split('.')[0] +' - '+document.title+'.zip');
					showMessage('Сохранение выполнено.')
	            }
	        }
	    }
	};
	xhr.send();
}