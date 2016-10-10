var c, snowCount, sa;
function addSnow(){
	if(getCookie2('style')=='Muon' || getCookie2('style') == 'Neutron' || getCookie2('style') == 'Achaba' || getCookie2('style')===undefined){
		if(document.getElementsByTagName('canvas').length < 1){
			c = document.createElement('canvas');
			c.width = screen.width;
			c.height = screen.height;
			document.body.appendChild(c);
			snowCount = 1000;
			sa = [];
			for(var i = 0; i < snowCount; i++){
				sa[i] = [];
				sa[i]['x'] = (Math.random()-0.5)*800;
				sa[i]['y'] = (Math.random());
				sa[i]['z'] = (Math.random()-0.5)*500;
			}
			setInterval('renderSnow()',100);
		}
		c = document.getElementsByTagName('canvas')[0];	
		c.style['display'] = 'block';
		c.style['position'] = 'fixed';
		c.onclick = function(){
			this.style['display'] = 'none';
		}
		c.style['top'] = 0;
		c.style['bottom'] = 0;
		c.style['left'] = 0;
		c.style['right'] = 0;
	}
}
function renderSnow(){
	if(c.style['display'] == 'block'){
		var ctx = c.getContext('2d');
		ctx.clearRect(0,0,screen.width, screen.height);
		for(var i = 0; i < snowCount; i++){
			ctx.fillStyle = 'rgba(255,255,255,'+(1-sa[i]['y'])*0.8+')';
			var tx = (sa[i]['x']+Math.sin(sa[i]['z']*0.2)*0.1)/(sa[i]['y']+Math.cos(sa[i]['z']*0.2)*0.01);
			var ty = (sa[i]['z'])/(sa[i]['y']+Math.cos(sa[i]['z']*0.2)*0.01);
			ctx.beginPath();
			ctx.arc(screen.width/2+tx, screen.height/2+ty, 2, 0, 2 * Math.PI, true);
			ctx.fill();
			ctx.closePath();
			sa[i]['z']+=Math.abs(Math.cos(i))+0.1;
			if(sa[i]['z'] > 250){
				sa[i]['z'] = -250;
			}
		}
	}
}
document.getElementById('new_logo').parentNode.href='javascript:addSnow();';
setTimeout('addSnow()',2600000);