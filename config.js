'use strict';
module.exports = function(){
  switch(process.env.NODE_ENV){
    // PRODUCTION (A.K.A. FIELD TRIAL) MODE
    case 'production':
    return {
      port: 3001,
      db: 'pg://postgres:liveandgov@localhost/liveandgov_dev'
    };

    // DEV MODE W/O SSH TUNNEL
    case 'development':
    return {
      port: 4001,
      db: 'pg://postgres:liveandgov@localhost/liveandgov_dev'
    };

    // LOCAL PSQL WITH NEW DB ON liveandgov_test
    case 'local':
    return {
      port: 4001,
      db: 'pg://postgres:liveandgov@localhost/liveandgov_dev'
    };

    // DEV MODE W/ SSH TUNNEL
    default:
    console.log('\nRunning in SSH tunnel mode. Other options to NODE_ENV are \'production\' or \'development\'');
    console.log('$ nc -z localhost 3333 >/dev/null || ssh -NfL 3333:lg:5432 USERNAME@SERVER\n');
    return {
      port: 4001,
      db: 'pg://postgres:liveandgov@localhost:3333/liveandgov_dev'
    };
  }
};





 // public | sensor_accelerometer       | table | liveandgov
 // public | sensor_gact                | table | liveandgov
 // public | sensor_gps                 | table | liveandgov
 // public | sensor_gravity             | table | liveandgov
 // public | sensor_gyroscope           | table | liveandgov
 // public | sensor_har                 | table | liveandgov
 // public | sensor_linear_acceleration | table | liveandgov
 // public | sensor_magnetic_field      | table | liveandgov
 // public | sensor_proximity           | table | liveandgov
 // public | sensor_rotation            | table | liveandgov
 // public | sensor_tags                | table | liveandgov
 // public | sensor_waiting             | table | liveandgov
 // public | trip                       | table | liveandgov


// sensor_gact
//  trip_id | ts | tag | confidence
// ---------+----+-----+------------
// (0 rows)

// sensor_gps
//  trip_id |      ts       |                       lonlat                       | altitude
// ---------+---------------+----------------------------------------------------+----------
//        1 | 1404914218200 | 0101000020E610000026EB26E77A591E404B1D893CEE2B4940 |

// sensor_har
//  trip_id |      ts       |   tag
// ---------+---------------+---------
//        8 | 1405006585838 | walking

// sensor_proximity
//  trip_id |      ts       |   key    | inside | of
// ---------+---------------+----------+--------+----
//        6 | 1405006548137 | platform | f      |

// sensor_tags
//  trip_id | ts | tag
// ---------+----+-----

// sensor_waiting
//  trip_id | ts | key | duration | at
// ---------+----+-----+----------+----





// SENSORS WITH X-, Y- AND Z-VALUES



// var sensors = {
//   motion: [
//     // trip_id | ts | x | y | z
//     'sensor_accelerometer',
//     'sensor_gravity',
//     'sensor_gyroscope',
//     'sensor_linear_acceleration',
//     'sensor_magnetic_field',
//     'sensor_rotation'
//   ]
// };

// var sensorDescription = {
//   motion: {
//     trip_id: Number,
//     ts: Number,
//     x: Number,
//     y: Number,
//     z: Number
//   }
// };


// sensor_gact
// sensor_gps
// sensor_har
// sensor_proximity
// sensor_tags
// sensor_waiting
