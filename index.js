"use strict";

var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/img", express.static(__dirname + "/img"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/controller", function(req, res) {
    res.sendFile(__dirname + "/controller.html");
});

io.on("connection", function(socket){
    socket.on("clickButton", function(e){
        socket.broadcast.emit("clickButton", true);
        console.log("clickButton");
    });

    socket.on("startLeftTilt", function(e){
        socket.broadcast.emit("startLeftTilt", true);
        console.log("startLeftTilt");
    });

    socket.on("startRightTilt", function(e){
        socket.broadcast.emit("startRightTilt", true);
        console.log("startRightTilt");
    });

    socket.on("stopTilt", function(e){
        socket.broadcast.emit("stopTilt", true);
        console.log("stopTilt");
    });
    socket.on("isShot", function(e){
        socket.broadcast.emit("isShot", true);
        console.log("isShot");
    });
});

server.listen(5555, function(){
    console.log("Listening on port 5555");
});