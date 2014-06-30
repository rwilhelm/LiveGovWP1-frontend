/*** @jsx React.DOM */

var Table = React.createClass({

	/* Component Specifications */

	render: function() {
		console.log('Table.jsx:render');
		return (
			<div />
		);
	},

	getInitialState: function() {
		console.log('Table.jsx:getInitialState');
		return {}
	},

	getDefaultProps: function() {
		console.log('Table.jsx:getDefaultProps');
		return {}
	},

	propTypes: {},
	mixins: [],
	statics: {},
	displayName: 'Table',

	/* Lifecycle Methods: Mounting */

	componentWillMount: function() {
		console.log('Table.jsx:componentWillMount');
	},

	componentDidMount: function() {
		console.log('Table.jsx:componentDidMount');
	},

	/* Lifecycle Methods: Updating */

	componentWillReceiveProps: function(nextProps) {
		console.log('Table.jsx:componentWillReceiveProps');
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		console.log('Table.jsx:shouldComponentUpdate');
		return true
	},

	componentWillUpdate: function(nextProps, nextState) {
		console.log('Table.jsx:componentWillUpdate');
	},

	componentDidUpdate: function(prevProps, prevState) {
		console.log('Table.jsx:componentDidUpdate');
	},

	/* Lifecycle Methods: Unmounting */

	componentWillUnmount: function() {
		console.log('Table.jsx:componentWillUnmount');
	},

});
