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
    
    var roomID = $routeParams.roomID;
    console.log("Angular Join: ",roomID);
    var room;
    svRooms.get(roomID).then(function(success){
        console.log("API Room: ",success)
        room = success.data;
        $scope.room = room;
    },function(error){
        console.log("API Room Error: ",error);
        $(".header-join").css('display','none');
        $("#errorDiv").css('display','');
        $scope.error = error.data;
    });
    
   

    
}])