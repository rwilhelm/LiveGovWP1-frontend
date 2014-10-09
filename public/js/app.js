/* jshint strict:true, devel:true, debug:true, camelcase:false, curly:false */
/* global angular, React, _, d3 */

(function() {
  'use strict';

  var config = {
    api: {
      trips: 'api/trips',
      tables: 'api/tables',
      columns: function(table) { return 'api/columns/' + table; },

      // e.g. localhost:3000/api/trips/18/sensor_accelerometer
      sensors: function(id, sensor) { return 'api/trips/' + id + '/' + sensor; },

      count: function(id, table) { return 'api/count/' + id + '/' + table; },
    },
    windowSize: 200
  };

  angular.module('app', ['ngResource', 'ui.router'])

  .config(function ($provide, $httpProvider, $stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    .state('trips', {
      url: '/',
      templateUrl: 'trips.html'
    })
    .state('raw', {
      url: '/raw/:tripId',
      templateUrl: 'raw.html'
    })
    .state('har', {
      url: '/har/:tripId',
      templateUrl: 'har.html'
    })
    .state('sld', {
      url: '/sld/:tripId',
      templateUrl: 'sld.html'
    });

    // http interceptor (so we can check on ongoing xhr calls)
    $provide.factory('httpInterceptor', function ($q, $rootScope) {
      return {
        'request': function (config) {
          // intercept and change config: e.g. change the URL
          // config.url += '?nocache=' + (new Date()).getTime();
          $rootScope.$broadcast('httpRequest', config);
          return config || $q.when(config);
        },
        'response': function (response) {
          // we can intercept and change response here
          $rootScope.$broadcast('httpResponse', response);
          return response || $q.when(response);
        },
        'requestError': function (rejection) {
          $rootScope.$broadcast('httpRequestError', rejection);
          return $q.reject(rejection);
        },
        'responseError': function (rejection) {
          $rootScope.$broadcast('httpResponseError', rejection);
          return $q.reject(rejection);
        }
      };
    });
    $httpProvider.interceptors.push('httpInterceptor');
  })

  // .run(function($rootScope, $state) {
  //   $rootScope.state = $state;
  // })

  .controller('appCtrl', ['$q', '$rootScope', '$scope', 'Data', '$state',
   function($q, $rootScope, $scope, Data, $state) {

    // console.log('ANGULAR ENV: ', $scope.env);

    // handle intercepted http requests
    if (!$rootScope.httpRequests) { $rootScope.httpRequests = 0; }
    if (!$rootScope.httpRequestErrors) { $rootScope.httpRequestErrors = false; }

    $scope.$on('httpRequest', function(e) {
      // console.log('http request started');
      $rootScope.httpRequests++;
    });

    $scope.$on('httpResponse', function(e) {
      // console.log('http request finished');
      $rootScope.httpRequests--;
    });

    $scope.$on('httpRequestError', function(e) {
      // console.error('http request error');
      $rootScope.httpRequestErrors = true;
    });

    $scope.$on('httpResponseError', function(e) {
      // console.error('http response error');
      $rootScope.httpRequests--;
    });

    // actual app initialization

    // 1. load and prepare initial data
    //    - xhr: all trips ($scope.trips)
    //    - xhr: all tables and columns ($scope.trip.tables)

    // 2. select a trip
    //    - store selected trip object ($scope.trip)
    //    - xhr: count data for motion sensor tables ($scope.trip.sensors)

    // 3. prepare chart data
    //    - create d3 chart data object for every motion sensor

    $scope.trip = {
      props: {},
      state: {
        updated: false
      },
      sensors: {}
    };

    var promises = [
      Data.tables(), // resolves all table and column names
      Data.trips(), // resolves all trips
    ];

    $q.all(promises).then(function(arr) {
      $scope.tables = arr[0];
      $scope.trips = arr[1];

      console.info('>>> INIT DONE');
      console.log('$scope.tables', $scope.tables);
      console.log('$scope.trips', $scope.trips);

      if ($state.params.tripId) { // <-- ui-router $state: if trip_id in address bar is set
        $scope.selectTrip($state.params.tripId); // auto-select trip
        console.info('>>> TRIP SELECTED:', $state.params.tripId);
        console.log('$scope.trip', $scope.trip);
      }
    });

    // click on a trip & load initial data
    $scope.selectTrip = function(id) {
      // reset before selecting a new trip
      $scope.trip = {
        props: {},
        state: {
          updated: false
        },
        sensors: {}
      };

      $scope.trip.props = _($scope.trips).select({id: +id}).head(); // select and pick first element
      Data.loadData($scope.trip, $scope.tables)
      .then(function() { // don't utilize any resolved value. $scope is manipiulated from service (stupid?)
        console.info('>>> TRIP READY', $scope.trip);
        console.log('$scope.trip', $scope.trip);
        $state.go('raw', {tripId: id});
      });
    };

    // on: ...
    $scope.setState = function(state) {
      _.assign($scope.trip.state, state);
      console.info('>>> STATE UPDATED', state);
      $scope.loadMoreData($scope.trip);
    };

    // on: brush extend change
    $scope.loadMoreData = function(trip) {
      // WILL UPDATE $scope.trip.data
      Data.loadData($scope.trip)
      .then(function() {
        console.info('>>> TRIP DATA UPDATED', $scope.trip);
      });
    };

    // on: delete button click in trip list view
    $scope.deleteTrip = function(id) {
      $scope.trips = $scope.trips.filter(function(trip) { return trip.id !== id; });
      Data.deleteTrip(id).then(function() {
        console.info('>>> TRIP DELETED:', id);
      });
    };

    // type something to the name column in list view
    // WILL UPDATE $scope.trip.props
    $scope.updateTrip = function(id, value) {
      Data.updateTrip(id, value).then(function() {
        console.info('>>> TRIP PROPS UPDATED:', id);
      });
    };
  }])

  .service('Data', ['$http', '$q', function($http, $q) {

    var tables = {};

    return {

      // get all table and corresponding column names and store them into ...
      tables: function() {
        var deferred = $q.defer();

        if (tables.length) {
          deferred.resolve(tables);
        } else {
          $http.get(config.api.tables)
          .success(function(data) {

            var promises = data.map(function(table) {
              return $http.get(config.api.columns(table.relname))
              .success(function(columns) {
                tables[table.relname] = _.map(columns, 'attname');
              });
            });

            $q.all(promises).then(function(data) {
              deferred.resolve(tables);
            });
          });
        }

        return deferred.promise;
      },

      count: function(tripId) {
        var deferred = $q.defer();

        // FIXME you cant just count for all tables, as there's e.g. auth and
        // service_sld w/o trip_id or ts
        // -> remove auth in back end after retrieval

        // step101: get all tables
        // step201: pick tables w/ trip_id and ts

        // TODO clean up using _.all
        // remove
        var tablesWithTripId = _.pick(tables, function(table) { return _.contains(table, 'trip_id'); });
        var tablesWithTripIdAndTs = _.pick(tablesWithTripId, function(table) { return _.contains(table, 'ts'); });

        var promises = _.keys(tablesWithTripIdAndTs).map(function(table) {
          return $http.get(config.api.count(tripId, table));
        });

        $q.all(promises).then(function(data) {
          deferred.resolve(data);
        });

        return deferred.promise;
      },

      // get all trips
      trips: function() {
        var deferred = $q.defer();
        $http.get(config.api.trips)
        .success(function(data) {
          data.forEach(function(trip) {

            trip.start = +trip.start;
            trip.stop = +trip.stop;
            trip.duration = trip.stop - trip.start;
            trip.user = trip.user.replace(/"/g, '');
            trip.expires = +trip.expires;

          });

          deferred.resolve(data);
        });

        return deferred.promise;
      },

      // get all sensor, gps and har data for a trip
      loadData: function(trip, tables) {

        // resolves: $scope.trip.sensors, e.g.:
        // $scope.trip.sensors = {
        //   ...
        // }
        var init = function() {
          var deferred = $q.defer();

          // $scope.trip.state.updated is changed on ...
          if (trip.state.updated) {
            deferred.resolve(_.pick(trip.sensors, function(d) { return d.isMotionSensor; }));
          } else {
            this.count(trip.props.id).then(function(counts) {

              // -> {sensor_velocity: "0", ...}
              counts = _(counts).map('data').flatten().foldr(function(a,b){ return _.merge(a, b); });

              trip.sensors = _.pick(counts, function(d) { return d; }); // to filter sensors w/o data: return d > 0

              // {sensor_gps: {count:123}, ...}
              trip.sensors = _.each(trip.sensors, function(v,k){ trip.sensors[k] = {}; trip.sensors[k].count = v; });

              // [{name: sensor_gps, count:123}, ...]
              // trip.sensors_.map(trip.sensors, function(v,k){ return {name:k, count:v.count}; });

              _(tables).each(function(columns, tableName) {
                if (trip.sensors.hasOwnProperty(tableName)) {
                  trip.sensors[tableName].columns = columns;
                } else {
                  trip.sensors[tableName] = {};
                  trip.sensors[tableName].columns = columns;
                }}).value();

              // mark motion sensors
              // trip.sensors is $scope.trip.sensors
              _(trip.sensors).each(function(sensor, sensorName, a) {
                sensor.isMotionSensor = _(['x', 'y', 'z']).all(function(xyz) {
                  return _(tables[sensorName]).values().contains(xyz); // XXX
                });
              });

              deferred.resolve(trip.sensors);
            });
          }
          return deferred.promise;
        }.bind(this);

        var deferred = $q.defer();

        init().then(function(sensors) {
          // sensors = _.pick(sensors, function(sensor) { return sensor.isMotionSensor; });

          sensors = _.pick(sensors, function(sensor) { return _.contains(sensor.columns, 'trip_id'); });
          sensors = _.pick(sensors, function(sensor) { return _.contains(sensor.columns, 'ts'); });

          var queries = _(sensors).map(function(sensor, sensorName) {
            var options;
            if (sensor.isMotionSensor) {
              options = {
                params: {
                  'w': (trip.state.windowSize || config.windowSize),
                  'e': (trip.state.extent && trip.state.extent.join(","))
                }
              };
            }

            return $http.get(config.api.sensors(trip.props.id, sensorName), options);
          });

          // xhr to api for every sensorname, e.g. GET /api/13/sensor_velocity
          $q.all(queries)
          .then(function(sensors) {
            _.forEach(sensors, function(sensor) {
              var sensorName = _.last(sensor.config.url.split('/'));
              trip.sensors[sensorName].data = _.forEach(sensor.data, function(d) {
                d.ts = +d.ts;
              });

            });
            trip.state.updated = Date.now();
            deferred.resolve();
          });
        });

        return deferred.promise;
      },

      deleteTrip: function(id) {
        return $http({ method: 'DELETE', url: 'api/trips/' + id });
      },

      undeleteTrip: function(id) {
        return $http({ method: 'POST', url: 'api/trips/' + id + '/undelete' });
      },

      updateTrip: function (id, value) {
        return $http({ method: 'POST', url: 'api/trips/' + id, data:{name:value} });
      },
    };
  }])

  .directive('trips', [function(){
    return {
      scope: {
        trips: '=',
        selectTrip: '&',
        deleteTrip: '&',
        updateTrip: '&'
      },
      restrict: 'E',
      link: function($scope, $element) {
        $scope.$watchCollection('trips', function(trips) {
          if (!trips || !trips.length) { return; }

          React.renderComponent(Trips({
            trips:trips,
            selectTrip: function(id) {
              $scope.selectTrip({id:id});
            },
            deleteTrip: function(id) {
              $scope.deleteTrip({id:id});
            },
            undeleteTrip: function(id) {
              $scope.undeleteTrip({id:id});
            },
            updateTrip: function(id, value) {
              $scope.updateTrip({id:id, value:value});
            },
          }), $element[0]);

        });
      }
    };
  }])

  .directive('map', [function(){
    return {
      scope: { trip: '=', setState: '&' },
      restrict: 'E',
      link: function($scope, $element) {

        // $scope.trip.state.updated is changed on ... (1/2)
        $scope.$watch('trip.state.updated', function(trip) {
          if ($scope.trip.state.updated) {
            React.renderComponent(Map({

              // only give non motion sensor data and extent state (BEWARE)
              // sensors: _.omit($scope.trip.sensors, function(d) { return d.isMotionSensor; }),

              extent: $scope.trip.state.extent || [],

              gps: $scope.trip.sensors.sensor_gps,
              har: $scope.trip.sensors.sensor_har,
              tags: $scope.trip.sensors.sensor_tags,

              setState: function(state) {
                $scope.setState({state: state}); // <- like this
              },

              width: $element[0].parentNode.offsetWidth,
            }), $element[0]);
          }

        });
      }
    };
  }])

  .directive('charts', [function(){
    return {
      scope: { trip: '=', setState: '&' },
      restrict: 'E',
      link: function($scope, $element) {

        // $scope.trip.state.updated is changed on ... (2/2)
        $scope.$watch('trip.state.updated', function(trip) {
          if ($scope.trip.state.updated) {
            React.renderComponent(Charts({

              // only give motion sensor data and extent state
              sensors: _.pick($scope.trip.sensors, function(d) { return d.isMotionSensor; }),
              extent: $scope.trip.state.extent || [],

              setState: function(state) {
                $scope.setState({state: state}); // <- like this
              },

              width: $element[0].parentNode.offsetWidth,
            }), $element[0]);
          }

        });
      }
    };
  }])

  .directive('har', [function(){
    return {
      scope: { trip: '=' },
      restrict: 'E',
      link: function($scope, $element) {
        $scope.$watch('trip.state.updated', function(trip) {
          if ($scope.trip.state.updated) {
            React.renderComponent(HarBrush({
              color: $scope.merge,
              setState: function(state) {
                $scope.setState({state: state}); // <- like this
              },

              width: $element[0].parentNode.offsetWidth,
            }), $element[0]);
          }
        });
      }
    };
  }])

  .directive('menu', [function(){
    return {
      scope: { trip: '=' },
      restrict: 'E',
      link: function($scope, $element) {
        $scope.$watch('trip.id', function(tripId) {
          React.renderComponent(Menu({
            tripId: tripId || false,
            merge: $scope.merge,
            toggleMerge: function() {
              $scope.merge = !!$scope.merge;
            },

          }), $element[0]);
        });
      }
    };
  }]);

}());
