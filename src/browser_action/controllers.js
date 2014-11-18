var gradesApp = angular.module('gradesApp', []);

gradesApp.controller('GradesCtrl', function($scope) {
  $scope.updateCredentials = function(user) {
    var updatedUser = angular.copy(user);
    rememberedGrades.updateCredentials(updatedUser.username, updatedUser.password);
  };

  $scope.updateGrades = function() {
    rememberedGrades.updateGrades();
  };
});