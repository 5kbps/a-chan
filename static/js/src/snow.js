function addSnowCanvas(){
    var c = newElement('canvas')
    c.className = 'snow-canvas'
    // position
    c.style.top     = 0
    c.style.left    = 0
    c.style.right   = 0
    c.style.bottom  = 0
    c.style['z-index'] = 1000
    c.style.position   = 'fixed'
    // size
    c.width = screen.width;
    c.height = screen.height;
    c.onclick = toggleSnow
    setTimeout(function(){
        c.style.opacity = 1
    },10)
    document.body.appendChild(c)
}

function addSnowCanvasStyle(){
    pushStyle('.snow-canvas{\
        transition: all '+config['snow-delay']+'s ease 0s;\
        opacity: 0;\
    }')
}

function removeSnowCanvas(){
    if(!!byClass('snow-canvas')){
        byClass('snow-canvas')[0].remove()
    }
}

function deactivateLink(){
    var logo = byID('new_logo')
    var link = logo.parentNode
    link.href = 'javascript:void(0);'
    logo.onclick = toggleSnow
}


function toggleSnow(){
    if(cache['snow']){
        // snow is on
        byClass('snow-canvas')[0].style.opacity = 0
        setTimeout(function(){
            removeSnowCanvas()
            cache['snow'] = false
            clearInterval(cache['snow-interval'])
        }, config['snow-delay']*1000)
    }else{
        // snow is off
        if(snowAvaliable()){
            generateSnow()
            addSnowCanvas()
            cache['snow-interval'] = setInterval(renderSnow,100)
            cache['snow'] = true
        }else{
            showMessage
        }
    }
}

function snowAvaliable(){
    curStyle = getCookie('style')
    return (['Muon','Neutron','Achaba','',undefined].indexOf(curStyle) != -1)
}

function generateSnow(){
    var cnt = cache['snow-count']
    var sa = []
    for(var i = 0; i < cnt; i++)
        sa[i] = {
            x: (Math.random()-0.5)*800,
            y: (Math.random()),
            z: (Math.random()-0.5)*500
        }
    cache['snow-array'] = sa
}

function renderSnow(){
    var c   = byClass('snow-canvas')[0]
    var ctx = c.getContext('2d');
    var sa  = cache['snow-array']
    var cnt = sa.length
    ctx.clearRect(0,0,screen.width, screen.height);
    for(var i = 0; i < cnt; i++){
        s = sa[i]
        ctx.fillStyle = 'rgba(255,255,255,'+(1-sa[i].y)*0.8+')';
        var tx = (s.x+Math.sin(s.z*0.2)*0.1 )/
        (s.y+Math.cos(s.z*0.2)*0.01);
        var ty = (s.z)/(s.y+Math.cos(s.z*0.2)*0.01);
        ctx.beginPath();
        ctx.arc(screen.width/2+tx, screen.height/2+ty, 2, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
        s.z+=Math.abs(Math.cos(i))*config['snow-speed']+0.1;
        if(s.z > 250){
            s.z = -250;
        }
        sa[i] = s
    }
    cache['snow-array'] = sa
    if(Math.random()<0.01){
        changeSpeed()
    }
}
function changeSpeed(){
    config['snow-speed'] = Math.ceil(Math.random()*3)
}
function initSnow(){
    if(snowAvaliable()){
        cache['snow'] = false
        cache['snow-count'] = 500
        cache['snow-array'] = []
        addSnowCanvasStyle()
        deactivateLink()
    }
}