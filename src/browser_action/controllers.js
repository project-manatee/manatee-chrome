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
            templateUrl: 'partials/viewCourses.html',
            controller: 'GradesCtrl'
        });
        $routeProvider.when('/viewCycle', {
            templateUrl: 'partials/viewCycle.html',
            controller: 'CycleCtrl'
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
            $location.path('/viewGrades');
        }
        $scope.exampleCycle = function() {
            $location.path('/viewCycle');
        }
        $scope.updateGrades = function() {
            rememberedGrades.updateGrades();
        };
    }
]);
gradesApp.controller('GradesCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        chrome.storage.local.get(['courses'], function(item) {
            $scope.$apply(function() {
                $scope.grades = item.courses;
            });
        });
        $scope.getGrades = function() {
            rememberedGrades.updateGrades();
            chrome.storage.local.get(['courses'], function(item) {
                $scope.$apply(function() {
                    $scope.grades = item.courses;
                });
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

gradesApp.controller('CycleCtrl', ['$scope', '$location', '$rootScope', '$http',
    function($scope, $location, $rootScope, $http) {
        $http.get('exampleCycle.json').success(function(data) {
            $scope.classGrade = data;
        });
        $scope.viewCourses = function() {
            $location.path('/viewGrades');
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