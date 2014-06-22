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
              SensorChart({
                data  : $scope.trip.sensorData.sensors[$scope.sensor],
                extent: $scope.trip.sensorData.extent,
                xDomain: $scope.trip.sensorData.xDomain,
                yDomain: $scope.trip.sensorData.yDomain,
                height: 200, // $element[0].offsetHeight || 200, // FIXME
                width: $element[0].offsetWidth,
                loadMoreData: function(extent, oldExtent) {
                  console.log('chartDirective:loadMoreData', extent, oldExtent);
                  $scope.loadMoreData({extent: extent, oldExtent: oldExtent});
                },
                // updateExtent: function(extent) {
                //   console.log('chartDirective:updateExtent');
                //   $scope.updateExtent({extent: extent});
                // },
                // onChange: handleChanges(function(extent) {
                //   $scope.trip.data.extent = extent;
                //   $scope.$apply();
                // }
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

          $scope.$watch('trip.sensorData', function(val, oldVal) {
            if (tripIsReady()) {
              console.log('chartDirective:' + $scope.sensor + ':$watch', val, oldVal);
              renderComponent();
            }
          }, true);
        }
      };
    }
  ]);
})();
