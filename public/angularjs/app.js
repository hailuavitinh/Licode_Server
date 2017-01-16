var FConfApp = angular.module('FConfApp',['ngRoute']);

FConfApp.config(function($routeProvider){
    $routeProvider
        .when('/',{
            templateUrl:'views/home.html',
            controller:'mainController'
        })
        .when('/about',{
            templateUrl:'views/home.html',
            controller:'aboutController'
        })
    
})

FConfApp.controller('mainController',function($scope){
    console.log("Angular");
    $scope.message = 'main Controller';
});