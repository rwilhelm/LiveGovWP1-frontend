// jshint esnext:true

(function() {
	'use strict';

  var _ = require('lodash'),
      Promise = require('bluebird');

  var app      = require('koa')(),
      compress = require('koa-compress')(),
      logger   = require('koa-logger')(),
      body     = require('koa-body')();

  var mount  = require('koa-mount'),
      serve  = require('koa-static');

	var Router = require('koa-router');

  var config = require('./config');

	var pg = require('koa-pg');

	var queries = require('./config/database/queries');
	var schema = require('./config/items');

  app.use(logger);
  app.use(body);
  app.use(compress);
	app.use(pg('pg://postgres:liveandgov@localhost:3333/liveandgov_dev'));

  // ------------------------------------------------------------------------------------------

  var api = new Router();

  // ------------------------------------------------------------------------------------------

  // api.get('/ingredients', function *() {
  //   this.body = yield ingredients.find({});
  // });

  // api.post('/ingredients/new', function *() {
  //   yield ingredients.insert(this.request.body);
  //   this.status = 204;
  // });

  // api.get('/recipes', function *() {
  //   this.body = yield recipes.find({});
  // });

  // api.post('/recipes/new', function *() {
  //   this.body = yield ingredients.insert(this.request.body);
  //   this.status = 204;
  // });

  // ------------------------------------------------------------------------------------------

  api.get('/schema', function *() {
  	this.body = schema;
  });

  // api.get('/tc', function *() {
  // 	var tables = function() {
  // 		return new Promise(function(resolve, reject) {
	 //  		resolve(this.pg.db.client.query_(queries.allTables()));
	 //  	}.bind(this));
  // 	}.bind(this);

  // 	// var columns = function(tableName) {
  // 	// 	return new Promise(function(resolve, reject) {
	 //  // 		resolve(this.pg.db.client.query_(queries.allTables()));
  // 	// 	});
  // 	// };

  // 	var result = [];

  // 	tables().then(function(data) {
  // 		console.log(data());
  // 	});

  // 	// tables.then(function(data) {
  // 	// 	data.forEach(function(d) {
  // 	// 		result.push(columns(d));
  // 	// 	});
  // 	// });

  // 	this.body = result;
  // });


  api.get('/tables', function *() {
  	var result = yield this.pg.db.client.query_(queries.allTables());
  	this.body = result.rows;
  });

  api.get('/columns/:tableName', function *() {
  	var result = yield this.pg.db.client.query_(queries.tableColumns(this.params.tableName));
  	this.body = result.rows;
  });

  api.get('/trips/:tripId/check', function *() {
    var result = yield this.pg.db.client.query_(q);
    this.body = result.rows;
  });

  // count sensor data for a trip
  //   curl -s localhost:3476/trips/850/count
  api.get('/count/:tripId', function *() {
  	console.log(this.query.q);
    var result = yield this.pg.db.client.query_(queries.count(this.params.tripId, this.query.q));
    var z = {};
    console.log(result.rows);
    _.forEach(result.rows, function(d) {
	    z[_(d).keys().head()] = { count: _(d).values().head() };
	  });
    this.body = z;
  });

  // get sensor data for a trip
  //   curl -s localhost:3476/trips/850/acc
  //   curl -s localhost:3476/trips/850/acc\?w=200
  //   curl -s localhost:3476/trips/850/acc\?w=200\&e=1394518675333,1394518346639
  api.get('/trips/:tripId/:sensor', function *() {
    var extent = this.query.e ? extentToSQL(this.query.e) : '';
    var result = yield this.pg.db.client.query_(
      queries.sensor(this.params.tripId, this.params.sensor, this.query.w, extent));
    console.log(result.rows);
    this.body = result.rows;
  });

  // get all trips
  //   curl -s localhost:3476/trips
  api.get('/trips', function *() {
    var result = yield this.pg.db.client.query_(queries.trips());
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

  // get index html template
  api.get('/', function *index() {
    yield this.render('index', {env: process.env.NODE_ENV});
  });

  // ------------------------------------------------------------------------------------------

  app.use(serve('public'));
  app.use(mount('/', serve('views')));
  app.use(mount('/lib', serve('bower_components')));
  app.use(mount('/api', api.middleware()));

	app.listen(3000);

}());
