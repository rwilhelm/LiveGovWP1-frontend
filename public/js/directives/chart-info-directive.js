

app.directive('chartInfo', [
  function() {
    return {
      restrict: 'E',
      scope: { trip: '=', sensor: '@' },
      templateUrl: 'partial/chart-info',
      link: function ($scope, $element, $attributes) {
        $scope.name = $attributes.name;
      }
    };
  }]);
