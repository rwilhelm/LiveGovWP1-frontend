/* jshint strict:true, devel:true, debug:true, camelcase:false, curly:false */
/* global angular, React, _, d3 */

(function() {
  'use strict';

  window.SCOPE = function(selector){
    return angular.element(selector).scope();
  };

  // merge two sensor data arrays, sorted w/o duplicates
  Array.prototype.merge = function(array) {
    if (!this.length) return array;
    if (!array.length) return this;

    // sort by timestamp first, then remove the ones where a[i+1].endtime is
    // bigger than a[i].endtime

    return this.concat(array)
    .sort(function(a,b) {
      return d3.ascending(a.ts, b.ts);
    })
      .filter(function(d,i,a) { // true returns d
        return (a[i+1] ? (a[i].stop <= a[i+1].stop) : true);
      })
      .filter(function(d,i,a) { // FIXME there are still remaining entries after the first filter run
        return (a[i+1] ? (a[i].stop <= a[i+1].stop) : true);
      });
    };

    var config = {
      api: {
        // schema: 'api/schema',
        tables: 'api/tables',
        columns: function(tableName) { return 'api/columns/' + tableName; },
        trips: 'api/trips',
        check: function(id) { return 'api/trips/' + id + '/check'; },
        count: function(id) { return 'api/count/' + id; },
        sensors: function(id, sensor) { return 'api/trips/' + id + '/' + sensor; }
      },
      windowSize: 200
    };

  // --angular module
  angular.module('app', ['ngResource', 'ui.router'])

  // http interceptor (so we can check on ongoing xhr calls)
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

    // .state('charts',e {
    //   template: '<charts data="trip.sensors" load-More-Data="loadMoreData(id, props)" trip-Data-Updated="trip.sensors.updated">'
    // })
    // .state('trips', {
    //   url: '/',
    //   template: '<trips trips="tables.trip.sensors" select-Trip="selectTrip(id)" delete-Trip="deleteTrip(id)">'
    // });

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
    //    - xhr: all trips
    //    - xhr: all tables and columns

    // 2. select a trip
    //    - store selected trip object in $scope.trip
    //    - xhr: count data for motion sensor tables

    // 3. prepare chart data
    //    - create c3 chart data object for every motion sensor

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

      if ($state.params.tripId) { // <-- ui-router $state
        $scope.selectTrip($state.params.tripId); // auto-select trip
        console.info('>>> TRIP SELECTED:', $state.params.tripId);
      }
    });

    // click on a trip & load initial data
    $scope.selectTrip = function(id) {
      $scope.trip.props = _($scope.trips).select({id: +id}).head();
      Data.loadData($scope.trip)
      .then(function() {
        console.info('>>> TRIP READY', $scope.trip);
        $state.go('raw', {tripId: id});
      });
    };

    $scope.setState = function(state) {
      _.assign($scope.trip.state, state);
      console.info('>>> STATE UPDATED', state);
      $scope.loadMoreData($scope.trip);
    };

    // $scope.loadData = function(trip) {
    //   Data.loadData($scope.trip)
    //   .then(function() {
    //     console.info('>>> TRIP DATA LOADED', $scope.trip);
    //   });
    // };

    // change brush extent
    $scope.loadMoreData = function(trip) {
      Data.loadData($scope.trip)
      .then(function() {
        console.info('>>> TRIP DATA UPDATED', $scope.trip);
      });
    };

    // click a delete button in list view
    $scope.deleteTrip = function(id) {
      $scope.trips = $scope.trips.filter(function(trip) { return trip.id !== id; });
      Data.deleteTrip(id).then(function() {
        console.info('>>> TRIP DELETED:', id);
      });
    };

    // type something to the name column in list view
    $scope.updateTrip = function(id, value) {
      Data.updateTrip(id, value).then(function() {
        console.info('>>> TRIP PROPS UPDATED:', id);
      });
    };
  }])

  .service('Data', ['$http', '$q', function($http, $q) {

    var tables = {};

    return {

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
      loadData: function(trip) {

        var init = function() {
          var deferred = $q.defer();

          if (trip.state.updated) {
            deferred.resolve(_.pick(trip.sensors, function(d) { return d.isMotionSensor; }));
          } else {

            $http.get(config.api.count(trip.props.id)).then(function(res) {
              trip.sensors = _.omit(res.data, function(sensor) { return sensor.count <= 0; });

              // mark motion sensors
              _(trip.sensors).forEach(function(sensor, sensorName) {
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
          var queries = _(sensors).map(function(sensor, sensorName) {
            return $http.get(config.api.sensors(trip.props.id, sensorName), {
              params: {
                'w': (trip.state.windowSize || config.windowSize),
                'e': (trip.state.extent && trip.state.extent.join(","))
              }
            });
          });

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
      scope: { trip: '=' },
      restrict: 'E',
      link: function($scope, $element) {
        $scope.$watch('trip.updated', function(data) {

          var tripDataReady = (function() {
            return !_($scope.data).select(function(d) { return d.data && d.data.length; }).map('data').flatten().size();
          })();

          if (tripDataReady) {
            console.warn('angular map directive ___ $scope.data has changed! ___ RETURN');
          } else {
            console.info('angular map directive ___ $scope.data has changed! ___ RENDER COMPONENT');

            React.renderComponent(Map({
              trip: trip,
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
