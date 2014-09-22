(function(){
  'use strict';

  var _ = require('lodash'),
      Promise = require('bluebird'),
      pg = require('pg.js');

  var preparedStatements = {

    // get all trips
    allTrips: {
      name: 'getAllTrips',
      text: 'SELECT trip_id AS id, user_id AS user, start_ts AS start, stop_ts AS stop, name AS comment FROM trip WHERE deleted = false ORDER BY trip_id DESC',
    },

    // create the trip table
    createTable: {
      name: 'createTable',
      text: 'CREATE TABLE IF NOT EXISTS trip (trip_id SERIAL PRIMARY KEY, user_id VARCHAR(36), start_ts BIGINT, stop_ts BIGINT, name VARCHAR(255), expires BIGINT, deleted BOOLEAN)',
    },

    // insert a new trip into the trip table
    insertTrip: {
      name: 'insertTrip',
      text: 'INSERT INTO trip (trip_id, user_id, start_ts, expires, deleted) VALUES (DEFAULT, $1, $2, $3, false) RETURNING trip_id'
    },

    // finalize the inserted trip by updating stop_ts
    finalizeTrip: {
      name: 'finalizeTrip',
      text: 'UPDATE trip SET stop_ts = $1 WHERE trip_id = $2'
    }
  };

  module.exports = exports = function(statement, values) {
   return new Promise(function(resolve, reject) {
     pg.connect("postgres://localhost/liveandgov_test", function(err, client, done) {

       if (err) {
         return console.error('error fetching client from pool', err);
       }

       if (values) {
         _.merge(preparedStatements[statement], {values: values});
       }

       if (typeof statement === 'string') {
         statement = preparedStatements[statement];
       }

       client.query(statement, function(err, result) {

         if (err) {
           return console.error('error running query', err);
         }

         resolve(result);
         done();
       });
     });
     // pg.end();
   });
  };

}());
