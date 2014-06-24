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
