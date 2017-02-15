var app = angular.module("FConfApp");

app.service("svLocalStream",function(){
    var _localStream;

    var setLocalStream = function(para){
        _localStream = para;
    }

    var getLocalStream = function(){
        return _localStream;
    }

    return {
    setLocalStream: setLocalStream,
    getLocalStream: getLocalStream
  };

});