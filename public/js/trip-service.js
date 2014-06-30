/* vi:set ft=javascript,tw=78
/* jshint strict:true, devel:true, debug:true */
/* global angular, app */

// TODO split into separate files

(function() {
	'use strict';

	app.service('Trip',
		['$http', '$q', 'Config', 'Data',
		function($http, $q, Config, Data) {

		var trips = []; // all data is stored in here
		var selectedTrip;

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

				var har = trip.data.har;
				var count = trip.dataCount;;
				var gps = trip.data.gps;
				var fc = trip.data.fc;

				if (!count.acc) Data.count(trip); // FIXME create helper to count that

				if (!gps.length) Data.gps(trip);
				if (!har.length) Data.har(trip);

				Data.sensor(trip, obj).then(function(data) {
					data.forEach(function(sensor) {
						sensor.forEach(function(c, i, a) {
							c.tag = har.filter(function(d) {
								if (c.ts >= +d[0] && c.ts <= +d[1]) {
									console.log(c.ts, +d[0], +d[1], d[2], "XXX CHECK ME XXX");
								}
								return c.ts >= +d[0] && c.ts <= +d[1];
							}).map(function(d) { return d[2]; })[0]; // argh, whats happening here?
						});
					});
					console.info('done:', trip);
				});
			},

			// test if a trip is selected
			// FIXME refactor
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
					.map(function (sensor) { return trip.data[sensor].length; })
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
				Config.sensors().map(function (sensor) { trip.data[sensor] = []; });
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
					Data.count(trip, sensor)
					.then(function(data) {
						console.log(data);
						trip.dataCount[sensor] = +data[0].count;
					});
				});
			}
		};
	}]);

}()); //eof
