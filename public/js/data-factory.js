/* vi:set ft=javascript,tw=78 */
/* jshint strict:true, devel:true, debug:true */
/* global angular, app */
// TODO SPLIT INTO SEPARATE FILES
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
}()); //eof
