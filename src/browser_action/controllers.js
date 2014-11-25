var gradesApp = angular.module('gradesApp', ['ngRoute']);




function checkLoggedIn(callback) {
    chrome.storage.local.get(['username', 'password'],
        function(item) {
            callback(item.hasOwnProperty('username') && item.hasOwnProperty('password'));
        });
}
gradesApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/loginPage', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        });
        $routeProvider.when('/viewGrades', {
            templateUrl: 'partials/view.html',
            controller: 'GradesCtrl'
        });
    }
]);

gradesApp.controller('LoginCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        checkLoggedIn(function(loggedIn) {
            if (loggedIn) {
                $rootScope.$apply(function() {
                    $location.path('/viewGrades');
                });
            }
        });

        $scope.updateCredentials = function(user) {
            var updatedUser = angular.copy(user);
            rememberedGrades.updateCredentials(updatedUser.username, updatedUser.password);
        };
        $scope.viewGrades = function() {
            $rootScope.$apply(function() {
                $location.path('/viewGrades');
            });
        }
        $scope.updateGrades = function() {
            rememberedGrades.updateGrades();
        };
    }
]);
gradesApp.controller('GradesCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        chrome.storage.local.get(['courses'], function(item) {
            $scope.grades = item.courses;
        });
        $scope.getGrades = function() {
            rememberedGrades.updateGrades();
            chrome.storage.local.get(['courses'], function(item) {
                console.log(item.courses);
                $scope.grades = item.courses;
            });
        };
        $scope.logout = function() {
            chrome.storage.local.clear(function() {
                $rootScope.$apply(function() {
                    $location.path('/loginPage');
                });
            });
        }
    }
]);