/*** @jsx React.DOM */

var RawView = React.createClass({

	getDefaultProps: function() {
		var scope = this.props.scope;
		var trip = scope.trip;
		var sensorData = scope.trip.sensorData;
		var sensors = sensorData.sensors;

		var data = {
			acc: sensors.acc,
			lac: sensors.lac,
			gra: sensors.gra,
		};
	generateFeatureCollection: function(gpsData, harTags) {
	  console.log('RawView:generateFeatureCollection');

	  var fc = {
	    type: 'FeatureCollection',
	    features: []
	  };

	  function createFeature(coordinates, activity) {
	    return {
	      type: 'Feature',
	      geometry: {
	        type: 'LineString',
	        coordinates: coordinates // [g0, g1]
	      },
	      properties: {
	        activities: {}
	      }
	    };
	  }

    var gpsLength = gps.length;
    for (var i = gpsLength - 1; i >= 0; --i) {
      if (gps[i - 1]) { // TODO use while loop

        var coordinates = [gps[i-1].lonlat.coordinates, gps[i].lonlat.coordinates];

        // FIXME instead of calculating the one top activity, count occuring
        // activities (BETTER!)

        debugger

        var activity = topActivity(har, gps[i-1].ts, gps[i].ts); // XXX

        // if there is a previous feature with the same har tag, append the
        // current one to it, else create a new feature

        if (previousFeature && previousFeature.properties.activity == activity) {
          previousFeature.geometry.coordinates.push(coordinates[1]);
        } else {
          fc.features.push(createFeature(coordinates, activity));
        }

        var previousFeature = fc.features[fc.features.length - 1];
      }
    }

	},

		var extent = sensorData.extent; // actually not sensorData
		var xDomain = sensorData.xDomain;
		var yDomain = sensorData.yDomain;

		var loadMoreData = scope.loadMoreData;

		return {
			data: data,
			extent: extent,
			height: 200,
			width: this.props.width, // TODO calculate width here
			xDomain: xDomain,
			yDomain: yDomain,
			loadMoreData: scope.loadMoreData,
			sensor: scope.sensor,
		}
	},

	getInitialState: function() {
		return {
			extent: []
		};
	},

	render: function() {
		return (
			<div>
				<SensorChart ref="graChart" data={this.props.data.gra} extent={this.props.extent} height={this.props.height} width={this.props.width} xDomain={this.props.xDomain} yDomain={this.props.yDomain} loadMoreData={this.props.loadMoreData}/>
				<SensorChart ref="accChart" data={this.props.data.acc} extent={this.props.extent} height={this.props.height} width={this.props.width} xDomain={this.props.xDomain} yDomain={this.props.yDomain} loadMoreData={this.props.loadMoreData}/>
				<SensorChart ref="lacChart" data={this.props.data.lac} extent={this.props.extent} height={this.props.height} width={this.props.width} xDomain={this.props.xDomain} yDomain={this.props.yDomain} loadMoreData={this.props.loadMoreData}/>
			</div>
		);
	}

});
