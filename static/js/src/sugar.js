function byID(id){
    return document.getElementById(id)
}
function byClass(className){
    return document.getElementsByClassName(className)
}
function byTag(tagName){
    return document.getElementsByTagName(tagName)
}
function byName(name){
    return document.getElementsByName(name)
}

function Cycle(iterations, callback){
    for(var i = 0; i < iterations; i++){
        callback(i)
    }
}
function CycleThrough(list,callback){
    for(var item in list){
        if(list.hasOwnProperty(item) && item != 'length'){
            callback(item)
        }
    }
}
function pushStyle(html){
    var el = newElement('style')
    el.innerHTML = html
    document.head.appendChild(el)
    return el
}
function collect() {
    var ret = {};
    var len = arguments.length;
    for (var i=0; i<len; i++) {
        for (var p in arguments[i]) {
            if (arguments[i].hasOwnProperty(p)) {
                ret[p] = arguments[i][p];
            }
        }
    }
    return ret;
}
function newElement(tagName){
    return document.createElement(tagName)
}
function newTextNode(textContent){
    return document.createTextNode(textContent)
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
Object.prototype.getKeys = function(){
    var keys = [];
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys
}

Object.prototype.hasKey = function(skey){
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            if(key==skey){
                return true
            }
        }
    }
    return false
}


Object.prototype.hasValue = function(val){
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            if(this[key]==val){
                return true
            }
        }
    }
    return false
}
Object.prototype.append = function(a){
    for(var i in a){
        if(a.hasOwnProperty(i)){
            this[i] = a[i]
        }
    }
}
Element.prototype.setProperties = function(arr){
    for(var property in arr){
        this[property] = arr[property]
    }
}
Element.prototype.byID = function(id){
    return this.getElementById(id)
}
Element.prototype.pushStyleArray = function(arr){
    for(var key in arr){
        this.style[key] = arr[key]
    }
}
Element.prototype.byClass = function(className){
    return this.getElementsByClassName(className)
}
Element.prototype.byTag = function(className){
    return this.getElementsByTagName(className)
}
Element.prototype.hasClass = function(className){
    var r = this.className.split(' ')
    for(var i = 0; i < r.length; i++){
        if(r[i]==className)
        return true
    }
    return false
}
Element.prototype.insertAfter = function(elem,refElem){
    var next = refElem.nextSibling;
    if (next) {
        return this.insertBefore(elem, next);
    } else {
        return this.appendChild(elem);
    }
}

Element.prototype.addClass = function(str){
    var r = this.className.split(' ')
    for(var i = 0; i < r.length; i++){
        if(r[i] == str){
            return
        }
    }
    this.className += ' '+str
}

Element.prototype.removeClass = function(str){
    var r = this.className.split(' '),
        n = []
    for(var i = 0; i < r.length; i++){
        if(r[i] != str){
            n.push(r[i])
        }
    }
    this.className = n.join(' ')
}

Array.prototype.inArray = function(comparer) {
    for(var i in this){
        if(this.hasOwnProperty(i)){
            if(this[i]==comparer){
                return true
            }
        }
    }
    return false
}
Array.prototype.getProperties = function(prop,iterations){
    var r = []
    var iterations = iterations?iterations:1
    for(var i in this){
        if(this.hasOwnProperty(i)){
            var t = this[i]
            for(var j = 0; j < iterations; j++){
                t = t[prop]
            }
            r.push(t)
        }
    }
    return r
}

String.prototype.replaceAll=function(find, replace_to){
    return this.replace(new RegExp(find, "g"), replace_to);
}

if(!HTMLCollection.prototype.map)
HTMLCollection.prototype.map = function(f){
    for(var i = 0; i < this.length; i++){
        f(this[i])
    }
}

function stopPropagation(evt) {
    if (typeof evt.stopPropagation == "function") {
        evt.stopPropagation();
    } else {
        evt.cancelBubble = true;
    }
}