/* jshint strict:true, devel:true, debug:true */
/* global angular, app */
'use strict'; // jshint -W097

app.service('Config', function() {
  var sensors = ['acc', 'gra', 'lac']; // used sensors
  var xDomain = ['starttime', 'endtime']; // by which values x-domain is calculated
  var yDomain = ['x', 'y', 'z']; // ... y-domain ...
  var windowSize = 200; // default window size

  return {
    sensors: function() { return sensors; },
    xDomain: function() { return xDomain; },
    yDomain: function() { return yDomain; },
    windowSize: function() { return windowSize; },
  };
});


// data factory: xhr action! called by trip service only
app.factory('Data',
  ['$http', '$q', 'Config', function ($http, $q, Config) {
  return {

    // functional, stateless
    // function must return promise

    trips: function(trips) {
      var deferred = $q.defer();

      if (trips.length) {
        deferred.resolve(trips);
      } else {

        // do the xhr request on 'trips' to get the trip list and immediately
        // return a promise on the to be received and prepared data. see
        // this.query() in the record controller (recCtrl).

        console.log('xhr: trips');

        $http.get('api/trips')
        .success(function(data, status, headers, config) {

          // set up trip object architecture (very fragile! change something
          // here and it'll break all over the place. fixable? FIXME)
          trips = data.map(function(d) {
            var trip = {
              id: d.trip_id,
              name: d.name,
              user: d.user_id.replace(/['"]+/g, ''), // TODO write helper to detox strings
              time: {
                start: +d.start_ts,
                stop: +d.stop_ts,
                duration: +d.stop_ts - (+d.start_ts) - 3600000, // FIXME -1h wrong ts in db
              },
              data: {
                gps: [],
                har: [],
                harSummarized: [],
                count: {},
                extent: [],
                sensors: {},
                domain: { x: [], y: [] },
                geo: [], // feature collection (gps + har)
              },
              love: false // TODO use local storage
            };

            // create empty sensor objects
            Config.sensors().map(function (sensor) { trip.data.sensors[sensor] = []; });

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

    // load sensor data
    sensor: function (trip, sensor, obj) {
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
            d.ts         = (+d.starttime + (+d.endtime)) / 2;
            d.starttime  = +d.starttime;
            d.endtime    = +d.endtime;
          });

          trip.data.sensors[sensor] = trip.data.sensors[sensor].merge(data);
          deferred.resolve(trip.data.sensors[sensor]);
        })
        .error(function (data, status, headers, config) {
          deferred.reject();
        });

        return deferred.promise;
      });
      return $q.all(promises);
    },

    count: function (trip, sensor, obj) {
      var promises = Config.sensors().map(function(sensor) {
        var deferred = $q.defer();

        $http.get('api/trips/' + trip.id + '/sensors/' + sensor + '/count')
        .success(function (data, status, headers, config) {
          trip.data.count[sensor] = data[0].count;
          deferred.resolve(trip.data.count[sensor]);
        })
        .error(function (data, status, headers, config) {
          deferred.reject();
        });

        return deferred.promise;
      });
      return $q.all(promises);
    },

    har: function(trip) {
      var deferred = $q.defer();

      if (trip.data.har.length)
        deferred.resolve(trip.data.har);

      $http.get('api/trips/' + trip.id + '/sensors/har')
      .success(function(data) {
        var harTags = data.map(function(d) {
          return {
            ts: d.ts,
            tag: d.tag.replace(/[\'\"]+/g, '') // TODO write detox helper
          };
        });
        trip.data.har = harTags;
        trip.data.harSummarized = harTags.summarize('tag');
        deferred.resolve(harTags);
      })
      .error(function (data, status, headers, config) {
        deferred.reject();
      });

      return deferred.promise;
    },

    gps: function(trip) {
      var deferred = $q.defer();

      if (trip.data.gps.length)
        deferred.resolve(trip.data.gps);

      $http.get('api/trips/' + trip.id + '/sensors/gps')
      .success(function(data) {
        trip.data.gps = data;
        deferred.resolve(data);
      })
      .error(function(data, status, headers, config) {
        deferred.reject();
      });

      return deferred.promise;
    },

    // load har and gps data, return feature collection
    geo: function(trip) {

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

      var gps = this.gps(trip);
      var har = this.har(trip);

      $q.all([gps, har]).then(function(data) {
        var gps = data[0];
        var har = data[1];
        var gpsLength = gps.length;
        var harLength = har.length;

        var n = 0;

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

        trip.data.geo = fc;

        deferred.resolve(fc);
      });
      return deferred.promise;
    },
  };
}]);



/*
    DIRECTIVES <-> CONTROLLER <-> TRIP SERVICE <-> DATA FACTORY
 */
// Trip.loadTrips():
// 1. load trip data and populate the trip table view ('/rec')

// Trip.select():
// 2. user selects a trip

// Trip.loadData():
// 3. load sensor data for that trip

app.service('Trip',
  ['$http', '$q', 'Config', 'Data', function($http, $q, Config, Data) {

  var trips = []; // all data is stored in here
  var selectedTrip; // a copy(?) of the currently selected trip object

  return {

    // called unconditionally by the record controller. returns a promise on
    // the trip object. if it's already populated, just resolve the promise
    // with it, else send an xhr request to our api, (hopefully) receive the
    // data and prepare it first.

    loadTrips: function() {
      return Data.trips(trips); // incoming promise -> controller
    },

    // select trip and call data factory
    // call w/o args to select no trip
    select: function(trip) {
      if (!arguments.length) {
        selectedTrip = undefined;
        console.log('unselected all trips');
        return;
      }

      // load trip data if there is none
      if (!this.hasData(trip))
        this.loadData(trip);

      selectedTrip = trip;
      console.log('selected trip', trip.id);
      return selectedTrip;
    },

    // FIXME what a mess
    // load (more) data for a trip
    // obj is optional: { extent: Array[2], windowSize: number }
    loadData: function(trip, obj) {
      // step 1 (async)
      // xhr: load sensor data for Config.sensors() √
      // xhr: load gps data √
      // xhr: load har data √
      // xhr: load sensor data count √

      // step 2 (after step 1 has finished)
      // create feature collection ()
      // calculate x- and y-domain

      // load sensor data. calls Data.sensor() for every sensor given in
      // Config.sensors(). when all sensor data has arrived, update the trips
      // x and y domain (which is the min and max timestamp for the x-axis and
      // min and max sensor data for the y-axis. see Config.xDomain() and
      // Config.yDomain())

      if (!trip.data.count.acc) {
        console.log('xhr: count');
        Data.count(trip);
      }

      if (!trip.data.har.length) {
        console.log('xhr: har');
        Data.har(trip);
      }

      if (!trip.data.gps.length) {
        console.log('xhr: gps');
        Data.gps(trip);
      }

      if (!trip.data.geo.length) {
        console.log('xhr: geo');
        Data.geo(trip);
      }

      Data.sensor(trip, obj).then(function(data) {
        console.log('xhr: sensor');
        data.forEach(function(sensor) {
          sensor.forEach(function(c, i, a) {
            c.tag = trip.data.har.filter(function(d) {
              if (c.ts >= +d[0] && c.ts <= +d[1]) {
                console.log(c.ts, +d[0], +d[1], d[2]);
              }
              return c.ts >= +d[0] && c.ts <= +d[1];
            }).map(function(d) { return d[2]; })[0]; // argh
          });
        });

        trip.data.domain.x = data.extent(Config.xDomain());
        trip.data.domain.y = data.extent(Config.yDomain());
        console.log('done:', trip);
      });
    },

    // test if a trip is selected
    selected: function(trip) {
      if (!arguments.length) {
        return selectedTrip ? selectedTrip : false;
      }
      return trip === selectedTrip;
    },

    // test if trip data is loaded
    hasData: function(trip) {
      if (!arguments.length) return;
      return Config.sensors()
        .map(function (d) { return trip.data.sensors[d].length; })
        .reduce(function (a, b) { return a + b; });
    },

    hasName: function(trip) {
      if (!arguments.length || !trip) return;
      return (trip.name ? true : false);
    },

    hasDuration: function(trip) {
      if (!arguments.length) return;
      return (trip.duration >= -3600000 && trip.duration <= -3500000) ? false : true;
    },

    hasLove: function(trip) {
      if (!arguments.length || !trip) return;
      return (trip.love ? true : false);
    },

    toggleLove: function(trip) {
      if (!arguments.length) return;
      return trip.love = (trip.love ? false : true);
    },

    reset: function (trip) {
      Config.sensors().map(function (sensor) { trip.data.sensors[sensor] = []; });
      trip.extent = [];
      this.loadData(trip);
    },

    update: function (trip, data) {
      trip.name = data.name; // client side update

      $http({ method: 'POST', url: 'api/trips/' + trip.id, data: data })
      .success(function(data, status, headers, config) {
        console.info("trip updated:", trip.id);
      })
      .error(function(data, status, headers, config) {});
    },

    // delete a trip
    delete: function (trip) {
      trips.splice(trips.indexOf(trip), 1); // client side removal

      $http({ method: 'DELETE', url: 'api/trips/' + trip.id })
      .success(function(data, status, headers, config) {
        console.info("trip deleted:", trip.id);
      })
      .error(function(data, status, headers, config) {});
    },

    download: function (trip, sensor, format) {
      $http({ method: 'GET', url: 'api/trips/' + trip.id + '/sensors/' + sensor + '.' + format })
      .success(function(data, status, headers, config) {
        // TODO better downloads
      });
    },

    count: function(trip) {
      Config.sensors().forEach(function (sensor) {
        // console.log(sensor, Data.count(trip, sensor));
        debugger
        Data.count(trip, sensor)
        .then(function(data) {
          console.log(data);
          trip.data.count[sensor] = +data[0].count;
        });
      });
    }
  };
}]);

