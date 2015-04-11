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
        var thisistance = $scope;
        $scope.loading = false;
        $scope.errorDisplay = false;
		redirect = function() {
			document.getElementById('login').click();
		};
		chrome.storage.local.get('loggedin', function(item) {
            if(item.loggedin)
                redirect();
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
                        if (courses && courses[0]) {
                            chrome.alarms.create("CourseAlarm", {delayInMinutes: 15, periodInMinutes: 15});   
                            var gpa = totalGPA(courses, true, {}, {});
                            chrome.storage.local.set({
                                'courses': courses,
                                'coursesettings': $scope.selection,
                                'gpa':gpa,
                                'loggedin':true
                            });
                            $scope.loading = false;
                            redirect();
                        }
                        else{
                            thisistance.loading = false;
                            thisistance.errorDisplay = true;
                            thisistance.$apply();
                        }
                    });
                   
                });
            }, function(msg) {
                console.log("Login error");
                $scope.loading = false;
                $scope.errorDisplay = true;
                $scope.$apply();
            });
        };
    }
]);

gradesApp.controller('GradesCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        $scope.getGrades = function() {
            rememberedGrades.getGrades(function(grades, updated) {
                chrome.storage.local.get('gpa', function(item) {
                    $scope.grades = grades;
                    $scope.grades = grades;
                    $scope.updated = updated;
                    $scope.gpa = item.gpa;
                    $scope.loadingCourses = false;
                    $scope.$apply();
                });
              
            });
        };
        $scope.getGrades();

        $scope.refresh = function() {
            $scope.loadingCourses = true;
            rememberedGrades.updateGrades(false, function(courses) {
                $scope.getGrades();      
            });
        };

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
        $scope.cycleLoading = true;
        var courseid = $routeParams.courseid;
        var semesterid = $routeParams.semester;
        var cycleid = $routeParams.cycle;
		console.log(courseid, semesterid, cycleid);
        $scope.getCycleGrades = function() {
            rememberedGrades.getCycleGrades(courseid, semesterid, cycleid, false,function(cycleGrades, updated) {
				// TODO: standardaize variable names cycleGrades classGrade
                $scope.$apply(function() {
                    $scope.cycleLoading = false;
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
                    chrome.storage.local.set({
                        'courses': courses,
                        'coursesettings': $scope.selection,
                        'gpa':gpa
                    });
                }
            });
        };
    }
]);
