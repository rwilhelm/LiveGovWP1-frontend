(function(){
	'use strict';

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/DataCommons.java

	// LiveGovWP1/shared/liveandgov-
	// commons/src/main/java/eu/liveandgov/wp1/data/impl/

	module.exports = {

		// Gravity

		gra: {
			x: {
				type: "float",
				value: function(value) { return value[0]; }
			},
			y: {
				type: "float",
				value: function(value) { return value[1]; }
			},
			z: {
				type: "float",
				value: function(value) { return value[2]; }
			}
		}

	};

}());
