/*** @jsx React.DOM */

var SensorTable = React.createClass({

	/* Component Specifications */

	render: function() {
		console.log('SensorTable.jsx:render');

		var th = [];
		var headers = Object.keys(this.props.data[0]).map(function(key) {
		  if (['starttime','endtime'].indexOf(key) < 0) {
				th.push(<th><a>{key}</a></th>);
				return key;
		  }
		}).filter(function(d) { return d; });

		var rows = this.props.data.map(function(row) {
			var td = headers.map(function(key) {
				if (['x','y','z'].indexOf(key) >= 0) {
					var td = parseFloat(row[key]).toFixed(2)
				} else if (['ts'].indexOf(key) >= 0) {
					var td = moment(row[key]).format("HH:MM:SS")
				} else {
					td = row[key];
				}
				return <td>{td}</td>;
			});
			return <tr>{td}</tr>;
		});
		return (
			<table className={this.props.className}>
				<thead><tr>{th}</tr></thead>
				<tbody>{rows}</tbody>
			</table>
		);
	},

	getInitialState: function() {
		console.log('SensorTable.jsx:getInitialState');
		return {}
	},

	getDefaultProps: function() {
		console.log('SensorTable.jsx:getDefaultProps');
		return {}
	},

	propTypes: {},
	mixins: [],
	statics: {},
	displayName: 'SensorTable',

	/* Lifecycle Methods: Mounting */

	componentWillMount: function() {
		console.log('SensorTable.jsx:componentWillMount');
	},

	componentDidMount: function() {
		console.log('SensorTable.jsx:componentDidMount');
	},

	/* Lifecycle Methods: Updating */

	componentWillReceiveProps: function(nextProps) {
		console.log('SensorTable.jsx:componentWillReceiveProps');
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		console.log('SensorTable.jsx:shouldComponentUpdate');
		return true
	},

	componentWillUpdate: function(nextProps, nextState) {
		console.log('SensorTable.jsx:componentWillUpdate');
	},

	componentDidUpdate: function(prevProps, prevState) {
		console.log('SensorTable.jsx:componentDidUpdate');
	},

	/* Lifecycle Methods: Unmounting */

	componentWillUnmount: function() {
		console.log('SensorTable.jsx:componentWillUnmount');
	},

});
