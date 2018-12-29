var app = angular.module('myApp', ['ngMaterial']);

app.controller('MyController', function ($scope,$http,$mdToast,$rootScope,$location,$sce,$timeout) {
    $scope.appTitle = 'Advices Request';

    $scope.baseUrl = 'http://localhost:3200';
    $scope.phpApiUrl = 'http://localhost/vflservices.com/php';
    $scope.config = { headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' } }
    $scope.thisDate = new Date();
    $scope.thisYear = $scope.thisDate.getFullYear();
    $scope.thisMonth = $scope.thisDate.getMonth() + 1;

    //render mã HTML
    $scope.renderHtml = function (value) {
        return $sce.trustAsHtml(value); // Use: <tag ng-bind-html="renderHtml(noidunghtml)"></tag>
    };


    $scope.socket = io.connect("http://localhost:3200");

    $scope.socket.on("connect", function () {
        console.log("You are connecting to Socket Io Server...");
    });



    //GET DATAS
    $scope.getLocationFinder = function(){
        $http.get($scope.phpApiUrl+'/LocationFinder')
        .then(function(res){
            $scope.locationArr = res.data;
        },function(err){})
    }
    $scope.getLocationFinder();





    $scope.radioData = {
        replyMethod: 'sendmail'
    }


    $scope.sendRequest = function () {
        var dulieu = $.param({
            name: $scope.name,
            location: $scope.location,
            tel: $scope.tel,
            email: $scope.email,
            title: $scope.title,
            content: $scope.content,
            replyMethod: $scope.radioData.replyMethod
        });
        console.log(dulieu);
    }
})

