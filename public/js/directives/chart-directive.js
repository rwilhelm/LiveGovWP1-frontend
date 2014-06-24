/* jshint strict:true, devel:true, debug:true */
/* global angular, app */

/* Fri Jun 20 03:28:04 CEST 2014 */
/* vi:set ft=javascript,tw=78 */

(function() {
  'use strict';

  app.directive('chart', [
    function () {
      return {
        restrict: 'E',
        scope: { trip: '=', sensor: '@', loadMoreData: '&', updateExtent: '&' },
        link: function($scope, $element, $attributes) {
          console.log('chartDirective:', $scope.sensor);

          function renderComponent() {
            React.renderComponent(
              RawView({
                scope: $scope,
                width: $element[0].offsetWidth,
                loadMoreData: function(extent, oldExtent) {
                  console.log('chartDirective:loadMoreData', extent, oldExtent);
                  $scope.loadMoreData({extent: extent, oldExtent: oldExtent});
                },
              }), $element[0]
            );
          }

          function tripIsReady () {
            return (
              $scope.trip &&
              $scope.trip.sensorData.sensors[$scope.sensor].length &&
              $scope.trip.sensorData.xDomain.length &&
              $scope.trip.sensorData.yDomain.length
            );
          }

          $scope.$watchCollection('trip.sensorData', function(val, oldVal) {
            if (tripIsReady()) {
              if (val.extent.length) {
                if (val.extent !== oldVal.extent) {
                  console.log('chartDirective:' + $scope.sensor + ':$watch', val.extent, oldVal.extent);
                  renderComponent();
                }
              } else {
                renderComponent();
              }
            }
          });
        }
      };
    }
  ]);
})();
