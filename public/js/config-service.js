/* vi:set ft=javascript,tw=78 */
/* jshint strict:true, devel:true, debug:true */
/* global angular, app */
/* Fri Jun 20 03:28:04 CEST 2014 */

// TODO MAKE TRIP.JS BUNDLE

(function() {
	'use strict';

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
}());
//eof