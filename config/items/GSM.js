(function(){
	'use strict';

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/DataCommons.java

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/impl/

	module.exports = {

		// GSM

		gsm: {
			cellIdentity: {
				type: "text",
				value: function(value) { return value.cellIdentity; }
			},
			cellType: {
				type: "text",
				value: function(value) { return value.cellType; }
			},
			rssi: {
				type: "text",
				value: function(value) { return value.rssi; }
			}
		}

	};

}());
