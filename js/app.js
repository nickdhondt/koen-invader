var socket = io();
var positionChange = 0.5;
var isLeft =false ;
var isRight=false ;
var isStop =false ;
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
    var shipPos= $(".ship").get(0).style.left;
    console.log(shipPos);
    if(shipPos != 0 && shipPos !=100){
        if(isLeft){
            $(".ship").css("left",shipPos + positionChange +"%");
        }
        if(isRight){
            $(".ship").css("left", shipPos - positionChange +"%");
        }
    }

    window.requestAnimationFrame(changePosition);
}
window.requestAnimationFrame(changePosition);