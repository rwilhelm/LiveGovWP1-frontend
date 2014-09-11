(function(){
	'use strict';

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/DataCommons.java

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/impl/

	module.exports = {

		// Bluetooth

		blt: {
			address: {
				type: "text",
				value: function(value) { return value.address; }
			},
			deviceMajorClass: {
				type: "text",
				value: function(value) { return value.deviceMajorClass; }
			},
			deviceMinorClass: {
				type: "text",
				value: function(value) { return value.deviceMinorClass; }
			},
			bondState: {
				type: "text",
				value: function(value) { return value.bondState; }
			},
			name: {
				type: "text",
				value: function(value) { return value.name; }
			},
			rssi: {
				type: "float",
				value: function(value) { return value.rssi; }
			},
		},

	};

}());
