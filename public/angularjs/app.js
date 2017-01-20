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

FConfApp.controller('roomsController',function($scope){
    console.log("rooms");
    $scope.message='rooms Controller';
});



FConfApp.controller('joinController',["$scope","$routeParams","svRooms",function($scope,$routeParams,svRooms){
    
    $scope.my = {isShowVideoConfernce:false,isShowError:false};
    

    var roomID = $routeParams.roomID;
    console.log("Angular Join: ",roomID);
    var roomJson;
    svRooms.get(roomID).then(function(success){
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
       var userName = $("#inpUserName").val();
       if(userName === null || userName === "" || userName === undefined){
           $scope.error = "Please enter User Name to start talking !!!!"
           $scope.my.isShowError = true;
           $scope.my.isShowVideoConfernce = false;
       } else {
           var obj = {roomID:roomJson._id,username:userName};
           svRooms.createToken(obj).then(function(success){
               $scope.my.isShowVideoConfernce = true;
               $scope.my.isShowError = false;
               console.log("Token: ",success);
               console.log(" InitLocalStream RoomID: ",roomJson._id);
               console.log(" InitLocalStream Token: ",success.data.Token);
               InitLocalStream(roomJson._id,success.data.Token);
           },function(error){
                $scope.error = error.data;
                $scope.my.isShowError = false;
           });
       }
   }


   function InitLocalStream(roomID, token){
       localStream = Erizo.Stream({audio: false, video: true, data: true});
       var room = Erizo.Room({token:token});
       var room;
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
                        room.subscribe(stream);
                    }
                }
            }

            var remoteDiv_RemoteStream = function(elementID){
                $("#"+elementID).remove();
            }

            room.addEventListener("room-connected",function(event){
                room.publish(localStream);
                console.log("room connected");
                console.log("Local Stream: ",localStream.getID())
                subscribeToStream(event.streams);
            });

            room.addEventListener("stream-subscribed",function(streamEvent){
                console.log("stream subscribed: ",streamEvent);
                var stream = streamEvent.stream;
                var div = document.createElement('div');
                div.setAttribute("class", "itemStreamVideo");
                div.setAttribute("id",idRmStream);
                $(".streamVideo").prepend(div);
                stream.play(idRmStream);
            });

            room.addEventListener("stream-added",function(streamEvent){
                var streams = [];
                streams.push(streamEvent.stream);
                subscribeToStream(streams);
            });

            room.addEventListener("stream-removed",function(streamEvent){
                var stream = streamEvent.stream;
                if(stream.elementID !== undefined){
                    remoteDiv_RemoteStream(stream.elementID);
                }
            });
        })
   }

    
}])