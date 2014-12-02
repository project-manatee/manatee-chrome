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
				grades = item.courses;
				for (var i = 0; i < grades.length; ++i) {
					grades[i].allCycles = [];
					for (var j = 0; j < grades[i].semesters.length; ++j) {
						for (var k = 0; k < grades[i].semesters[j].cycles.length; ++k) {
							grades[i].semesters[j].cycles[k].semesterId = j;
							grades[i].semesters[j].cycles[k].cycleId = k;
							grades[i].allCycles.push(grades[i].semesters[j].cycles[k]);
						}
					}
				}
				console.log(grades);
                $scope.$apply(function() {
                    $scope.grades = grades;
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
		$scope.getCycle = function(course_index, cycle_index) {
			courseId = grades[course_index].courseId;
			semesterId = grades[course_index].allCycles[cycle_index].semesterId;
			cycleId = grades[course_index].allCycles[cycle_index].cycleId;
			console.log("(" + courseId + ", " + semesterId + ", " + cycleId + ")");
		};
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
        };
    }
]);
