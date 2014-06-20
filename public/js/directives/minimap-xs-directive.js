// app.directive('minimapPreview', ['$window',
//   function($window) {
//     return {
//       restrict: 'EA',
//       replace: true,
//       scope: {har: '=', domain: '='},
//       link: function($scope, $element, $attributes) {
//         var minimapPreview = d3.custom.minimapPreview();
//         var minimapPreviewElement = d3.select($element[0]); // brush's 'this' in selection.each

//         $scope.$watchCollection('[data.domain.x, data.domain.y, har]', function(val, oldVal) {
//           console.log('almost...');
//           if ($scope.har && $scope.data.domain.x.length && $scope.data.domain.y.length) {
//             console.log(' ready!');
//             minimapPreviewElement
//             .datum({domain: $scope.data.domain, har: $scope.har})
//             .call(minimapPreview);
//           }
//         });
//       }
//     };
//   }
// ]);

