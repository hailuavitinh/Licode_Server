var FConfApp = angular.module('FConfApp',['ngRoute']);

FConfApp.config(function($routeProvider,$locationProvider){
    $routeProvider
        .when('/',{
            // templateUrl:'angularjs/views/home.html',
            // controller:'mainController'
            templateUrl:'angularjs/views/rooms.html',
            controller:'roomsController'
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

FConfApp.controller('roomsController',["$scope","svRooms","$location","svLocalStream",function($scope,svRooms,$location,svLocalStream){

    var localStream = svLocalStream.getLocalStream();
    if(localStream){
        // console.log("localStream: ",localStream);
        // var track = localStream.stream.getTracks()[0];
        // console.log("Rooms - Track: ",track);
        // track.stop();
        // $scope.$apply();
        svLocalStream.setLocalStream(null);
        window.location.reload();
    }

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



FConfApp.controller('joinController',["$timeout","$scope","$routeParams","svRooms","svLocalStream",function($timeout,$scope,$routeParams,svRooms,svLocalStream){
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
               console.log("Token: ",success);
               console.log(" InitLocalStream RoomID: ",roomJson._id);
               console.log(" InitLocalStream Token: ",success.data.Token);
               DetectHasCamera_Audio_Speaker(function(result){
                   console.log("Device Kind: ",result);
                   if(result.IsEnumerateDevices){
                       $scope.my.isShowVideoConfernce = true;
                       $scope.my.isShowButtonShareScreen = true;
                       $scope.my.isShowEnterUserName = false;
                       $scope.my.isShowError = false;
                       $scope.$apply();
                       InitLocalStream(userName,roomJson._id,success.data.Token,result.IsSpeaker,result.IsCamera);
                   } else {
                        $scope.error = result.content;
                        $scope.my.isShowError = true;
                        $scope.my.isShowVideoConfernce = false;
                        $scope.$apply();
                   }
               }) 
           },function(error){
                $scope.error = error.data;
                $scope.my.isShowError = false;
                $scope.$apply();
           });
       }
   }


   $scope.Share = function(){
        if($scope.my.isShowShareScreen == false){// Event Share Screen
            $scope.my.isShowError = false;
            var isChrome = !!window.chrome && !!window.chrome.webstore; 
            if(isChrome) {
                InitShareScreenStream(userName);
            } else {
                $scope.error = "Share Screen don't support this browser. Please switch Chrome to use it !";
                $scope.my.isShowError = true;
            }
        } else { // Event Stop Sharing Screen
            screen_stream.close();
            HiddenSharing()
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
        var screenName = "Screen: " + userName;
        screen_stream = Erizo.Stream({screen: true,attributes:{name: screenName}});
        screen_stream.init();
        screen_stream.addEventListener("access-accepted",function(){
            ShowSharing();
            room.publish(screen_stream);
            screen_stream.play("screen_stream");
            

            //for Click button "Stop Sharing" at the bottom of the screen
             screen_stream.stream.getVideoTracks()[0].onended = function () {
                screen_stream.close();
                HiddenSharing();
            };
        });

        screen_stream.addEventListener("access-denied",function(event){
            console.log("Access-denied: ",event);
            var content = event.msg.code;
            if (event.msg.code === "Access to screen denied"){
                content += "<br/>Please download <a href='./downloads/extensions.crx' download>extensions.crx</a> to install this plug-in for Google Chrome"

            }
            $scope.error = "";
            $("#errorDiv").html(content);
            $scope.my.isShowError = true;
            TimeoutHidenErrorDiv();
            $scope.$apply();
        });
    }

function addImageUserForStream_NotCamera(idDivStream){
    var idDiv = "#"+idDivStream;
    $(idDiv).css("background-image","url(./images/user_icon.png)");
    $(idDiv).css("background-position","center");
    $(idDiv).css("background-repeat","no-repeat");
    $(idDiv).css("background-color","white");
    $(idDiv).css("background-size","contain");
}

function ShowSharing(){
    $scope.my.isShowShareScreen = true;
    $("#btnShareScreen").html("Stop Sharing");
    autoResizeItemContainer();
    $scope.$apply();
}

  function HiddenSharing(){
      $("#btnShareScreen").html("Share Screen");
      $scope.my.isShowShareScreen = false;
      $scope.my.isShowButtonShareScreen = true;
      autoResizeItemContainer();
      $scope.$apply();
  }

  function TimeoutHidenErrorDiv(){
      $timeout(function(){
          $scope.my.isShowError = false;
          $scope.error = "";
      },5000);
  }

  function DetectHasCamera_Audio_Speaker(callback){
      var result = {IsEnumerateDevices: false,IsAudio: false,IsSpeaker:false,IsCamera:false,content:""};
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            result.content = "Please switch Chorme or FireFox browser to use this function !";
            callback(result);
      }
      result.IsEnumerateDevices = true;

      navigator.mediaDevices.enumerateDevices().then(function(devices){
          devices.forEach(function(itemDevice){
              if(itemDevice.kind === "audioinput"){
                  result.IsAudio = true;
              }
              
              if(itemDevice.kind === "videoinput"){
                  result.IsCamera = true;
              }

              if(itemDevice.kind === "audiooutput"){
                  result.IsSpeaker = true;  
            }
          });
          callback(result);
      }).catch(function(err) {
          result.IsEnumerateDevices = false;
          result.content = "Error: " + err.name + " - " + err.message;
          callback(result);
      });
  }

   function InitLocalStream(username,roomID, token,isSpeaker,isCamera){
       localStream = Erizo.Stream({audio: isSpeaker, video: isCamera, data: true, attributes : {name: username}});
       console.log("LocalStream Init:",localStream);
       room = Erizo.Room({token:token});
       localStream.init();
       localStream.addEventListener("access-accepted", function () {
            localStream.play("localStream");
            svLocalStream.setLocalStream(localStream);
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
                        
                    } else { // remote stream là local stream --> thì chuyển màu border div lại, để biết trạng thái kết nối socket thành công hay không ?
                        $("#localStream").css("border-color","chartreuse");
                        if(!localStream.hasVideo()){
                            addImageUserForStream_NotCamera("player_local");
                        }
                    }
                }
            }

            var remoteDiv_RemoteStream = function(elementID,streamID,isScreen){
                
                if(isScreen == true){
                    $("#screen_stream").html("");

                    HiddenSharing()
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
                     $scope.$apply();
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
                    if(!stream.hasVideo()){
                        addImageUserForStream_NotCamera("player_"+stream.getID());
                    }
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

            room.addEventListener("room-error",function(event){
                console.log("Room-error: ",event);
            });

            room.addEventListener("room-disconnected",function(event){
                console.log("Room-disconnected: ",event);
            });
        })
   }

    
}])