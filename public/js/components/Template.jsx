/*** @jsx React.DOM */

/*

	http://facebook.github.io/react/docs/component-specs.html

 */

var Template = React.createClass({

	/* Component Specifications */

	render: function() {
		console.log('Template.jsx:render');
		return (
			<div />
		);
	},

	getInitialState: function() {
		console.log('Template.jsx:getInitialState');
		return {}
	},

	getDefaultProps: function() {
		console.log('Template.jsx:getDefaultProps');
		return {}
	},

	propTypes: {},
	mixins: [],
	statics: {},
	displayName: 'Template',

	/* Lifecycle Methods: Mounting */

	componentWillMount: function() {
		console.log('Template.jsx:componentWillMount');
	},

	componentDidMount: function() {
		console.log('Template.jsx:componentDidMount');
	},

	/* Lifecycle Methods: Updating */

	componentWillReceiveProps: function(nextProps) {
		console.log('Template.jsx:componentWillReceiveProps');
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		console.log('Template.jsx:shouldComponentUpdate');
		return true
	},

	componentWillUpdate: function(nextProps, nextState) {
		console.log('Template.jsx:componentWillUpdate');
	},

	componentDidUpdate: function(prevProps, prevState) {
		console.log('Template.jsx:componentDidUpdate');
	},

	/* Lifecycle Methods: Unmounting */

	componentWillUnmount: function() {
		console.log('Template.jsx:componentWillUnmount');
	},

});
