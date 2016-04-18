var socket = io();
var positionChange = 1;
var isLeft =false ;
var isRight=false ;
var isStop =false ;
var screenWith = $(window).width() - 200;
$(document).ready(function () {
    getValues();
});
function getValues(){
    socket.on("clickButton",function(){
        //schiet
    });
    socket.on("startRightTilt",function(){
       // Ga naar rechts
        isRight = true;
        isLeft = false;
        isStop = false;
    });
    socket.on("startLeftTilt",function(){
       //Ga naar links
        isLeft = true;
        isRight = false;
        isStop = false;
    });
    socket.on("stopTilt", function () {
        // Sta stil
        isStop = true;
        isRight = false;
        isLeft = false;
    });
}

function changePosition(){
    var shipPos= $(".ship").position().left;
    var percentage = (shipPos / screenWith) * 100;
    console.log(percentage);
        if(isLeft){
            var newpercentageL = percentage - positionChange;
            if(newpercentageL<0){
                newpercentageL = 0;
            }
            $(".ship").css("left",newpercentageL +"%");
        }
        if(isRight){
            var newpercentageR = percentage + positionChange;
            if(newpercentageR >100){
                newpercentageR = 100;
            }
            $(".ship").css("left", newpercentageR +"%");
        }


    window.requestAnimationFrame(changePosition);
}
window.requestAnimationFrame(changePosition);
function makeBullet(){
    $(".info_overlay").append("<div>bullet :)</div>")
}