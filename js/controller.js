$(document).ready(function(){
    window.screen.orientation.lock('landscape-primary');
    window.screen.orientation.addEventListener("change",function(){
        motion();
    });
});
var isLeft =false ;
var isRight=false ;
var isStop =false ;
function motion(){
    var orientation = window.screen.orientation;
    if(orientation.type == "landscape-primary"){
        if(window.DeviceOrientationEvent){
            $(".schiet").click(function(){
                socket.emit("clickButton",true);
            });
            window.addEventListener("deviceorientation", function (eventdata) {
                var tiltLR = Math.round(eventdata.beta)%180;
                if(tiltLR >5){
                    //Rechts
                    if(!isRight){
                        socket.emit("startRightTilt",true);
                        isRight = true;
                        isLeft = false;
                        isStop = false;
                    }
                }
                if(tiltLR <-5){
                    //Links
                    if(!isLeft){
                        socket.emit("startLeftTilt",true);
                        isLeft = true;
                        isRight = false;
                        isStop = false;
                    }
                }
                if(tiltLR>-5 &&tiltLR<5){
                    if(!isStop){
                        socket.emit("stopTilt",true);
                        isStop = true;
                        isRight = false;
                        isLeft = false;
                    }
                }
            })
        }
    }
}

//function screenOrientation(){
//    var orientation = window.screen.orientation;
//    if(orientation.type!='landscape-primary'){
//
//    }
//}