var socket = io();
var isLeft =false ;
var isRight=false ;
var isStop =false ;
var shoot = false;
var screenWith = $(window).width() - 200;
var screenHeight = $(window).height();
var koensList = [];
var projectilesList = [];
var bulletlist = [];
var paused = false;
var start = null;

$(document).ready(function () {
    getValues();
    spawnKoens();
    window.requestAnimationFrame(frame);
    $(".restart").click(function(){
        $("#over").hide();
        $("#won").hide();
        $(".projectiles").empty();
        $(".koens").empty();
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
        shoot = true;
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
        if(shoot){
            shoot = false;
            makeBullet();
            console.log("shoot");
        }
        $.each(bulletlist, function (key,bullet) {
            var jbullet = $(bullet);

            jbullet.css("top", jbullet.offset().top - 0.2 * delta);

            if(jbullet.offset().top < 0 - 50){
                jbullet.remove();
            }
            var shot = false;
            $.each(koensList, function(key,koen){
                var jKoen = $(koen);
                var kwidth = 60;
                if(!shot){
                    if(jbullet.offset().left<jKoen.offset().left+kwidth
                        && jbullet.offset().left + 20 >jKoen.offset().left
                        &&jbullet.offset().top<jKoen.offset().top + 100
                        && jbullet.offset().top + 50 > jKoen.offset().top){
                        removeKoen(koen);
                        jbullet.remove();
                        shot = true;
                    }
                }
            });
        });

        if (koensList.length <= 0) {
            $("#won").show();
            paused = true;
        }

        $.each(projectilesList, function(key, projectile) {
            var jProjectile = $(projectile);

            jProjectile.css("top", jProjectile.offset().top + 0.2 * delta);

            if (jProjectile.offset().top > screenHeight) {
                jProjectile.remove();
            }

            var lives = $("#lives");

            if (collision(ship, jProjectile)) {
                jProjectile.remove();
                socket.emit("isShot",true);
                lives.text(lives.text() - 1);

                if (lives.text() <= 0) {
                    $("#over").show();
                    paused = true;
                }
            }
        });

        $.each(koensList, function(key, koen) {
            if (Math.random() < 0.001) {
                //spawnEnemyProjectile(koen);
            }
        });
    }

    window.requestAnimationFrame(frame);
}

function makeBullet(){
    var schip = $(".ship");
    var y = schip.offset().top - 60;
    var x = schip.offset().left + 100;

    var bullet = $("<div class='bullet'></div>");
    bullet.css("top",y).css("left",x);
    $(".projectiles").append(bullet);

    bulletlist.push(bullet[0]);
}

function spawnKoens() {
    var koens = $(".koens");
    var koensDivWidth = $("body > section > div").width();
    console.log(Math.floor(koensDivWidth / 110) * 4);
    for(var i = 0; i < Math.floor(koensDivWidth / 110) * 4; i++) {
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

// Een koen moet meegegeven worden als jQuery node
// Niet als gewonen js node
// Een gewone node converteer je zo:
// var jQueryNode = $(javaScriptNode);
function removeKoen(koen) {
    $(koen).css("visibility", "hidden");
    koensList.splice($.inArray(koen, koensList), 1);
}