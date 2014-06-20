/* jshint strict:true, devel:true, debug:true */
/* globals app */
'use strict'; // jshint -W097

app.config(function ($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(false);
  // $locationProvider.hashPrefix('!');

  // NOTE paths to local fs must be relative and without leading ./ (e.g.
  // localhost:3001/#/rec)

  $routeProvider
    .when('/rec/:trip_id?', {
      templateUrl: 'partial/rec',
    })

    .when('/raw/:trip_id?', {
      templateUrl: 'partial/raw',
    })

    .when('/har/:trip_id?', {
      templateUrl: 'partial/har',
    })

    .otherwise({
     redirectTo: 'rec'
    });
});
