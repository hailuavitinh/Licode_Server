var app = angular.module("FConfApp");

app.factory("svRooms",["$http",function($http){
    return {
        get: function(roomID){
            return $http.get("/api/rooms/"+roomID);
        }
    }
}])