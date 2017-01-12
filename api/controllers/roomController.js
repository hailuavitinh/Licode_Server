var Room = require("../models/roomModel");
var abc = require("../models/abcModel");
var appRoot = require('app-root-path');
var N = require(appRoot+"/libs/nuve.js");
var config = require(appRoot+"/config/licode_config");

N.API.init(config.nuve.superserviceID, config.nuve.superserviceKey, 'http://118.69.135.101:3000/');

// var getRoomsFromNuve = function(res,callback){
//     N.API.getRooms(function(roomList){
//         var rooms = JSON.parse(roomList);
//         callback(res,rooms);
//     },errCallBackNuve(res))
// };


var getRooms = function(callback){
    var res = arguments[1];
    N.API.getRooms(function(roomList){
        var rooms = JSON.parse(roomList);
        console.log("rooms: ",rooms);
        callback(res,rooms);
    },errCallBackNuve);
}


var errCallBackNuve = function(){
    console.log("Error Nuve");
}

var getRoomssss = function(res,roomList){
    console.log("Access getRoomssss");
    Room.find(function(err,result){
        if (err){
            res.status(500).send("FConf DB has a error. Error: ",err);
        } else{
            res.send(result);
        }
    });
}

module.exports = function(app) {
    app.get("/api/rooms",function(req,res){
        getRooms(getRoomssss,res);
       
    });
}