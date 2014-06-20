
/* Fri Jun 20 03:28:04 CEST 2014 */
/* vi:set ft=javascript,tw=78 */

(function() {
  'use strict';
  /* jshint strict:true, devel:true, debug:true */
  /* global angular, app */

  app.directive('chart', [
    function () {
      return {
        restrict: 'E',
        scope: { trip: '=', sensor: '@', loadMoreData: '&' },
        link: function($scope, $element, $attributes) {
          console.log('chart directive:', $scope.sensor);

					// $scope.$broadcast('bla', ['asdf', 'qwer']);
					// $scope.$on('bla', function(args) { console.warn('BROADCAST CATCHED'); });


          // FIXME listen, don't watch (is that even possible?)
          // BUT WHO'S TALKING?
          $scope.$watchCollection('[trip.data.sensors[sensor], trip.data.domain.x, trip.data.domain.y, trip.data.extent]', function(val, oldVal) {
            if ($scope.trip && $scope.trip.data.sensors[$scope.sensor].length && $scope.trip.data.domain.x.length && $scope.trip.data.domain.y.length) {
              React.renderComponent(
                OLDCHART({
                  sensor  : $scope.sensor,
                  data    : $scope.trip.data.sensors[$scope.sensor],
                  extent  : $scope.trip.data.extent,
                  xDomain : $scope.trip.data.domain.x,
                  yDomain : $scope.trip.data.domain.y,
                  loadMoreData: function(extent, oldExtent) {
                    console.log('directive: loadMoreData', extent, oldExtent);
                    $scope.loadMoreData({extent: extent, oldExtent: oldExtent});
                  },
                  updateExtent: function(extent) {
                    $scope.updateExtent({extent: extent});
                  },
                  // onChange: handleChanges(function(extent) {
                  //   $scope.trip.data.extent = extent;
                  //   $scope.$apply();
                  // }
                }), $element[0]
              );
            }
          });
        }
      };
    }
  ]);
})()
