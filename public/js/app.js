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
          schema: 'api/schema',
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
    angular.module('app', ['ngResource', 'ngRoute'])

    // provide location.path() in template
    .run(function($rootScope, $routeParams) {
      $rootScope.routeParams = $routeParams;
    })

    // http interceptor (so we can check on ongoing xhr calls)
    .config(function ($httpProvider, $provide, $routeProvider) {

      // (fake) routes TODO
      $routeProvider
      .when('/:view/:id', {})
      .otherwise({redirectTo: '/'});

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

    // NOTICE: there's only one controller

    // --controller start
    .controller('appCtrl', ['$q', '$rootScope', '$scope', '$location', '$route', '$routeParams', 'Data',
     function($q, $rootScope, $scope, $location, $route, $routeParams, Data) {

      // console.log('ANGULAR ENV: ', $scope.env);

      // handle intercepted http requests
      if (!$rootScope.httpRequests) { $rootScope.httpRequests = 0; }
      if (!$rootScope.httpRequestErrors) { $rootScope.httpRequestErrors = false; }

      $scope.$on('$routeChangeSuccess', function() {
        console.log('route changed');
        $scope.template = $route.current.templateUrl;
      });

      $scope.$on('httpRequest', function(e) {
        console.log('http request started');
        $rootScope.httpRequests++;
      });

      $scope.$on('httpResponse', function(e) {
        console.log('http request finished');
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




      // actual app initialization

      // 1. load and prepare initial data
      //    - xhr: all trips
      //    - xhr: all tables and columns

      // 2. select a trip
      //    - store selected trip object in $scope.trip
      //    - xhr: count data for motion sensor tables

      // 3. prepare chart data
      //    - create c3 chart data object for every motion sensor

      var initialize = function() {
        if ($scope.ready) return;

        var promises = [];
        var deferred = $q.defer();
        $scope.tripDataReady = false;
        $scope.merge = false;

        // all trips
        promises.push(Data.trips()
          .then(function(trips) {
            $scope.trips = trips;
          }));

        // all table and column names
        promises.push(Data.tables()
          .then(function(tables) {
            $scope.tables = tables;
          }));

        $q.all(promises).then(function(data) {
          deferred.resolve();
        });

        return deferred.promise;
      };

      initialize().then(function() {
        if ($routeParams.id) {
          $scope.selectTrip(+$routeParams.id);
        }

        console.log('___INIT DONE___');
        $scope.ready = true;
      });


      // click on a trip & load initial data
      $scope.selectTrip = function(id) {
        $scope.trip = _($scope.trips).select({id: id}).head();
        console.log('selecting trip ' + id, $scope.trip);
        console.log('motionTables', $scope.motionTables);

        Data.countData(id)
        .then(function(dataCount) {

          // initialize data object: as soon as we have a trip selected we can
          // use the dataCount object as our initial data object
          $scope.trip.data = dataCount;

          // add column names to data object and mark motion sensors
          _($scope.trip.data).forEach(function(table, tableName) {
            table.columns = $scope.tables[tableName];

            table.isMotionSensor = _(['x', 'y', 'z'])
            .all(function(value) {
              return _(table.columns).values().contains(value);
            });
          });

          Data.loadData($scope.trip)
          .then(function(data) {
            $scope.trip.data = data;
            $scope.trip.data.updated = Date.now();
            console.log('___TRIP READY___', $scope.trip);
            $location.path('raw/' + id);
          });
        });

      };

      // change brush extent
      $scope.loadMoreData = function(id, props) {
        console.log('___LOAD_MORE_DATA___');
        Data.loadData($scope.trip, props, true)
        .then(function(data) {
          _.keys(data).forEach(function(sensor) {

            if ($scope.merge) {
              $scope.trip.data[sensor] = $scope.trip.data[sensor].merge(data[sensor]);
            } else {
              $scope.trip.data[sensor] = data[sensor];
            }

            console.log('angular loadMoreData ___ $scope.trip.data updated! ___ ');

            // NOTICE: in our directives we're watching $scope.trip, but here
            // we're updating $scope.trip.data. as a consequence, the
            // directive's watch function will not recognize any change unless
            // we do something in $scope.trip TODO

            $scope.trip.data.updated = Date.now();
          });
        });
      };

      // click a delete button in list view
      $scope.deleteTrip = function(id) {
        $scope.trips = $scope.trips.filter(function(trip) { return trip.id !== id; });
        Data.deleteTrip(id);
      };

      // type something to the name column in list view
      $scope.updateTrip = function(id, value) {
        Data.updateTrip(id, value);
      };
      // --controller end
    }])

    // DATA FACTORY (MAKES API CALLS)
    .factory('Data', ['$http', '$q', function($http, $q) {
      return {

        tables: function() {
          var deferred = $q.defer();

          var t = {}; // returning table object

          $http.get(config.api.tables)
          .success(function(tables) {

            var promises = [];

            tables.forEach(function(table) {
              promises.push($http.get(config.api.columns(table.relname))
                .success(function(columns) {
                  t[table.relname] = _.map(columns, 'attname');
                }));
            });

            $q.all(promises).then(function(data) {
              console.log(t);
              deferred.resolve(t);
            });

          });

          return deferred.promise;
        },

        schema: function() {
          return $http.get(config.api.schema);
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
              trip.updated = Date.now();
              trip.expires = +trip.expires;

            });

            deferred.resolve(data);
          });

          return deferred.promise;
        },

        // get all sensor, gps and har data for a trip
        loadData: function(trip, params, more) {
          var deferred = $q.defer();
          console.log('___LOAD_MORE_DATA___***');

          // save name
          _(trip.data).forEach(function(sensor, sensorName) { sensor.name = sensorName; });

          // filter out sensors without data
          var sensors = _.pick(trip.data, function(d) { return d.count > 0; });

          // only load more data for motion sensors (BEWARE)
          if (more) {
            sensors = _.omit(sensors, function(d) { return !d.isMotionSensor; });
          }

          // create an array of promises
          var queries = _(sensors).map(function(sensor) {
            return $http.get(config.api.sensors(trip.id, sensor.name), {
              params: {
                'w': (params && params.windowSize || config.windowSize),
                'e': (params && params.extent.join(","))
              }
            });
          });

          $q.all(queries)
          .then(function(arr) {

            _.forEach(arr, function(a) {
              var sensor = sensors[_.last(a.config.url.split('/'))];
              console.log(sensor);
              sensor.data = _.forEach(a.data, function(row) {
                row.ts = +row.ts;
              });
            });

            deferred.resolve(sensors);
          });

          return deferred.promise;
        },

        // minimal db query to count available data
        countData: function(id) {
          var deferred = $q.defer();
          $http.get(config.api.count(id))
          .success(function(data) {
            deferred.resolve(data);
          });
          return deferred.promise;
        },

        deleteTrip: function(id) {
          $http({ method: 'DELETE', url: 'trips/' + id })
          .success(function() {
            console.info('DELETED TRIP', id);
          });
        },

        undeleteTrip: function(id) {
          $http({ method: 'POST', url: 'trips/' + id + '/undelete' })
          .success(function() {
            console.info('UNDELETED TRIP', id);
          });
        },

        updateTrip: function (id, value) {
          $http({ method: 'POST', url: 'trips/' + id, data:{name:value} })
          .success(function() {
            console.info('UPDATED TRIP', id);
          });
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

.directive('charts', [function(){
  return {
    scope: { data: '=', loadMoreData: '&', tripDataUpdated: '=' },
    restrict: 'E',
    link: function($scope, $element) {
      $scope.$watch('tripDataUpdated', function(data) {

        var tripDataReady = (function() {
          return !_($scope.data).select(function(d) { return d.data && d.data.length; }).map('data').flatten().size();
        })();

        if (tripDataReady) {
          console.warn('angular chart directive ___ $scope.data has changed! ___ RETURN');
        } else {
          console.info('angular chart directive ___ $scope.data has changed! ___ RENDER COMPONENT');
          React.renderComponent(Charts({
            data: _.select($scope.data, 'isMotionSensor'),
            extent: [],
            width: $element[0].parentNode.offsetWidth,
            loadMoreData: function(props) {
              $scope.loadMoreData({props:props});
            },
          }), $element[0]);
        }

      });
    }
  };
}])

.directive('raw', [function(){
  return {
    scope: { trip: '=', loadMoreData: '&' },
    restrict: 'E',
    link: function($scope, $element) {
      $scope.$watchCollection('trip', function(trip) {
        if (!trip || !trip.data) {
          console.warn('angular raw directive ___ $scope.trip has changed! ___ RETURN');
          return;
        } else {
          console.info('angular raw directive ___ $scope.trip has changed! ___ OK');
        }

        React.renderComponent(Raw({
          trip:trip,
          width: $element[0].parentNode.offsetWidth,
          loadMoreData: function(props) {
            $scope.loadMoreData({props:props});
          },
        }), $element[0]);
      });
    }
  };
}])

.directive('har', [function(){
  return {
    scope: { trip: '=' },
    restrict: 'E',
    link: function($scope, $element) {
      $scope.$watchCollection('trip', function(trip) {
        if (!trip || !trip.data) { return; }

        React.renderComponent(Har({
          trip:trip,
          width: $element[0].parentNode.offsetWidth
        }), $element[0]);
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
