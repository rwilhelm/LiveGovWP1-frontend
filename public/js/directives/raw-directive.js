/* jshint strict:true, devel:true, debug:true, newcap:false */
/* global angular, app, RawView */

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

                // TODO can i trigger $scope changes from within react
                // components? should i?
                // scope: $scope,

                data: $scope.trip.data,
                onBrush: function(extent, oldExtent) {
                  console.log('chartDirective:onBrush', extent, oldExtent);
                  $scope.onBrush({extent: extent, oldExtent: oldExtent});
                },
              }), $element[0]
            );
          }

          var tripIsReady = function() {
            if (!$scope.trip) return false;
            if (!$scope.trip.data) return false;
            // if (!$scope.trip.data.arrayLengthSum <= 600) return false;
            return true;
          };

          $scope.$watchCollection('trip.data', function(val, oldVal) {
            if (tripIsReady()) {
              console.log('rawDirective:$watch', val, oldVal);
              renderComponent();
            }
          });
        }
      };
    }
  ]);
})();
