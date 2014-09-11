(function(){
	'use strict';

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/DataCommons.java

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/impl/

	module.exports = {

		// WiFi

		wifi: {
			ssid: {
				type: "text",
				value: function(value) { return value.ssid; }
			},
			bssid: {
				type: "text",
				value: function(value) { return value.bssid; }
			},
			frequency: {
				type: "float",
				value: function(value) { return value.frequency; }
			},
			level: {
				type: "float",
				value: function(value) { return value.level; }
			},
		}

	};

}());
