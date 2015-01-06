var gradesApp = angular.module('gradesApp', ['ngRoute']);

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
        rememberedGrades.isLoggedIn(function(loggedIn) {
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
    }
]);
gradesApp.controller('GradesCtrl', ['$scope', '$location', '$rootScope',
    function($scope, $location, $rootScope) {
        $scope.getGrades = function() {
            rememberedGrades.getGrades(function(courses) {
                $scope.$apply(function() {
                    $scope.grades = courses;
                });
            });
        };
		$scope.getGrades();

        $scope.logout = function() {
			rememberedGrades.logout(function () {
				$rootScope.$apply(function() {
					$location.path('/loginPage');
				});
			});
        };
        $scope.getCycle = function(course, semester, cycle) {
            $rootScope.$apply(function() {
                $location.path('/viewCycle/' + course + '/' + semester + '/' + cycle);
            });
        };
    }
]);

gradesApp.controller('CycleCtrl', ['$scope', '$location', '$rootScope', '$routeParams',
    function($scope, $location, $rootScope, $routeParams) {
        var courseid = $routeParams.courseid;
        var semester = $routeParams.semester;
        var cycle = $routeParams.cycle;
        $scope.getCycleGrades = function () {
			rememberedGrades.getCycleGrades(course, semester, cycle, function(cyclereturned) {
				$scope.$apply(function() {
					$scope.classGrade = cyclereturned;
				});
			});
		};
		$scope.getCycleGrades();
		
        $scope.viewCourses = function() {
            $location.path('/viewGrades');
        };
        $scope.logout = function() {
			rememberedGrades.logout(function () {
				$rootScope.$apply(function() {
					$location.path('/loginPage');
				});
			});
        };
    }
]);
