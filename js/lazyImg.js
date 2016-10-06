/**
 * Created by Administrator on 2016/8/29.
 */
function LazyImg(id){
    this.lazy = document.getElementById(id);
    this.aDiv = this.lazy.getElementsByTagName('div');
    this.aImg = this.lazy.getElementsByTagName('img');
    this.init();
}
LazyImg.prototype ={
    constructor:LazyImg,
    init : function(){
        var _this = this;
        window.onscroll = function(){
            _this.Scroll();
        };
    },
    Scroll : function Scroll(){
        var scrollBottom = utils.win('scrollTop') + utils.win('clientHeight');
        for(var i=0;i<this.aDiv.length;i++){
            // var imgPos = utils.offset(aDiv[i]).top + utils.css(aDiv[i],'height');
            var imgPos = this.aDiv[i].offsetTop + this.aDiv[i].offsetHeight;
            if(imgPos<scrollBottom){
                this.lazyImg(this.aImg[i]);
            }
        }
    },
    lazyImg : function lazyImg(img){
        if(img.loaded) return;
        //创建一个新的图片元素
        var tempImg = new Image;
        //保存正确的图片地址
        tempImg.src = img.getAttribute('realImg');
        //校验
        tempImg.onload = function(){
            img.src = this.src;
            tempImg = null;
            img.loaded = true;
        };
        tempImg.onerror = function(){
            img.loaded = true;
            tempImg = null;
            img.parentNode.style.backgroundImage = 'url("../images/error.png")';
        }
    }
};
