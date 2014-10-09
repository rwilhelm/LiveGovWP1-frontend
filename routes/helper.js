// jshint esnext:true


///////////////////
// HELPER ROUTES //
///////////////////


(function() {
	'use strict';

  var queries = require('../config/database/queries');

	module.exports = function(api, passport) {

	  api.get('/tables', function *() {
	    var result = yield this.pg.db.client.query_(queries.allTables());
	    this.body = result.rows;
	  });

	  api.get('/columns/:tableName', function *() {
	  	var result = yield this.pg.db.client.query_(queries.tableColumns(this.params.tableName));
	  	this.body = result.rows;
	  });

	  // api.get('/trips/:tripId/check', function *() {
	  //   var result = yield this.pg.db.client.query_(q);
	  //   this.body = result.rows;
	  // });

	};

})();