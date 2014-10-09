// jshint esnext:true


////////////////
// API ROUTES //
////////////////


(function() {
	'use strict';

  var queries = require('../config/database/queries');

	module.exports = function(api, passport) {

	  // count sensor data for a trip
	  //   curl -s localhost:3476/trips/850/count
	  api.get('/count/:tripId/:table', function *() {
	    var result = yield this.pg.db.client.query_(queries.count(this.params.tripId, this.params.table));
	   //  var z = {};
	   //  _.forEach(result.rows, function(d) {
		  //   z[_(d).keys().head()] = { count: _(d).values().head() };
		  // });
	    this.body = result.rows;
	  });

	  // get sensor data for a trip
	  //   curl -s localhost:3476/trips/850/acc
	  //   curl -s localhost:3476/trips/850/acc\?w=200
	  //   curl -s localhost:3476/trips/850/acc\?w=200\&e=1394518675333,1394518346639
	  api.get('/trips/:tripId/:sensor', function *() {
	    var extent = this.query.e ? extentToSQL(this.query.e) : '';
	    var result = yield this.pg.db.client.query_(
	      queries.sensor(this.params.tripId, this.params.sensor, this.query.w, extent));
	    this.body = result.rows;
	  });

	  // get all trips
	  //   curl -s localhost:3476/trips
	  api.get('/trips', function *() {
	  	debugger
	    // var result = yield this.pg.db.client.query_(queries.trips());
	    var result = yield this.pg.db.client.query_(queries.trips(this.session.passport.user));
	    this.body = result.rows;
	  });

	  // delete a trip
	  api.del('/trips/:tripId', function *() {
	    yield this.pg.db.client.query_(queries.delete(this.params.tripId));
	    this.status = 204;
	  });

	  // undelete a trip
	  api.post('/trips/:tripId/undelete', function *() {
	    yield this.pg.db.client.query_(queries.undelete(this.params.tripId));
	    this.status = 204;
	  });

	  // update a trip
	  api.post('/trips/:tripId', function *() {
	    yield this.pg.db.client.query_(queries.update(this.params.tripId, this.request.body));
	    this.status = 204;
	  });

	};

})();