/*** @jsx React.DOM */

var ChartInfo= React.createClass({
	componentWillReceiveProps: function(nextProps) {
		console.log('ChartInfo:componentWillReceiveProps' + this.props.sensor);
	},
	render: function() {
		var style = {
			y: -30
		};
		return (
			<div style={style}>EXTENT: {this.props.extent[0]}, {this.props.extent[1]}</div>
		);
	}
});
