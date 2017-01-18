var app = angular.module("FConf",[]);

app.controller("joinController",["$scope","$routeParams","svRooms",function($scope,$routeParams,svRooms){
    var roomID = $routeParams.roomID;
    $scope.roomID = roomID;
}]);