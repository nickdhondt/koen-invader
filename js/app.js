var socket = io();
var positionChange = 1;
var isLeft =false ;
var isRight=false ;
var isStop =false ;
var screenWith = $(window).width() - 200;
var screenHeight = $(window).height();
var koensList = [];
var projectilesList = [];

$(document).ready(function () {
    getValues();
    spawnKoens();
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

function frame(){
    var ship = $(".ship");
    var shipPos= ship.position().left;
    var percentage = (shipPos / screenWith) * 100;
        if(isLeft){
            var newpercentage = percentage - positionChange;
            if(newpercentage<0){
                newpercentage = 0;
            }
            ship.css("left",newpercentage +"%");
        }
        if(isRight){
            var newpercentageR = percentage + positionChange;
            if(newpercentageR >100){
                newpercentageR = 100;
            }
            ship.css("left", newpercentageR +"%");
        }

    $.each(projectilesList, function(key, projectile) {
        var jProjectile = $(projectile);

        jProjectile.css("top", jProjectile.offset().top + 5);

        if (jProjectile.offset().top > screenHeight) {
            jProjectile.remove();
        }
    });

    $.each(koensList, function(key, koen) {
        if (Math.random() < 0.001) {
            console.log("Fire! " + key);
            spawnEnemyProjectile(koen);
        }
    });

    window.requestAnimationFrame(frame);
}
window.requestAnimationFrame(frame);

function makeBullet(){
    $(".info_overlay").append("<div>bullet :)</div>")
}

function spawnKoens() {
    var koens = $(".koens");
    for(var i = 0; i < 36; i++) {
        var koen = $("<div class='koen'></div>");
        koens.append(koen);
        koensList.push(koen[0]);
    }
}

function spawnEnemyProjectile(koen) {
    var jKoen = $(koen);
    var y = jKoen.offset().top + 100;
    var x = jKoen.offset().left + 20;

    var projectile = $("<div class='projectile'></div>");
    projectile.css("top", y).css("left", x);
    $(".info_overlay").append(projectile);

    projectilesList.push(projectile[0]);
}