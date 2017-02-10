var FConfApp = angular.module('FConfApp',['ngRoute']);

FConfApp.config(function($routeProvider,$locationProvider){
    $routeProvider
        .when('/',{
            templateUrl:'angularjs/views/home.html',
            controller:'mainController'
        })
        .when('/about',{
            templateUrl:'angularjs/views/about.html',
            controller:'aboutController'
        })
        .when('/rooms',{
            templateUrl:'angularjs/views/rooms.html',
            controller:'roomsController'
        })
        .when('/join/:roomID',{
            templateUrl:'angularjs/views/join.html',
            controller:'joinController'
        }).
        when('/join',{
            templateUrl:'angularjs/views/joinError.html'
        });

        // $locationProvider.html5Mode(true);
})

FConfApp.controller('mainController',function($scope){
    console.log("Angular");
    $scope.message = 'main Controller';
   

    $scope.ngShow = function(){
        if($scope.my.isShow){
            console.log($scope.my.isShow);
            $scope.my.isShow = false;
        } else {
            console.log($scope.my.isShow);
            $scope.my.isShow = true;
        }  
    }

});

FConfApp.controller('aboutController',function($scope){
    console.log("about");
    $scope.message='about Controller';
});

FConfApp.controller('roomsController',["$scope","svRooms","$location",function($scope,svRooms,$location){

    var localUrl = $location.host()+":"+$location.port();
    $scope.localUrl=localUrl+"/#!/";

    svRooms.getRooms().then(function(success){
        console.log("Angular Rooms: ",success);
        $scope.rooms = success.data;
    },function(error){
        console.log("API Rooms error: ",error);
    });
    $scope.message='rooms Controller';
}]);



FConfApp.controller('joinController',["$scope","$routeParams","svRooms",function($scope,$routeParams,svRooms){
    //Declare 
    var room,screen_stream,localStream,userName;

    $scope.my = {isShowVideoConfernce:false,isShowError:false,isShowEnterUserName:true,isShowShareScreen:false,isShowButtonShareScreen:false};

    var roomID = $routeParams.roomID;
    console.log("Angular Join: ",roomID);
    var roomJson;
    svRooms.getRoomByID(roomID).then(function(success){
        console.log("API Room: ",success)
        roomJson = success.data;
        $scope.roomJson = roomJson;
    },function(error){
        console.log("API Room Error: ",error);
        $(".header-join").css('display','none');
        $("#inpUserName").css('display','none');
        $scope.my.isShowError = true;
        $scope.error = error.data;
    });
    


   $scope.accessRoom = function(){
       console.log("Click accessRoom");
       userName = $("#inpUserName").val();
       if(userName === null || userName === "" || userName === undefined){
           $scope.error = "Please enter User Name to start talking !!!!"
           $scope.my.isShowError = true;
           $scope.my.isShowVideoConfernce = false;
       } else {
           var obj = {roomID:roomJson._id,username:userName};
           svRooms.createToken(obj).then(function(success){
               $scope.my.isShowVideoConfernce = true;
               $scope.my.isShowButtonShareScreen = true;
               $scope.my.isShowEnterUserName = false;
               $scope.my.isShowError = false;
               console.log("Token: ",success);
               console.log(" InitLocalStream RoomID: ",roomJson._id);
               console.log(" InitLocalStream Token: ",success.data.Token);
               InitLocalStream(userName,roomJson._id,success.data.Token);
           },function(error){
                $scope.error = error.data;
                $scope.my.isShowError = false;
           });
       }
   }

   $scope.TestShare = function(){
        // chrome.runtime.sendMessage("pilllhclpdkekamgkkkaciffnklfjfoe",{getstream:true},function(e){
        //     console.log("Share Screen Chrome: ",e);
        // });
        $scope.my.isShowShareScreen = true;
        $("#btnShareScreen").html("Stop Sharing");
        autoResizeItemContainer();
   }

   $scope.Share = function(){
        if($scope.my.isShowShareScreen == false){// Event Share Screen
            $scope.my.isShowShareScreen = true;
            $("#btnShareScreen").html("Stop Sharing");
            autoResizeItemContainer();
            InitShareScreenStream(userName);
        } else { // Event Stop Sharing Screen
            $("#btnShareScreen").html("Share Screen");
            screen_stream.close();
            $scope.my.isShowShareScreen = false;
            autoResizeItemContainer();
        }
    }


   $scope.append =  function(){
       $scope.my.isShowVideoConfernce = true;
       var div = document.createElement('div');
       div.setAttribute("class", "itemStreamVideo itemRemoveStreamVideo");
       $(".streamVideo").prepend(div);
       autoResizeItemContainer();
   }

   function autoResizeItemContainer(){
       var i  = $(".itemStreamVideo").length;
        console.log("i : ",i);
        console.log("Is Share Video :",$scope.my.isShowShareScreen);
        if($scope.my.isShowShareScreen == true){
            $(".itemStreamVideo").css("width","13vw");
            $(".itemStreamVideo").css("height","20vh");
        }
        else{
            if(i < 3){
                console.log("i<3: ",i);
                $(".itemStreamVideo").css("width","30vw");
                $(".itemStreamVideo").css("height","40vh");
            } else if (i<5){
                console.log("i<5: ",i);
                $(".itemStreamVideo").css("width","20vw");
                $(".itemStreamVideo").css("height","30vh");
            } else if(i == 5){
                console.log("i==5: ",i);
                $(".itemStreamVideo").css("width","15vw");
                $(".itemStreamVideo").css("height","25vh");
            } else {
                console.log("default: ",i);
                $(".itemStreamVideo").css("width","12vw");
                $(".itemStreamVideo").css("height","20vh");
            }
        }
    }

    function showUserOnline(username,streamID,isLocal){
        $("#ulShowUser").append("<li id='li_"+streamID+"'><span class='glyphicon glyphicon-ok-circle' aria-hidden='true' style='color: green'></span> "+username+"</li>")
    }

    function InitShareScreenStream(username){
        screen_stream = Erizo.Stream({screen: true,attributes:{name: username}});
        screen_stream.init();
        screen_stream.addEventListener("access-accepted",function(){
            room.publish(screen_stream);
            screen_stream.play("screen_stream");
        });
    }


   function InitLocalStream(username,roomID, token){
       localStream = Erizo.Stream({audio: true, video: true, data: true, attributes : {name: username}});
       room = Erizo.Room({token:token});
       localStream.init();
       localStream.addEventListener("access-accepted", function () {
            localStream.play("localStream");
            console.log("Local: ",localStream);
            console.log("token:",L.Base64.decodeBase64(token));
            room.connect();

            var subscribeToStream = function(streams){
                console.log("subscribeToStream Array Stream: ",streams);
                for (var index in streams){
                    var stream = streams[index];
                    console.log("subscribeToStream Stream :",stream);
                    console.log("subscribeToStream StreamID :",stream.getID());
                    if(localStream.getID() !== stream.getID()){
                        if(screen_stream){
                            if (screen_stream.getID() !== stream.getID()){
                                room.subscribe(stream);
                            }
                        } else {
                            room.subscribe(stream);
                        } //end if
                        
                    }
                }
            }

            var remoteDiv_RemoteStream = function(elementID,streamID,isScreen){
                
                if(isScreen == true){
                    $("#screen_stream").html("");
                } else {
                    /*remove li in Show User online*/
                    $("#li_"+streamID).remove();
                    
                    /*remove div remote stream */
                    $("#"+elementID).remove();
                }
            }

            room.addEventListener("room-connected",function(event){
                room.publish(localStream);
                console.log("room connected");
                console.log("Local Stream: ",localStream.getID())
                showUserOnline(username,localStream.getID(),true);
                subscribeToStream(event.streams);
            });

            room.addEventListener("stream-subscribed", function(streamEvent) {
                console.log("stream subscribed: ",streamEvent);
                var stream = streamEvent.stream;
                if(stream.hasScreen()){
                    $scope.my.isShowShareScreen = true;
                    $scope.my.isShowButtonShareScreen = false;
                    autoResizeItemContainer();
                    stream.play("screen_stream");
                } else {
                    var idRmStream = "rmStream_"+stream.getID();
                    var div = document.createElement('div');
                    div.setAttribute("class", "itemStreamVideo");
                    div.setAttribute("id",idRmStream);
                    $(".streamVideo").prepend(div);
                    autoResizeItemContainer();

                    var attributes = stream.getAttributes();
                    if(attributes.name){
                        showUserOnline(attributes.name,stream.getID(),false);
                    }

                    stream.play(idRmStream);
                }
            });

            room.addEventListener("stream-added",function(streamEvent){
                var streams = [];
                streams.push(streamEvent.stream);
                subscribeToStream(streams);
            });

            room.addEventListener("stream-removed",function(streamEvent){
                var stream = streamEvent.stream;
                if(stream.elementID !== undefined){
                    remoteDiv_RemoteStream(stream.elementID,stream.getID(),stream.hasScreen());
                }
            });
        })
   }

    
}])