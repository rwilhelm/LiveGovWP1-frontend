app.directive('minimap', [
  function () {
    return {
      restrict: 'E',
      scope: { trip: '=', sensor: '@', updateExtent: '&', loadMoreData: '&' },
      link: function($scope, $element, $attributes) {
        console.log('chart directive:', $scope.sensor);

        // FIXME listen, don't watch (is that even possible?)
        $scope.$watchCollection('[trip.data.domain.x, trip.data.domain.y]', function(val, oldVal) {
          if ($scope.trip && $scope.trip.data.domain.x.length && $scope.trip.data.domain.y.length && $scope.trip.data.harSummarized.length) {
            React.renderComponent(
              minimap({
                extent  : $scope.trip.data.extent,
                xDomain : $scope.trip.data.domain.x,
                yDomain : $scope.trip.data.domain.y,
                data    : $scope.trip.data.harSummarized,
                loadMoreData: function(extent, oldExtent) {
                  $scope.loadMoreData({extent: extent, oldExtent: oldExtent});
                },
                updateExtent: function(extent) {
                  $scope.updateExtent({extent: extent});
                },
              }), $element[0]
            );
          }
        });
      }
    };
  }
]);

