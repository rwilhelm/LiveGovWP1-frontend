/*** @jsx React.DOM */

var TripInfo = React.createClass({
	componentWillReceiveProps: function(nextProps) {
		console.log('RawInfo:componentWillReceiveProps');
	},

	render: function() {
		return (
			<div className='tripInfo'>
				<span> extent: {this.props.trip.extent} </span>
				<span> domain: {this.props.trip.domain} </span>
			</div>
		);
	}
});
