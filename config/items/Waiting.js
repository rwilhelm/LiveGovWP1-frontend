(function(){
	'use strict';

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/DataCommons.java

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/impl/

	module.exports = {

		// Waiting

		wtn: {
			key: {
				type: "text",
				value: function(value) { return value.key; }
			},
			duration: {
				type: "text",
				value: function(value) { return value.duration; }
			},
			at: {
				type: "text",
				value: function(value) { return value.at; }
			}
		},

	};

}());
