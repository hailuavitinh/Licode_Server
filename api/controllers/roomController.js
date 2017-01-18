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
    },function(err){
        console.log("Error Nuve",err);
        res.status(404).send(err);
    });
}

var getRoomByID = function(callback){
    var roomID = arguments[1];
    console.log("function getRoomByID: ",roomID);
    var res = arguments[2];
    N.API.getRoom(roomID, function(resp) {
        var room= JSON.parse(resp);
        console.log('Room name: ', room.name);
         callback(room);
    }, function(err){
        console.log("Error Nuve",err);
        res.status(404).send(err);
    });



    // N.API.getRoom(roomID,function(resp){
    //     console.log("API Room: ",resp);
    //     var room = JSON.parse(resp);
    //     callback(room);
    // },errCallBackNuve)
}


var errCallBackNuve = function(res,err){
    console.log("Error Nuve",err);
}

var getRoomsFromFConf= function(res,roomList){
    console.log("Access getRoomssss");
    Room.find(function(err,result){
        if (err){
            res.status(404).send("FConf DB has a error. Error: ",err);
        } else{
            res.send(result);
        }
    });
}



module.exports = function(app) {
    app.get("/api/rooms",function(req,res){
        getRooms(getRoomsFromFConf,res);
    });

    app.get("/api/rooms/:id",function(req,res){
        var roomID = req.params.id;
        console.log("Acess API rooms/:id ",roomID);
        getRoomByID(function(room){
            if(room == null || room == undefined){
                res.status(404).send("Room doesn't have exists. Please check again !!");
            } else{
                res.send(room);
            }
        },roomID,res)
    });


}