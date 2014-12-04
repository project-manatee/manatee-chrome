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
        $routeProvider.when('/viewCycle/:courseid/:semester/:cycle', {
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
        };
        $scope.exampleCycle = function() {
            $location.path('/viewCycle');
        };
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
        };
		$scope.getCycle = function(course, semester, cycle) {
			rememberedGrades.getCycleGrades(course, semester, cycle, function(cyclereturned) {
                $rootScope.$apply(function() {
                    $location.path('/viewCycle/' + course + '/' + semester + '/' + cycle);
                });
			});
		};
    }
]);

gradesApp.controller('CycleCtrl', ['$scope', '$location', '$rootScope', '$routeParams',
    function($scope, $location, $rootScope, $routeParams) {
        var courseid = $routeParams.courseid;
        var semester = $routeParams.semester;
        var cycle = $routeParams.cycle;
        chrome.storage.local.get(['cycleObj'], function(item) {
            $scope.$apply(function() {
                $scope.classGrade = item.cycleObj[courseid][semester][cycle];
            });
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
        };
    }
]);
