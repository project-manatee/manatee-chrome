var gradesApp = angular.module('gradesApp', []);

gradesApp.controller('GradesCtrl', function($scope, $http) {
	var grades = null;
	$http.get('grades.json').success(function(data) {
		console.log(data[0]);
		$scope.grades = data;
	});
});