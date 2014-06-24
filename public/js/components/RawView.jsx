/*** @jsx React.DOM */

var RawView = React.createClass({

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

	compressHarTags: function (harTags) {

	},

	// calculate x and y domain
	getDomains: function() {
		return {
			xDomain: this.props.data.extent(['starttime', 'endtime']),
			yDomain: this.props.data.extent(['x', 'y', 'z'])
		}
	},

	// get width and height of the parent container
	getContainerSize: function() {

	},

	getDefaultProps: function() {
		var data = this.props.data;
		var onBrush = this.props.onBrush;

		return {
			data: data,
			height: 200, // TODO make height dynamic
			width: 500, // TODO calculate width here
			onBrush: this.props.onBrush,
		}
	},

	getInitialState: function() {
		return {
			extent: []
		};
	},

	componentDidMount: function() {
		this.getContainerSize();
		this.getDomains();
		this.compressHarTags(this.props.data.har);
		this.generateFeatureCollection(this.props.data.gps, this.props.data.har)
	},

	render: function() {

		var xDomain = this.getDomains().xDomain;
		var yDomain = this.getDomains().yDomain;

		return (
			<div>
				<SensorChart ref="graChart" data={this.props.data.gra} extent={this.state.extent} height={this.props.height} width={this.props.width} xDomain={xDomain} yDomain={yDomain} onBrush={this.props.onBrush}/>
				<SensorChart ref="accChart" data={this.props.data.acc} extent={this.state.extent} height={this.props.height} width={this.props.width} xDomain={xDomain} yDomain={yDomain} onBrush={this.props.onBrush}/>
				<SensorChart ref="lacChart" data={this.props.data.lac} extent={this.state.extent} height={this.props.height} width={this.props.width} xDomain={xDomain} yDomain={yDomain} onBrush={this.props.onBrush}/>
			</div>
		);
	}

});
