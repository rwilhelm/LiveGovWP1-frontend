/*** @jsx React.DOM */

var ChartInfo= React.createClass({
	componentWillReceiveProps: function(nextProps) {
		console.log('ChartInfo:componentWillReceiveProps');
	},
	render: function() {
		var style = {
			// y: -30
		};
		var className = this.props.className;
		return (
			<div style={style} className={className}>
				extent: {this.props.extent[0]}, {this.props.extent[1]}
			</div>
		);
	}
});
