var gradesApp = angular.module('gradesApp', ['ngRoute']);
var redirectIfLoggedIn;
var loc;
gradesApp.controller('LoginCtrl', ['$scope', '$location',
    function($scope, $location) {
        loc = $location;
        redirectIfLoggedIn = function() {
            chrome.storage.local.get('loggedIn', function(loggedInObj) {
                if (loggedInObj.loggedIn) {
                    console.log($location);
                    $location.path('/view');
                } else {
                	$location.path('/login');
                }
            });
        }

        $scope.updateCredentials = function(user) {
            var updatedUser = angular.copy(user);
            rememberedGrades.updateCredentials(updatedUser.username, updatedUser.password);
        };

        $scope.updateGrades = function() {
            rememberedGrades.updateGrades();
        };
    }
]);

gradesApp.controller('ViewCtrl', ['$scope', '$location',
    function($scope, $location) {

    }
]);

gradesApp.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider.when('/login', {
            templateUrl: "partials/login.html",
            controller: 'LoginCtrl'
        });
        $routeProvider.when('/view', {
            templateUrl: "partials/view.html",
            controller: 'viewCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: 'partials/login.html'
        });
    }
]);