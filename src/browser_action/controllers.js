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
        $routeProvider.when('/settings', {
            templateUrl: 'partials/settings.html',
            controller: 'SettingsCtrl'
        });
    }
]);

gradesApp.controller('LoginCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        $scope.loading = false;
        $scope.errorDisplay = false;
		redirect = function() {
			document.getElementById('login').click();
		};
		rememberedGrades.loggedInCache(function(loggedin) {
			if (loggedin || rememberedGrades.manaTEAMS.isLoggedIn) {
                console.log(loggedin);
                console.log(rememberedGrades.manaTEAMS.isLoggedIn)
				redirect();
			}
		});

        $scope.updateCredentials = function(user) {
            $scope.loading = true;
            $scope.errorDisplay = false;
            var updatedUser = angular.copy(user);
            rememberedGrades.updateCache(updatedUser.username, updatedUser.password, function() {
                console.log("updating cache");
				rememberedGrades.updateGrades(false,function(courses) {
                    console.log("updating grades");
                    chrome.storage.local.get('courses', function(item) {
                        var courses = item.courses;
                        if (courses) {
                            chrome.alarms.create("CourseAlarm", {delayInMinutes: 15, periodInMinutes: 15});   
                            var gpa = totalGPA(courses, true, {}, {});
                            courses[0].gpa = gpa;
                            chrome.storage.local.set({
                                'courses': courses,
                                'coursesettings': $scope.selection
                            });
                            $scope.loading = false;
                            redirect();
                        }
                    });
                   
                });
				// Logged in successfully from user input
            }, function(msg) {
                console.log("Login error");
                $scope.loading = false;
                $scope.errorDisplay = true;
                // Wrong username password
            });
        };
    }
]);

gradesApp.controller('GradesCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        $scope.getGrades = function() {
            rememberedGrades.getGrades(function(grades, updated) {
                $scope.grades = grades;
                $scope.updated = updated;
                $scope.$apply(function() {
                });
            });
        };
        $scope.getGrades();

        $scope.logout = function() {
            rememberedGrades.logout(function() {

                $location.path('/loginPage');
                $scope.$apply(function() {
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
            rememberedGrades.getCycleGrades(courseid, semesterid, cycleid, false,function(cycleGrades, updated) {
				// TODO: standardaize variable names cycleGrades classGrade
                $scope.$apply(function() {
					console.log(cycleGrades);
                    $scope.classGrade = cycleGrades;
					$scope.updated = updated;
                    $scope.cyclenum = (parseInt(semesterid)*3 + parseInt(cycleid))+ parseInt(1);
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
gradesApp.controller('SettingsCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        chrome.storage.local.get('coursesettings', function(item) {
            var coursesettings = item.coursesettings;
            if (coursesettings){
                $scope.selection = coursesettings;
            }
            else{
                $scope.selection = {
                    weighted: {},
                    excluded:{}
                };
            }
        });
        $scope.selection = {
            weighted: {},
            excluded:{}
        };
        $scope.getGrades = function() {
            rememberedGrades.getGrades(function(grades, updated) {
                $scope.grades = grades;
                $scope.updated = updated;
                $scope.$apply(function() {});
            });
        };
        $scope.getGrades();
        $scope.viewCourses = function() {
            $location.path('/viewGrades');
        };
        $scope.onClick = function() {
            console.log("Saving value....", $scope.selection);
            chrome.storage.local.get('courses', function(item) {
                var courses = item.courses;
                if (courses) {
                    var gpa = totalGPA(courses, true, $scope.selection.weighted, $scope.selection.excluded);
                    courses[0].gpa = gpa;
                    chrome.storage.local.set({
                        'courses': courses,
                        'coursesettings': $scope.selection
                    });
                }
            });
        };
    }
]);
