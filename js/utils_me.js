/**
 * Created by Administrator on 2016/8/15.
 */
var utils = (function(){
    var flag = 'getComputedStyle' in window;
    return{
        jsonParse:function(str){
            return 'JSON' in window?JSON.parse(str):eval('('+str+')');
        },
        rnd:function(n,m){
            n = Number(n);
            m = Number(m);
            if(isNaN(n) || isNaN(m)){
                return Math.random();
            }
            if(n>m){
                var temp = m;
                m = n;
                n = temp;
            }
            return Math.round(Math.random()*(m-n)+n);
        },
        //类数组转数组
        makeArray:function(arg){
            var ary = [];
            try{   //标准浏览器处理
                ary = Array.prototype.slice.call(arg);
            }
            catch(e){  //非标准浏览器的兼容处理
                for(var i=0;i<arg.length;i++){
                    ary.push(arg[i]);
                }
            }
            return ary;
        },
        //以下是元素的获取和样式（10个）
        //client,offset没法设置  能设置的只有scrollTop/scrollLeft
        win:function(attr,value){
            if(value===undefined){
                //当第二个参数没传，说明是获取，必须写return
                return document.documentElement[attr] || document.body[attr];
            }
            //说明第二个参数传了，说明是设置
            document.documentElement[attr] = document.body[attr] = value;
        },
        //盒子模型偏移量(当前元素到body的距离)
        offset:function(curEle){
            var l = curEle.offsetLeft;
            var t =  curEle.offsetTop;
            var par = curEle.offsetParent;
            while(par){
                //IE浏览器下，offsetLeft已经包含了border，所以不需要加border
                //不是IE8浏览器，所以，只对不是IE8的加上border
                //clientLeft/top:边框的宽度；
                // offsetLeft/top:当前元素的外边框距离定位父级的内边框之间的距离；
                if(navigator.userAgent.indexOf('MSIE 8.0')===-1){
                    l+=par.clientLeft;
                    t+=par.clientTop;
                }
                l+=par.offsetLeft;
                t+=par.offsetTop;
                par = par.offsetParent;//有定位父级的话，继续找定位父级的定位父级
            }
            return {left:l,top:t}
        },
        //在一定的范围内，通过class名获取元素
        getByClass:function(strClass,parent){
            parent = parent||document;
            if(flag){
                return this.makeArray(parent.getElementsByClassName(strClass));
            }
            //1.字符串转数组(去除首尾空格，再按照空格进行切割)
            var aryClass = strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            //2.获parent下的所有元素
            var nodeList = parent.getElementsByTagName('*');
            //3.校验每个元素身上的class名，是否包含数组中的每一项
            var ary = [];
            for(var i=0;i<nodeList.length;i++){
                var curEle = nodeList[i];
                var bOk = true;   //假设都合格
                for(var j=0;j<aryClass.length;j++){
                    var reg = new RegExp('(^| +)'+aryClass[j]+'( +|$)');
                    //var reg = new RegExp('\\b'+aryClass[j]+'\\b');
                    if(!reg.test(curEle.className)){
                       bOk = false;   //校验是不合格
                        break;
                    }
                }
                if(bOk){
                    ary.push(curEle);
                }
            }
            return ary;
        },
        hasClass:function(curEle,cName){
            var reg = new RegExp('(^| +)'+cName+'( +|$)');
            return reg.test(curEle.className);
        },
        addClass:function(curEle,strClass){
            var aryClass = strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            for(var i=0;i<aryClass.length;i++){
                if(!this.hasClass(curEle,aryClass[i])){
                    curEle.className +=' '+aryClass[i];
                }
            }
        },
        removeClass:function(curEle,strClass){
            var aryClass = strClass.replace(/(^ +)|( +$)/g,'').split(/\s+/g);
            for(var i=0;i<aryClass.length;i++){
                var reg = new RegExp('\\b'+aryClass[i]+'\\b');
                if(reg.test(curEle.className)){
                    curEle.className = curEle.className.replace(reg,' ').replace(/(^ +)|( +$)/g,'').replace(/\s+/g,' ');
                }
            }
        },
        getCss:function(curEle,attr){
            var val=null;
            var reg = null;
            if(flag){
                val = getComputedStyle(curEle,false)[attr];
            }
            else{
                if(attr==='opacity'){
                    val= curEle.currentStyle.filter;
                    reg = /^alpha\(opacity[=:](\d+)\)$/i;
                    return reg.test(val)?reg.exec(val)[1]/100:1;
                }
                val = curEle.currentStyle[attr];
            }
            reg = /^[+-]?((\d|([1-9]\d+))(\.\d+)?)(px|pt|rem|em)$/i;
            return reg.test(val)?parseInt(val):val;
        },
        setCss:function(curEle,attr,value){
            //float处理
            if(attr==='float'){
                curEle.style.cssFloat = value;
                curEle.style.styleFloat = value;
                return;
            }
            //opacity处理
            if(attr==='opacity'){
                curEle.style.opacity = value;
                curEle.style.filter = 'alpha(opacity='+value*100+')';
                return;
            }
            //单位处理
            var reg = /^(width|height|top|bottom|left|right|((margin|padding)(left|right|top|bottom)?))$/i;
            if(reg.test(attr)){
                //修改
                if(!(value==='auto' || value.toString().indexOf('%')!==-1)){
                    value=parseFloat(value)+'px';
                }
            }
            curEle.style[attr] = value;
        },
        setGroupCss:function(curEle,opt){
            if(opt.toString()!=='[object Object]') return;
            for(var attr in opt){
                this.setCss(curEle,attr,opt[attr]);
            }
        },
        css:function(curEle){
            var arg2 = arguments[1];
            if(typeof arg2 ==='string'){
                var arg3 = arguments[2];
                if(arg3===undefined){
                   return this.getCss(curEle,arg2);
                }
                else{
                    this.setCss(curEle,arg2,arg3);
                }
            }
            if(arg2.toString()==='[object Object]'){
                this.setGroupCss(curEle,arg2)
            }
        },
        //节点关系的封装（10个）
        getChildren:function(curEle,tagName){
            var nodeList = curEle.childNodes;
            var ary = [];
            for(var i=0;i<nodeList.length;i++){
                var curEle = nodeList[i];
                if(curEle.nodeType===1){
                    if(tagName!==undefined){
                        //当第二个参数存在的时候，需要再次过滤
                        if(curEle.tagName.toLowerCase()===tagName.toLowerCase()){
                            ary.push(curEle);
                        }
                    }
                    else{
                        ary.push(curEle);
                    }
                }
            }
            return ary;
        },
        prev:function(curEle){
            if(flag){
                return curEle.previousElementSibling;
            }
            var pre = curEle.previousSibling;
            while(pre&&pre.nodeType!==1){
                pre = pre.previousSibling;
            }
            return pre;
        },
        prevAll:function(curEle){
            var pre = this.prev(curEle);
            var ary = [];
            while(pre){
                ary.unshift(pre);
                pre = this.prev(pre);
            }
            return ary;
        },
        next:function(curEle){
            if(flag){ return curEle.nextElementSibling;}
            var nex = curEle.nextSibling;
            while(nex&&nex.nodeType!==1){
                nex = nex.nextSibling;
            }
            return nex;
        },
        nextAll:function(curEle){
            var nex = this.next(curEle);
            var ary = [];
            while(nex){
                ary.push(nex);
                nex = this.next(nex);
            }
            return ary;
        },
        sibling:function(curEle){
            var ary=[];
            var pre = this.prev(curEle);
            var nex = this.next(curEle);
            if(pre) ary.push(pre);
            if(nex) ary.push(nex);
            return ary;
        },
        siblings:function(curEle){
            var ary1 = this.prevAll(curEle);
            var ary2 = this.nextAll(curEle);
            return ary1.concat(ary2);
        },
        firstChild:function(curEle){
            var childs = this.getChildren(curEle);
            return childs[0];
        },
        lastChild:function(curEle){
            var childs = this.getChildren(curEle);
            return childs[childs.length-1];
        },
        index:function(curEle){
            return this.prevAll(curEle).length;
        },
        //元素的动态操作（4个）
        appendChild:function(parent,curEle){
            parent.appendChild(curEle);
        },
        prependChild:function(parent,curEle){
            var first = this.firstChild(parent);
            if(first){
                parent.insertBefore(curEle,first);
            }
            else{
                parent.appendChild(curEle);
            }
        },
        insertBefore:function(newEle,oldEle){
            oldEle.parentNode.insertBefore(newEle,oldEle);
        },
        insertAfter:function(newEle,oldEle){
            var nex = this.next(oldEle);
            if(nex){
                oldEle.parentNode.insertBefore(newEle,nex);
            }
            else{
                oldEle.parentNode.appendChild(newEle);
            }
        }
    }
})();