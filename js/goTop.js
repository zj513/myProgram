var oDiv = document.getElementById('toTop');
window.onscroll = computerDisplay;
function computerDisplay(){
    if(utils.win('scrollTop') > utils.win('clientHeight')){
        oDiv.style.display = 'block';
    }
    else{
        oDiv.style.display = 'none';
    }
}
oDiv.onclick = function(){
    this.style.display = 'none';
    window.onscroll = null;
    var target = utils.win('scrollTop');
    var duration = 1000;
    var interval  =30;
    var step = target/duration*interval;
    var timer = setInterval(function(){
        var curTop = utils.win('scrollTop');
        if(curTop<=0){
            clearInterval(timer);
            window.onscroll = computerDisplay;
            return;
        }
        curTop-=step;
        utils.win('scrollTop',curTop);
    },interval)
};
