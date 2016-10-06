/**
 * Created by Administrator on 2016/8/19.
 */
function Banner(){
    //1.获取元素
    this.oBox = document.getElementById('box');
    this.oBoxInner = this.oBox.getElementsByTagName('div')[0];
    this.aDiv = this.oBoxInner.getElementsByTagName('div');
    this.aImg = this.oBoxInner.getElementsByTagName('img');
    this.oUl = this.oBox.getElementsByTagName('ul')[0];
    this.aLi = this.oBox.getElementsByTagName('li');
    this.oBtnLeft = this.oBox.getElementsByTagName('a')[0];
    this.oBtnRight = this.oBox.getElementsByTagName('a')[1];
    this.data = null;
    this.step = 0;
    this.timer = null;
    this.init();
}
Banner.prototype =  {
    constructor : Banner,
    init:function(){
        var _this = this;
        //2.获取数据并且解析数据
        this.getData();
        //console.log(this.data)
        //3.绑定数据
        this.bind();
        //4.图片延迟加载
        this.lazyImg();
        //5.图片自动的渐隐渐现
        clearInterval(this.timer);
        this.timer = setInterval(function(){
            _this.autoMove()
        },2000);
        //6.焦点自动播放
        this.bannerTip();
        //7.鼠标移入停止，移除继续
        this.overout();
        //8.点击焦点手动切换
        this.handleChange();
        //9.左右切换
        this.leftRight();
    },
    getData:function getData(){
        var _this = this;
        var xml = new XMLHttpRequest;
        xml.open('get','json/data.txt',false);
        xml.onreadystatechange = function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data  = utils.jsonParse(xml.responseText);
            }
        };
        xml.send();
    },
    bind:function bind(){
        var strDiv ="";
        var strLi = "";
        for(var i=0;i<this.data.length;i++){
            strDiv+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""></div>';
            strLi+=i==0?'<li class="on"></li>':'<li></li>';
        }
        this.oBoxInner.innerHTML = strDiv;
        this.oUl.innerHTML = strLi;
    },
    lazyImg:function lazyImg(){
        var _this = this;
        for(var i=0;i<this.aImg.length;i++){
            (function(index){
                var tmpImg = new Image;
                tmpImg.src = _this.aImg[index].getAttribute('realImg');
                tmpImg.onload = function(){
                    _this.aImg[index].src = this.src;
                    var oDiv1 =_this.aDiv[0];
                    utils.css(oDiv1,'zIndex',1);
                    animate(oDiv1,{opacity:1},1000);
                }
            })(i)
        }
    },
    autoMove:function autoMove(){
        if(this.step>=this.aDiv.length-1){
            this.step = -1;
        }
        this.step++;
        this.setBanner();
    },
    setBanner:function setBanner(){
        for(var i=0;i<this.aDiv.length;i++){
            if(i===this.step){ //那个div的索引等于step时，让那个div的层级提高，其他div的层级都是0
                utils.css(this.aDiv[i],'zIndex',1);
                animate(this.aDiv[i],{opacity:1},1000,function(){
                    //2.应该把索引等于step的div透明度从0-1，等他结束运动后，让他们所有的兄弟元素的透明度变成0
                    var siblings = utils.siblings(this);
                    for(var i=0;i<siblings.length;i++){
                        animate(siblings[i],{opacity:0});
                    }
                });
                continue;
            }
            utils.css(this.aDiv[i],'zIndex',0);
        }
        this.bannerTip();
    },
    bannerTip:function bannerTip(){
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].className =i==this.step?'on':null;
        }
    },
    overout:function overout(){
        var _this = this;
        this.oBox.onmouseover = function(){
            clearInterval(_this.timer);
            _this.oBtnLeft.style.display = 'block';
            _this.oBtnRight.style.display = 'block';
        };
        this.oBox.onmouseout = function(){
            _this.timer = setInterval(function(){
                _this.autoMove();
            },2000);
            _this.oBtnLeft.style.display = 'none';
            _this.oBtnRight.style.display = 'none';
        };
    },
    handleChange:function handleChange(){
        var _this = this;
        for(var i=0;i<this.aLi.length;i++){
            this.aLi[i].index = i;
            this.aLi[i].onclick = function(){
                _this.step = this.index;
                _this.setBanner();
            }
        }
    },
    leftRight:function leftRight(){
        var _this =this;
        this.oBtnRight.onclick = function(){
            _this.autoMove()
        };
        this.oBtnLeft.onclick = function(){
            if(_this.step<=0){
                _this.step=_this.aLi.length;
            }
            _this.step--;
            _this.setBanner();
        }
    }
};
