var mainRender = (function(){
    var oLi3 = document.getElementById('li3');
    var oDrop_ul = document.getElementById('drop_ul');
    var oAlist = document.getElementById('alist');
    var oDrop_ul_list = document.getElementById('drop_ul_list');
    var oCode = document.getElementById('right-qrcode');
    function menus(){
        oLi3.onmouseenter = function(e){
            oDrop_ul.style.display = oDrop_ul.style.display == "block" ? "none" : "block";
            (e || window.event).cancelBubble = true
        };
        oLi3.onmouseleave = function(){  oDrop_ul.style.display = 'none'; };
        oAlist.onmouseenter = function(){  oDrop_ul_list.style.display = 'block';};
        oAlist.onmouseleave = function(){ oDrop_ul_list.style.display = 'none';};
        oCode.onmouseenter= function(e){
            this.getElementsByTagName('div')[0].style.display ='block';
            this.style.position="relative";
        };
        oCode.onmouseleave = function(){
            this.getElementsByTagName('div')[0].style.display ='none';
            this.style.position="";
        };
    }
    function tabs(){
        var oTab_t = document.getElementById('tab_t');
        var aSpan = oTab_t.getElementsByTagName('span');
        for(var i=0;i<aSpan.length;i++){
            (function(index){
                aSpan[i].onclick = function(){
                    for(var i=0;i<aSpan.length;i++){
                        aSpan[i].className = '';
                    }
                    aSpan[index].className = 'tab_on';
                }
            })(i)
        }
    }
    return{
        init:function(){
            menus();
            tabs();
        }
    }
})();
mainRender.init();
function list_show(strid){
    strid.getElementsByTagName('ul')[0].style.display="block";
    strid.style.position="relative";
}
function list_hide(strid){
    strid.getElementsByTagName('ul')[0].style.display="";
    strid.style.position="";
}