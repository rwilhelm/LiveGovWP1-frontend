(function(){
	'use strict';

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/DataCommons.java

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/impl/

	module.exports = {

		// Proximity

		prx: {
			key: {
				type: "text",
				value: function(value) { return value[0]; }
			},
			inside: {
				type: "boolean",
				value: function(value) { return value[1]; }
			},
			of: {
				type: "text",
				value: function(value) { return value[2]; }
			}
		}

	};

}());
