/* jshint strict:true, devel:true, debug:true */
/* globals app, d3 */
'use strict'; // jshint -W097

/*
  See 'Controllers' section in README.md for documentation.
 */

app.controller('mainCtrl', ['$scope', '$rootScope', '$route', function($scope, $rootScope, $route) {
  console.log('ctrl: mainCtrl');

  if (!$rootScope.httpRequests) $rootScope.httpRequests = 0;
  if (!$rootScope.httpRequestErrors) $rootScope.httpRequestErrors = false;

  $scope.$on('$routeChangeSuccess', function() {
    console.log('route changed');
    $scope.template = $route.current.templateUrl;
  });

  $scope.$on('httpRequest', function(e) {
    // console.log('http request started');
    $rootScope.httpRequests++;
  });

  $scope.$on('httpResponse', function(e) {
    // console.log('http request finished');
    $rootScope.httpRequests--;
  });

  $scope.$on('httpRequestError', function(e) {
    console.error('http request error');
    $rootScope.httpRequestErrors = true;
  });

  $scope.$on('httpResponseError', function(e) {
    console.error('http response error');
    $rootScope.httpRequests--;
  });
}]);

app.controller('tripCtrl',
  ['$scope', '$location', '$route', '$routeParams', '$q', 'Config', 'Trip', 'msgBus',
  function($scope, $location, $route, $routeParams, $q, Config, Trip, msgBus) {
  console.log('ctrl: tripCtrl');

  msgBus.onMsg('somemsg', $scope, function() {
    console.info('___ TRIP CONTROLLER: MESSAGE RECEIVED ___')
  });

  Trip.loadTrips().then(function(data) {
    $scope.trips = data;

    if ($routeParams.trip_id) {
      console.log('trip id is set by route params to', $routeParams.trip_id);
      $scope.trip = $scope.trips.filter(function(d) {
        return d.id == $routeParams.trip_id;
      })[0];
      Trip.select($scope.trip);
    } else {
      $scope.trip = Trip.selected();
    }
  });

  // update a trip
  // TODO debounce
  this.update = function(trip, data) {
    // console.log(data);
    Trip.update(trip, data);
  };

  // delete a trip
  // TODO modal
  this.delete = function(trip) {
    if (confirm("Permanently delete trip " + trip.trip_id + "?")) {
      Trip.delete(trip);
    }
  };

  // TODO -> helper?
  this.updateUrl = function(trip) {
    var path = $location.path().split('/');
    var tripIdx = path.indexOf($routeParams.trip_id);
    if (!arguments.length) {
      path.pop(); // removes last element -> selects no trip
    } else if (tripIdx === -1) { // trip
      path.push(trip.id); // append -> selects trip
    } // else trip_id (url param) matches trip.id (selected trip)
    $location.url(path.join('/')).replace();
  };

  // select trip
  this.select = function(trip) {
    if (!arguments.length) {
      this.updateUrl();
      Trip.select();
    } else {
      this.updateUrl(trip);
      Trip.select(trip);
    }
  };

  // load (more) data for a trip
  // opt arg: { extent: Array[2], windowSize: number } // TODO test if correct -> ?e=?945i324, ?=e1235123
  // this.loadData = function(trip, obj) {
  //   Trip.loadData(trip, obj);
  // };

  // reset loaded trip data
  this.reset = function(trip) {
    return Trip.reset(trip);
  };

  // test if trip is selected
  this.selected = function(trip) {
    return Trip.selected(trip);
  };

  // count sensor data points
  this.count = function(trip) {
    Trip.count(trip);
  };

  // test if data is loaded
  this.hasData = function(trip) {
    return Trip.hasData(trip);
  };

  // test if ts1 > ts0
  this.hasDuration = function(trip) {
    return Trip.hasDuration(trip);
  };

  // test if name is set
  this.hasName = function(trip) {
    return Trip.hasName(trip);
  };

  // test if "bookmarked"
  this.hasLove = function(trip) {
    return Trip.hasLove(trip);
  };

  // toggle bookmark flag
  this.toggleLove = function(trip) {
    return Trip.toggleLove(trip);
  };

  // change location path
  this.to = function(loc, trip) {
    console.log('this.to: location.path set to: ', loc + "/" + trip.id);
    $location.path(loc + "/" + trip.id);
  };

  // test for current route (used by navbar)
  this.loc = function(loc) {
    return ($route.current && $route.current.name == loc);
  };

  $scope.loadMoreData = function(extent, oldExtent) {
    console.log('controller: loadMoreData', extent, oldExtent);
    // load more data only if we're zooming in
    var extentSize = extent.reduce(function(a,b) { return b-a; }, 0);
    var oldExtentSize = oldExtent.reduce(function(a,b) { return b-a; }, 0);

    if (extentSize === 0) {
      console.log('Zoom reset: not loading more data');
    } else {
      console.log('Zooming changed: loading more data', extentSize, oldExtentSize);
      Trip.loadData($scope.trip, {
        extent: extent,
        windowSize: 200 // Math.floor(Math.abs((Trip.hasData($scope.trip) / 3) + 200))
      });
    }
  };

  // // load more data
  // $scope.loadMoreData = function(extent) {
  //   Trip.loadData($scope.trip, {extent: extent, windowSize: 200});
  // };

  // update scope (called by directive)
  $scope.updateExtent = function(extent) {
    console.warn('ctrl updating extent', extent);
    $scope.$apply(function() {
      $scope.trip.data.extent = extent;
    });
  };

  // $scope.handleChanges = function(extent, oldExtent) {
  //   // update extent
  //   $scope.$apply(function() {
  //     $scope.trip.data.extent = extent;
  //   });
  // };

  // export data. format can be 'csv' or 'json'
  this.download = function(trip, sensor, format) {
    Trip.download(trip, sensor, format);
  };

  this.is = function(loc) {
    return ($route.current && $route.current.name == loc) ? true : false;
  };

  this.matchExtent = function(d) {
    return (d.ts >= $scope.trip.data.extent[0] && d.ts <= $scope.trip.data.extent[1]) ? true : false;
  };
}]);

app.controller('navCtrl', function ($route, $scope, $routeParams, Trip) {
  console.log('ctrl: navCtrl');

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
