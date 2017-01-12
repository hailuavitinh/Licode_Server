var express = require('express'),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    appRoot = require('app-root-path'),
    mongoose = require("mongoose");




var roomController = require(appRoot+"/api/controllers/roomController");
var config = require(appRoot+'/config/config');

var app = express();
var port = process.env.port || 3005;
app.use(morgan("dev"));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.set("view engine","ejs");
console.log(config.getMongoConnectString());
mongoose.connect(config.getMongoConnectString());

roomController(app);


/* Begin
N.API.init(config.nuve.superserviceID, config.nuve.superserviceKey, 'http://118.69.135.101:3000/');

app.get("/",function(req,res){
    getRoomIDByRoomName("basicExampleRoom",function(roomID){
        if(roomID == null || roomID == undefined ){
               roomID = "Room doesn't have exists. Please check again !!"
        } 
        res.render("index",{roomID: roomID});
    });
    
});

app.get("/api/rooms",function(re,res){
    getRooms(function(rooms){
        res.send(rooms);
    });
})

var getRooms = function(callback){
    N.API.getRooms(function(roomList){
        var rooms = JSON.parse(roomList);
        callback(rooms);
    });
}


var getRoomIDByRoomName = function(roomName,callback){
    var roomID;
    N.API.getRooms(function(roomList){
        var rooms = JSON.parse(roomList);
        for (var i in rooms){
            if(rooms[i].name == roomName){
                roomID = rooms[i]._id;
                break;
            }
        }
        callback(roomID);
    });
};

var createToken = function (roomID, username,role,callback){
    console.log("Access createToken");
    console.log("RoomI: "+ roomID + " - User: "+username+" - Role: "+role);
    N.API.createToken(roomID, username, role, function(token) {
        console.log("token: ",token);
        callback(token);
    },function(err){
        console.log("Token Error: ",err);
    })
}


app.post("/joinRoom",function(req,res){
    console.log("POST JOIN ROOM");
    var roomID = req.body.roomID;
    var username = req.body.username;
    var role = "presenter";

    createToken(roomID,username,role,function(token){
        if(token == null || token == undefined ){
            res.status(500).send(JSON.stringify({error:"The Erizo have problem."}));
        }

        res.send(JSON.stringify({Token:token}));
    });
});
*/
app.listen(port,function(){
    console.log("Server listening with port ....",port);
    //console.log(config);
})

