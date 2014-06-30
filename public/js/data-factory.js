/* vi:set ft=javascript,tw=78 */
/* jshint strict:true, devel:true, debug:true */
/* global angular, app */

/*
  SERVICE PROVIDER: DATA FACTORY

  core, functional, stateless, immutable

  all methods are called by controllers (tripCtrl) and return promises

  TODO split into separate files
  TODO use require.js
 */

(function() {
  'use strict';

  app.factory('Data',
    ['$http', '$q', 'Config',
    function ($http, $q, Config) {
    return {

      // functional, stateless
      // function must return promise

      trips: function(trips) {
        var deferred = $q.defer();

        if (trips.length) {
          console.log('dataFactory:trips XHR NOT!');
          deferred.resolve(trips);
        } else {
          console.log('dataFactory:trips XHR');

          // do the xhr request on 'trips' to get the trip list and immediately
          // return a promise on the to be received and prepared data. see
          // this.query() in the record controller (recCtrl).


          $http.get('api/trips')
          .success(function(data, status, headers, config) {

            // set up trip object architecture (very fragile! change something
            // here and it'll break all over the place. fixable? TODO)
            trips = data.map(function(d) {
              var trip = {
                id        : d.trip_id,
                name      : d.name,
                user      : d.user_id.replace(/['"]+/g, ''), // TODO write helper to detox strings
                duration  : +d.stop_ts - (+d.start_ts) - 3600000, // FIXME -1h wrong ts in db
                love      : false, // TODO use local storage
                extent    : [], // FIXME! angular doesn't need to know about the extent anymore!
                dataCount : 0,
                data: {
                  har: [], // Human Activity Recognition Tags
                  gps: []
                }
              };

              // create empty sensor arrays (acc, gra, lac) on the above data object
              Config.sensors().map(function(sensor) {
                trip.data[sensor] = [];
              });

              return trip;
            });

            deferred.resolve(trips);
          })
          .error(function(data, status, headers, config) {
            console.error("Could not load trips!");
            deferred.reject();
          });
        }

        return deferred.promise;
      },

      // FIXME should load data for one sensor only. iterating above
      // Config.sensors() should be job ob the calling method REALLY? BUT HOW
      // TO CHECK THEN IF ALL SENSOR DATA HAS ARRIVED?
      sensor: function (trip, sensor, obj) {
        console.log('dataFactory:sensor XHR');

        var promises = Config.sensors().map(function(sensor) {
          var deferred = $q.defer();
          $http({
            method: "GET",
            url: 'api/trips/' + trip.id + '/sensors/' + sensor,
            params: {
              'w': (obj && obj.hasOwnProperty('windowSize') ? obj.windowSize : Config.windowSize()),
              'e': (obj && obj.hasOwnProperty('extent')     ? obj.extent : undefined)
            }
          })
          .success(function (data, status, headers, config) {
            data.forEach(function(d) {
              d.ts = (+d.starttime + (+d.endtime)) / 2;
              d.starttime = +d.starttime;
              d.endtime = +d.endtime;
            });

            trip.data[sensor] = trip.data[sensor].merge(data); // TODO refactor helper to change 'this' and return something useful instead
            deferred.resolve(trip.data[sensor]);
          })
          .error(function (data, status, headers, config) {
            deferred.reject();
          });

          return deferred.promise;
        });
        return $q.all(promises);
      },

      // FIXME should load count for one sensor only. iterating above
      // Config.sensors() should be job ob the calling method
      count: function (trip, sensor, obj) {
        console.log('dataFactory:count XHR');

        var promises = Config.sensors().map(function(sensor) {
          var deferred = $q.defer();

          $http.get('api/trips/' + trip.id + '/sensors/' + sensor + '/count')
          .success(function (data, status, headers, config) {
            trip.dataCount[sensor] = data[0].count;
            deferred.resolve(trip.dataCount[sensor]);
          })
          .error(function (data, status, headers, config) {
            deferred.reject();
          });

          return deferred.promise;
        });
        return $q.all(promises);
      },

      // ok
      har: function(trip) {
        console.log('dataFactory:har XHR');

        var deferred = $q.defer();
        if (trip.data.har.length) {
          deferred.resolve(trip.data.har);
        } else {
          $http.get('api/trips/' + trip.id + '/sensors/har')
          .success(function(data) {
            trip.data.har = data.map(function(d) {
              return {
                ts: d.ts,
                tag: d.tag.replace(/[\'\"]+/g, '') // TODO write detox helper
              };
            });
            trip.data.harSum = trip.data.har.summarize('tag'); // -> helpers
            deferred.resolve(trip.data.har);
          })
          .error(function (data, status, headers, config) {
            console.warn('Failed fetching har har');
            deferred.reject();
          });
        }
        return deferred.promise;
      },

      // ok
      gps: function(trip) {
        console.log('dataFactory:gps XHR');

        var deferred = $q.defer();
        if (trip.data.gps.length) {
          deferred.resolve(trip.data.gps); // resolve old trip data
        } else {
          $http.get('api/trips/' + trip.id + '/sensors/gps')
          .success(function(data) {
            trip.data.gps = data;
            deferred.resolve(trip.data.gps);
          })
          .error(function(data, status, headers, config) {
            console.warn("Failed fetching gps data");
            deferred.reject();
          });
        }
        return deferred.promise;
      },

      // load har and gps data, return feature collection
    };
  }]);
}()); //eof
