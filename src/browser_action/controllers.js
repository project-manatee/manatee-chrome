var gradesApp = angular.module('gradesApp', ['ngRoute']);




function checkLoggedIn (callback) {
		chrome.storage.local.get(['username','password'], 
								 function(item) { 
									 callback(item.hasOwnProperty('username') && item.hasOwnProperty('password'));
								 });
}
gradesApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/loginPage', {
		template: function () {
			return "Here is my login page {{testdsf}}";
		},
		controller:'LoginCtrl'
	});
	$routeProvider.when('/viewGrades', {
		template: function() {
			return "{{testdsf}}";
		},
		controller:'GradesCtrl'
	});
}]);

gradesApp.controller('LoginCtrl', ['$scope', '$location', 
	function($scope, $location) {
		checkLoggedIn(function(loggedIn) {
			if(loggedIn) {
				$location.path('/viewGrades');
			}
		});
	}
]);

gradesApp.controller('GradesCtrl', ['$scope', '$location', 
	function($scope, $location) {
	
	}
]);

/*
[
			'<!doctype html>',
			'<html lang="en" ng-app>',
			'<head>',
			'	<script src="../../js/angular/angular.js"></script>',
			'	<script src="../../js/angular/angular-route.js"></script>',
			'	<script src="controllers.js"></script>',
			'</head>',
			'<body>',
			'	<div ng-view>HELP. ME. NOW!</div>',
			'</body>',
			'</html>'
		].join("\n")

var ctr = 0;

var login = function () {
	ctr += 1;
	console.log("ctr: " + ctr + ", logged in:" + (ctr % 3) === 0);
	return (ctr % 3) === 0;
};

var watProvider = function (IDontEvenKnow) {
	if (login()) {
		return 'logged in';
	} else {
		return 'not logged in';
	}
};

var login = function ($q, $rootScope, $location) {
	chrome.storage.local.get(['username', 'password'], function(item) { 
		if(username in item && password in item) {
			callback(true);
		} else {
			callback(false);
		}
	});
};

gradesApp.controller('LoginCtrl', ['$scope', '$location',
    function($scope, $location) {

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

gradesApp.controller('MainCtrl', ['$scope', '$location', 
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

gradesApp.run(['$logincheck', '$location', 
function($logincheck, $location) {
	$logincheck(function(isLoggedIn) { 
		if(isLoggedIn) {
			$location.path('/view');
		} else {
			$location.path('/login');
		}
	});
}]);
*/
