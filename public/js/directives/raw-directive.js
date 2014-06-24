/* jshint strict:true, devel:true, debug:true */
/* global angular, app */

/* Fri Jun 20 03:28:04 CEST 2014 */
/* vi:set ft=javascript,tw=78 */

(function() {
  'use strict';

  app.directive('raw', [
    function () {
      return {
        restrict: 'E',
        scope: { trip: '=', sensors: '@', onBrush: '&' },
        link: function($scope, $element, $attributes) {
          console.log('chartDirective:', $scope.sensors);
          function renderComponent() {
            React.renderComponent(
              RawView({
                scope: $scope,
                width: $element[0].offsetWidth,
                loadMoreData: function(extent, oldExtent) {
                  console.log('chartDirective:loadMoreData', extent, oldExtent);
                  $scope.loadMoreData({extent: extent, oldExtent: oldExtent});
                onBrush: function(extent, oldExtent) {
                  console.log('chartDirective:onBrush', extent, oldExtent);
                  $scope.onBrush({extent: extent, oldExtent: oldExtent});
                },
              }), $element[0]
            );
          }

          // function renderComponent() {
          //   React.renderComponent(
          //     SensorChart({
          //       sensor: $scope.sensor,
          //       data  : $scope.trip.sensorData.sensors[$scope.sensor],
          //       extent: $scope.trip.sensorData.extent,
          //       xDomain: $scope.trip.sensorData.xDomain,
          //       yDomain: $scope.trip.sensorData.yDomain,
          //       height: 200, // $element[0].offsetHeight || 200, // FIXME
          //       width: $element[0].offsetWidth,
          //       loadMoreData: function(extent, oldExtent) {
          //         console.log('chartDirective:loadMoreData', extent, oldExtent);
          //         $scope.loadMoreData({extent: extent, oldExtent: oldExtent});
          //       },
          //       // updateExtent: function(extent) {
          //       //   console.log('chartDirective:updateExtent');
          //       //   $scope.updateExtent({extent: extent});
          //       // },
          //       // onChange: handleChanges(function(extent) {
          //       //   $scope.trip.data.extent = extent;
          //       //   $scope.$apply();
          //       // }
          //     }), $element[0]
          //   );
          // }

          function tripIsReady () {
            if (!$scope.trip) return false;

            var dataCount =
              Object.keys($scope.trip.sensorData.sensors)
                .map(function(sensor) {
                  return $scope.trip.sensorData.sensors[sensor].length;
                })
                .reduce(function(a,b){ return a + b; });

            var domainsReady =
              $scope.trip.sensorData.xDomain.length + $scope.trip.sensorData.yDomain.length;

            return (
              $scope.trip &&
              dataCount <= 600 &&
              domainsReady == 4 // uh oh
            );
          }

          $scope.$watchCollection('trip.sensorData', function(val, oldVal) {
            if (tripIsReady()) {
              if (val.extent.length) {
                if (val.extent !== oldVal.extent) {
                  console.log('rawDirective:$watch', val.extent, oldVal.extent);
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
