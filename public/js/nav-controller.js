app.controller('navCtrl', function ($route, $scope, $routeParams, Trip) {
  console.log('ctrl: navCtrl');
  // TODO split into separate files
  $scope.$on('$routeChangeSuccess', function() {
    $scope.trip_id = $routeParams.trip_id;
  });

  this.selected = function() {
    return Trip.selected();
  };

  this.loc = function(loc) {
    return ($route.current && $route.current.name == loc);
  };
});
