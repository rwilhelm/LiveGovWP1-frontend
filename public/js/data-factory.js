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
            // here and it'll break all over the place. fixable? FIXME)
            trips = data.map(function(d) {
              var trip = {
                id: d.trip_id,
                name: d.name,
                user: d.user_id.replace(/['"]+/g, ''), // TODO write helper to detox strings
                duration: +d.stop_ts - (+d.start_ts) - 3600000, // FIXME -1h wrong ts in db
                love: false, // TODO use local storage

                // watch this in chart-directive (FIXME less is more! only extent!)
                // (r) = react, (a) = angular, (d3) = d3
                //
                // (d3)brush -> (d3)extent -> (r)loadMoreData(FIXME!onChange?) -> (a)chartDirective -> controller(scope)
                //
                sensorData: {
                  count: {},
                  extent: [],
                  xDomain: [],
                  yDomain: [],
                  sensors: {},
                },

                // not this
                harData: {
                  tags: [], // vanilla tags
                  tagsSum: [], // summarized tags
                  gps: [], // vanilla gps
                  geo: [], // feature collection (gps + har)
                },
              };

              // create empty sensor objects
              Config.sensors().map(function (sensor) { trip.sensorData.sensors[sensor] = []; });
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
              'e': (obj && obj.hasOwnProperty('extent')     ? obj.extent : undefined),
            }
          })
          .success(function (data, status, headers, config) {
            data.forEach(function(d) {
              d.ts = (+d.starttime + (+d.endtime)) / 2;
              d.starttime = +d.starttime;
              d.endtime = +d.endtime;
            });

            trip.sensorData.sensors[sensor] = trip.sensorData.sensors[sensor].merge(data); // TODO refactor helper to change 'this' and return something useful instead
            deferred.resolve(trip.sensorData.sensors[sensor]);
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
            trip.sensorData.count[sensor] = data[0].count;
            deferred.resolve(trip.sensorData.count[sensor]);
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
        if (trip.harData.tags.length) {
          deferred.resolve(trip.harData.tags);
        } else {
          $http.get('api/trips/' + trip.id + '/sensors/har')
          .success(function(data) {
            trip.harData.tags = data.map(function(d) {
              return {
                ts: d.ts,
                tag: d.tag.replace(/[\'\"]+/g, '') // TODO write detox helper
              };
            });
            trip.harData.tagsSum = trip.harData.tags.summarize('tag'); // -> helpers
            deferred.resolve(trip.harData.tags);
          })
          .error(function (data, status, headers, config) {
            console.warn('Failed fetching har tags');
            deferred.reject();
          });
        }
        return deferred.promise;
      },

      // ok
      gps: function(trip) {
        console.log('dataFactory:gps XHR');

        var deferred = $q.defer();
        if (trip.harData.gps.length) {
          deferred.resolve(trip.harData.gps); // resolve old trip data
        } else {
          $http.get('api/trips/' + trip.id + '/sensors/gps')
          .success(function(data) {
            trip.harData.gps = data;
            deferred.resolve(trip.harData.gps);
          })
          .error(function(data, status, headers, config) {
            console.warn("Failed fetching gps data");
            deferred.reject();
          });
        }
        return deferred.promise;
      },

      // load har and gps data, return feature collection
      geo: function(trip) {
        console.log('dataFactory:geo XHR');

        // TODO -> helpers
        function calculateDistance(a, b) {
          return gju.pointDistance({
            type: 'Point',
            coordinates: a
          }, {
            type: 'Point',
            coordinates: b
          });
        }

        // TODO -> helpers
        // get array element which occures the most
        function getMaxOccurrence(array) {
          if (!array.length) return null;
          var len = array.length;
          var modeMap = {};
          var maxEl = array[0];
          var maxCount = 1;
          for (var i = 0; i < len; i++) {
            var el = array[i];
            if (modeMap[el] === null) modeMap[el] = 1;
            else modeMap[el]++;
            if (modeMap[el] > maxCount) {
              maxEl = el;
              maxCount = modeMap[el];
            }
          }
          return maxEl;
        }

        // TODO -> helpers
        function topActivity(har, t0, t1) {
          return getMaxOccurrence(har.map(function (d) {
            if (d.ts >= t0 && d.ts <= t1) { // get tags between t0 and t1
              return d.tag.replace(/\"/g, ""); // remove quotes
            }}).filter(function (d) { return d; }) // remove undefined
          );
        }

        function createFeature(coordinates, activity) {
          return {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': coordinates // [g0, g1]
            },
            'properties': {
              'activity': activity
            }
          };
        }

        var deferred = $q.defer();

        var fc = {
          "type": "FeatureCollection",
          "features": []
        };

        var gps = this.gps(trip); // same as Data.gps(trip) for the outside world.
        var har = this.har(trip);

        $q.all([gps, har]).then(function(data) {
          var gps = trip.harData.gps;
          var har = trip.harData.tags; // FIXME refactor vars
          var gpsLength = gps.length;
          var harLength = har.length;

          // var n = 0;

          // FIXME -> HELPERS
          for (var i = gpsLength - 1; i >= 0; --i) {
            if (gps[i - 1]) {
              var coordinates = [gps[i-1].lonlat.coordinates, gps[i].lonlat.coordinates];
              var activity = topActivity(har, gps[i-1].ts, gps[i].ts);

              if (previousFeature && previousFeature.properties.activity == activity) {
                previousFeature.geometry.coordinates.push(coordinates[1]);
                // previousFeature.properties.t1 = t1; // wrong timestamp?
                // previousFeature.properties.distance += calculateDistance(g0, g1);
                // previousFeature.properties.duration += moment.duration(t1 - t0);
              } else {
                fc.features.push(createFeature(coordinates, activity));
              }

              var previousFeature = fc.features[fc.features.length - 1];
            }
          }

          trip.harData.geo = fc;

          deferred.resolve(fc);
        });
        return deferred.promise;
      },
    };
  }]);
}()); //eof
