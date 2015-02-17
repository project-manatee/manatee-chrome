// faster
// better callbacks
// prettier

var gradesApp = angular.module('gradesApp', ['ngRoute']);
gradesApp.config([
    '$compileProvider',
    function($compileProvider) {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);

var scopeService = angular.module('main', []).service('scopeService', function() {
     return {
         safeApply: function ($scope, fn) {
             var phase = $scope.$root.$$phase;
             if (phase == '$apply' || phase == '$digest') {
                 if (fn && typeof fn === 'function') {
                     fn();
                 }
             } else {
                 $scope.$apply(fn);
             }
         },
     };
});

rememberedGrades = chrome.extension.getBackgroundPage().rememberedGrades;

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
		redirect = function() {
			document.getElementById('login').click();
		};
		rememberedGrades.loggedInCache(function(loggedin) {
			if (loggedin) {
				redirect();
			}
		});

        $scope.updateCredentials = function(user) {
            var updatedUser = angular.copy(user);
            rememberedGrades.updateCache(updatedUser.username, updatedUser.password, function() {
				redirect();
				// Logged in successfully from user input
            }, function(msg) {
                // Wrong username password
            });
        };
    }
]);

gradesApp.controller('GradesCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        $scope.getGrades = function() {
            rememberedGrades.getGrades(function(grades, updated) {
                $scope.$apply(function() {
                    $scope.grades = grades;
					$scope.updated = updated;
                });
            });
        };
        $scope.getGrades();

        $scope.logout = function() {
            rememberedGrades.logout(function() {
                $rootScope.$apply(function() {
                    $location.path('/loginPage');
                });
            });
        };
        $scope.getCycle = function(course, semester, cycle) {
			url = '#/viewCycle' + course + '/' + semester + '/' + cycle;
			//window.location = url;
			//$location.url(url);
			//$location.path(url);
		};
    }
]);

gradesApp.controller('CycleCtrl', ['$scope', '$location', '$rootScope', '$routeParams',
    function($scope, $location, $rootScope, $routeParams) {
        var courseid = $routeParams.courseid;
        var semesterid = $routeParams.semester;
        var cycleid = $routeParams.cycle;
		console.log(courseid, semesterid, cycleid);
        $scope.getCycleGrades = function() {
            rememberedGrades.getCycleGrades(courseid, semesterid, cycleid, function(cycleGrades, updated) {
				// TODO: standardaize variable names cycleGrades classGrade
                $scope.$apply(function() {
					console.log(cycleGrades);
                    $scope.classGrade = cycleGrades;
					$scope.updated = updated;
                });
            });
        };
        $scope.getCycleGrades();

        $scope.viewCourses = function() {
            $location.path('/viewGrades');
        };
        $scope.logout = function() {
            rememberedGrades.logout(function() {
                $rootScope.$apply(function() {
                    $location.path('/loginPage');
                });
            });
        };
    }
]);
