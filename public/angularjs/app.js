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
        });

        $locationProvider.html5Mode(true);
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