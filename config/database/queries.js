(function() {
	'use strict';

  var sensors = [
    'sensor_accelerometer',
    'sensor_gravity',
    'sensor_gyroscope',
    'sensor_linear_acceleration',
    'sensor_magnetic_field',
    'sensor_rotation'
  ];

  var moreSensors = [
    'sensor_gps',
    'sensor_har',
    'sensor_tags',
  ];

	module.exports = {

		allTables: function() {
			return "SELECT c.relname FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN ('r','') AND n.nspname <> 'pg_catalog'AND n.nspname <> 'information_schema'AND n.nspname !~ '^pg_toast'AND pg_catalog.pg_get_userbyid(c.relowner) != 'postgres' AND pg_catalog.pg_table_is_visible(c.oid) ORDER BY 1";
		},

		tableColumns: function(tableName) {
			return "SELECT attname FROM pg_attribute WHERE attrelid = 'public." + tableName + "'::regclass AND attnum > 0 AND NOT attisdropped ORDER BY attnum";
		},

		motionSensorTables: function() {

		},

    trips: function() {
      return 'SELECT trip_id AS id, user_id AS user, start_ts AS start, stop_ts AS stop, name AS comment FROM trip ORDER BY trip_id DESC';
    },

    check: function(id) {
      return sensors.concat(moreSensors).map(function(sensor) {
        return 'SELECT EXISTS(SELECT 1 FROM ' + sensor + ' WHERE trip_id = ' + id + ') AS ' + sensor;
      }).join('; ');
    },

    // count: function(id, sensors) {
    // 	if (typeof sensors === 'string') sensors = [sensors];
    //   return sensors.map(function(sensor) {
    //     return 'SELECT (SELECT COUNT(ts) FROM ' + sensor + ' WHERE trip_id = ' + id + ') AS ' + sensor;
    //   }).join('; ');
    // },

    count: function(id) {
      return sensors.concat(moreSensors).map(function(sensor) {
        return 'SELECT (SELECT COUNT(ts) FROM ' + sensor + ' WHERE trip_id = ' + id + ') AS ' + sensor;
      }).join('; ');
    },

    sensor: function(id, sensor, windowSize, extent) {
      var q;
      if (sensor === 'sensor_har') {
        q = 'SELECT ts, tag FROM sensor_har WHERE trip_id = ' + id + 'ORDER BY ts ASC';
      } else if (sensor === 'sensor_gps') {
        q = 'SELECT ts, ST_AsGeoJSON(lonlat)::json AS lonlat FROM sensor_gps WHERE trip_id = ' + id + 'ORDER BY ts ASC';
      } else if (sensor === 'sensor_tags') {
        q = 'SELECT * FROM sensor_tags WHERE trip_id = ' + id + 'ORDER BY ts ASC';
      } else if (windowSize) {
        q = 'SELECT avg(x) x, avg(y) y, avg(z) z, avg(ts) ts FROM (SELECT x, y, z, ts, NTILE(' + windowSize + ') OVER (ORDER BY ts) AS w FROM ' + sensor + ' WHERE trip_id = ' + id + extent + ') A GROUP BY w ORDER BY w';
      } else {
        q = 'SELECT * from ' + sensor + ' WHERE trip_id = ' + id + extent + 'ORDER BY ts ASC';
      }
      return q;
    },

    delete: function(id) {
      // mark trip as deleted
      return 'UPDATE trip SET deleted = true WHERE trip_id = ' + id;
    },

    undelete: function(id) {
      // mark trip as deleted
      return 'UPDATE trip SET deleted = false WHERE trip_id = ' + id;
    },

    update: function(id, data) {
      // parse the request body and create key-value-pairs as part of the sql statement
      var fields = Object.keys(data).map(function(key) {
        return key + ' = \'' + data[key] + '\'';
      }, this).join(', ');

      return 'UPDATE trip SET ' + fields + ' WHERE trip_id = ' + id;
    },
	};

}());