/*** @jsx React.DOM */

var Map = React.createClass({

	// generateFeatureCollection: function(gpsData, harTags) {
	//   console.log('RawView:generateFeatureCollection');

	//   var gps = this.props.data.gps;

	//   var fc = {
	//     type: 'FeatureCollection',
	//     features: []
	//   };

	//   function createFeature(coordinates, activity) {
	//     return {
	//       type: 'Feature',
	//       geometry: {
	//         type: 'LineString',
	//         coordinates: coordinates // [g0, g1]
	//       },
	//       properties: {
	//         activities: {}
	//       }
	//     };
	//   }

 //    var gpsLength = gps.length;
 //    for (var i = gpsLength - 1; i >= 0; --i) {
 //      if (gps[i - 1]) { // TODO use while loop

 //        var coordinates = [gps[i-1].lonlat.coordinates, gps[i].lonlat.coordinates];

 //        // FIXME instead of calculating the one top activity, count occuring
 //        // activities (BETTER!)

 //        debugger

 //        // FIXME NOT DEFINED
 //        var activity = topActivity(har, gps[i-1].ts, gps[i].ts); // XXX

 //        // if there is a previous feature with the same har tag, append the
 //        // current one to it, else create a new feature

 //        if (previousFeature && previousFeature.properties.activity == activity) {
 //          previousFeature.geometry.coordinates.push(coordinates[1]);
 //        } else {
 //          fc.features.push(createFeature(coordinates, activity));
 //        }

 //        var previousFeature = fc.features[fc.features.length - 1];
 //      }
 //    }
	// },

	render: function() {
		return (
			<div />
		);
	}

});


