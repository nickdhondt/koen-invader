var socket = io();
var isLeft =false ;
var isRight=false ;
var isStop =false ;
var screenWith = $(window).width() - 200;
var screenHeight = $(window).height();
var koensList = [];
var projectilesList = [];
var paused = false;
var start = null;

$(document).ready(function () {
    getValues();
    spawnKoens();
    $("#restart").click(function(){
        $("#over").hide();
        $(".projectiles").empty();
        $("#first").empty();
        $("#second").empty();
        $("#third").empty();
        $("#fourth").empty();
        $("#lives").text("3");
        koensList = [];
        projectilesList = [];
        spawnKoens();
        paused = false;
    });
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

function frame(timestamp){
    if (start) var delta = timestamp - start;
    start = timestamp;

    if (paused === false) {
        var positionChange = 16;

        var ship = $(".ship");
        var shipPos= ship.position().left;
        var percentage = (shipPos / screenWith) * 100;
            if(isLeft){
                var newpercentage = percentage - (positionChange / delta);
                if(newpercentage<0){
                    newpercentage = 0;
                }
                ship.css("left",newpercentage +"%");
            }
            if(isRight){
                var newpercentageR = percentage + (positionChange / delta);
                if(newpercentageR > 100){
                    newpercentageR = 100;
                }
                ship.css("left", newpercentageR +"%");
            }

        $.each(projectilesList, function(key, projectile) {
            var jProjectile = $(projectile);

            jProjectile.css("top", jProjectile.offset().top + 50 / delta);

            if (jProjectile.offset().top > screenHeight) {
                jProjectile.remove();
            }

            var lives = $("#lives");

            if (collision(ship, jProjectile)) {
                jProjectile.remove();

                lives.text(lives.text() - 1);

                if (lives.text() <= 0) {
                    $("#over").show();
                    paused = true;
                }
            }
        });

        $.each(koensList, function(key, koen) {
            if (Math.random() < 0.001) {
                spawnEnemyProjectile(koen);
            }
        });
    }

    window.requestAnimationFrame(frame);
}
window.requestAnimationFrame(frame);

function makeBullet(){
    $(".info_overlay").append("<div>bullet :)</div>")
}

function spawnKoens() {
    for(var i = 0; i < 36; i++) {
        var koen = $("<div class='koen'></div>");
        var row = Math.ceil((i + 1) / 9);
        switch (row) {
            case 1:
                $("#first").append(koen);
                break;
            case 2:
                $("#second").append(koen);
                break;
            case 3:
                $("#third").append(koen);
                break;
            case 4:
                $("#fourth").append(koen);
                break;
        }
        koensList.push(koen[0]);
    }
}

function spawnEnemyProjectile(koen) {
    var jKoen = $(koen);
    var y = jKoen.offset().top + 100;
    var x = jKoen.offset().left + 20;

    var projectile = $("<div class='projectile'></div>");
    projectile.css("top", y).css("left", x);
    $(".projectiles").append(projectile);

    projectilesList.push(projectile[0]);
}

function collision($div1, $div2) {
    var x1 = $div1.offset().left;
    var y1 = $div1.offset().top;
    var h1 = $div1.outerHeight(true);
    var w1 = $div1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = $div2.offset().left;
    var y2 = $div2.offset().top;
    var h2 = $div2.outerHeight(true);
    var w2 = $div2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}